-- =====================================================================
-- HomePlanner — a agenda da casa no calendário do telemóvel
--
-- Cada casa pode publicar a sua semana como um calendário subscrito
-- (iCalendar). Quem o adicionar no telemóvel passa a ver a agenda da
-- família ao lado dos compromissos do trabalho, e actualiza-se sozinho.
--
-- O endereço é a credencial: quem o tiver vê a agenda desta casa. Por
-- isso é um valor aleatório longo, guardado aqui, e pode ser trocado a
-- qualquer momento — trocá-lo corta o acesso a quem o tinha.
--
-- A verificação é feita AQUI DENTRO, por uma função `security definer`.
-- Assim quem serve o ficheiro só precisa da chave pública: não há
-- nenhum segredo novo espalhado pelo alojamento.
--
-- Correr uma vez, no SQL Editor do projecto.
-- =====================================================================

alter table public.casas
  add column if not exists calendario_token text unique;

comment on column public.casas.calendario_token is
  'O endereço secreto do calendário subscrito. Nulo = a casa não publica nada.';

-- ---------------------------------------------------------------------
-- Ligar, desligar, trocar
-- ---------------------------------------------------------------------

create or replace function public.ligar_calendario()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  minha uuid := public.casa_do_utilizador();
  novo  text;
begin
  if minha is null then
    raise exception 'Não pertence a nenhuma casa.';
  end if;
  -- 32 caracteres hexadecimais: adivinhá-lo não é um plano
  novo := replace(gen_random_uuid()::text, '-', '');
  update public.casas set calendario_token = novo where id = minha;
  return novo;
end $$;

comment on function public.ligar_calendario() is
  'Cria (ou troca) o endereço do calendário desta casa. Trocar corta o acesso ao anterior.';

create or replace function public.desligar_calendario()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  minha uuid := public.casa_do_utilizador();
begin
  if minha is null then
    raise exception 'Não pertence a nenhuma casa.';
  end if;
  update public.casas set calendario_token = null where id = minha;
end $$;

-- ---------------------------------------------------------------------
-- O que o calendário lê
--
-- Uma janela: oito semanas para trás e um ano para a frente. Um
-- calendário não precisa da agenda de 2019, e assim o ficheiro
-- mantém-se pequeno em casas que usem isto durante anos.
-- ---------------------------------------------------------------------

create or replace function public.calendario_por_token(p_token text)
returns table (
  id           uuid,
  texto        text,
  genero       text,
  autor        text,
  inicio_data  date,
  fim_efectivo date,
  hora         text,
  hora_fim     text,
  casa_nome    text
)
language sql
stable
security definer
set search_path = public
as $$
  select e.id, e.texto, e.genero, e.autor,
         e.inicio_data, e.fim_efectivo, e.hora, e.hora_fim,
         c.nome
    from public.entradas e
    join public.casas c on c.id = e.casa_id
   where c.calendario_token is not null
     -- um token curto ou vazio nunca abre nada
     and length(coalesce(p_token, '')) >= 32
     and c.calendario_token = p_token
     and e.riscada = false
     and e.inicio_data is not null
     and e.inicio_data between current_date - interval '8 weeks'
                           and current_date + interval '52 weeks'
   order by e.inicio_data, e.hora nulls first
$$;

comment on function public.calendario_por_token(text) is
  'As entradas de uma casa, para quem tiver o endereço do calendário. O token é a credencial.';

-- Quem serve o ficheiro chega sem sessão: é o token que autoriza.
revoke all on function public.calendario_por_token(text) from public;
grant execute on function public.calendario_por_token(text) to anon, authenticated;

revoke all on function public.ligar_calendario() from public;
revoke all on function public.desligar_calendario() from public;
grant execute on function public.ligar_calendario() to authenticated;
grant execute on function public.desligar_calendario() to authenticated;
