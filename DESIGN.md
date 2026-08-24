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
  aviso-selo:
    backgroundColor: "transparent"
    textColor: "{colors.margem}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.1875rem 0.4375rem"
---

# Design System: HomePlanner

## Overview

**Creative North Star: "A Caderneta"**

The Portuguese school agenda, opened flat to this week. Everything the application
provides is *printed* — day names, rules, dates, the red margin, the role tags. Everything
the household provides is *written* — each member's own pen, sitting on the rule. Those
two registers carry the whole identity, and they never mix. Nothing else in this system is
load-bearing: no texture, no skeuomorphic paper photograph, no drop-shadowed cards
pretending to be sheets. The book is conveyed by the rule pitch, the margin, the gutter
and the ribbon, and by nothing else.

The paper is cool, not cream. The stock is a blue-grey `papel` field with a slightly
brighter `folha` sheet laid on it; the covers are saturated navy. Warm parchment,
lamplight and sepia are outside this world — the surface is read at 7:40am in a kitchen
with sun on the screen, and the primary register has to survive that. Density is
deliberately light: a household week is about ten entries, so the design refuses the
seven-column hour grid that would render those ten entries as ninety percent empty
scaffolding, and instead rules every day whether or not anything is on it. An empty day is
not a void or an illustration; it is clear ruling, waiting.

Type is set at four sizes with wide jumps and nothing between them — a specimen ramp, not
a smooth scale. Day names run at poster scale. Each day's lead entry is raised one step,
because it is what gets read before the day name. The one handwriting face in the entire
application is the household's own name on the cover, the way a name label is written on a
school book; every other written thing is carried by ink colour and by the baseline sitting
on the rule, never by a script font.

**Key Characteristics:**

- Two registers that never mix: printed structure versus written content.
- The rule pitch is the layout unit — one entry is exactly one rule.
- No edit mode: every entry and every blank rule is a live field.
- Four type sizes, wide jumps, nothing between.
- Attribution is the ink *and* a printed role tag — never colour alone.
- Completion is a stamp where the ink lands, not a checkbox in a gutter.
- One authored motion moment: the stamp press.
- Interface language is Portuguese (pt-PT), and so is the code — class names,
  custom properties and comments.

## Colors

A cool blue-grey stationery palette: printed structure in pale rules and grey-blue ink, a
saturated navy cover, and four saturated pens that carry every piece of household content.

### Primary

- **Esferográfica Azul** (`pai`): the father's ballpoint, and the system's dominant written
  ink. Also the caret colour for the whole document and the tint of the text selection —
  the pen you write with is the pen the browser hands you. Measured 8.33:1 on the sheet.
- **Azul da Capa** (`capa`): the cover. Dresses the header band, day names, and every
  hover-darkened control. Never appears as written content.
- **Fundo da Capa** (`capa-funda`): the cover's deepest tone, at the bottom of its gradient
  and behind selected text; also the ink of today's day name.

### Secondary

- **Ocre da Fita** (`fita`): the ribbon marker. Marks today and nothing else — the ribbon
  down the left edge of today's block, the `HOJE` chip beside today's name, and the wash
  and inset edge on whichever rule currently has focus. Its whole value is that exactly one
  day per week can carry it.
- **Violeta do Carimbo** (`carimbo`): acknowledgement. The `VISTO` stamp, the strike on a
  stamped task, and (mixed 70% into the sheet, resolving to `#9577c1`) the dashed field
  waiting for a stamp. Measured 6.99:1 stamped; 3.57:1 pending, which is non-text and sits
  above the 3:1 floor.
- **Vermelho da Margem** (`margem`): correction. The printed margin rule at 55% opacity, the
  strike-through on a moved entry and its arrow to the new day, the destructive menu item,
  the sample-content seal, the save-failure notice, and the focus ring for the entire
  application. The teacher's red pen, used for exactly what a red pen is used for.

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
  menu surface, the cover's text colour, and the mask behind the touch action menu.
- **Pauta** (`pauta`): the printed rules, drawn as a repeating gradient rather than as
  borders. Also the menu item hover wash at 45%.
- **Pauta Forte** (`pauta-forte`): the heavier printed line — the day-header divider, the
  opening's border, the gutter crease, the menu border, and the scrollbar thumb.
- **Tinta do Impresso** (`impresso-tinta`): the grey-blue the book is printed in. Every
  printed label, date and role tag; the time column; and the recessive state for a
  multi-day continuation and a completed task. Measured 5.23:1.

### Named Rules

**The Two Registers Rule.** Printed and written never mix. A colour from the printed group
(`impresso-tinta`, `pauta`, `pauta-forte`, `capa`) never carries a household entry, and a
pen (`pai`, `mae`, `filha`, `casa`) never draws structure. The only sanctioned crossing is
recession: a continuation of a multi-day block, or a completed task, drops from its pen to
`impresso-tinta` — it stays readable but stops competing with what has not happened yet.

**The Ink-Plus-Tag Rule.** A member is never identified by colour alone. Every entry
carries its author's ink *and* a printed role tag in that same ink (`PAI`, `MÃE`, `FILHA`,
`TODOS`, or an em dash when unassigned). Remove the tag and the attribution is gone,
not merely weakened.

**The One Ribbon Rule.** `fita` marks today and the line under the cursor, and nothing
else. It is never a general accent, a button fill, or a highlight for importance.

## Typography

**Display Font:** Archivo (variable, weight 400–700, width 62–125%), self-hosted, with
`ui-sans-serif, system-ui, sans-serif` behind it.
**Body Font:** Archivo — the same face. One grotesque prints the book and carries the ink;
the two registers are separated by colour, case and tracking, not by a second family.
**Hand Font:** Caveat (variable weight 500–700), self-hosted, with `ui-sans-serif, cursive`
behind it. Used once, on the cover.

**Character:** A sturdy European grotesque with a real width axis, worked hard — condensed
and tracked into small caps for everything printed, opened wide and set at poster scale for
the day names. Numerals are tabular document-wide, so times and dates stack into columns
without being told to. Synthetic weights are switched off; the variable font supplies every
weight it renders.

### Hierarchy

- **Display / `--t-dia`** (700, 2.5rem desktop / 1.875rem mobile, line-height 0.95, width
  118%, tracking 0.015em, uppercase): the day name. Poster scale, on purpose — the week is
  navigated by these before anything else is read. The undated list's heading is the one
  variant: same size, natural width, sentence case, negative tracking, printed ink — it is
  a section, not a day.
- **Headline / `--t-destaque`** (1.5rem desktop / 1.375rem mobile, tracking −0.01em): the
  raised step. Applied to each day's lead entry and to the household name on the cover, and
  to nothing else.
- **Body / `--t-escrita`** (1.0625rem desktop / 1rem mobile, line-height locked to the rule
  pitch): everything the household writes, plus menu items and notice copy.
- **Label / `--t-impresso`** (600, 0.6875rem, width 112%, tracking 0.14em, uppercase,
  printed ink): everything the book arrives with — dates, the week interval, role tags,
  meal tags, the `HOJE` chip, the sample seal, the menu heading, the "Esta semana" control.
  Role and meal tags run one step heavier (700) at 0.1em to hold their own beside the ink.
- **Hand / Caveat** (1.5rem, line-height 1.2, on a dashed rule): the household's name on the
  cover. The single permitted handwriting setting in the application.

### Named Rules

**The Four Steps Rule.** There are four sizes — 0.6875 / 1.0625 / 1.5 / 2.5rem, with mobile
substitutions — and nothing lives between one step and the next. A new element takes an
existing step or it does not ship. No intermediate size, no smooth ramp, no `clamp()` on
type.

**The Fixed Time Column Rule.** The time is bound to `--t-escrita` at doubled specificity
(`.escrita.escrita--hora`) precisely so it does *not* rise with a raised lead row. Its
column has a fixed width; letting the time scale overflows it. Any value that lives in a
fixed-width column must be pinned the same way.

**The One Hand Rule.** Caveat appears on the cover name and nowhere else. Written content is
carried by ink, weight and the baseline on the rule — a script face across the entries is
costume, and it costs legibility on the device that matters most.

## Layout

The whole application is one surface: a cover band, then an opening.

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

**The margin.** A single hairline at `--margem-x` (3.25rem desktop, 2.5rem mobile) in 55%
`margem`, drawn as a pseudo-element on the ruled body so it runs the full height of the day
regardless of content. It is the status gutter: multi-day brackets sit in it, in their
author's ink.

**Rhythm.** Days are separated by 1.75rem within a page; the page is padded 1.25rem top and
1.75rem bottom with a fluid 0.625–1.5rem inline. Horizontal page padding is fluid
(`clamp(1rem, 4vw, 2.5rem)` on the cover and notices, `clamp(0.5rem, 3vw, 2.5rem)` on the
opening). Everything else is a multiple of the rule pitch, because the rules are visible and
anything off the pitch shows.

**Density floor.** Every day renders at least three rules, and at least one blank rule
beyond whatever it holds. Sunday with nothing on it is ruled and waiting.

**Arrival.** On a narrow viewport the week opens scrolled to today, the way a book opens at
its ribbon — but only from Wednesday onward, and only once; earlier in the week today is
already in the first viewport.

### Named Rules

**The One Rule, One Entry Rule.** An entry occupies exactly one rule pitch, or a whole
number of them. Nothing sits between rules, nothing straddles a rule, and no element
introduces a height that is not a multiple of `--pauta-passo`.

**The Override-Last Rule.** In these stylesheets a declaration only counts if nothing at
equal specificity overrides it later. This build shipped four dead rules before they were
caught: a token declared above the media query that redefined it, a raised-row rule written
before the base row rule that beat it, and two colour rules that could never win against an
inline `style`. Three consequences are load-bearing and are commented in place: `.linha`'s
base declarations come *before* `.linha--destaque`; `.escrita.escrita--hora` doubles its
specificity on purpose; and text ink is passed as an inline `style` from the component
rather than declared in CSS. Before adding a rule, check what follows it — and prefer to
delete a rule that cannot win over leaving it as decoration.

## Elevation & Depth

Flat, with one exception, and the exception is bookbinding rather than material design.
There are no elevation tiers, no hover lifts, no shadowed cards. Depth is carried by the
printed rules, by the gutter's shadow gradient, and by the `papel`/`folha` tonal step
between the stock and the sheet.

Four shadows exist in the whole build, and each names a physical fact rather than a level:
the cover's hard bottom edge and the soft drop beneath it, the opening's single low shadow
suggesting a sheet lying on the stock, the menu's shadow because it is the only thing that
genuinely floats above the page, and the ribbon's small cast shadow because it is a physical
object clipped over the edge of the paper. On touch, the actions overlay uses a solid
`folha` shadow purely as a mask, not as depth.

### Shadow Vocabulary

- **Cover edge** (`box-shadow: 0 2px 0 <capa-funda 70%>, 0 10px 24px -14px rgb(14 23 48 / 0.55)`):
  the board's edge and the shade beneath it. Cover band only.
- **Sheet** (`box-shadow: 0 18px 40px -30px rgb(14 23 48 / 0.55)`): the opening resting on
  the stock. Very wide, very low, no lift.
- **Menu** (`box-shadow: 0 12px 28px -12px rgb(14 23 48 / 0.4), 0 2px 6px -2px rgb(14 23 48 / 0.25)`):
  the only floating surface.
- **Ribbon** (`box-shadow: 0 1px 3px rgb(14 23 48 / 0.28)`): a real object over the page edge.

### Named Rules

**The Flat Page Rule.** Nothing in the opening is elevated. A row, a tag, a stamp and a
blank rule all sit in the paper. If a new element wants a shadow, it needs a physical
justification in the book — an edge, a crease, or a thing genuinely lying on top.

## Shapes

Radii are effectively absent, because paper does not have them. The system uses 1px on
anything that only needs its focus ring not to look sharp-cornered (writing fields, the
cover name), 2px on the small printed rectangles (role and meal tags, cover buttons, the
today chip, the sample seal, the stamp field), 3px on the menu — the one true surface — and
a pill only on the scrollbar thumb, which is a browser part rather than a page element. The
favicon's cover uses a 9px corner because it is a book, at icon scale.

Borders are hairlines and behave like printed lines: 1px for the opening, the menu and the
role tag's outline; 1.5px for the day-header divider, the sample seal and the strike on a
moved entry; 1px dashed for the cover's name field and 1.6px dashed for the pending stamp
field. Drawn icons are a single 1.5 stroke with round caps and joins, in the book's
grammar — a bracket for a multi-day block, an arrow for a move, chevrons for week
navigation, and three dots for the row menu.

The recurring silhouette is the stamp: a 74×30 rounded rectangle (4px corner) rotated −6°,
dashed and 1.6-weight while pending, solid and 2.4-weight with `VISTO` set in tracked
Archivo caps once given. The sample seal repeats the same idea, rotated −2.5° in margin red.

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
colour (a member's ink, the destructive red) shows in that colour. The active option is
bolded, not ticked. Opens with a 180ms fade and a 0.25rem rise; closes on outside click or
Escape, returning focus to its trigger.

### Cover (`capa`)

The header band: a navy vertical gradient from a lightened cover tone through `capa` to
`capa-funda`, with a hard bottom edge. Left, the household name in the hand face on a dashed
rule, with the week's interval printed beneath it in tracked caps. Right, three navigation
controls — previous, "Esta semana", next — as 2.25rem minimum ghost buttons with 26%-opacity
sheet borders, filling to a 12% sheet wash on hover. "Esta semana" disables to 0.38 opacity
when the current week is already shown. Focus rings on the cover switch from margin red to
ribbon ochre, because red does not read on navy.

### Notices

Two, both inline above the opening and neither of them a toast or a modal. The sample-content
notice leads with a red-outlined `EXEMPLO` seal rotated −2.5°, states plainly that the
content is not anyone's data, and offers a text-underline control to restore it. The
save-failure notice sets everything in margin red behind an underlined `NÃO GUARDADO` mark
and says exactly what will happen to what is written.

### Motion

One authored moment: the stamp press. When a task is stamped — and only on the act of
stamping, never on page load or re-render — the stamp animates from −11°/1.5× and
transparent to −6°/1× and opaque over 420ms on `cubic-bezier(.16, 1, .3, 1)`. Everything
else is functional and brief: a 180ms menu open on the same curve, 160ms colour transitions
on the stamp field and the cover buttons, and a 140ms fade for the row actions on
hover-capable devices. A global reduced-motion rule collapses every animation and transition
to 1ms, and the mobile scroll-to-today switches to an instant jump.

### Browser surfaces

The parts of the interface that were not drawn still carry the design. Selection is a 22%
wash of the father's pen with cover-deep text; the caret is that same pen; the scrollbar is
a `pauta-forte` thumb with a 3px `papel` inset on a `papel` track, darkening to printed ink
on hover; the focus ring everywhere except the cover is a 2px margin-red outline at 2px
offset with a 1px radius; and numerals are tabular document-wide.

## Do's and Don'ts

### Do:

- **Do** keep the two registers separate. Structure is printed (`impresso-tinta`, tracked
  Archivo caps at `--t-impresso`); household content is written, in its author's pen.
- **Do** give every entry both its ink and its printed role tag. Colour alone is not
  attribution.
- **Do** size everything in whole rule pitches (`--pauta-passo`), and let a long entry wrap
  onto the next rule rather than stretch its own.
- **Do** render a day's rules whether or not anything is on it, and keep at least one blank,
  writable rule below the last entry.
- **Do** make every entry editable exactly where it sits.
- **Do** restyle a row in place when its state changes — struck and rewritten when moved,
  stamped when done — and keep the old line visible.
- **Do** take one of the four type steps, or do not ship the element.
- **Do** pin any value in a fixed-width column to its own size at doubled specificity, so a
  raised row cannot overflow it.
- **Do** check what follows a new rule in the stylesheet before trusting it, per
  The Override-Last Rule.
- **Do** write new code in the same Portuguese vocabulary the build uses — `linha`, `pauta`,
  `escrita`, `impresso`, `carimbo`, `fita`. It is the project's language, not an accident.

### Don't:

- **Don't** introduce an edit mode, a save button, or a modal for editing an entry.
- **Don't** build an hour grid. The week is ruled lines, not a seven-column timetable.
- **Don't** put a checkbox in the margin gutter or a checkmark glyph anywhere. Completion is
  the `VISTO` stamp, in the column where the ink lands.
- **Don't** use a pen colour (`pai`, `mae`, `filha`, `casa`) for structure, or printed ink
  for a live entry — the one sanctioned crossing is recession for continuations and
  completed tasks.
- **Don't** spend `fita` on anything but today and the focused rule.
- **Don't** set household content in Caveat. The hand face belongs to the cover name only.
- **Don't** add a paper photo-texture, a cream or parchment ground, or a warm lamplight
  cast. This paper is cool and slightly blue.
- **Don't** add elevation tiers or hover lifts. Nothing in the opening floats except the
  menu.
- **Don't** add a second motion moment. The stamp press is the one authored animation, and
  it fires on the act of stamping, not on render.
- **Don't** introduce a type size between the four steps, or a fluid `clamp()` on type.
- **Don't** ship English in the interface, and don't ship invented household data as real —
  sample content states that it is sample content.
