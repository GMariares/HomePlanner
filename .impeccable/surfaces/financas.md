<!--
  Surface brief — Finanças
  Escrito por `shape`, 2026-08-26. Semente de superfície 4ff8a0cc, re-roll 1.
  O mundo é o de sempre (Os Módulos); DESIGN.md ganha em qualquer questão visual.
-->

# Surface brief — Finanças

Modo: **Operate**. Rota nova, a substituir o "em breve".

## 1. Job and audience

Quem trata do dinheiro da casa, em duas sessões que não se conciliam e têm de ser
servidas as duas: a **hora ao computador** (categorizar, pôr orçamentos, importar
um extracto) e os **segundos ao telemóvel** (registar um gasto na fila do
supermercado; ver se ainda há folga antes de comprar). Partilhado por omissão.

## 2. Outcome and proof

Saber em três segundos se o mês vai bem, e registar um gasto mais depressa do que
não o registar. A prova é o extracto do banco a entrar como vem e a arrumar-se
quase todo sozinho: a casa diz uma vez que "Auchan é Mercearias" e não volta a
dizê-lo.

## 3. Selected direction — O passo do mês

**Ritmo, não total.** O mês é uma pista do dia 1 ao último dia, com hoje marcado,
onde se lê o que já se gastou contra o ritmo que o orçamento implica.

Sequência: pista → envelopes por **pressão** (o mais perto de rebentar primeiro,
nunca por ordem alfabética) → comprometido → livro e importação um nível abaixo.

**O que faz ou desfaz esta direcção:** uma linha de gasto uniforme é mentira numa
casa a sério. Duas regras seguram-na — o corredor cobre **só os envelopes
variáveis** (o comprometido está fora por construção, o que tira a distorção da
renda que cai no dia 8), e desenha-se como **corredor de tolerância, não como
linha**, sem alarme antes do dia 7. A palavra é *ao ritmo de*, nunca *devias ter
gasto*.

## 4. Scope and boundaries

**Dentro:** pista do mês; envelopes (criar, editar, gastar); bloco de
compromissos com dia de vencimento e estado; registo rápido; importação de
CSV/XLSX com mapa de colunas lembrado por banco e detecção de duplicados;
entradas (ordenado recorrente + avulsas); livro do mês; categoria e fornecedor
por movimento; **categorias configuráveis na aplicação**.

**Fora (anti-goals):** Open Banking / sincronização viva; **qualquer ligação entre a
lista de compras e as Finanças** — decidido pelo dono da casa a 26/08/2026, e não é
"por agora": a lista serve o supermercado e as contas servem o mês, e cruzá-las só
poria a lista a pedir contas a quem está a fazer compras; investimentos e
património; multi-moeda; fotografia de recibos.

## 5. States and ranges

Envelopes 0 / 6–12 típico / 20+ sem partir. Movimentos 0 / 60–120 por mês / 400+
depois de uma importação. Importação: 2 a ~2000 linhas, colunas desconhecidas,
vírgula decimal e dd/mm/aaaa, reimportação sobreposta, e um ficheiro que nem
sequer é um extracto. Valores de 0,01 € a cinco algarismos, **incluindo negativos**
— estornos não podem partir um medidor. Meses: o primeiro (sem histórico nem
envelopes), um a decorrer, um fechado. Falhas: sem rede, migração por correr,
importação a meio do mapa, envelope rebentado, compromisso em atraso.

## 6. Interaction and layout

No computador a pista ocupa a largura toda e os envelopes ficam em grelha; no
telemóvel empilha — pista reduzida a uma barra, envelopes em linhas, registo
sempre à mão. A navegação de mês repete o botão de pílula da Semana. Registar um
gasto mexe o envelope e o marcador: essa consequência à vista **é** a recompensa.

## 7. Constraints and open decisions

Mesma pilha; RLS por casa. **Dinheiro em cêntimos inteiros, nunca vírgula
flutuante.** pt-PT, EUR, vírgula decimal, dd/mm/aaaa. O estado do ritmo nunca só
por cor; medidores com equivalente escrito; algarismos tabulares.

**Decidido pelo dono da casa (2026-08-26):**
- As categorias são propostas por omissão mas **configuráveis na aplicação**.
- O mês começa no dia 1, **mas um movimento pode ser contado noutro mês** — o
  ordenado que entra a 29 de Agosto pode contar para Setembro. Cada movimento
  guarda a sua data verdadeira e, opcionalmente, o mês em que conta.
- Corredor de ritmo uniforme na v1; ponderado pelo histórico fica para quando
  houver histórico.
