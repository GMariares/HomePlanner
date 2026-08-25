-- =====================================================================
-- HomePlanner — as contas da casa
--
-- O dinheiro guarda-se em CÊNTIMOS INTEIROS. Nunca em vírgula flutuante:
-- 0.1 + 0.2 não dá 0.3 em binário, e num sítio onde se soma um ano de
-- compras isso deixa de ser curiosidade e passa a ser um erro no total.
--
-- Um movimento é assinado: negativo sai, positivo entra. Assim um estorno
-- do supermercado é um positivo na categoria do mercado e desconta do
-- envelope sozinho, sem casos especiais.
--
-- Correr uma vez, no SQL Editor do projecto.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Categorias — propostas por omissão, mandadas pela casa
-- ---------------------------------------------------------------------

create table if not exists public.categorias (
  id          uuid primary key default gen_random_uuid(),
  casa_id     uuid not null references public.casas(id) on delete cascade,
  nome        text not null,
  -- 'despesa' enche um envelope; 'entrada' é dinheiro que chega
  natureza    text not null default 'despesa' check (natureza in ('despesa','entrada')),
  -- o matiz de onde saem todos os tons desta categoria, como manda o mundo
  cor         text not null default '#2f7e78',
  -- qual dos desenhos da casa usar; o nome da chave vive no código
  icone       text not null default 'saco',
  -- o tecto mensal por omissão, em cêntimos. Nulo = categoria sem orçamento.
  limite_cents integer check (limite_cents is null or limite_cents >= 0),
  ordem       integer not null default 0,
  arquivada   boolean not null default false,
  criada_em   timestamptz not null default now()
);

create index if not exists categorias_casa_idx on public.categorias (casa_id, arquivada, ordem);
comment on table public.categorias is 'As categorias desta casa. Semeadas com uma proposta, editáveis na aplicação.';

-- ---------------------------------------------------------------------
-- Orçamentos — só quando um mês foge ao tecto normal da categoria
-- ---------------------------------------------------------------------

create table if not exists public.orcamentos (
  id           uuid primary key default gen_random_uuid(),
  casa_id      uuid not null references public.casas(id) on delete cascade,
  categoria_id uuid not null references public.categorias(id) on delete cascade,
  -- sempre o dia 1
  mes          date not null,
  limite_cents integer not null check (limite_cents >= 0),
  unique (categoria_id, mes)
);

comment on table public.orcamentos is 'O tecto de uma categoria num mês. Sem linha, vale o limite da categoria.';

-- ---------------------------------------------------------------------
-- Compromissos — o que se repete todos os meses
--
-- Ficam fora dos envelopes de propósito: a renda não compete com o
-- mercado, e o ritmo do mês só faz sentido sobre o que é variável.
-- ---------------------------------------------------------------------

create table if not exists public.compromissos (
  id           uuid primary key default gen_random_uuid(),
  casa_id      uuid not null references public.casas(id) on delete cascade,
  nome         text not null,
  fornecedor   text,
  valor_cents  integer not null check (valor_cents > 0),
  dia_do_mes   smallint not null check (dia_do_mes between 1 and 31),
  categoria_id uuid references public.categorias(id) on delete set null,
  activo       boolean not null default true,
  criado_em    timestamptz not null default now()
);

create index if not exists compromissos_casa_idx on public.compromissos (casa_id, activo);
comment on table public.compromissos is 'Renda, luz, água, escola — o que chega todos os meses.';

-- ---------------------------------------------------------------------
-- Importações — para se poder desfazer uma de uma vez
-- ---------------------------------------------------------------------

create table if not exists public.importacoes (
  id        uuid primary key default gen_random_uuid(),
  casa_id   uuid not null references public.casas(id) on delete cascade,
  ficheiro  text not null default '',
  banco     text,
  quando    timestamptz not null default now()
);

create table if not exists public.mapas_de_importacao (
  id            uuid primary key default gen_random_uuid(),
  casa_id       uuid not null references public.casas(id) on delete cascade,
  nome          text not null,
  -- que coluna é a data, a descrição, o valor… guardado como o utilizador o disse
  colunas       jsonb not null default '{}'::jsonb,
  formato_data  text not null default 'dd/mm/aaaa',
  decimal_virgula boolean not null default true,
  usado_em      timestamptz not null default now(),
  unique (casa_id, nome)
);

comment on table public.mapas_de_importacao is 'O mapa de colunas de um banco, para não se dizer duas vezes.';

-- ---------------------------------------------------------------------
-- Movimentos — o livro
-- ---------------------------------------------------------------------

create table if not exists public.movimentos (
  id            uuid primary key default gen_random_uuid(),
  casa_id       uuid not null references public.casas(id) on delete cascade,
  -- o dia em que aconteceu de verdade
  data          date not null,
  -- negativo sai, positivo entra; zero não é movimento nenhum
  valor_cents   integer not null check (valor_cents <> 0),
  descricao     text not null default '',
  categoria_id  uuid references public.categorias(id) on delete set null,
  fornecedor    text,
  autor         text check (autor in ('pai','mae','filha','casa')),
  compromisso_id uuid references public.compromissos(id) on delete set null,
  /*
   * O ordenado que entra a 29 de Agosto é o ordenado de Setembro. O
   * movimento guarda a data verdadeira e, quando é preciso, o mês em que
   * conta. Sem isto, um mês ficava com dois ordenados e o seguinte sem nenhum.
   */
  mes_conta_manual date,
  importacao_id uuid references public.importacoes(id) on delete set null,
  -- para não entrar duas vezes ao reimportar um período sobreposto
  impressao     text,
  criado_em     timestamptz not null default now(),
  criado_por    uuid references auth.users(id) default auth.uid()
);

-- O mês a que este movimento pertence: o escolhido, ou o da sua data.
alter table public.movimentos
  add column if not exists mes_conta date
  generated always as (
    coalesce(mes_conta_manual, make_date(extract(year from data)::int, extract(month from data)::int, 1))
  ) stored;

create index if not exists movimentos_casa_mes_idx on public.movimentos (casa_id, mes_conta);
create index if not exists movimentos_casa_data_idx on public.movimentos (casa_id, data);
create index if not exists movimentos_categoria_idx on public.movimentos (categoria_id);
-- a mesma linha do mesmo extracto não entra duas vezes
create unique index if not exists movimentos_impressao_idx
  on public.movimentos (casa_id, impressao) where impressao is not null;

comment on table public.movimentos is 'Tudo o que entrou e saiu. Cêntimos inteiros, com sinal.';
comment on column public.movimentos.mes_conta is 'O mês em que este movimento conta. Gerado: o manual, ou o da data.';

-- ---------------------------------------------------------------------
-- A proposta de categorias
--
-- Semeia-se uma vez, e só se a casa ainda não tiver nenhuma: a partir daí
-- as categorias são da casa e ninguém lhas mexe.
-- ---------------------------------------------------------------------

create or replace function public.semear_categorias()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  minha uuid := public.casa_do_utilizador();
  quantas integer;
begin
  if minha is null then
    raise exception 'Não pertence a nenhuma casa.';
  end if;
  select count(*) into quantas from public.categorias where casa_id = minha;
  if quantas > 0 then return 0; end if;

  insert into public.categorias (casa_id, nome, natureza, cor, icone, ordem) values
    (minha, 'Mercado',            'despesa', '#b9862c', 'cesto',      10),
    (minha, 'Casa',               'despesa', '#5561b8', 'casa',       20),
    (minha, 'Contas',             'despesa', '#2f7e78', 'raio',       30),
    (minha, 'Transportes',        'despesa', '#bd5f3a', 'carro',      40),
    (minha, 'Saúde',              'despesa', '#c0566e', 'cruz',       50),
    (minha, 'Escola',             'despesa', '#467a52', 'livro',      60),
    (minha, 'Restaurantes',       'despesa', '#a0682c', 'talheres',   70),
    (minha, 'Lazer',              'despesa', '#7a5bb5', 'balao',      80),
    (minha, 'Roupa',              'despesa', '#4a7fa8', 'camisola',   90),
    (minha, 'Cuidados pessoais',  'despesa', '#a65a86', 'gota',      100),
    (minha, 'Animais',            'despesa', '#7d7a4a', 'pata',      110),
    (minha, 'Outros',             'despesa', '#75705f', 'saco',      120),
    (minha, 'Ordenado',           'entrada', '#2f7e78', 'moeda',     200),
    (minha, 'Outras entradas',    'entrada', '#467a52', 'moeda',     210);
  return 14;
end $$;

revoke all on function public.semear_categorias() from public;
grant execute on function public.semear_categorias() to authenticated;

-- ---------------------------------------------------------------------
-- Row-Level Security — uma casa nunca vê as contas de outra
-- ---------------------------------------------------------------------

alter table public.categorias          enable row level security;
alter table public.orcamentos          enable row level security;
alter table public.compromissos        enable row level security;
alter table public.movimentos          enable row level security;
alter table public.importacoes         enable row level security;
alter table public.mapas_de_importacao enable row level security;

do $$
declare t text;
begin
  foreach t in array array['categorias','orcamentos','compromissos','movimentos','importacoes','mapas_de_importacao']
  loop
    execute format('drop policy if exists %I on public.%I', t || '_ler', t);
    execute format('drop policy if exists %I on public.%I', t || '_escrever', t);
    execute format('drop policy if exists %I on public.%I', t || '_alterar', t);
    execute format('drop policy if exists %I on public.%I', t || '_apagar', t);

    execute format(
      'create policy %I on public.%I for select to authenticated using (casa_id = public.casa_do_utilizador())',
      t || '_ler', t);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (casa_id = public.casa_do_utilizador())',
      t || '_escrever', t);
    execute format(
      'create policy %I on public.%I for update to authenticated using (casa_id = public.casa_do_utilizador()) with check (casa_id = public.casa_do_utilizador())',
      t || '_alterar', t);
    execute format(
      'create policy %I on public.%I for delete to authenticated using (casa_id = public.casa_do_utilizador())',
      t || '_apagar', t);
  end loop;
end $$;

-- tempo real, se a publicação existir neste projecto
do $$
begin
  execute 'alter publication supabase_realtime add table public.movimentos';
  execute 'alter publication supabase_realtime add table public.categorias';
exception when others then
  raise notice 'Sem publicação supabase_realtime: o tempo real fica de fora, o resto funciona.';
end $$;
