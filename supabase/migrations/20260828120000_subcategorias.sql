-- =====================================================================
-- HomePlanner — subcategorias
--
-- "Casa" desdobra-se em renda, electricidade, IMI, água, obras — como na
-- folha de cálculo que esta família já usava. Um nível só, de propósito:
-- dois níveis chegam para arrumar uma casa, e uma árvore funda é onde as
-- categorias vão morrer esquecidas.
--
-- Correr uma vez, no SQL Editor do projecto.
-- =====================================================================

alter table public.categorias
  add column if not exists mae_id uuid references public.categorias(id) on delete cascade;

create index if not exists categorias_mae_idx on public.categorias (mae_id);

comment on column public.categorias.mae_id is
  'A categoria de que esta é parte. Nula = categoria de raiz. Um nível só.';

-- Um nível só, e a mãe tem de ser da mesma casa e da mesma natureza:
-- uma subcategoria de despesa dentro de uma entrada não quer dizer nada.
create or replace function public.validar_subcategoria()
returns trigger
language plpgsql
as $$
declare mae public.categorias;
begin
  if new.mae_id is null then return new; end if;
  if new.mae_id = new.id then
    raise exception 'Uma categoria não pode ser mãe de si própria.';
  end if;
  select * into mae from public.categorias where id = new.mae_id;
  if mae.id is null then
    raise exception 'A categoria-mãe não existe.';
  end if;
  if mae.mae_id is not null then
    raise exception 'Só há um nível: uma subcategoria não tem filhas.';
  end if;
  if mae.casa_id <> new.casa_id then
    raise exception 'A mãe é de outra casa.';
  end if;
  if mae.natureza <> new.natureza then
    raise exception 'Mãe e filha têm de ser da mesma natureza.';
  end if;
  return new;
end $$;

drop trigger if exists categorias_validar_sub on public.categorias;
create trigger categorias_validar_sub
  before insert or update of mae_id on public.categorias
  for each row execute function public.validar_subcategoria();
