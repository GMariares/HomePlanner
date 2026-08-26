-- =====================================================================
-- HomePlanner — as transferências entre contas próprias
--
-- Passar 500 € da poupança para a conta à ordem aparece no extracto como
-- um débito de 500 €. Não é despesa nenhuma: o dinheiro continua na casa,
-- mudou de bolso. Contado como gasto, estragava o envelope, o passo do
-- mês, o total do ano e a diferença entre o previsto e o real.
--
-- A resposta é uma terceira natureza. Uma categoria de transferência não
-- enche envelope nenhum e não conta em lado nenhum — só aparece no livro,
-- porque aconteceu. Com uma regra de fornecedor ("trf cxdapp"), o extracto
-- passa a arrumá-las sozinho.
--
-- Correr uma vez, no SQL Editor do projecto.
-- =====================================================================

-- ---------------------------------------------------------------------
-- A natureza ganha um terceiro valor
-- ---------------------------------------------------------------------

-- O check nasceu em linha e tem nome gerado; procura-se em vez de se adivinhar.
do $$
declare nome text;
begin
  for nome in
    select conname from pg_constraint
     where conrelid = 'public.categorias'::regclass
       and contype = 'c'
       and pg_get_constraintdef(oid) ilike '%natureza%'
  loop
    execute format('alter table public.categorias drop constraint %I', nome);
  end loop;
end $$;

alter table public.categorias
  add constraint categorias_natureza_check
  check (natureza in ('despesa', 'entrada', 'transferencia'));

comment on column public.categorias.natureza is
  '''despesa'' enche um envelope; ''entrada'' é dinheiro que chega; ''transferencia'' é dinheiro que muda de bolso e não conta para nada.';

-- ---------------------------------------------------------------------
-- Uma categoria de transferência para quem já tem contas abertas
--
-- Só a casas que já semearam categorias (uma casa vazia recebe-a na
-- sementeira) e só se ainda não tiverem nenhuma: correr isto duas vezes
-- não cria duas.
-- ---------------------------------------------------------------------

insert into public.categorias (casa_id, nome, natureza, cor, icone, ordem)
select c.id, 'Transferências', 'transferencia', '#75705f', 'troca', 300
  from public.casas c
 where exists (select 1 from public.categorias k where k.casa_id = c.id)
   and not exists (
     select 1 from public.categorias k
      where k.casa_id = c.id and k.natureza = 'transferencia');

-- ---------------------------------------------------------------------
-- A proposta de categorias, agora com a transferência
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
    (minha, 'Mercado',            'despesa',       '#b9862c', 'cesto',      10),
    (minha, 'Casa',               'despesa',       '#5561b8', 'casa',       20),
    (minha, 'Contas',             'despesa',       '#2f7e78', 'raio',       30),
    (minha, 'Transportes',        'despesa',       '#bd5f3a', 'carro',      40),
    (minha, 'Saúde',              'despesa',       '#c0566e', 'cruz',       50),
    (minha, 'Escola',             'despesa',       '#467a52', 'livro',      60),
    (minha, 'Restaurantes',       'despesa',       '#a0682c', 'talheres',   70),
    (minha, 'Lazer',              'despesa',       '#7a5bb5', 'balao',      80),
    (minha, 'Roupa',              'despesa',       '#4a7fa8', 'camisola',   90),
    (minha, 'Cuidados pessoais',  'despesa',       '#a65a86', 'gota',      100),
    (minha, 'Animais',            'despesa',       '#7d7a4a', 'pata',      110),
    (minha, 'Outros',             'despesa',       '#75705f', 'saco',      120),
    (minha, 'Ordenado',           'entrada',       '#2f7e78', 'moeda',     200),
    (minha, 'Outras entradas',    'entrada',       '#467a52', 'moeda',     210),
    (minha, 'Transferências',     'transferencia', '#75705f', 'troca',     300);
  return 15;
end $$;

revoke all on function public.semear_categorias() from public;
grant execute on function public.semear_categorias() to authenticated;
