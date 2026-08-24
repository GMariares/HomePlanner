-- =====================================================================
-- Somar o que se compra
--
-- Se um jantar leva 1 kg de carne e outro leva 500 g, a lista não deve
-- pedir duas linhas de carne: deve pedir 1,5 kg. Para isso é preciso
-- saber de onde vem cada parcela, senão tirar um dos jantares não sabe
-- quanto há-de devolver.
--
-- Correr depois de 20260824140000_despensa.sql.
-- =====================================================================

alter table public.compras add column if not exists automatica boolean not null default false;
comment on column public.compras.automatica is 'Nasceu de um prato. Sem parcelas nenhumas, deixa de fazer sentido.';

-- ---------------------------------------------------------------------
-- Ler uma quantidade escrita à mão
-- ---------------------------------------------------------------------
create or replace function public.medida(t text, out valor numeric, out unidade text)
language plpgsql
immutable
as $$
declare m text[]; n numeric; u text;
begin
  valor := null; unidade := null;
  if t is null or btrim(t) = '' then return; end if;

  m := regexp_match(btrim(lower(t)), '^([0-9]+(?:[.,][0-9]+)?)\s*([a-zà-ú]*)\.?$');
  if m is null then return; end if;

  n := replace(m[1], ',', '.')::numeric;
  u := coalesce(m[2], '');

  if    u in ('kg','kgs','quilo','quilos')          then valor := n * 1000; unidade := 'g';
  elsif u in ('g','gr','grs','grama','gramas')      then valor := n;        unidade := 'g';
  elsif u in ('l','lt','lts','litro','litros')      then valor := n * 1000; unidade := 'ml';
  elsif u in ('ml','mls')                           then valor := n;        unidade := 'ml';
  elsif u = ''                                      then valor := n;        unidade := 'un';
  else                                                   valor := n;        unidade := u;
  end if;
end
$$;

/** Escreve um número à portuguesa: vírgula decimal, e sem vírgula pendurada
    quando o número é inteiro — "10", não "10,". */
create or replace function public.numero_pt(v numeric)
returns text
language sql
immutable
as $$
  select replace(rtrim(trim(to_char(v, 'FM999999990.999')), '.'), '.', ',')
$$;

/** 1500 g escreve-se 1,5 kg. */
create or replace function public.escrever_quantidade(v numeric, u text)
returns text
language sql
immutable
as $$
  select case
    when u = 'g'  and v >= 1000 then public.numero_pt(v / 1000) || ' kg'
    when u = 'ml' and v >= 1000 then public.numero_pt(v / 1000) || ' l'
    when u = 'un'               then public.numero_pt(v)
    else                             public.numero_pt(v) || ' ' || u
  end
$$;

/**
 * Soma o que é da mesma espécie e não inventa o resto: "1 molho" e "2 kg"
 * ficam lado a lado, porque somá-los seria mentira.
 */
create or replace function public.juntar_quantidades(qs text[])
returns text
language plpgsql
immutable
as $$
declare
  q text; v numeric; u text;
  totais jsonb := '{}'::jsonb;
  soltas text[] := '{}';
  chave text; partes text[] := '{}';
begin
  foreach q in array coalesce(qs, '{}'::text[]) loop
    if q is null or btrim(q) = '' then continue; end if;
    select m.valor, m.unidade into v, u from public.medida(q) m;
    if v is null then
      soltas := soltas || q;
    else
      totais := jsonb_set(totais, array[u], to_jsonb(coalesce((totais ->> u)::numeric, 0) + v));
    end if;
  end loop;

  for chave in select jsonb_object_keys(totais) order by 1 loop
    partes := partes || public.escrever_quantidade((totais ->> chave)::numeric, chave);
  end loop;
  partes := partes || soltas;

  if array_length(partes, 1) is null then return null; end if;
  return array_to_string(partes, ' + ');
end
$$;

-- ---------------------------------------------------------------------
-- De onde vem cada parcela
-- ---------------------------------------------------------------------
create table if not exists public.compra_origens (
  id          uuid primary key default gen_random_uuid(),
  casa_id     uuid not null references public.casas(id) on delete cascade,
  compra_id   uuid not null references public.compras(id) on delete cascade,
  entrada_id  uuid not null references public.entradas(id) on delete cascade,
  prato_id    uuid references public.pratos(id) on delete set null,
  quantidade  text
);

create index if not exists compra_origens_compra_idx on public.compra_origens (compra_id);
create index if not exists compra_origens_entrada_idx on public.compra_origens (entrada_id);

/**
 * A quantidade de uma linha é a soma das suas parcelas. Uma linha comprada
 * ou mexida à mão é da casa: fica como está.
 */
create or replace function public.recalcular_compra(p_compra uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  c public.compras;
  quantas int;
  nova text;
begin
  select * into c from public.compras where id = p_compra;
  if c.id is null then return; end if;

  select count(*) into quantas from public.compra_origens o where o.compra_id = p_compra;

  if quantas = 0 then
    -- nasceu de um prato e já não tem nenhum: sai, a menos que a casa lhe tenha mexido
    if c.automatica and not c.comprado and not c.editado then
      delete from public.compras where id = p_compra;
    end if;
    return;
  end if;

  if c.comprado or c.editado then return; end if;

  select public.juntar_quantidades(array_agg(o.quantidade)) into nova
  from public.compra_origens o where o.compra_id = p_compra;

  update public.compras set quantidade = nova where id = p_compra;
end
$$;

create or replace function public.ao_mudar_origem()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.recalcular_compra(coalesce(new.compra_id, old.compra_id));
  return coalesce(new, old);
end
$$;

drop trigger if exists compra_origens_recalcular on public.compra_origens;
create trigger compra_origens_recalcular
  after insert or delete on public.compra_origens
  for each row execute function public.ao_mudar_origem();

-- ---------------------------------------------------------------------
-- Marcar um prato num dia: junta-se ao que já lá está
-- ---------------------------------------------------------------------
create or replace function public.juntar_prato_na_lista(p_entrada uuid, p_prato uuid, p_semana date)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  casa uuid := public.casa_do_utilizador();
  i record;
  alvo uuid;
begin
  if casa is null then raise exception 'Sem casa.' using errcode = '42501'; end if;

  for i in select * from public.ingredientes where prato_id = p_prato and casa_id = casa order by ordem loop
    select c.id into alvo
      from public.compras c
     where c.casa_id = casa
       and c.semana = p_semana
       and c.comprado = false
       and public.chave_de_nome(c.nome) = public.chave_de_nome(i.nome)
     limit 1;

    if alvo is null then
      insert into public.compras (casa_id, semana, nome, quantidade, prato_id, automatica)
      values (casa, p_semana, i.nome, i.quantidade, p_prato, true)
      returning id into alvo;
    end if;

    insert into public.compra_origens (casa_id, compra_id, entrada_id, prato_id, quantidade)
    values (casa, alvo, p_entrada, p_prato, i.quantidade);
  end loop;
end
$$;

/** Tirar o jantar tira as suas parcelas; os gatilhos fazem as contas. */
create or replace function public.tirar_prato_da_lista(p_entrada uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.compra_origens where entrada_id = p_entrada;
end
$$;

revoke all on function public.juntar_prato_na_lista(uuid, uuid, date) from public;
revoke all on function public.tirar_prato_da_lista(uuid) from public;
grant execute on function public.juntar_prato_na_lista(uuid, uuid, date) to authenticated;
grant execute on function public.tirar_prato_da_lista(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- O gatilho antigo apagava a linha inteira. Agora só tira a sua parcela.
-- ---------------------------------------------------------------------
create or replace function public.limpar_compras_do_prato()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.compra_origens where entrada_id = old.id;
  -- linhas antigas, de antes das parcelas
  delete from public.compras
   where origem_entrada_id = old.id and comprado = false and editado = false
     and not exists (select 1 from public.compra_origens o where o.compra_id = compras.id);
  return old;
end
$$;

-- ---------------------------------------------------------------------
-- Trazer o que já existe para o modelo novo
-- ---------------------------------------------------------------------
insert into public.compra_origens (casa_id, compra_id, entrada_id, prato_id, quantidade)
select c.casa_id, c.id, c.origem_entrada_id, c.prato_id, c.quantidade
  from public.compras c
 where c.origem_entrada_id is not null
   and not exists (select 1 from public.compra_origens o where o.compra_id = c.id);

update public.compras set automatica = true where origem_entrada_id is not null;

-- ---------------------------------------------------------------------
-- Privilégios e RLS
-- ---------------------------------------------------------------------
alter table public.compra_origens enable row level security;
revoke all on public.compra_origens from anon;
grant select, insert, update, delete on public.compra_origens to authenticated;

drop policy if exists compra_origens_ler on public.compra_origens;
create policy compra_origens_ler on public.compra_origens
  for select to authenticated using (casa_id = public.casa_do_utilizador());
drop policy if exists compra_origens_escrever on public.compra_origens;
create policy compra_origens_escrever on public.compra_origens
  for insert to authenticated with check (casa_id = public.casa_do_utilizador());
drop policy if exists compra_origens_apagar on public.compra_origens;
create policy compra_origens_apagar on public.compra_origens
  for delete to authenticated using (casa_id = public.casa_do_utilizador());
