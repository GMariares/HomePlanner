-- =====================================================================
-- HomePlanner — a caderneta partilhada
--
-- Tudo pertence a uma casa, não a uma pessoa. É por isso que o Row-Level
-- Security aqui é a peça principal e não um extra: é ele que garante que
-- uma família nunca vê a agenda de outra.
--
-- Correr uma vez, no SQL Editor do projecto.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------

create table if not exists public.casas (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null default '',
  codigo     text not null unique,
  criada_em  timestamptz not null default now()
);

comment on table public.casas is 'Uma casa. O código serve para os outros membros entrarem.';

create table if not exists public.membros (
  id             uuid primary key default gen_random_uuid(),
  casa_id        uuid not null references public.casas(id) on delete cascade,
  utilizador_id  uuid not null references auth.users(id) on delete cascade,
  papel          text not null default 'casa' check (papel in ('pai','mae','filha','casa')),
  entrou_em      timestamptz not null default now(),
  unique (utilizador_id)
);

comment on table public.membros is 'Quem vive em que casa. Um utilizador pertence a uma casa de cada vez.';

create table if not exists public.entradas (
  id           uuid primary key default gen_random_uuid(),
  casa_id      uuid not null references public.casas(id) on delete cascade,
  -- a segunda-feira da semana a que esta linha pertence
  semana       date not null,
  -- 0 = segunda … 6 = domingo; null = "esta semana, sem dia marcado"
  dia          smallint check (dia between 0 and 6),
  genero       text not null check (genero in ('evento','refeicao','tarefa')),
  autor        text check (autor in ('pai','mae','filha','casa')),
  texto        text not null default '',
  -- guardada como texto porque a linha é editável a meio de se escrever
  hora         text,
  refeicao     text check (refeicao in ('almoco','jantar')),
  feita        boolean not null default false,
  extensao     text check (extensao in ('inicio','meio','fim')),
  -- uma linha riscada fica onde estava: a agenda guarda o que aconteceu
  riscada      boolean not null default false,
  movida_para  smallint check (movida_para between 0 and 6),
  criada_em    timestamptz not null default now(),
  criada_por   uuid references auth.users(id) default auth.uid()
);

comment on table public.entradas is 'Uma linha da caderneta. Uma entrada ocupa uma pauta.';

create index if not exists entradas_casa_semana_idx on public.entradas (casa_id, semana);

-- ---------------------------------------------------------------------
-- A casa de quem está a pedir
--
-- SECURITY DEFINER de propósito: as políticas de `membros` precisam de ler
-- `membros`, e sem isto o RLS chamava-se a si próprio em ciclo.
-- ---------------------------------------------------------------------

create or replace function public.casa_do_utilizador()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select casa_id from public.membros where utilizador_id = auth.uid() limit 1
$$;

revoke all on function public.casa_do_utilizador() from public;
grant execute on function public.casa_do_utilizador() to authenticated;

-- ---------------------------------------------------------------------
-- Row-Level Security
-- ---------------------------------------------------------------------

alter table public.casas    enable row level security;
alter table public.membros  enable row level security;
alter table public.entradas enable row level security;

drop policy if exists casas_ler on public.casas;
create policy casas_ler on public.casas
  for select to authenticated
  using (id = public.casa_do_utilizador());

drop policy if exists casas_mudar_nome on public.casas;
create policy casas_mudar_nome on public.casas
  for update to authenticated
  using (id = public.casa_do_utilizador())
  with check (id = public.casa_do_utilizador());

drop policy if exists membros_ler on public.membros;
create policy membros_ler on public.membros
  for select to authenticated
  using (casa_id = public.casa_do_utilizador());

drop policy if exists membros_mudar_papel on public.membros;
create policy membros_mudar_papel on public.membros
  for update to authenticated
  using (utilizador_id = auth.uid())
  with check (utilizador_id = auth.uid());

drop policy if exists membros_sair on public.membros;
create policy membros_sair on public.membros
  for delete to authenticated
  using (utilizador_id = auth.uid());

-- As entradas são da casa inteira: quem lá vive lê e escreve tudo.
-- É uma casa, não um escritório — a privacidade entre membros seria a excepção,
-- e essa excepção ainda não foi decidida (ver PRODUCT.md).
drop policy if exists entradas_ler on public.entradas;
create policy entradas_ler on public.entradas
  for select to authenticated
  using (casa_id = public.casa_do_utilizador());

drop policy if exists entradas_escrever on public.entradas;
create policy entradas_escrever on public.entradas
  for insert to authenticated
  with check (casa_id = public.casa_do_utilizador());

drop policy if exists entradas_alterar on public.entradas;
create policy entradas_alterar on public.entradas
  for update to authenticated
  using (casa_id = public.casa_do_utilizador())
  with check (casa_id = public.casa_do_utilizador());

drop policy if exists entradas_apagar on public.entradas;
create policy entradas_apagar on public.entradas
  for delete to authenticated
  using (casa_id = public.casa_do_utilizador());

-- ---------------------------------------------------------------------
-- Privilégios
--
-- Explícitos e não herdados dos default privileges do projecto: quem lê isto
-- vê exactamente quem pode tocar em quê. `anon` não tem nada — não há nada
-- nesta caderneta para ver sem entrar.
-- ---------------------------------------------------------------------

revoke all on public.casas    from anon;
revoke all on public.membros  from anon;
revoke all on public.entradas from anon;

grant select, update                 on public.casas    to authenticated;
grant select, update, delete         on public.membros  to authenticated;
grant select, insert, update, delete on public.entradas to authenticated;

-- ---------------------------------------------------------------------
-- Criar e entrar numa casa
--
-- Também SECURITY DEFINER: quem ainda não tem casa não passa em nenhuma
-- política, por isso não conseguiria criar a primeira.
-- ---------------------------------------------------------------------

create or replace function public.gerar_codigo()
returns text
language plpgsql
volatile
as $$
declare
  -- sem I, O, 0 e 1: este código vai ser lido em voz alta e escrito à mão
  alfabeto constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  tentativa text;
begin
  loop
    tentativa := '';
    for _ in 1..6 loop
      tentativa := tentativa || substr(alfabeto, 1 + floor(random() * length(alfabeto))::int, 1);
    end loop;
    exit when not exists (select 1 from public.casas where codigo = tentativa);
  end loop;
  return tentativa;
end
$$;

create or replace function public.criar_casa(nome text default '')
returns public.casas
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  nova public.casas;
begin
  if auth.uid() is null then
    raise exception 'É preciso entrar primeiro.' using errcode = '42501';
  end if;
  if exists (select 1 from public.membros where utilizador_id = auth.uid()) then
    raise exception 'Já pertence a uma casa.' using errcode = '23505';
  end if;

  insert into public.casas (nome, codigo)
  values (coalesce(criar_casa.nome, ''), public.gerar_codigo())
  returning * into nova;

  insert into public.membros (casa_id, utilizador_id) values (nova.id, auth.uid());
  return nova;
end
$$;

create or replace function public.entrar_em_casa(codigo text)
returns public.casas
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  destino public.casas;
begin
  if auth.uid() is null then
    raise exception 'É preciso entrar primeiro.' using errcode = '42501';
  end if;
  if exists (select 1 from public.membros where utilizador_id = auth.uid()) then
    raise exception 'Já pertence a uma casa.' using errcode = '23505';
  end if;

  -- qualificado com o nome da função: `codigo` sozinho é ambíguo com casas.codigo
  select * into destino from public.casas c where c.codigo = upper(trim(entrar_em_casa.codigo));
  if destino.id is null then
    raise exception 'Não há nenhuma casa com esse código.' using errcode = 'P0002';
  end if;

  insert into public.membros (casa_id, utilizador_id) values (destino.id, auth.uid());
  return destino;
end
$$;

revoke all on function public.criar_casa(text) from public;
revoke all on function public.entrar_em_casa(text) from public;
grant execute on function public.criar_casa(text) to authenticated;
grant execute on function public.entrar_em_casa(text) to authenticated;

-- ---------------------------------------------------------------------
-- Tempo real: a semana muda no telemóvel de quem está na cozinha
-- e muda no PC de quem está a planear, sem ninguém recarregar nada.
-- ---------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    raise notice 'Sem publicação supabase_realtime: o tempo real fica de fora, o resto funciona.';
  elsif not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'entradas'
  ) then
    alter publication supabase_realtime add table public.entradas;
  end if;
end
$$;
