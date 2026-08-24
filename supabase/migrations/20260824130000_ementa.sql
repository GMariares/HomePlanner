-- =====================================================================
-- A ementa e as compras
--
-- O livro dos pratos é da casa. Um prato tem ingredientes; marcar o prato
-- num dia põe os ingredientes na lista dessa semana, e tirá-lo tira-os
-- outra vez — desde que ainda não tenham sido comprados nem mexidos à mão.
--
-- Correr depois de 20260824120000_caderneta.sql.
-- =====================================================================

create table if not exists public.pratos (
  id         uuid primary key default gen_random_uuid(),
  casa_id    uuid not null references public.casas(id) on delete cascade,
  nome       text not null,
  criado_em  timestamptz not null default now(),
  unique (casa_id, nome)
);

comment on table public.pratos is 'O livro dos pratos que esta casa cozinha.';

create table if not exists public.ingredientes (
  id          uuid primary key default gen_random_uuid(),
  casa_id     uuid not null references public.casas(id) on delete cascade,
  prato_id    uuid not null references public.pratos(id) on delete cascade,
  nome        text not null,
  -- texto e não número: escreve-se "2 kg", "1 molho", "meia dúzia"
  quantidade  text,
  ordem       smallint not null default 0
);

create index if not exists ingredientes_prato_idx on public.ingredientes (prato_id);

-- a linha da semana que marcou este prato; apagá-la leva os ingredientes atrás
alter table public.entradas
  add column if not exists prato_id uuid references public.pratos(id) on delete set null;

create table if not exists public.compras (
  id                 uuid primary key default gen_random_uuid(),
  casa_id            uuid not null references public.casas(id) on delete cascade,
  semana             date not null,
  nome               text not null,
  quantidade         text,
  comprado           boolean not null default false,
  comprado_em        timestamptz,
  -- de onde veio: null = escrito à mão
  origem_entrada_id  uuid references public.entradas(id) on delete set null,
  prato_id           uuid references public.pratos(id) on delete set null,
  -- mexido à mão depois de ter vindo de um prato: deixa de ser apagado sozinho
  editado            boolean not null default false,
  criada_em          timestamptz not null default now()
);

comment on table public.compras is 'A lista de compras da semana. O que não se comprou passa para a semana seguinte.';

create index if not exists compras_casa_semana_idx on public.compras (casa_id, semana);
create index if not exists compras_por_comprar_idx on public.compras (casa_id, comprado);

-- ---------------------------------------------------------------------
-- Tirar o prato do dia tira os ingredientes — mas só os que ainda não
-- foram comprados nem mexidos à mão.
--
-- Isto vive num gatilho e não no código da aplicação porque o jantar
-- também se apaga a partir da semana, e a regra tem de valer nas duas.
-- Um item já comprado fica, e perde apenas a ligação ao prato: é história,
-- e a caderneta guarda o que aconteceu.
-- ---------------------------------------------------------------------

create or replace function public.limpar_compras_do_prato()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.compras
   where origem_entrada_id = old.id
     and comprado = false
     and editado = false;
  return old;
end
$$;

drop trigger if exists entradas_ao_apagar on public.entradas;
create trigger entradas_ao_apagar
  before delete on public.entradas
  for each row execute function public.limpar_compras_do_prato();

-- ---------------------------------------------------------------------
-- Privilégios e RLS, iguais aos da caderneta: tudo é da casa
-- ---------------------------------------------------------------------

alter table public.pratos        enable row level security;
alter table public.ingredientes  enable row level security;
alter table public.compras       enable row level security;

revoke all on public.pratos       from anon;
revoke all on public.ingredientes from anon;
revoke all on public.compras      from anon;

grant select, insert, update, delete on public.pratos       to authenticated;
grant select, insert, update, delete on public.ingredientes to authenticated;
grant select, insert, update, delete on public.compras      to authenticated;

do $$
declare t text;
begin
  foreach t in array array['pratos','ingredientes','compras'] loop
    execute format('drop policy if exists %I on public.%I', t || '_ler', t);
    execute format('create policy %I on public.%I for select to authenticated using (casa_id = public.casa_do_utilizador())', t || '_ler', t);

    execute format('drop policy if exists %I on public.%I', t || '_escrever', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (casa_id = public.casa_do_utilizador())', t || '_escrever', t);

    execute format('drop policy if exists %I on public.%I', t || '_alterar', t);
    execute format('create policy %I on public.%I for update to authenticated using (casa_id = public.casa_do_utilizador()) with check (casa_id = public.casa_do_utilizador())', t || '_alterar', t);

    execute format('drop policy if exists %I on public.%I', t || '_apagar', t);
    execute format('create policy %I on public.%I for delete to authenticated using (casa_id = public.casa_do_utilizador())', t || '_apagar', t);
  end loop;
end
$$;

-- ---------------------------------------------------------------------
-- Tempo real, como as entradas
-- ---------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    raise notice 'Sem publicação supabase_realtime: o tempo real fica de fora, o resto funciona.';
  else
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'compras') then
      alter publication supabase_realtime add table public.compras;
    end if;
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'pratos') then
      alter publication supabase_realtime add table public.pratos;
    end if;
  end if;
end
$$;
