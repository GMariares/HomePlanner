-- =====================================================================
-- A despensa, os conjuntos e o preço
--
-- Escrever a lista à mão, item a item, todas as semanas, é trabalho a
-- mais para uma coisa que se repete. Esta migração dá à casa memória:
--
--   artigos   — o que esta casa costuma comprar, aprendido sozinho do
--               que já foi escrito, com a quantidade e o preço do costume
--   conjuntos — coisas que se compram sempre juntas ("Pequeno-almoço")
--   preço     — opcional, por linha, para se saber quanto custa a compra
--
-- Correr depois de 20260824130000_ementa.sql.
-- =====================================================================

alter table public.compras add column if not exists preco numeric(10,2);
comment on column public.compras.preco is 'Opcional. Em euros.';

alter table public.casas add column if not exists mostrar_precos boolean not null default false;

-- ---------------------------------------------------------------------
-- "Iogurtes" e "iogurtes" são a mesma coisa. Sem depender da extensão
-- unaccent, que pode não estar ligada no projecto.
-- ---------------------------------------------------------------------
create or replace function public.chave_de_nome(t text)
returns text
language sql
immutable
as $$
  select translate(
    lower(btrim(coalesce(t, ''))),
    'áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ',
    'aaaaaeeeeiiiiooooouuuucnAAAAAEEEEIIIIOOOOOUUUUCN'
  )
$$;

-- ---------------------------------------------------------------------
-- A despensa
-- ---------------------------------------------------------------------
create table if not exists public.artigos (
  id          uuid primary key default gen_random_uuid(),
  casa_id     uuid not null references public.casas(id) on delete cascade,
  chave       text not null,
  nome        text not null,
  quantidade  text,
  preco       numeric(10,2),
  vezes       integer not null default 1,
  ultima_em   timestamptz not null default now(),
  unique (casa_id, chave)
);

comment on table public.artigos is 'O que esta casa costuma comprar. Ninguém escreve isto: aprende-se.';
create index if not exists artigos_casa_idx on public.artigos (casa_id, vezes desc);

/**
 * Cada linha escrita na lista ensina a despensa. Comprar não é preciso:
 * escrever já diz que esta casa compra isto, e com que quantidade.
 * SECURITY DEFINER porque o gatilho escreve numa tabela que o RLS protege.
 */
create or replace function public.aprender_artigo()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  limpo text := btrim(coalesce(new.nome, ''));
begin
  if limpo = '' then return new; end if;

  insert into public.artigos (casa_id, chave, nome, quantidade, preco, vezes, ultima_em)
  values (
    new.casa_id, public.chave_de_nome(limpo), limpo,
    nullif(btrim(coalesce(new.quantidade, '')), ''), new.preco,
    case when tg_op = 'INSERT' then 1 else 0 end, now()
  )
  on conflict (casa_id, chave) do update set
    nome       = excluded.nome,
    quantidade = coalesce(excluded.quantidade, public.artigos.quantidade),
    preco      = coalesce(excluded.preco, public.artigos.preco),
    -- editar uma linha não faz de conta que se comprou mais uma vez
    vezes      = public.artigos.vezes + case when tg_op = 'INSERT' then 1 else 0 end,
    ultima_em  = now();

  return new;
end
$$;

drop trigger if exists compras_aprender_ins on public.compras;
create trigger compras_aprender_ins
  after insert on public.compras
  for each row execute function public.aprender_artigo();

drop trigger if exists compras_aprender_upd on public.compras;
create trigger compras_aprender_upd
  after update of nome, quantidade, preco on public.compras
  for each row execute function public.aprender_artigo();

-- ---------------------------------------------------------------------
-- Conjuntos: o que se compra sempre junto
-- ---------------------------------------------------------------------
create table if not exists public.conjuntos (
  id         uuid primary key default gen_random_uuid(),
  casa_id    uuid not null references public.casas(id) on delete cascade,
  nome       text not null,
  criado_em  timestamptz not null default now(),
  unique (casa_id, nome)
);

create table if not exists public.conjunto_itens (
  id            uuid primary key default gen_random_uuid(),
  casa_id       uuid not null references public.casas(id) on delete cascade,
  conjunto_id   uuid not null references public.conjuntos(id) on delete cascade,
  nome          text not null,
  quantidade    text,
  ordem         smallint not null default 0
);

create index if not exists conjunto_itens_idx on public.conjunto_itens (conjunto_id, ordem);

-- ---------------------------------------------------------------------
-- Privilégios e RLS, como tudo o resto: é da casa
-- ---------------------------------------------------------------------
alter table public.artigos        enable row level security;
alter table public.conjuntos      enable row level security;
alter table public.conjunto_itens enable row level security;

revoke all on public.artigos        from anon;
revoke all on public.conjuntos      from anon;
revoke all on public.conjunto_itens from anon;

grant select, insert, update, delete on public.artigos        to authenticated;
grant select, insert, update, delete on public.conjuntos      to authenticated;
grant select, insert, update, delete on public.conjunto_itens to authenticated;

do $$
declare t text;
begin
  foreach t in array array['artigos','conjuntos','conjunto_itens'] loop
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

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='conjuntos') then
      alter publication supabase_realtime add table public.conjuntos;
    end if;
  end if;
end
$$;
