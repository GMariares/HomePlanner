-- =====================================================================
-- HomePlanner — os fornecedores da casa
--
-- "Auchan é Mercado" diz-se uma vez. A partir daí, escrever "Auchan" no
-- registo escolhe a categoria sozinho, e um extracto do banco chega já
-- arrumado — menos as linhas de fornecedor desconhecido, que ficam
-- marcadas por alocar em vez de entrarem caladas na categoria errada.
--
-- A chave é um pedaço de texto ("auchan", "lidl", "via verde"): casa com
-- qualquer descrição que o contenha, porque é assim que os bancos
-- escrevem — "AUCHAN MATOSINHOS" hoje, "AUCHAN GAIA" para o mês.
--
-- Correr uma vez, no SQL Editor do projecto.
-- =====================================================================

create table if not exists public.fornecedores (
  id           uuid primary key default gen_random_uuid(),
  casa_id      uuid not null references public.casas(id) on delete cascade,
  -- normalizada: minúsculas, sem acentos, espaços aparados
  chave        text not null check (length(trim(chave)) >= 2),
  -- como a casa lhe chama ("Auchan", não "AUCHAN MATOSINHOS 0043")
  nome         text not null default '',
  categoria_id uuid references public.categorias(id) on delete set null,
  criado_em    timestamptz not null default now(),
  unique (casa_id, chave)
);

create index if not exists fornecedores_casa_idx on public.fornecedores (casa_id);
comment on table public.fornecedores is
  'Uma regra por fornecedor: quem casar com a chave entra na categoria. A chave mais comprida ganha.';

alter table public.fornecedores enable row level security;

drop policy if exists fornecedores_ler on public.fornecedores;
drop policy if exists fornecedores_escrever on public.fornecedores;
drop policy if exists fornecedores_alterar on public.fornecedores;
drop policy if exists fornecedores_apagar on public.fornecedores;
create policy fornecedores_ler on public.fornecedores
  for select to authenticated using (casa_id = public.casa_do_utilizador());
create policy fornecedores_escrever on public.fornecedores
  for insert to authenticated with check (casa_id = public.casa_do_utilizador());
create policy fornecedores_alterar on public.fornecedores
  for update to authenticated using (casa_id = public.casa_do_utilizador())
  with check (casa_id = public.casa_do_utilizador());
create policy fornecedores_apagar on public.fornecedores
  for delete to authenticated using (casa_id = public.casa_do_utilizador());
