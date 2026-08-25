-- =====================================================================
-- HomePlanner — uma entrada tem princípio e fim
--
-- Até aqui uma entrada tinha uma hora e mais nada. Duas coisas que a casa
-- faz todos os dias não cabiam nisso:
--
--   "Reunião das 14:00 às 15:30"        — um intervalo de horas
--   "Pai fora de 31 às 12:00 a 3 às 23:00" — vários dias seguidos
--
-- A coluna `extensao` ('inicio' | 'meio' | 'fim') tentava o segundo caso
-- escrevendo uma linha por dia. Nunca foi usada pela aplicação, e era a
-- solução errada: mudar o texto obrigava a corrigir N linhas, apagar
-- obrigava a apagar N, e as linhas separavam-se quando uma semana acabava.
-- Fica onde está para as linhas antigas continuarem a ler-se; deixa de ser
-- escrita. A extensão passa a ser deduzida do intervalo, não guardada.
--
-- Agora: uma linha só, com um fim opcional.
--   hora_fim  — a que horas acaba
--   fim_data  — em que dia acaba, quando não é no mesmo
--
-- Correr uma vez, no SQL Editor do projecto.
-- =====================================================================

alter table public.entradas
  add column if not exists hora_fim text,
  add column if not exists fim_data date;

comment on column public.entradas.hora_fim is 'A que horas acaba. Texto, como `hora`: a linha edita-se a meio de se escrever.';
comment on column public.entradas.fim_data is 'O último dia do período. Nulo = começa e acaba no mesmo dia.';

-- ---------------------------------------------------------------------
-- As datas a sério
--
-- `semana` + `dia` dizem quando uma entrada começa, mas em duas colunas —
-- e uma pergunta como "o que atravessa esta semana?" não se faz assim.
-- Estas duas colunas geradas dão a data real de início e de fim, e é sobre
-- elas que a semana se lê. Geradas e não escritas: não há hipótese de
-- ficarem em desacordo com o que lá está.
-- ---------------------------------------------------------------------

alter table public.entradas
  add column if not exists inicio_data date
    generated always as (case when dia is null then null else semana + dia end) stored;

alter table public.entradas
  add column if not exists fim_efectivo date
    generated always as (
      coalesce(fim_data, case when dia is null then null else semana + dia end)
    ) stored;

comment on column public.entradas.inicio_data is 'Data real em que a entrada começa. Gerada de semana + dia.';
comment on column public.entradas.fim_efectivo is 'Data real em que acaba: fim_data, ou o próprio dia quando não há período.';

-- Um período nunca acaba antes de começar.
alter table public.entradas drop constraint if exists entradas_fim_depois_do_inicio;
alter table public.entradas
  add constraint entradas_fim_depois_do_inicio
  check (fim_data is null or dia is null or fim_data >= semana + dia);

-- A semana lê-se por sobreposição de datas, não por igualdade de `semana`:
-- uma viagem que começa na segunda e acaba na quinta da semana seguinte
-- tem de aparecer nas duas.
create index if not exists entradas_casa_periodo_idx
  on public.entradas (casa_id, inicio_data, fim_efectivo);
