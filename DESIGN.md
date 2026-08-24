---
name: HomePlanner
description: A Portuguese school agenda, opened to this week — printed structure, written content, one pen per person.
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

The Portuguese school agenda, opened flat to this week. Everything the application
provides is *printed* — day names, rules, dates, the red margin, the role tags, the field
labels. Everything the household provides is *written* — each member's own pen, sitting on
the rule. Those two registers carry the whole identity, and they never mix. Nothing else in
this system is load-bearing: no texture, no skeuomorphic paper photograph, no
drop-shadowed cards pretending to be sheets. The book is conveyed by the rule pitch, the
margin, the gutter and the ribbon, and by nothing else.

The world has exactly two grounds, and they are the two faces of one object. The **cover**
is saturated navy: the header band on the week, and the full-bleed field behind every
screen that comes before the week. The **sheet** is a cool blue-grey `papel` stock with a
slightly brighter `folha` sheet laid on it. Warm parchment, lamplight and sepia are outside
this world — the surface is read at 7:40am in a kitchen with sun on the screen, and the
primary register has to survive that. Density is deliberately light: a household week is
about ten entries, so the design refuses the seven-column hour grid that would render those
ten entries as ninety percent empty scaffolding, and instead rules every day whether or not
anything is on it. An empty day is not a void or an illustration; it is clear ruling,
waiting.

Everything that happens before the week — signing in, creating an account, confirming an
email, opening a household, joining one with its six-letter code, and the two configuration
messages the application can print about itself — happens on one recurring object: a single
white name label, glued slightly crooked to the navy cover, carrying the same red margin
rule as the pages inside. There is no second layout for authentication and no marketing
front door. The book identifies itself the way a school notebook does, by the label on its
cover.

Type is set at four sizes with wide jumps and nothing between them — a specimen ramp, not a
smooth scale. Day names run at poster scale. Each day's lead entry is raised one step,
because it is what gets read before the day name. The one handwriting face in the entire
application is the household's own name on the cover, the way a name label is written on a
school book; every other written thing is carried by ink colour and by the baseline sitting
on the rule, never by a script font.

**Key Characteristics:**

- Two registers that never mix: printed structure versus written content.
- Two grounds, one object: the navy cover and the ruled sheet.
- The rule pitch is the layout unit — one entry is exactly one rule.
- No edit mode: every entry and every blank rule is a live field.
- Four type sizes, wide jumps, nothing between.
- Attribution is the ink *and* a printed role tag — never colour alone.
- Completion is a stamp where the ink lands, not a checkbox in a gutter.
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
  as on the page. Measured 8.33:1 on the sheet, 8.24:1 on the label card.
- **Azul da Capa** (`capa`): the cover, in both of its jobs. It dresses the header band and
  the full navy ground behind the pre-week screens; it sets day names, the label card's
  title, and every hover-darkened control; and it fills the one solid button in the system
  (`botao-capa`). It never appears as written household content.
- **Fundo da Capa** (`capa-funda`): the cover's deepest tone, at the bottom of both cover
  gradients and behind selected text; the ink of today's day name; and the hover fill of
  the solid button.

### Secondary

- **Ocre da Fita** (`fita`): the ribbon marker, and the cover's only accent. On the sheet it
  marks today and nothing else — the ribbon down the left edge of today's block, the `HOJE`
  chip beside today's name, and the wash and inset edge on whichever rule currently has
  focus. On navy it does the same job for the cover: it is the focus ring there (red does
  not read on navy), and it marks the household's join code, which is the one unique,
  uncopyable thing the cover carries. Measured 5.57:1 on the cover band.
- **Violeta do Carimbo** (`carimbo`): acknowledgement. The `VISTO` stamp, the strike on a
  stamped task, and (mixed 70% into the sheet, resolving to `#9577c1`) the dashed field
  waiting for a stamp. Measured 6.99:1 stamped; 3.57:1 pending, which is non-text and sits
  above the 3:1 floor.
- **Vermelho da Margem** (`margem`): correction, and the mark of the book. The printed
  margin rule at 55% opacity — on the ruled page *and* down the left of the label card, which
  is what says the label belongs to this notebook. Also the strike-through on a moved entry
  and its arrow to the new day, the destructive menu item, the whole of every failure strip,
  the left rule and text of a form's error message, and the focus ring everywhere except the
  navy cover. The teacher's red pen, used for exactly what a red pen is used for.

### Tertiary

The remaining three pens. Each is a household member's ink; none of them is a brand accent
and none may be repurposed as one.

- **Esferográfica Verde** (`mae`): the mother's pen. Measured 5.15:1 on the sheet, and it
  additionally clears when struck.
- **Lápis** (`filha`): the daughter's pencil — the one grey-toned pen, deliberately softer
  than the ballpoints.
- **Esferográfica Preta** (`casa`): the household pen, for what belongs to everyone. Also
  the document's base text colour and the ink of every meal, which belongs to the table
  rather than to a person.

### Neutral

- **Papel** (`papel`): the cool stock the opening sits on. The page ground, the scrollbar
  track, and the PWA background colour.
- **Folha** (`folha`): the sheet itself, one step brighter than the stock. The opening, the
  menu surface, the label card on the cover screens, the cover's text colour, and the mask
  behind the touch action menu.
- **Pauta** (`pauta`): the printed rules, drawn as a repeating gradient rather than as
  borders. Also the menu item hover wash at 45%.
- **Pauta Forte** (`pauta-forte`): the heavier printed line — the day-header divider, the
  opening's border, the gutter crease, the menu border, the label card's border, the resting
  underline of a cover-screen field, and the scrollbar thumb.
- **Tinta do Impresso** (`impresso-tinta`): the grey-blue the book is printed in. Every
  printed label, date and role tag; the field labels and body copy on the label card and its
  always-visible placeholders; the time column; and the recessive state for a multi-day
  continuation and a completed task. Measured 5.23:1 on the sheet, 5.18:1 on the label card.

### Named Rules

**The Two Registers Rule.** Printed and written never mix. A colour from the printed group
(`impresso-tinta`, `pauta`, `pauta-forte`, `capa`) never carries a household entry, and a
pen (`pai`, `mae`, `filha`, `casa`) never draws structure. This holds on the cover screens
exactly as it holds on the page: the label above a field is printed, the value typed into it
is written in `pai`. The only sanctioned crossing is recession: a continuation of a
multi-day block, or a completed task, drops from its pen to `impresso-tinta` — it stays
readable but stops competing with what has not happened yet.

**The Ink-Plus-Tag Rule.** Inside the week, a member is never identified by colour alone.
Every entry carries its author's ink *and* a printed role tag in that same ink (`PAI`,
`MÃE`, `FILHA`, `TODOS`, or an em dash when unassigned). Remove the tag and the attribution
is gone, not merely weakened.

**The One Ribbon Rule.** `fita` is the marker colour, and it marks one thing per ground. On
the sheet: today, and the line under the cursor. On the navy cover: focus, and the join
code. It is never a general accent, a button fill, or a highlight for importance, and it
never appears twice on the same ground for two different reasons.

## Typography

**Display Font:** Archivo (variable, weight 400–700, width 62–125%), self-hosted, with
`ui-sans-serif, system-ui, sans-serif` behind it.
**Body Font:** Archivo — the same face. One grotesque prints the book and carries the ink;
the two registers are separated by colour, case and tracking, not by a second family.
**Hand Font:** Caveat (variable weight 500–700), self-hosted, with `ui-sans-serif, cursive`
behind it. Used once, on the cover.

**Character:** A sturdy European grotesque with a real width axis, worked hard — condensed
and tracked into small caps for everything printed, opened wide and set at poster scale for
the day names. Numerals are tabular document-wide, so times, dates and the join code stack
into columns without being told to. Synthetic weights are switched off; the variable font
supplies every weight it renders.

### Hierarchy

- **Display / `--t-dia`** (700, 2.5rem desktop / 1.875rem mobile, line-height 0.95, width
  118%, tracking 0.015em, uppercase): the day name. Poster scale, on purpose — the week is
  navigated by these before anything else is read. The undated list's heading is the one
  variant: same size, natural width, sentence case, negative tracking, printed ink — it is
  a section, not a day.
- **Headline / `--t-destaque`** (1.5rem desktop / 1.375rem mobile, tracking −0.01em): the
  raised step. Applied to each day's lead entry and to the household name on the cover.
- **Title / `--t-destaque` set hard** (700, same 1.5rem step, width 112%, tracking −0.015em,
  line-height 1.15, cover navy): the one heading on a label card — "A semana da família",
  "Abrir uma caderneta", "Falta confirmar o email". The same step as Headline, set to carry
  a screen instead of a line. Measured 14.74:1. The join-code field also takes this step,
  opened to 0.22em tracking and uppercased, because six letters read as a serial number.
- **Body / `--t-escrita`** (1.0625rem desktop / 1rem mobile, line-height locked to the rule
  pitch in the week, 1.45–1.5 in prose on the label card): everything the household writes,
  plus menu items, cover-screen fields, explanatory copy and every failure sentence.
- **Label / `--t-impresso`** (600, 0.6875rem, width 112%, tracking 0.14em, uppercase,
  printed ink): everything the book arrives with — dates, the week interval, role tags, meal
  tags, the `HOJE` chip, the menu heading, the "Esta semana" control, the brand line and
  field labels on a label card, every text-underline control, and the mark that opens a
  failure strip. Role and meal tags run one step heavier (700) at 0.1em to hold their own
  beside the ink.
- **Hand / Caveat** (1.5rem, line-height 1.2, on a dashed rule): the household's name on the
  cover, now bound to the household's real name in the database. The single permitted
  handwriting setting in the application.

### Named Rules

**The Four Steps Rule.** There are four sizes — 0.6875 / 1.0625 / 1.5 / 2.5rem, with mobile
substitutions — and nothing lives between one step and the next. A new element takes an
existing step or it does not ship. Weight, width, tracking and case may differ freely within
a step (Headline and Title are the same 1.5rem, set differently); the size may not. No
intermediate size, no smooth ramp, no `clamp()` on type.

**The Fixed Time Column Rule.** The time is bound to `--t-escrita` at doubled specificity
(`.escrita.escrita--hora`) precisely so it does *not* rise with a raised lead row. Its
column has a fixed width; letting the time scale overflows it. Any value that lives in a
fixed-width column must be pinned the same way.

**The One Hand Rule.** Caveat appears on the cover name and nowhere else — not on the label
card, whose title is Archivo. Written content is carried by ink, weight and the baseline on
the rule; a script face across the entries is costume, and it costs legibility on the device
that matters most.

## Layout

There are two layouts in the whole application: the label on the cover, and the opening.

**The cover screen (`portada`).** One full-viewport navy field (`min-height: 100dvh`),
padded `clamp(1rem, 5vw, 3rem)`, with a single object centred in it by `place-items: center`.
The ground is a radial highlight from just above the top edge over a vertical `capa` →
`capa-funda` gradient — a board catching light, not a hero image. The object is the label
card at `min(26rem, 100%)`, a single column with 1rem between every element and its
own left inset (`clamp(2.75rem, 7vw, 3.5rem)`) to clear the red margin rule at
`clamp(1.75rem, 4.5vw, 2.25rem)`. It is the same composition at 1440 and at 390 — the card
takes the full width on a phone and stops growing at 26rem on a desktop. There is no second
column, no split panel, no illustration half.

**The opening.** At 64rem and above, a three-column grid — page, gutter, page — inside an
82rem measure. Monday through Thursday sit left, Friday through Sunday plus the undated
"Esta semana" list sit right. It is one sheet creased down the middle, not two cards: a
single `folha` background, a single hairline border, one soft shadow beneath the whole
thing, and a 2.25rem gutter carrying a symmetric shadow gradient and a hairline crease
inset 1.25rem from either end. Below 64rem the grid collapses to one column and the same
gutter becomes a 2rem horizontal break between Thursday and Friday, rotated 90°: the same
object, read differently.

**The rule pitch is the unit.** `--pauta-passo` (2.125rem desktop, 2.375rem mobile) sets the
repeating gradient that draws every day's rules, the min-height and line-height of every
row, and the height of every cell in the row grid. One entry is exactly one rule. A long
entry wraps onto the next rule rather than being clipped or stretching the row: the writing
field auto-grows in whole pitches, remeasuring on `document.fonts.ready` (the pitch cannot
be measured before the real face arrives) and again through a `ResizeObserver` on its
column. The pitch holds exactly across raised rows and wrapped rows alike.

**The row grid.** Four columns: the margin gutter (`--margem-x`), the text measure, the time
column (`--hora-x`), and the actions column (`--largura-accoes`). Three variants, each
earning its space: a meal collapses the time column to `0` and gives the width back to the
measure, because a meal never has a time; a task with a set time opens a fifth column so the
time and the stamp can sit side by side; and on a touch device the actions column collapses
to `0` and the menu lifts out of the grid into an absolutely positioned overlay that appears
only when the row has focus. On mobile that returns a text measure of 199px for an event,
223px for a meal and 128px for a timed task.

**The margin.** A single hairline in 55% `margem`, drawn as a pseudo-element so it runs the
full height of its container regardless of content. On a day it falls at `--margem-x`
(3.25rem desktop, 2.5rem mobile) on the ruled body, and it is the status gutter: multi-day
brackets sit in it, in their author's ink. On the label card it falls at
`clamp(1.75rem, 4.5vw, 2.25rem)` and carries nothing — there, it is identification.

**The cover band.** An 82rem measure padded `clamp(1rem, 4vw, 2.5rem)`, laid out as a
wrapping flex row with its two ends baseline-aligned at the bottom: the household's name and
the week interval on the left, and on the right a right-aligned stack of the week navigation
above the account row (join code, email, sign out). Below 48rem that stack switches to
left-aligned, so both halves share one edge on a phone.

**Rhythm.** Days are separated by 1.75rem within a page; the page is padded 1.25rem top and
1.75rem bottom with a fluid 0.625–1.5rem inline. Horizontal page padding is fluid
(`clamp(1rem, 4vw, 2.5rem)` on the cover and notices, `clamp(0.5rem, 3vw, 2.5rem)` on the
opening). Everything else is a multiple of the rule pitch, because the rules are visible and
anything off the pitch shows.

**Density floor.** Every day renders at least three rules, and at least one blank rule
beyond whatever it holds. Sunday with nothing on it is ruled and waiting.

**Arrival.** On a narrow viewport the week opens scrolled to today, the way a book opens at
its ribbon — but only from Wednesday onward, only once, and only after the week has actually
loaded. Earlier in the week today is already in the first viewport.

### Named Rules

**The One Rule, One Entry Rule.** An entry occupies exactly one rule pitch, or a whole
number of them. Nothing sits between rules, nothing straddles a rule, and no element
introduces a height that is not a multiple of `--pauta-passo`.

**The One Label Rule.** Every screen that is not the week is the same navy ground with the
same white label card on it — sign in, create account, confirm your email, open a household,
join a household, missing configuration, missing migration. A new pre-week screen is new
copy inside that card, never a new layout. The single exception is the loading phase, which
prints one tracked line straight onto the navy and shows no card at all, because a card that
appears and is then replaced is a flash, not a state.

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
(`:hover`, `:disabled`), not on being written later in its own file. Before adding a rule,
check what follows it — and prefer to delete a rule that cannot win over leaving it as
decoration.

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
depth.

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

**The Flat Page Rule.** Nothing in the opening is elevated. A row, a tag, a stamp and a
blank rule all sit in the paper. If a new element wants a shadow, it needs a physical
justification in the book — an edge, a crease, a glued label, or a thing genuinely lying on
top.

## Shapes

Radii are effectively absent, because paper does not have them. The system uses 1px on
anything that only needs its focus ring not to look sharp-cornered (writing fields, the
cover name, cover-screen fields), 2px on the small printed rectangles (role and meal tags,
cover buttons, the today chip, the stamp field, the solid cover button), 3px on the two true
surfaces — the menu and the label card — and a pill only on the scrollbar thumb, which is a
browser part rather than a page element. The favicon's cover uses a 9px corner because it is
a book, at icon scale.

Borders are hairlines and behave like printed lines: 1px for the opening, the menu, the
label card and the role tag's outline; 1.5px for the day-header divider and the strike on a
moved entry; 1px dashed for the cover's name field and 1.6px dashed for the pending stamp
field. A single 1px rule also does duty as a bracket rather than a box: under a cover-screen
field, under every text-underline control, and down the left of an error message. Drawn
icons are a single 1.5 stroke with round caps and joins, in the book's grammar — a bracket
for a multi-day block, an arrow for a move, chevrons for week navigation, and three dots for
the row menu.

Two silhouettes recur, and both are things placed on paper by hand rather than drawn by the
grid. The stamp: a 74×30 rounded rectangle (4px corner) rotated −6°, dashed and 1.6-weight
while pending, solid and 2.4-weight with `VISTO` set in tracked Archivo caps once given. And
the label: a 26rem card rotated −0.35°, just enough that it reads as glued on rather than
laid out. Rotation in this system means *applied by a person*; nothing structural is ever
off-axis.

## Components

### Row (`linha`) — the signature component

The entire application is rows. A row is a four-column grid one rule tall, holding the
margin gutter, the text measure, the time column and the actions column. It is not a card,
a list item or a widget — it is a printed rule with writing on it.

- **Shape:** no background, no border, no radius. The rule beneath it comes from the day's
  repeating gradient, not from the row.
- **Content:** the author's role tag in that author's ink, then the writing field in the
  same ink. Meals swap the role tag for an outlined meal tag and are always written in the
  household pen.
- **Lead row:** the first entry of each day is raised to the headline step, with slightly
  tightened tracking and its tag centred to the taller line. Exactly one per day.
- **Focus:** the whole row takes a 9% `fita` wash and a 2px inset `fita` edge on its leading
  side. The row you are writing on is ribboned, like the day.
- **Struck (moved):** printed ink, a `margem`-coloured 1.5px strike, and a small red arrow
  plus the destination day in tracked caps. The row is never removed — the agenda keeps what
  happened.
- **Completed:** the writing keeps its position and takes a `carimbo` strike-through; the
  stamp lands beside it.
- **Blank:** a row with nothing in it but a live writing field. Rendered by default, always
  writable, and it becomes a real entry on Enter or on blur.

### Writing field (`escrita`)

The page, not a widget on it. Transparent, borderless, zero padding, inheriting font,
tracking and width from the row, with line-height locked to the rule pitch and resize
disabled. It auto-grows in whole pitches. Its placeholder is invisible at rest and appears
in printed ink on hover or focus, so an empty week reads as clear ruling rather than as a
field of grey prompts. `Enter` commits and keeps the cursor in place, so entries can be
written one after another. Ink is applied inline by the component, never in CSS — see
The Override-Last Rule.

### Time field (`escrita--hora`)

The same field, right-aligned in printed ink with tabular numerals, pinned to the body size,
inside a fixed-width column. Placeholder `--:--`. Meals never show it.

### Stamp field (`campo-carimbo`)

Completion, in the column where the ink lands. Pending, it is a dashed rounded rectangle at
70% stamp violet over the sheet, sized to the stamp's own footprint — the empty box a
teacher would stamp into. Given, it is the `VISTO` stamp at full violet, rotated −6°. The
control is a `checkbox`-role button whose hit area extends 0.25rem vertically and 0.5rem
horizontally beyond its box. There is no gutter checkbox and no checkmark glyph anywhere in
the system.

### Tags (`etiqueta`)

Small printed rectangles inline at the head of a row, one rule tall so they never break the
pitch. The author tag is set in its member's ink with no border; the meal tag is set in
printed ink with a 32%-opacity outline, because a meal has no author. Both open a menu; both
take a 12% wash of their own colour on hover.

### Menu (`menu`)

A short list that opens beside the row it belongs to — never a modal, never a sheet, and the
page under it stays readable. Sheet background, `pauta-forte` hairline, 3px corner, a
tracked printed heading, and body-sized items in the household pen. An option that carries a
colour (a member's ink, the destructive red) shows in that colour, applied inline. The
active option is bolded, not ticked. Opens with a 180ms fade and a 0.25rem rise; closes on
outside click or Escape, returning focus to its trigger.

### Cover (`capa`)

The header band on the week: a navy vertical gradient from a lightened cover tone through
`capa` to `capa-funda`, with a hard bottom edge. Left, the household's real name in the hand
face on a dashed rule — typed straight onto the cover, debounced 600ms to the database, no
save control — with the week's interval printed beneath it in tracked caps. Right, a stack:
the three navigation controls (previous, "Esta semana", next) as 2.25rem minimum ghost
buttons with 26%-opacity sheet borders, filling to a 12% sheet wash on hover, "Esta semana"
disabling to 0.38 opacity when the current week is already shown; and beneath them the
account row — the six-letter join code in `fita`, the signed-in email truncated to 14ch with
its full value on hover, and a text-underline "Sair". Focus rings on the cover switch from
margin red to ribbon ochre, because red does not read on navy.

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
caret. Unlike the week's writing field, the placeholder here is printed ink and permanently
visible: a form has to say what it wants, where an empty rule only has to be a rule. The
join-code variant (`campo-escrita--codigo`) takes the title step at 0.22em tracking,
uppercased and tabular, and upper-cases what is typed as it is typed.

### Buttons

- **Solid (`botao-capa`):** the one filled button in the system, and there is at most one per
  screen. `capa` fill, `folha` text, 2px corner, 2.875rem minimum height, full card width,
  body size at 600. Hover deepens to `capa-funda` over 160ms; disabled drops to 0.55 opacity
  and swaps its label for "Um momento…" while a request is in flight.
- **Ghost (`capa-botao`):** the week navigation on the cover band. Hairline sheet border,
  2.25rem minimum square, transparent until hover.
- **Text-underline (`botao-linha`, `aviso-repor`, `capa-sair`):** every secondary action in
  the application. No box at all — printed caps or inherited text with a 1px underline in
  `currentColor`, darkening to `capa` on hover. Mode switches, "Sair desta conta", "Voltar",
  and the sample-week offer are all this control; none of them is a second button.

### Notices and failure states

Every state the data layer can be in has a designed, printed strip above the opening, and
none of them is a toast, a modal or a spinner. All are `role="status"`, all open with a
tracked printed mark, and all say what happened and what it means for what is written:

- **Sem tabelas** — the database has no caderneta yet; the strip prints the exact migration
  path to run.
- **Sem ligação** — reading from the device's cache; what is written now may not reach the
  others.
- **Não guardado** — something did not reach the server; what is written is still here.
- **Empty week** — printed ink rather than red, because nothing is wrong: "Caderneta em
  branco. As pautas estão à espera.", beside a text-underline offer to write an example
  week. Sample content is never seeded; it is only ever written on request.

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
on the stamp field, the cover buttons and the solid button, and a 140ms fade for the row
actions on hover-capable devices. A global reduced-motion rule collapses every animation and
transition to 1ms, and the mobile scroll-to-today switches to an instant jump.

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

## Do's and Don'ts

### Do:

- **Do** keep the two registers separate, on the label as on the page. Structure is printed
  (`impresso-tinta`, tracked Archivo caps at `--t-impresso`); household content is written,
  in its author's pen.
- **Do** give every entry both its ink and its printed role tag. Colour alone is not
  attribution.
- **Do** size everything in whole rule pitches (`--pauta-passo`), and let a long entry wrap
  onto the next rule rather than stretch its own.
- **Do** render a day's rules whether or not anything is on it, and keep at least one blank,
  writable rule below the last entry.
- **Do** make every entry editable exactly where it sits, and write it to the page before
  writing it to the network.
- **Do** restyle a row in place when its state changes — struck and rewritten when moved,
  stamped when done — and keep the old line visible.
- **Do** put any new pre-week screen inside the label card, in its existing order: printed
  line, title, fields, error, solid button, text-underline alternatives.
- **Do** give every failure a printed mark and a Portuguese sentence that names the recovery,
  per The Named State Rule.
- **Do** take one of the four type steps, or do not ship the element.
- **Do** pin any value in a fixed-width column to its own size at doubled specificity, so a
  raised row cannot overflow it.
- **Do** check what follows a new rule in the stylesheet — and whether a component passes an
  inline `style` — before trusting it, per The Override-Last Rule.
- **Do** write new code in the same Portuguese vocabulary the build uses — `linha`, `pauta`,
  `escrita`, `impresso`, `carimbo`, `fita`, `portada`, `etiqueta`, `recado`. It is the
  project's language, not an accident.

### Don't:

- **Don't** introduce an edit mode, a save button, or a modal for editing an entry.
- **Don't** build an hour grid. The week is ruled lines, not a seven-column timetable.
- **Don't** put a checkbox in the margin gutter or a checkmark glyph anywhere. Completion is
  the `VISTO` stamp, in the column where the ink lands.
- **Don't** use a pen colour (`pai`, `mae`, `filha`, `casa`) for structure, or printed ink
  for a live entry — the one sanctioned crossing is recession for continuations and
  completed tasks.
- **Don't** spend `fita` on more than one thing per ground: today and the focused rule on the
  sheet, focus and the join code on the navy.
- **Don't** set household content in Caveat. The hand face belongs to the cover name only.
- **Don't** give a cover screen its own layout, split panel, illustration or marketing
  header. It is the label card on the navy ground.
- **Don't** add a second solid button to a screen. One `botao-capa`; every other action is a
  text-underline.
- **Don't** add a paper photo-texture, a cream or parchment ground, or a warm lamplight
  cast. This paper is cool and slightly blue.
- **Don't** add elevation tiers or hover lifts. Nothing in the opening floats except the
  menu.
- **Don't** rotate anything structural. Rotation means a person put it there — the stamp and
  the glued label, and nothing else.
- **Don't** add a second motion moment. The stamp press is the one authored animation, and
  it fires on the act of stamping, not on render.
- **Don't** introduce a type size between the four steps, or a fluid `clamp()` on type.
- **Don't** ship English in the interface — including a provider's error text; map it through
  the error dictionary first.
- **Don't** write invented household data into a real database. The example week exists, and
  it is only ever written when someone asks for it.
