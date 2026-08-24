---
name: HomePlanner
description: A Portuguese school agenda — this week, this week's dinners, and the household's book of dishes. Printed structure, written content, one pen per person.
colors:
  papel: "#eef1f6"
  folha: "#f8fafc"
  pauta: "#c7d2e0"
  pauta-forte: "#a5b6cc"
  impresso-tinta: "#5a6b85"
  margem: "#c0392b"
  capa: "#16224a"
  capa-funda: "#0e1730"
  fita: "#c8912b"
  carimbo: "#6b3fa8"
  pai: "#2440b0"
  mae: "#157a52"
  filha: "#4a5568"
  casa: "#1a1f2e"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "0.015em"
    fontVariation: "'wdth' 118"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: "2.125rem"
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 112"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: "2.125rem"
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: "2.125rem"
    letterSpacing: "0.14em"
    fontVariation: "'wdth' 112"
  hand:
    fontFamily: "Caveat, ui-sans-serif, cursive"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  hairline: "1px"
  sm: "2px"
  md: "3px"
  pill: "999px"
spacing:
  pauta-passo: "2.125rem"
  pauta-passo-movel: "2.375rem"
  margem-x: "3.25rem"
  margem-x-movel: "2.5rem"
  hora-x: "4.25rem"
  hora-x-movel: "3.25rem"
  qtd-x: "5.5rem"
  qtd-x-movel: "5.25rem"
  largura-accoes: "2rem"
  lombada: "2.25rem"
  medida: "82rem"
components:
  linha:
    typography: "{typography.body}"
    height: "{spacing.pauta-passo}"
  linha-destaque:
    typography: "{typography.headline}"
    height: "{spacing.pauta-passo}"
  escrita:
    backgroundColor: "transparent"
    textColor: "{colors.pai}"
    rounded: "{rounded.hairline}"
    padding: "0"
    width: "100%"
  escrita-hora:
    backgroundColor: "transparent"
    textColor: "{colors.impresso-tinta}"
    typography: "{typography.body}"
    width: "{spacing.hora-x}"
  escrita-quantidade:
    backgroundColor: "transparent"
    textColor: "{colors.impresso-tinta}"
    typography: "{typography.body}"
    width: "{spacing.qtd-x}"
  etiqueta-autor:
    backgroundColor: "transparent"
    textColor: "{colors.pai}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 0.25rem"
    height: "{spacing.pauta-passo}"
  etiqueta-refeicao:
    backgroundColor: "transparent"
    textColor: "{colors.impresso-tinta}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 0.25rem"
    height: "{spacing.pauta-passo}"
  campo-carimbo:
    backgroundColor: "transparent"
    textColor: "#9577c1"
    rounded: "{rounded.sm}"
    width: "{spacing.hora-x}"
    height: "{spacing.pauta-passo}"
  campo-carimbo-feito:
    backgroundColor: "transparent"
    textColor: "{colors.carimbo}"
    rounded: "{rounded.sm}"
    width: "{spacing.hora-x}"
    height: "{spacing.pauta-passo}"
  dia-nome:
    textColor: "{colors.capa}"
    typography: "{typography.display}"
  dia-hoje:
    backgroundColor: "{colors.fita}"
    textColor: "{colors.capa-funda}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.1875rem 0.375rem 0.125rem"
  aba:
    backgroundColor: "color-mix(in srgb, #0e1730 55%, transparent)"
    textColor: "color-mix(in srgb, #f8fafc 68%, #16224a)"
    typography: "{typography.label}"
    rounded: "3px 3px 0 0"
    padding: "0.4375rem 0.75rem 0.5rem"
  aba-actual:
    backgroundColor: "{colors.folha}"
    textColor: "{colors.capa}"
  tira-celula:
    backgroundColor: "transparent"
    textColor: "{colors.casa}"
    typography: "{typography.body}"
    padding: "0.4375rem 0.5rem 0.5rem"
    height: "4.25rem"
  tira-celula-aberta:
    backgroundColor: "color-mix(in srgb, #c8912b 12%, transparent)"
    textColor: "{colors.casa}"
  prato-conta:
    backgroundColor: "transparent"
    textColor: "{colors.impresso-tinta}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 0.25rem"
    height: "{spacing.pauta-passo}"
  livro-linha:
    backgroundColor: "transparent"
    textColor: "{colors.casa}"
    typography: "{typography.body}"
    padding: "0.375rem 0.25rem"
    width: "100%"
  livro-linha-novo:
    backgroundColor: "transparent"
    textColor: "{colors.pai}"
  compra-origem:
    backgroundColor: "transparent"
    textColor: "{colors.impresso-tinta}"
    typography: "{typography.label}"
    width: "11rem"
  confirmar:
    backgroundColor: "color-mix(in srgb, #c0392b 7%, transparent)"
    textColor: "{colors.casa}"
    typography: "{typography.body}"
    padding: "0.625rem 0 0.625rem 3.25rem"
  confirmar-sim:
    backgroundColor: "transparent"
    textColor: "{colors.margem}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.3125rem 0.625rem"
  confirmar-sim-hover:
    backgroundColor: "{colors.margem}"
    textColor: "{colors.folha}"
  capa-nome:
    backgroundColor: "transparent"
    textColor: "{colors.folha}"
    typography: "{typography.hand}"
    rounded: "{rounded.hairline}"
    padding: "0 0 0.125rem"
    width: "min(20ch, 60vw)"
  capa-botao:
    backgroundColor: "transparent"
    textColor: "{colors.folha}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    height: "2.25rem"
    width: "2.25rem"
  capa-botao-hover:
    backgroundColor: "rgb(248 250 252 / 0.12)"
    textColor: "{colors.folha}"
  capa-codigo:
    backgroundColor: "transparent"
    textColor: "{colors.fita}"
    typography: "{typography.label}"
  menu:
    backgroundColor: "{colors.folha}"
    rounded: "{rounded.md}"
    padding: "0.375rem"
    width: "12rem"
  menu-item:
    backgroundColor: "transparent"
    textColor: "{colors.casa}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0.4375rem 0.5rem"
  portada:
    backgroundColor: "{colors.capa}"
    padding: "clamp(1rem, 5vw, 3rem)"
  etiqueta-capa:
    backgroundColor: "{colors.folha}"
    rounded: "{rounded.md}"
    padding: "clamp(1.5rem, 4vw, 2rem)"
    width: "min(26rem, 100%)"
  etiqueta-marca:
    backgroundColor: "transparent"
    textColor: "{colors.impresso-tinta}"
    typography: "{typography.label}"
  etiqueta-titulo:
    backgroundColor: "transparent"
    textColor: "{colors.capa}"
    typography: "{typography.title}"
  etiqueta-texto:
    backgroundColor: "transparent"
    textColor: "{colors.impresso-tinta}"
    typography: "{typography.body}"
  campo-escrita:
    backgroundColor: "transparent"
    textColor: "{colors.pai}"
    typography: "{typography.body}"
    rounded: "{rounded.hairline}"
    padding: "0.25rem 0 0.375rem"
  campo-escrita-codigo:
    backgroundColor: "transparent"
    textColor: "{colors.pai}"
    rounded: "{rounded.hairline}"
    padding: "0.25rem 0 0.375rem"
  botao-capa:
    backgroundColor: "{colors.capa}"
    textColor: "{colors.folha}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    height: "2.875rem"
  botao-capa-hover:
    backgroundColor: "{colors.capa-funda}"
    textColor: "{colors.folha}"
  botao-linha:
    backgroundColor: "transparent"
    textColor: "{colors.impresso-tinta}"
    typography: "{typography.label}"
    padding: "0"
  recado-erro:
    backgroundColor: "transparent"
    textColor: "{colors.margem}"
    typography: "{typography.body}"
    padding: "0 0 0 0.625rem"
  falha:
    backgroundColor: "transparent"
    textColor: "{colors.margem}"
    typography: "{typography.body}"
    padding: "0.625rem clamp(0.75rem, 4vw, 2.5rem)"
---

# Design System: HomePlanner

## Overview

**Creative North Star: "A Caderneta"**

The Portuguese school agenda, opened flat. Everything the application provides is *printed*
— day names, rules, dates, the red margin, the role tags, the field labels, the ingredient
count beside a dish, the dish a shopping item came from. Everything the household provides
is *written* — each member's own pen, sitting on the rule. Those two registers carry the
whole identity, and they never mix. Nothing else in this system is load-bearing: no texture,
no skeuomorphic paper photograph, no drop-shadowed cards pretending to be sheets. The book
is conveyed by the rule pitch, the margin, the gutter and the ribbon, and by nothing else.

The world has exactly two grounds, and they are the two faces of one object. The **cover**
is saturated navy: the header band over every signed-in section, and the full-bleed field
behind every screen that comes before the week. The **sheet** is a cool blue-grey `papel`
stock with a slightly brighter `folha` sheet laid on it. Warm parchment, lamplight and sepia
are outside this world — the surface is read at 7:40am in a kitchen with sun on the screen,
and the primary register has to survive that. Density is deliberately light: a household
week is about ten entries, so the design refuses the seven-column hour grid that would
render those ten entries as ninety percent empty scaffolding, and instead rules every day
whether or not anything is on it. An empty day is not a void or an illustration; it is clear
ruling, waiting — and so is an empty dish book, which reserves four rule pitches of blank
page rather than printing an empty-state graphic.

The book now has three sections behind one cover, reached by thumb tabs on the navy band:
the week, the week's dinners with the shopping list under them, and the household's book of
dishes. They are sections of one notebook, not three applications: the same ruled page, the
same rule pitch, the same row, the same stamp. The book of dishes belongs to no week, so on
its tab the week interval and the week navigation come off the cover and the rest stays
exactly where it was.

Everything that happens before the week — signing in, creating an account, confirming an
email, opening a household, joining one with its six-letter code, and the two configuration
messages the application can print about itself — happens on one recurring object: a single
white name label, glued slightly crooked to the navy cover, carrying the same red margin
rule as the pages inside. There is no second layout for authentication and no marketing
front door. The book identifies itself the way a school notebook does, by the label on its
cover.

Type is set at four sizes with wide jumps and nothing between them — a specimen ramp, not a
smooth scale. Day names and section names run at poster scale. Each day's lead entry is
raised one step, because it is what gets read before the day name. The one handwriting face
in the entire application is the household's own name on the cover, the way a name label is
written on a school book; every other written thing is carried by ink colour and by the
baseline sitting on the rule, never by a script font.

**Key Characteristics:**

- Two registers that never mix: printed structure versus written content.
- Two grounds, one object: the navy cover and the ruled sheet.
- The rule pitch is the layout unit — one entry is exactly one rule, across all five surfaces.
- No edit mode: every entry and every blank rule is a live field.
- Four type sizes, wide jumps, nothing between.
- Attribution is the ink *and* a printed role tag — never colour alone.
- Completion is a stamp where the ink lands, not a checkbox in a gutter.
- Sections are thumb tabs on the cover, never a sidebar or a bottom bar.
- A destructive act is confirmed in the row itself, on the page, never in a modal.
- Every failure has a named, printed state that says what happened in plain Portuguese.
- One authored motion moment: the stamp press.
- Interface language is Portuguese (pt-PT), and so is the code — class names,
  custom properties and comments.

## Colors

A cool blue-grey stationery palette: printed structure in pale rules and grey-blue ink, a
saturated navy cover, and four saturated pens that carry every piece of household content.

### Primary

- **Esferográfica Azul** (`pai`): the father's ballpoint in the week, and the system's
  dominant written ink everywhere. It is also the caret colour for the whole document, the
  tint of the text selection, and the ink and caret of every text field on the cover
  screens — the pen you write with is the pen the browser hands you, on the label as well
  as on the page. In the dish book it marks the one line that writes something new
  (`livro-linha--novo`, "Escrever … no livro"), because that line is an act of writing
  rather than a choice among what is already written. Measured 8.33:1 on the sheet, 8.24:1
  on the label card.
- **Azul da Capa** (`capa`): the cover, in both of its jobs. It dresses the header band and
  the full navy ground behind the pre-week screens; it sets day and section names, the label
  card's title, the ink of the open thumb tab, and every hover-darkened control; and it
  fills the one solid button in the system (`botao-capa`). It never appears as written
  household content.
- **Fundo da Capa** (`capa-funda`): the cover's deepest tone, at the bottom of both cover
  gradients and behind selected text; the ink of today's day name; the recessed fill of a
  closed thumb tab at 55%; and the hover fill of the solid button.

### Secondary

- **Ocre da Fita** (`fita`): the ribbon marker, and the cover's only accent. It marks where
  you are and nothing else — see The One Ribbon Rule for the full list, which grew from
  three marks to six with the two new sections without gaining a new reason. On navy it is
  the focus ring, because red does not read there, and it marks the household's join code.
  Measured 5.57:1 on the cover band.
- **Violeta do Carimbo** (`carimbo`): acknowledgement. The `VISTO` stamp, the strike on a
  stamped task *and* on a bought shopping item, and (mixed 70% into the sheet, resolving to
  `#9577c1`) the dashed field waiting for a stamp. The shopping list takes the same stamp as
  a task, unchanged — buying a thing and doing a thing are acknowledged the same way.
  Measured 6.99:1 stamped; 3.57:1 pending, which is non-text and sits above the 3:1 floor.
- **Vermelho da Margem** (`margem`): correction, and the mark of the book. The printed
  margin rule at 55% opacity — on every ruled page *and* down the left of the label card,
  which is what says the label belongs to this notebook. Also the strike-through on a moved
  entry and its arrow to the new day, the "de trás" mark on a shopping item carried over
  from a past week, the destructive menu item, the whole of every failure strip, the left
  rule and text of a form's error message, the focus ring everywhere except the navy cover,
  and the inline confirmation of a destructive act — a 7% wash with a 2px inset red edge and
  a red-outlined confirm button. The teacher's red pen, used for exactly what a red pen is
  used for.

### Tertiary

The remaining three pens. Each is a household member's ink; none of them is a brand accent
and none may be repurposed as one.

- **Esferográfica Verde** (`mae`): the mother's pen. Measured 5.15:1 on the sheet, and it
  additionally clears when struck.
- **Lápis** (`filha`): the daughter's pencil — the one grey-toned pen, deliberately softer
  than the ballpoints.
- **Esferográfica Preta** (`casa`): the household pen, for what belongs to everyone. Also
  the document's base text colour, the ink of every meal, and the ink of everything in the
  ementa and the dish book — a dinner, a shopping item, a dish name and an ingredient all
  belong to the table rather than to a person, so none of them carries a member's pen.

### Neutral

- **Papel** (`papel`): the cool stock the opening sits on. The page ground, the scrollbar
  track, and the PWA background colour.
- **Folha** (`folha`): the sheet itself, one step brighter than the stock. The opening, the
  menu surface, the label card on the cover screens, the open thumb tab, the cover's text
  colour, and the mask behind the touch action menu.
- **Pauta** (`pauta`): the printed rules, drawn as a repeating gradient rather than as
  borders. Also the strip's cell dividers and the dish-picker's line separators, the menu
  item hover wash at 45%, the strip cell hover wash at 28%, the picker line hover at 32%,
  and the ingredient-count button's hover at 40%.
- **Pauta Forte** (`pauta-forte`): the heavier printed line — the day-header divider, the
  divider above the open day's dish panel, the opening's border, the gutter crease, the menu
  border, the label card's border, the resting underline of a cover-screen field, and the
  scrollbar thumb.
- **Tinta do Impresso** (`impresso-tinta`): the grey-blue the book is printed in. Every
  printed label, date and role tag; the field labels and body copy on the label card and its
  always-visible placeholders; the time column and the quantity column; the printed caption
  on a ruled page; a dish's ingredient count; the dish a shopping item came from; the
  explanatory copy on an empty dish book; and the recessive state for a multi-day
  continuation, a completed task and a bought shopping item. Measured 5.23:1 on the sheet,
  5.18:1 on the label card.

### Named Rules

**The Two Registers Rule.** Printed and written never mix. A colour from the printed group
(`impresso-tinta`, `pauta`, `pauta-forte`, `capa`) never carries a household entry, and a
pen (`pai`, `mae`, `filha`, `casa`) never draws structure. This holds on the cover screens
exactly as it holds on the page, and it held through both new surfaces without amendment: a
dish name and an ingredient are written in `casa`; the count beside them, the caption above
them and the dish a shopping item came from are printed in `impresso-tinta`. The only
sanctioned crossing is recession: a continuation of a multi-day block, a completed task, or
a bought shopping item drops from its pen to `impresso-tinta` — it stays readable but stops
competing with what has not happened yet.

**The Ink-Plus-Tag Rule.** Inside the week, a member is never identified by colour alone.
Every entry carries its author's ink *and* a printed role tag in that same ink (`PAI`,
`MÃE`, `FILHA`, `TODOS`, or an em dash when unassigned). Remove the tag and the attribution
is gone, not merely weakened. The rule is confined to the week by construction, not by
exception: nothing in the ementa or the dish book has an author, so nothing there is
attributed and no tag appears.

**The One Ribbon Rule.** `fita` answers exactly one question — *where are you?* — and it is
spent on nothing else. On the sheet it now marks six things, and all six are that one
question: today's ribbon down the left of the day block (`.fita`) and of today's strip cell
(`.fita--tira`), the `HOJE` chip beside today's name, the rule your cursor is in
(`.linha:focus-within`), the strip cell you have opened (`.tira-celula[data-aberta]`), and
the dish row you have opened (`.linha--prato[data-aberto]`). On the navy cover it is the
focus ring, because red does not read on navy, and it marks the household's join code — the
one mark in the system that answers a different question, and the only sanctioned exception.
It is never a general accent, never a button fill, never a highlight for importance, and
never a category colour.

*This rule was restated, and the restatement gives ground.* It was recorded last pass as
"it marks one thing per ground … and it never appears twice on the same ground for two
different reasons." The build does not obey that clause and cannot: the dish book shows an
opened dish row and a focused dish row carrying ochre at the same instant, and the ementa
shows today's ribbon beside an opened cell. What survived the two new surfaces is the
meaning, not the count. The clause is withdrawn; the meaning is the rule.

Ochre arrives in three weights, and the build does not apply them uniformly: a drawn,
shadowed ribbon object for today; a 9–12% wash plus a 2px inset edge for a focused rule and
for an opened strip cell; and a bare 2px inset edge for an opened dish row. "Held open" is
therefore drawn two different ways across the two new surfaces. That is what the build does,
recorded as fact rather than as a pattern to copy.

## Typography

**Display Font:** Archivo (variable, weight 400–700, width 62–125%), self-hosted, with
`ui-sans-serif, system-ui, sans-serif` behind it.
**Body Font:** Archivo — the same face. One grotesque prints the book and carries the ink;
the two registers are separated by colour, case and tracking, not by a second family.
**Hand Font:** Caveat (variable weight 500–700), self-hosted, with `ui-sans-serif, cursive`
behind it. Used once, on the cover.

**Character:** A sturdy European grotesque with a real width axis, worked hard — condensed
and tracked into small caps for everything printed, opened wide and set at poster scale for
the day and section names. Numerals are tabular document-wide, so times, dates, quantities
and the join code stack into columns without being told to. Synthetic weights are switched
off; the variable font supplies every weight it renders.

### Hierarchy

- **Display / `--t-dia`** (700, 2.5rem desktop / 1.875rem mobile, line-height 0.95, width
  118%, tracking 0.015em, uppercase): the day name, and the name of a section — "OS
  JANTARES", "A LISTA", "O LIVRO". Poster scale, on purpose: the book is navigated by these
  before anything else is read. The undated list's heading and the open day's name inside
  the dish panel are the one variant (`dia-nome--lista`): same size, natural width, sentence
  case, negative tracking, printed ink — it is a section, not a day.
- **Headline / `--t-destaque`** (1.5rem desktop / 1.375rem mobile, tracking −0.01em): the
  raised step. Applied to each day's lead entry, to the chosen dish name at the head of an
  open day's panel, and to the household name on the cover.
- **Title / `--t-destaque` set hard** (700, same 1.5rem step, width 112%, tracking −0.015em,
  line-height 1.15, cover navy): the one heading on a label card — "A semana da família",
  "Abrir uma caderneta", "Falta confirmar o email". The same step as Headline, set to carry
  a screen instead of a line. Measured 14.74:1. The join-code field also takes this step,
  opened to 0.22em tracking and uppercased, because six letters read as a serial number.
- **Body / `--t-escrita`** (1.0625rem desktop / 1rem mobile, line-height locked to the rule
  pitch on a ruled page, 1.25 in a strip cell, 1.45–1.55 in prose): everything the household
  writes, plus menu items, dish-picker lines, cover-screen fields, explanatory copy, the
  inline confirmation sentence and every failure sentence.
- **Label / `--t-impresso`** (600, 0.6875rem, width 112%, tracking 0.14em, uppercase,
  printed ink): everything the book arrives with — dates, the week interval, role tags, meal
  tags, the `HOJE` chip, the thumb tabs, the strip's day abbreviations, a dish's ingredient
  count, the dish a shopping item came from, the "de trás" mark, a printed caption occupying
  one rule, the menu heading, the "Esta semana" control, the brand line and field labels on
  a label card, every text-underline control, the confirm button of an inline confirmation,
  and the mark that opens a failure strip. Role and meal tags run one step heavier (700) at
  0.1em to hold their own beside the ink.
- **Hand / Caveat** (1.5rem, line-height 1.2, on a dashed rule): the household's name on the
  cover. The single permitted handwriting setting in the application, and it stayed single
  through two new surfaces.

### Named Rules

**The Four Steps Rule.** There are four sizes — 0.6875 / 1.0625 / 1.5 / 2.5rem, with mobile
substitutions — and nothing lives between one step and the next. A new element takes an
existing step or it does not ship. Weight, width, tracking and case may differ freely within
a step (Headline and Title are the same 1.5rem, set differently); the size may not. No
intermediate size, no smooth ramp, no `clamp()` on type. Everything the two new surfaces
added — tabs, strip cells, ingredient counts, provenance, captions, confirmations — took an
existing step.

**The Fixed Column Rule.** *(Recorded last pass as The Fixed Time Column Rule. It
generalised, exactly as its own closing sentence anticipated, and is renamed to what it
governs.)* A value that lives in a fixed-width column is pinned to `--t-escrita` at doubled
specificity (`.escrita.escrita--hora`) so it cannot rise with a raised row and overflow its
column. Two such columns now exist and both are served by that one pin: the time at
`--hora-x` (4.25rem / 3.25rem mobile) and the quantity at `--qtd-x` (5.5rem / 5.25rem
mobile). The quantity got its own width because it is free text — "1 pacote" and "3 grandes"
do not fit a column cut for "08:30". Any third column-bound value takes the same pin and its
own width token.

*The class name is now narrower than what it holds.* `.escrita--hora` sets the time in the
week and the quantity in the shopping list, in the ementa's ingredient rows and in the dish
book. What the class actually means is *column-bound value, right-aligned, tabular, printed
ink, pinned to the body step* — three of those four columns hold no time at all. Recorded as
the build's fact, not as a naming convention to copy forward.

**The One Hand Rule.** Caveat appears on the cover name and nowhere else — not on the label
card, whose title is Archivo; not on a dish name, which is Archivo in the household pen.
Written content is carried by ink, weight and the baseline on the rule; a script face across
the entries is costume, and it costs legibility on the device that matters most.

## Layout

There are two layouts in the whole application: the label on the cover, and the opening. The
opening comes in two column counts.

**The cover screen (`portada`).** One full-viewport navy field (`min-height: 100dvh`),
padded `clamp(1rem, 5vw, 3rem)`, with a single object centred in it by `place-items: center`.
The ground is a radial highlight from just above the top edge over a vertical `capa` →
`capa-funda` gradient — a board catching light, not a hero image. The object is the label
card at `min(26rem, 100%)`, a single column with 1rem between every element and its
own left inset (`clamp(2.75rem, 7vw, 3.5rem)`) to clear the red margin rule at
`clamp(1.75rem, 4.5vw, 2.25rem)`. It is the same composition at 1440 and at 390 — the card
takes the full width on a phone and stops growing at 26rem on a desktop. There is no second
column, no split panel, no illustration half.

**The opening.** At 64rem and above the week is a three-column grid — page, gutter, page —
inside an 82rem measure. Monday through Thursday sit left, Friday through Sunday plus the
undated "Esta semana" list sit right. It is one sheet creased down the middle, not two cards:
a single `folha` background, a single hairline border, one soft shadow beneath the whole
thing, and a 2.25rem gutter carrying a symmetric shadow gradient and a hairline crease inset
1.25rem from either end. Below 64rem the grid collapses to one column and the same gutter
becomes a 2rem horizontal break between Thursday and Friday, rotated 90°: the same object,
read differently. The ementa and the dish book use the same opening at one column
(`abertura--ementa`) at every width — one page rather than a spread, because neither is
divided into two halves that face each other.

**The rule pitch is the unit.** `--pauta-passo` (2.125rem desktop, 2.375rem mobile) sets the
repeating gradient that draws every ruled page — the week's days, the shopping list, an open
dish's ingredients, and the dish book — plus the min-height and line-height of every row and
the height of every cell in the row grid. One entry is exactly one rule. A long entry wraps
onto the next rule rather than being clipped or stretching the row: the writing field
auto-grows in whole pitches, remeasuring on `document.fonts.ready` (the pitch cannot be
measured before the real face arrives) and again through a `ResizeObserver` on its column.
The pitch holds unbroken across raised rows, wrapped rows, the strip, the list, the book and
the indented ingredient rows.

**The row grid.** The base row is four columns: the margin gutter (`--margem-x`), the text
measure, the time column (`--hora-x`) and the actions column (`--largura-accoes`). Every
variant re-cuts those columns and nothing else — no variant introduces a new height, a
background, a border or a radius:

- *Meal* — the time column collapses to `0` and gives the width back to the measure, because
  a meal never has a time.
- *Timed task* — a fifth column opens so the time and the stamp can sit side by side.
- *Shopping item* (`linha--compra`) — five columns: gutter, name, quantity at `--qtd-x`,
  stamp at `--hora-x`, actions. The one row in the system that carries a stamp without a
  time.
- *Ingredient* (`linha--ingrediente`) — four columns with the quantity at `--qtd-x` where
  the time would be.
- *Dish* (`linha--prato`) — four columns, with the ingredient-count button standing in the
  quantity column: the count is what you press to open the dish, so it sits where a value
  sits.
- *Indented* (`linha--dentro`) — the gutter widens to `calc(var(--margem-x) + 1.5rem)`.
  Ingredients under a dish are rules of the same page, set in from the same margin; a nested
  ruled page would give two margins and two rhythms.
- *Caption* (`linha--legenda`) — a printed line occupying exactly one rule, vertically
  centred in it. A caption on a ruled page costs a rule like anything else.

On a touch device the actions column collapses to `0` for every variant and the menu lifts
out of the grid into an absolutely positioned overlay that appears only when the row has
focus — and the focused row takes `padding-inline-end: 1.75rem`, so the row *shrinks to let
the menu in* rather than the menu covering what is written. Measured on touch with a row
focused, the ingredient-count button ends at x=334 and the menu rail begins at x=343. On
mobile the text measure is 199px for an event, 223px for a meal, 128px for a timed task,
199px for a dinner row and 223px for a meal row on the shopping list.

**The strip (`tira`).** Seven day cells across the top of the ementa: a seven-column grid
ruled top and bottom in `pauta`, each cell divided from the next by a 1px `pauta` rule
(suppressed on the first), each at least two rule pitches tall, holding the printed day and
date over the dinner's name clamped to three lines. Below 64rem the grid becomes one column
and each cell becomes a single rule — one pitch tall, day label in a fixed 5.5rem lead
column, dinner name beside it, clamped to two lines. It stacks; it never scrolls sideways.
A horizontally scrolling strip on a phone hides days, and the point of the strip is that all
seven are in one glance.

**The margin.** A single hairline in 55% `margem`, drawn as a pseudo-element so it runs the
full height of its container regardless of content. On any ruled page it falls at
`--margem-x` (3.25rem desktop, 2.5rem mobile), and on a day it is also the status gutter:
multi-day brackets sit in it, in their author's ink. On the label card it falls at
`clamp(1.75rem, 4.5vw, 2.25rem)` and carries nothing — there, it is identification.

**The cover band.** An 82rem measure padded `clamp(1rem, 4vw, 2.5rem)`, laid out as a
wrapping flex row with its ends baseline-aligned at the bottom: the household's name and the
week interval on the left, the thumb tabs in the middle sitting flush on the band's bottom
edge, and on the right a right-aligned stack of the week navigation above the account row
(join code, email, sign out). Below 48rem that stack switches to left-aligned, so both ends
share one edge on a phone. On the dish book's tab the week interval and the week navigation
are both absent (`semSemana`) and the band closes up around what remains — the book belongs
to no week, so it shows no week.

**Rhythm.** Days are separated by 1.75rem within a page; the page is padded 1.25rem top and
1.75rem bottom with a fluid 0.625–1.5rem inline. An open day's dish panel is separated from
the strip by 1.25rem plus a 1.5px `pauta-forte` rule and 1rem of air; the shopping list sits
2rem below what precedes it. Horizontal page padding is fluid (`clamp(1rem, 4vw, 2.5rem)` on
the cover and notices, `clamp(0.5rem, 3vw, 2.5rem)` on the opening). Everything else is a
multiple of the rule pitch, because the rules are visible and anything off the pitch shows.

**Density floor.** Every day renders at least three rules, and at least one blank rule beyond
whatever it holds. Sunday with nothing on it is ruled and waiting. A ruled page with nothing
on it at all (`dia-corpo[data-vazio]`, the empty dish book) reserves four rule pitches of
blank ruling, so an empty book reads the way an empty day reads.

**Arrival.** On a narrow viewport the week opens scrolled to today, the way a book opens at
its ribbon — but only from Wednesday onward, only once, and only after the week has actually
loaded. Earlier in the week today is already in the first viewport.

### Named Rules

**The One Rule, One Entry Rule.** An entry occupies exactly one rule pitch, or a whole number
of them. Nothing sits between rules, nothing straddles a rule, and no element introduces a
height that is not a multiple of `--pauta-passo`. This now covers a caption, an ingredient
count, a quantity and an indented ingredient as well as an entry: anything that lands on a
ruled page costs a whole rule.

**The One Label Rule.** Every screen that is not a signed-in section is the same navy ground
with the same white label card on it — sign in, create account, confirm your email, open a
household, join a household, missing configuration, missing migration. A new pre-week screen
is new copy inside that card, never a new layout. The single exception is the loading phase,
which prints one tracked line straight onto the navy and shows no card at all, because a
card that appears and is then replaced is a flash, not a state.

**The Same Page Rule.** A new section is a tab on the existing cover over the existing
opening, and it is built from rows on a ruled page. The ementa and the dish book added no
new page object, no card, no panel, no second grid and no second rhythm: what they added
were column cuts of `linha` and one new list object, the strip. If a new thing cannot be
made of the row grid and the rule pitch, the question is what it is, not what to draw.

**The Override-Last Rule.** In these stylesheets a declaration only counts if nothing at
equal specificity overrides it later — and an inline `style` prop in a component beats every
one of them. This build shipped four dead rules before they were caught: a token declared
above the media query that redefined it, a raised-row rule written before the base row rule
that beat it, and two colour rules that could never win against an inline `style`. Three
consequences are load-bearing and are commented in place: `.linha`'s base declarations come
*before* `.linha--destaque`; `.escrita.escrita--hora` doubles its specificity on purpose;
and text ink is passed as an inline `style` from the component rather than declared in CSS
(the row's ink, the row tag, the writing field, and a coloured menu option all take their
colour that way). Two orderings in the current build follow from the same rule and are worth
knowing before editing: `.impresso` is defined after every component sheet, so any element
carrying that class takes printed ink no matter what colour its own class declares; and any
element that needs a different colour while printed must win on specificity or state
(`:hover`, `:disabled`), not on being written later in its own file. The rule also governs
where a new token goes: `--qtd-x` is declared mid-file with its own mobile override
immediately after it, because a token separated from the media query that redefines it is
how the first dead rule happened. Before adding a rule, check what follows it — and prefer
to delete a rule that cannot win over leaving it as decoration.

## Elevation & Depth

Flat, with one exception, and the exception is bookbinding rather than material design.
There are no elevation tiers, no hover lifts, no shadowed cards inside the opening. Depth is
carried by the printed rules, by the gutter's shadow gradient, and by the `papel`/`folha`
tonal step between the stock and the sheet.

Five shadows exist in the whole build, and each names a physical fact rather than a level:
the cover's hard bottom edge and the soft drop beneath it, the opening's single low shadow
suggesting a sheet lying on the stock, the menu's shadow because it is the only thing that
genuinely floats above the page, the ribbon's small cast shadow because it is a physical
object clipped over the edge of the paper, and the label card's deep drop plus a 1px white
inset along its top edge, because it is a piece of paper glued onto a board and the glue has
a lip. On touch, the actions overlay uses a solid `folha` shadow purely as a mask, not as
depth. The two new surfaces added no sixth shadow: every `box-shadow` they introduced is an
`inset` edge — the ochre edge on a focused rule, an open strip cell and an open dish row,
and the red edge on an inline confirmation — which is a printed line drawn with the shadow
property, not elevation.

### Shadow Vocabulary

- **Cover edge** (`box-shadow: 0 2px 0 <capa-funda 70%>, 0 10px 24px -14px rgb(14 23 48 / 0.55)`):
  the board's edge and the shade beneath it. Cover band only.
- **Sheet** (`box-shadow: 0 18px 40px -30px rgb(14 23 48 / 0.55)`): the opening resting on
  the stock. Very wide, very low, no lift.
- **Label card** (`box-shadow: 0 22px 44px -26px rgb(6 10 24 / 0.75), 0 2px 0 rgb(255 255 255 / 0.5) inset`):
  paper glued to a navy board. The only deep shadow in the system, and it is deep because
  the ground behind it is dark.
- **Menu** (`box-shadow: 0 12px 28px -12px rgb(14 23 48 / 0.4), 0 2px 6px -2px rgb(14 23 48 / 0.25)`):
  the only floating surface.
- **Ribbon** (`box-shadow: 0 1px 3px rgb(14 23 48 / 0.28)`): a real object over the page edge.

### Named Rules

**The Flat Page Rule.** Nothing in the opening is elevated. A row, a tag, a stamp, a strip
cell, a dish, an inline confirmation and a blank rule all sit in the paper. If a new element
wants a shadow, it needs a physical justification in the book — an edge, a crease, a glued
label, or a thing genuinely lying on top. A 2px `inset` edge is a printed line and is not
covered by this prohibition; a drop shadow is.

## Shapes

Radii are effectively absent, because paper does not have them. The system uses 1px on
anything that only needs its focus ring not to look sharp-cornered (writing fields, the
cover name, cover-screen fields), 2px on the small printed rectangles (role and meal tags,
cover buttons, the today chip, the stamp field, the ingredient-count button, the inline
confirm button, the solid cover button), 3px on the two true surfaces — the menu and the
label card — and a pill only on the scrollbar thumb, which is a browser part rather than a
page element. The thumb tabs take the system's only asymmetric corner, `3px 3px 0 0` with no
bottom border, because a tab is a page rising out of the block and its bottom edge is where
it joins. The favicon's cover uses a 9px corner because it is a book, at icon scale.

Borders are hairlines and behave like printed lines: 1px for the opening, the menu, the
label card, the role tag's outline, the strip's frame and cell dividers, the dish-picker's
line separators, the tab's edge and the inline confirm button; 1.5px for the day-header
divider, the divider above a day's dish panel, and the strike on a moved entry; 1px dashed
for the cover's name field and 1.6px dashed for the pending stamp field. A single 1px rule
also does duty as a bracket rather than a box: under a cover-screen field, under every
text-underline control, and down the left of an error message. A 2px `inset` box-shadow does
the same job as a rule where a border would move the content — the ochre edge on a focused
or open row and the red edge on an inline confirmation are edges, not boxes. Drawn icons are
a single 1.5 stroke with round caps and joins, in the book's grammar — a bracket for a
multi-day block, an arrow for a move, chevrons for week navigation, and three dots for the
row menu.

Two silhouettes recur, and both are things placed on paper by hand rather than drawn by the
grid. The stamp: a 74×30 rounded rectangle (4px corner) rotated −6°, dashed and 1.6-weight
while pending, solid and 2.4-weight with `VISTO` set in tracked Archivo caps once given. And
the label: a 26rem card rotated −0.35°, just enough that it reads as glued on rather than
laid out. Rotation in this system means *applied by a person*; nothing structural is ever
off-axis.

## Components

### Row (`linha`) — the signature component

The entire application is rows. A row is a grid one rule tall, cut into columns by its
variant, holding the margin gutter, the text measure, one or two data columns and the
actions column. It is not a card, a list item or a widget — it is a printed rule with
writing on it. It carries the week's entries, the shopping list, a dish, an ingredient and a
printed caption; the column cuts are in Layout.

- **Shape:** no background, no border, no radius. The rule beneath it comes from the page's
  repeating gradient, not from the row.
- **Content:** in the week, the author's role tag in that author's ink, then the writing
  field in the same ink. Meals swap the role tag for an outlined meal tag and are always
  written in the household pen. In the ementa and the book there is no tag: the writing
  field starts at the measure, in the household pen.
- **Lead row:** the first entry of each day is raised to the headline step, with slightly
  tightened tracking and its tag centred to the taller line. Exactly one per day, and only
  in the week.
- **Focus:** the whole row takes a 9% `fita` wash and a 2px inset `fita` edge on its leading
  side. The row you are writing on is ribboned, like the day.
- **Struck (moved):** printed ink, a `margem`-coloured 1.5px strike, and a small red arrow
  plus the destination day in tracked caps. The row is never removed — the agenda keeps what
  happened.
- **Completed / bought:** the writing keeps its position and takes a `carimbo`
  strike-through; the stamp lands beside it.
- **Blank:** a row with nothing in it but a live writing field. Rendered by default at the
  foot of every ruled page, always writable, and it becomes a real entry on Enter or on blur.

### Writing field (`escrita`)

The page, not a widget on it. Transparent, borderless, zero padding, inheriting font,
tracking and width from the row, with line-height locked to the rule pitch and resize
disabled. It auto-grows in whole pitches. Its placeholder is invisible at rest and appears
in printed ink on hover or focus, so an empty page reads as clear ruling rather than as a
field of grey prompts. `Enter` commits and keeps the cursor in place, so entries can be
written one after another. Ink is applied inline by the component, never in CSS — see
The Override-Last Rule.

**Saving is deferred, and it is invisible by design.** Text edits are batched per record and
flushed when typing stops (600ms), and flushed again if the component unmounts with work
pending, so leaving a page cannot eat what was written. There is no save control, no saving
indicator and no dirty state — the only visible consequence of saving is its failure, which
prints a named strip. The household name on the cover uses the same 600ms deferral.

### Column-bound field (`escrita--hora`)

The same field, right-aligned in printed ink with tabular numerals, pinned to the body size,
inside a fixed-width column. It serves two columns: the time (`--hora-x`, placeholder
`--:--`, week only, never on a meal) and the quantity (`--qtd-x`, placeholder `qt.`, on the
shopping list, on an open dish's ingredients and in the dish book). Quantities are free text
— "2 kg", "1 molho", "3 grandes" — which is why they have a wider column of their own. See
The Fixed Column Rule, including the note that the class name is narrower than its contents.

### Stamp field (`campo-carimbo`)

Completion, in the column where the ink lands. Pending, it is a dashed rounded rectangle at
70% stamp violet over the sheet, sized to the stamp's own footprint — the empty box a
teacher would stamp into. Given, it is the `VISTO` stamp at full violet, rotated −6°. The
control is a `checkbox`-role button whose hit area extends 0.25rem vertically and 0.5rem
horizontally beyond its box. A bought shopping item takes the identical control. There is no
gutter checkbox and no checkmark glyph anywhere in the system.

### Tags (`etiqueta`)

Small printed rectangles inline at the head of a row, one rule tall so they never break the
pitch. The author tag is set in its member's ink with no border; the meal tag is set in
printed ink with a 32%-opacity outline, because a meal has no author. Both open a menu; both
take a 12% wash of their own colour on hover. Week only.

### Thumb tabs (`abas`) — navigation

The sections of the notebook, as thumb tabs cut into the navy cover band. Three of them, sat
flush on the band's bottom edge with top corners only (`3px 3px 0 0`) and no bottom border,
so a tab reads as a page rising out of the block. A closed tab is a 55% `capa-funda` recess
with an 18% sheet hairline and printed caps at 68% sheet, brightening to full sheet on hover
over 160ms. The open tab fills solid `folha` with `capa` ink and a `folha` border: it has
become the page. State is `aria-current`, not a colour alone. There is no sidebar, no bottom
bar, no hamburger and no route — the tabs are the only navigation between sections, and week
navigation stays on the cover beside them, absent on the section that has no week.

### Strip (`tira`) — signature component of the ementa

Seven day cells in one glance, above the shopping list. Each cell is a button: printed day
abbreviation and date over the dinner's name in the household pen, or "por decidir" in
printed ink when nothing is set. Hover takes a 28% `pauta` wash. The open cell takes a 12%
`fita` wash and a 2px inset `fita` edge along its bottom — the edge is on the bottom because
that is where the cell meets what it opened. Today's cell carries a shortened ribbon
(`fita--tira`) inset 0.4375rem from the leading edge rather than flush to the divider, so it
reads as belonging to its own day rather than to the one before. Geometry and responsive
behaviour are in Layout.

### Dish panel (`prato-do-dia`)

What opens beneath the strip when a day is pressed. Ruled off from the strip by 1.5px
`pauta-forte`, headed by the day's name in the section variant with its date printed
opposite, then the chosen dish at the headline step with a text-underline "Tirar este
jantar" beside it, then the picker, then that dish's ingredients as editable ruled rows on
their own ruled page with their own margin. It is a section of the same page, not an overlay
or a drawer: the strip stays visible above it and nothing is covered.

### Dish picker (`livro`)

A short list of lines between 1px `pauta` rules — the dish name at the body step in the
household pen on the left, its ingredient count printed on the right, hovering to a 32%
`pauta` wash. It shows at most eight dishes and prints "e mais N — escreva para procurar"
when the book is longer, because the whole book does not belong inside a day. When what is
typed matches nothing, the last line becomes the writing line (`livro-linha--novo`), set in
the father's pen with "prato novo" printed opposite: writing a new dish is one press from
the day that wants it.

### Dish row (`linha--prato`) — signature component of the book

A dish in the book is a row: its name in an always-live writing field, so a dish is renamed
by typing over it; the ingredient count as a printed button in the quantity column, which
expands the dish in place; and the row menu at the rail. An expanded dish is marked by a 2px
inset `fita` edge and its ingredients follow immediately as indented rows on the same ruled
page, under a printed caption occupying one rule. There is no detail view, no drawer and no
second page — a dish opens where it sits.

### Inline confirmation (`confirmar`)

A destructive act asks in the row itself. The row it belongs to stays exactly where it is
and the question appears on the rule below it: a 7% `margem` wash with a 2px inset `margem`
edge, indented to the margin gutter, carrying a sentence that names the thing and states
what survives ("Os jantares já marcados ficam escritos como estão — só o prato sai."), then
a red-outlined confirm button in printed caps that fills solid red on hover, then a
text-underline "Deixar ficar". It is `role="alert"`. No modal, no dialog, no overlay, no
page dimming: the page under the question stays readable, which is the point — the question
is about something on that page.

### Printed provenance (`compra-origem`)

A shopping item that came from a dish prints that dish's name, in the printed register,
truncated at 11rem. It is the answer to "why is this on my list", and it belongs to the
table. Below 64rem it is hidden outright: in the aisle nobody needs to know which dinner the
onion came from, they need to know it is onion, and the measure is worth more than the
provenance on a phone. A shopping item carried over from a past week prints "de trás" in
`margem` instead, and that one is *not* hidden on a phone, because it is about the item.

### Menu (`menu`)

A short list that opens beside the row it belongs to — never a modal, never a sheet, and the
page under it stays readable. Sheet background, `pauta-forte` hairline, 3px corner, a
tracked printed heading, and body-sized items in the household pen. An option that carries a
colour (a member's ink, the destructive red) shows in that colour, applied inline. The
active option is bolded, not ticked. Opens with a 180ms fade and a 0.25rem rise; closes on
outside click or Escape, returning focus to its trigger. A destructive option does not act —
it raises the inline confirmation.

### Cover (`capa`)

The header band over every signed-in section: a navy vertical gradient from a lightened
cover tone through `capa` to `capa-funda`, with a hard bottom edge. Left, the household's
real name in the hand face on a dashed rule — typed straight onto the cover, deferred 600ms
to the database, no save control — with the week's interval printed beneath it in tracked
caps. Middle, the thumb tabs. Right, a stack: the three navigation controls (previous, "Esta
semana", next) as 2.25rem minimum ghost buttons with 26%-opacity sheet borders, filling to a
12% sheet wash on hover, "Esta semana" disabling to 0.38 opacity when the current week is
already shown; and beneath them the account row — the six-letter join code in `fita`, the
signed-in email truncated to 14ch with its full value on hover, and a text-underline "Sair".
On a section with no week, the interval and the whole navigation are omitted. Focus rings on
the cover switch from margin red to ribbon ochre, because red does not read on navy.

### Cover screen (`portada` + `etiqueta-capa`)

The label glued to the front of the notebook, and the only screen the application shows
before the week. Navy ground; one white card at `min(26rem, 100%)`, 3px corner,
`pauta-forte` hairline, rotated −0.35°, with the red margin rule down its left and every
element stacked 1rem apart. Its contents are always some subset of the same six parts, in
this order: a printed brand or account line (`etiqueta-marca`), one title
(`etiqueta-titulo`), any number of labelled fields (`campo`), an error message
(`recado-erro`), the solid action button (`botao-capa`), and one or more text-underline
alternatives (`botao-linha`). Measured on the card: printed lines 5.18:1, title 14.74:1,
written ink 8.24:1, placeholder 5.18:1.

### Field (`campo` + `campo-escrita`)

A printed name over a ruled line, which is what a form looks like in a notebook. The label
is `--t-impresso` in printed ink; the input has no box — transparent, borderless, a single
`pauta-forte` underline that turns `pai` on focus, and its value set in `pai` with a matching
caret. Unlike a ruled page's writing field, the placeholder here is printed ink and
permanently visible: a form has to say what it wants, where an empty rule only has to be a
rule. The same control does the searching inside the book — "Procurar", shown only once the
book passes six dishes — and the dish picker's "Que prato" line. The join-code variant
(`campo-escrita--codigo`) takes the title step at 0.22em tracking, uppercased and tabular,
and upper-cases what is typed as it is typed.

### Buttons

- **Solid (`botao-capa`):** the one filled button in the system, and there is at most one per
  screen. `capa` fill, `folha` text, 2px corner, 2.875rem minimum height, full card width,
  body size at 600. Hover deepens to `capa-funda` over 160ms; disabled drops to 0.55 opacity
  and swaps its label for "Um momento…" while a request is in flight. It exists only on the
  cover screens.
- **Ghost (`capa-botao`):** the week navigation on the cover band. Hairline sheet border,
  2.25rem minimum square, transparent until hover.
- **Outlined red (`confirmar-sim`):** the confirm half of an inline confirmation, and the
  only outlined button in the system. Printed caps in `margem` inside a 1px `margem` border
  at 2px, filling solid red with `folha` text on hover. It appears only inside `confirmar`.
- **Text-underline (`botao-linha`, `aviso-repor`, `capa-sair`):** every secondary action in
  the application. No box at all — printed caps or inherited text with a 1px underline in
  `currentColor`, darkening to `capa` on hover. Mode switches, "Sair desta conta", "Voltar",
  "Tirar este jantar", "Deixar ficar", "Fechar" and the sample-week offer are all this
  control; none of them is a second button.
- **Bare (`botao-nu`):** the icon-only control at a row's rail. No box, printed ink at 65%,
  a hit area extending 0.5rem beyond its bounds, and on hover-capable devices it is at
  opacity 0 until the row is hovered or focused.

### Notices and failure states

Every state the data layer can be in has a designed, printed strip above the opening, and
none of them is a toast, a modal or a spinner. All are `role="status"`, all open with a
tracked printed mark, and all say what happened and what it means for what is written:

- **Sem tabelas** — the database is missing a migration; the strip prints the exact file
  path to run. Each section names its own migration.
- **Sem ligação** — reading from the device's cache, or the section could not be read at all;
  what is written now may not reach the others.
- **Não guardado** — something did not reach the server; what is written is still here.
- **Atenção** — a named message from a section's own vocabulary, with a text-underline
  "Fechar", because this one is dismissible where the others describe a standing condition.
- **Empty week** — printed ink rather than red, because nothing is wrong: "Caderneta em
  branco. As pautas estão à espera.", beside a text-underline offer to write an example
  week. Sample content is never seeded; it is only ever written on request.
- **Empty book** — printed ink prose on the ruled page itself, saying what the book is for
  and what filling it buys ("depois é só marcá-los num dia e a lista de compras faz-se
  sozinha"), over four rule pitches of blank ruling. No illustration, no dashed drop zone,
  no button.

A failure strip is `margem` throughout except its opening mark, which is set by the printed
class and therefore prints in `impresso-tinta` with an underline in that same ink. On a
cover screen the same job is done by `recado-erro`: red text behind a 1px red left rule,
carrying a sentence from the error dictionary that names the recovery ("Falta confirmar o
email. Veja a caixa de entrada — a mensagem tem um link.") rather than the provider's
English.

### Motion

One authored moment: the stamp press. When a task is stamped — and only on the act of
stamping, never on page load or re-render — the stamp animates from −11°/1.5× and
transparent to −6°/1× and opaque over 420ms on `cubic-bezier(.16, 1, .3, 1)`. Everything
else is functional and brief: a 180ms menu open on the same curve, 160ms colour transitions
on the stamp field, the cover buttons, the thumb tabs and the solid button, a 140ms strip
cell wash, and a 140ms fade for the row actions on hover-capable devices. Opening a strip
cell, opening a dish and raising an inline confirmation are all instant — the page changes,
it does not perform. A global reduced-motion rule collapses every animation and transition
to 1ms, and the mobile scroll-to-today switches to an instant jump.

### Browser surfaces

The parts of the interface that were not drawn still carry the design. Selection is a 22%
wash of the father's pen with cover-deep text; the caret is that same pen; the scrollbar is
a `pauta-forte` thumb with a 3px `papel` inset on a `papel` track, darkening to printed ink
on hover; the focus ring everywhere except the cover is a 2px margin-red outline at 2px
offset with a 1px radius; and numerals are tabular document-wide.

### Named Rules

**The Named State Rule.** Every way this application can fail has a designed state with a
Portuguese name printed on it, and that state says what happened and what to do next. There
is no spinner standing in for a failure, no raw provider error on screen, and no silent
retry: missing configuration prints the two variables to set, a missing migration prints the
file to run, a lost connection says which copy you are reading, and a failed save says where
what you wrote still lives. Adding a way to fail means adding its strip and its Portuguese
sentence.

**The Ask-On-The-Page Rule.** A destructive act is confirmed on the rule below the thing it
would destroy, in the red register, in a sentence that names the thing and states what
survives. It is never a modal, never a dialog, never an overlay, and it never dims the page:
the question is about something visible, and covering it to ask is the wrong shape. An act
that cannot be undone gets this treatment; an act that can be undone gets none.

## Do's and Don'ts

### Do:

- **Do** keep the two registers separate, on the label as on the page. Structure is printed
  (`impresso-tinta`, tracked Archivo caps at `--t-impresso`); household content is written,
  in its author's pen — or in the household pen where the thing has no author.
- **Do** give every entry in the week both its ink and its printed role tag. Colour alone is
  not attribution.
- **Do** size everything in whole rule pitches (`--pauta-passo`), and let a long entry wrap
  onto the next rule rather than stretch its own.
- **Do** build a new thing out of the row grid and the rule pitch — a new column cut of
  `linha`, not a new page object — per The Same Page Rule.
- **Do** render a page's rules whether or not anything is on it, and keep at least one blank,
  writable rule below the last entry. A page with nothing at all reserves four pitches.
- **Do** make every entry editable exactly where it sits, and write it to the page before
  writing it to the network. Batch the write and flush it when the hand stops, and again on
  unmount.
- **Do** restyle a row in place when its state changes — struck and rewritten when moved,
  stamped when done or bought — and keep the old line visible.
- **Do** put a new section behind a thumb tab on the existing cover, and drop from the cover
  whatever that section does not have (the week interval and week navigation on the book).
- **Do** ask before a destructive act on the rule below it, per The Ask-On-The-Page Rule.
- **Do** put any new pre-week screen inside the label card, in its existing order: printed
  line, title, fields, error, solid button, text-underline alternatives.
- **Do** give every failure a printed mark and a Portuguese sentence that names the recovery,
  per The Named State Rule.
- **Do** take one of the four type steps, or do not ship the element.
- **Do** give a new column-bound value its own width token and pin it at doubled specificity,
  per The Fixed Column Rule.
- **Do** let the row shrink to make room for the touch action menu (`padding-inline-end`),
  rather than letting the menu sit over what is written.
- **Do** check what follows a new rule in the stylesheet — and whether a component passes an
  inline `style` — before trusting it, per The Override-Last Rule. Keep a new token and its
  mobile override adjacent.
- **Do** write new code in the same Portuguese vocabulary the build uses — `linha`, `pauta`,
  `escrita`, `impresso`, `carimbo`, `fita`, `portada`, `etiqueta`, `recado`, `tira`, `livro`,
  `prato`, `confirmar`. It is the project's language, not an accident.

### Don't:

- **Don't** introduce an edit mode, a save button, a saving indicator, or a modal for editing
  an entry.
- **Don't** build an hour grid. The week is ruled lines, not a seven-column timetable.
- **Don't** put a checkbox in the margin gutter or a checkmark glyph anywhere. Completion and
  purchase are the `VISTO` stamp, in the column where the ink lands.
- **Don't** use a pen colour (`pai`, `mae`, `filha`, `casa`) for structure, or printed ink
  for a live entry — the one sanctioned crossing is recession for continuations, completed
  tasks and bought items.
- **Don't** spend `fita` on anything but *where you are* — today, the rule under the cursor,
  the thing you have opened — plus the join code on the navy, which is the one recorded
  exception. Never a button fill, an importance highlight or a category colour.
- **Don't** nest a ruled page inside a ruled page. Ingredients under a dish are indented rows
  of the same page; two margins and two rhythms on one screen is two books.
- **Don't** confirm a destructive act in a modal, a dialog, or anything that covers the page.
- **Don't** scroll the strip sideways on a phone. Seven days stack into seven rules; a
  strip that scrolls hides days, and the strip exists so all seven are in one glance.
- **Don't** set household content in Caveat. The hand face belongs to the cover name only.
- **Don't** give a cover screen its own layout, split panel, illustration or marketing
  header. It is the label card on the navy ground.
- **Don't** add a second solid button to a screen. One `botao-capa`; every other action is a
  text-underline or, for a destructive confirmation, the one outlined red button.
- **Don't** add a paper photo-texture, a cream or parchment ground, or a warm lamplight
  cast. This paper is cool and slightly blue.
- **Don't** add elevation tiers or hover lifts. Nothing in the opening floats except the
  menu; an `inset` edge is a printed line, a drop shadow is not.
- **Don't** rotate anything structural. Rotation means a person put it there — the stamp and
  the glued label, and nothing else.
- **Don't** add a second motion moment. The stamp press is the one authored animation, and
  it fires on the act of stamping, not on render.
- **Don't** introduce a type size between the four steps, or a fluid `clamp()` on type.
- **Don't** draw an empty-state illustration, a dashed drop zone or a call-to-action panel.
  An empty page is ruled and waiting, with printed prose on it at most.
- **Don't** ship English in the interface — including a provider's error text; map it through
  the error dictionary first.
- **Don't** write invented household data into a real database. The example week exists, and
  it is only ever written when someone asks for it.
