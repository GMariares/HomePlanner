---
name: HomePlanner
description: The house seen from above — porcelain ground, floating white modules, one hue per area of family life.
colors:
  porcelana: "#f2f0ea"
  modulo: "#ffffff"
  tinta: "#1c1b20"
  tinta-2: "#696456"
  tinta-3: "#6f6a5c"
  linha: "#e7e4da"
  perigo: "#b4432c"
  iris: "#5561b8"
  folha: "#467a52"
  mel: "#b9862c"
  terracota: "#bd5f3a"
  azulejo-verde: "#2f7e78"
  pai: "#3f57ad"
  mae: "#336f50"
  filha: "#7a51a8"
  groselha: "#c0566e"
  canela: "#a0682c"
  ameixa: "#7a5bb5"
  faianca: "#4a7fa8"
  malva: "#a65a86"
  azeitona: "#7d7a4a"
  pinho: "#3e8560"
  pedra: "#75705f"
typography:
  display:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.125rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  strong:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "0.01em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.85em"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "normal"
  micro:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.01em"
rounded:
  medidor: "3px"
  aro: "4px"
  codigo: "6px"
  linha: "8px"
  campo: "12px"
  tile: "16px"
  modulo: "24px"
  pilula: "999px"
spacing:
  meio: "4px"
  u: "8px"
  u15: "12px"
  u2: "16px"
  u25: "20px"
  u3: "24px"
  u4: "32px"
  u6: "48px"
components:
  modulo:
    backgroundColor: "{colors.modulo}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.modulo}"
    padding: "20px"
  modulo-hover:
    backgroundColor: "{colors.modulo}"
  tile:
    textColor: "{colors.tinta}"
    rounded: "{rounded.tile}"
    size: "40px"
  pilula:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.modulo}"
    typography: "{typography.body}"
    rounded: "{rounded.pilula}"
    padding: "12px 24px"
  pilula-hover:
    backgroundColor: "#33323a"
  botao-texto:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-2}"
    typography: "{typography.label}"
    rounded: "{rounded.campo}"
    padding: "4px 6px"
  botao-texto-hover:
    textColor: "{colors.tinta}"
  chip:
    textColor: "{colors.tinta}"
    typography: "{typography.label}"
    rounded: "{rounded.pilula}"
    padding: "7px 12px"
  campo-escrita:
    backgroundColor: "#f6f5f5"
    textColor: "{colors.tinta}"
    typography: "{typography.body}"
    rounded: "{rounded.campo}"
    padding: "12px 16px"
  campo-escrita-focus:
    backgroundColor: "{colors.modulo}"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-2}"
    typography: "{typography.body}"
    rounded: "{rounded.pilula}"
    padding: "8px 14px"
  nav-item-active:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.modulo}"
  visto:
    backgroundColor: "{colors.modulo}"
    rounded: "{rounded.pilula}"
    size: "28px"
  fila:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    typography: "{typography.body}"
    padding: "10px 0"
    height: "40px"
  tira-celula:
    backgroundColor: "#f7f7f6"
    textColor: "{colors.tinta}"
    rounded: "{rounded.tile}"
    padding: "10px"
    width: "96px"
  tile-pequeno:
    textColor: "{colors.tinta}"
    rounded: "{rounded.campo}"
    size: "36px"
  selo:
    backgroundColor: "#f5f4f4"
    textColor: "{colors.tinta-2}"
    typography: "{typography.label}"
    rounded: "{rounded.pilula}"
    padding: "4px 10px"
  medidor:
    backgroundColor: "#f0efee"
    rounded: "{rounded.pilula}"
    height: "6px"
  medidor-fino:
    backgroundColor: "#f0efee"
    rounded: "{rounded.pilula}"
    height: "4px"
  barra-do-ano:
    backgroundColor: "#f6f5f5"
    rounded: "{rounded.medidor}"
    height: "32px"
  codigo:
    backgroundColor: "#f1f0f0"
    textColor: "{colors.tinta}"
    typography: "{typography.mono}"
    rounded: "{rounded.codigo}"
    padding: "1px 5px"
---

# Design System: HomePlanner

## Overview

**Creative North Star: "Os Módulos"**

The house seen from above. The application is a warm porcelain floor, and resting on
it are white modules — one for each area of family life. A module is never a label
with an arrow into somewhere else; it is the thing itself, showing its own live data
at the size the data deserves. Tonight's dinner is a headline you read from across
the kitchen. The list is three real items and a count. Today's schedule is three real
lines with real times. A parent should get dinner, the list and the day in about three
seconds, and one tap should swell any module into its full page.

The character is calm, warm and modern-consumer: soft porcelain rather than cold grey,
generous 24px corners, true offset shadows that put the modules a few millimetres above
the floor, one geometric sans in the full range from 200 to 800, and black ink pills
for the actions that matter. Colour is not decoration here — it is the address system.
Each of the five areas of the house owns a hue (week iris, menu leaf, list honey, book
terracotta, finances tile-green), and every tint that area needs is derived from that
one hue by a single formula. Nothing in this system is a pastel someone picked by eye.

What it refuses is as fixed as what it does. It refuses the notebook metaphor and every
paper simulation that came with it. It refuses the single-list template where five
different jobs get the same row. It refuses the card-inside-a-card: once you are inside
a module, hierarchy is made of type and space, never of another box. It refuses coloured
borders as state — a selected, current or open thing announces itself with light and
lift, not with a ring. And it refuses borrowed pictures: every icon is drawn in this
repository in a single 1.8 stroke, with no emoji, no icon library and no photography.

**Key Characteristics:**

- Porcelain ground (#f2f0ea) with pure white modules floating on it — one ground, one surface, no third plane.
- One hue per area of the house; all four of its working tints derived from that hue by one `color-mix` formula.
- Manrope alone, 200–800, in five size steps — four for reading and one constrained micro rung; the hierarchy is carried by weight and space, not by more sizes.
- 8px governs every gap, every padding and every radius.
- Numbers are tabular and right-aligned, everywhere, without exception.
- State is a colour wash plus a raised shadow — never a border colour.
- Drawn-in-house icons: 24×24 box, 1.8 stroke, round caps and joins.
- One expansion gesture per module.
- A hue is never text at full strength: text on a category colour is derived, not raw.
- A module decides its own columns from its own width, not from the width of the screen.
- Nothing judges without a real number behind it: no verdict from a partial estimate.

## Colors

A warm, low-chroma palette: a single porcelain floor, white modules, near-black ink, and
five saturated hues that never appear at full strength except as the action itself.

### Primary

- **Tinta** (#1c1b20): The near-black with a trace of violet in it. This is the writing
  ink of the whole product and the fill of every pill that acts — the primary button, the
  current navigation item, the brand tile on the sign-in card. It is the only true
  "primary" in the Material sense: everything else is either ground, surface, or an
  area's own hue.

### Secondary

The five area hues. Each one is set on a container as `--cor` and then the formula does
the rest; the hue at 100% is reserved for the action itself (a filled check, the "hoje"
badge), never for large fills.

- **Íris** (#5561b8): The week. Day modules, the today badge, the schedule dot column.
- **Folha** (#467a52): The menu and dinners. The dinner module on Início, the dinner strip, the dish tiles.
- **Mel** (#b9862c): The shopping list. List module, set chips, the checks in the aisle.
- **Terracota** (#bd5f3a): The book of dishes and its pantry.
- **Azulejo-verde** (#2f7e78): Finanças, present and designed while still "em breve".

### Tertiary

The pens. Each household member writes in their own colour, and that colour appears as a
6–8px dot beside their line and as the tint of their author tag.

- **Pai** (#3f57ad): 6.6:1 on a white module.
- **Mãe** (#336f50): 6.0:1.
- **Filha** (#7a51a8): 5.9:1.
- **Todos** (#1c1b20): unattributed entries write in house ink.

### Neutral

- **Porcelana** (#f2f0ea): The one floor. Page background, browser theme colour, scrollbar track. Warm, never blue-grey.
- **Módulo** (#ffffff): Pure white. The only thing that floats on the floor, plus the popovers and the sign-in card.
- **Tinta secundária** (#696456): Supporting prose — page subtitles, module notes, secondary buttons at rest. Tinted from the floor rather than a pure grey; 5.2:1 on porcelain.
- **Tinta terciária** (#6f6a5c): Metadata and placeholders only — timestamps, counts, "e mais 9…", disabled controls. 4.7:1 on porcelain, 5.4:1 on a module.
- **Linha** (#e7e4da): Hairline dividers between rows inside one module. Deliberately rare.
- **Perigo** (#b4432c): Destructive text buttons, invalid field rings, and the inline confirmation wash. Never a background fill.

### Category Palette

The finance section lets a household invent its own categories, and each one owns a hue
drawn from a fixed palette so a new envelope never arrives in a colour the world doesn't
speak. Eight beyond the five area hues, all at the same low chroma:

- **Groselha** (#c0566e): health and anything that reads as care.
- **Canela** (#a0682c): eating out.
- **Ameixa** (#7a5bb5): leisure.
- **Faiança** (#4a7fa8): clothes; the first hue offered to a new envelope.
- **Malva** (#a65a86): personal care.
- **Azeitona** (#7d7a4a): animals.
- **Pinho** (#3e8560): the second hue offered to a new income line.
- **Pedra** (#75705f): the catch-all — "Outros", "Sem categoria", and transfers between
  the household's own accounts, which are deliberately the quietest thing on the page.

### Named Rules

**The Derived Tint Rule.** A hue is a surface colour, never a text colour. Text that must
carry a category's identity takes `color-mix(in oklab, var(--cor) 78%, var(--tinta))` —
the same 78% the `.com-cor` formula already mixes. Measured on white, raw honey (#b9862c)
reaches 3.2:1 and fails; the derived tint reaches 4.7:1 and passes. If a label needs to be
the colour of its module, it goes through the formula or it does not go.

**The One Formula Rule.** Any element carrying `.com-cor` declares a single `--cor` and
receives its whole family by derivation: tile at 14% over white, chip at 8% over white,
pressed at 20% over white, text at 78% over ink — all mixed in OKLab. No tint in this
system is hand-picked. Change the area's hue and every surface, chip, wash and label in
that area moves with it. A new pastel typed in by hand is a bug, not a variant.

**The Legible Pen Rule.** Every member ink and every chip label carries a measured
contrast ratio, not an eyeballed one. The pens were deepened until each cleared 4.5:1 at
body size on a white module, and the chip label takes more ink than `--cor-texto` does
(42% hue into ink, not 78%) because the lighter mix sat at 3.7:1 on its own chip. If a
colour cannot be read at 15px, it does not ship at 15px.

**The One Ground Rule.** There is exactly one floor and one surface. Porcelain is the
only background of the application; white is the only thing that rests on it. There is
no third plane, no tinted section band, no grey card behind a group of cards.

## Typography

**Display Font:** Manrope (variable 200–800, self-hosted, with `ui-sans-serif, system-ui, sans-serif` behind it)
**Body Font:** Manrope — the same family
**Label/Mono Font:** Manrope; a system mono stack (`ui-monospace, SFMono-Regular, Menlo`) appears only inside the `<code>` spans of developer-facing warning strips

**Character:** One geometric humanist sans doing the whole job, with the full weight axis
open. The voice is in the jumps — 800 against 500 in the same size reads as two different
things, and it never introduces a second personality the way a font pairing would. Tight
negative tracking on the big sizes (−0.03em on display) gives the headlines a modern
consumer-app compactness; body sits at normal tracking and 1.45 line-height for reading
at arm's length.

### Hierarchy

- **Display** (800, 2.125rem / 34px, 1.05, −0.03em): The greeting, the page title, and the
  single hero value inside a bento module — tonight's dinner, the number that matters.
  Drops to 1.75rem below 768px. Clamps to three lines and wraps anywhere rather than
  overflowing.
- **Title** (800, 1.5rem / 24px, −0.02em): The sign-in card heading and the running totals
  at the foot of the list. Drops to 1.375rem below 768px.
- **Strong** (800, 1.125rem / 18px, −0.01em): The first thing read in a row or a header —
  the house name in the top bar, a day's name, the chosen dish, the household code.
- **Body** (500 at rest, 700 for the name in a row, 0.9375rem / 15px, 1.45): Everything
  else. Prose blocks are held to about 46ch.
- **Label** (700–800, 0.75rem / 12px, +0.01em): Field names, counts, metadata, chips, text
  buttons, the day badge. Sentence case; uppercase appears only on the marker word of a
  developer-facing warning strip.
- **Micro** (700–800, 0.6875rem / 11px, +0.01em): The constrained rung. Thumb-bar labels,
  the "hoje" badge, the calendar feed address. Never body, never a value the household has
  to compare, and never reached for because something did not fit — only where nothing
  else can.
- **Mono** (500, 0.85em, system stack): A literal the household must copy or type exactly —
  a migration filename, a subscription address — inside a 6% ink wash at 6px radius. It is
  the one place a second family appears, and it is there because the characters have to be
  unambiguous, not because the content is technical.

### Named Rules

**The Five Steps Rule.** There are five type sizes and nothing between them — 11, 12, 15,
18, 24, plus 34 for display. Four of them are for reading. The fifth, 11px, is a
constrained rung and needs a reason a designer would accept: five thumb-bar labels that
must fit across a 390px phone, the "hoje" badge, a subscription URL that has to be read
once and copied. If a new element seems to need a size that is not on this list, the
answer is a weight change or a space change, not a new size. Two steps shrink on mobile;
the rest hold, because 15px body at arm's length is already the floor.

**The One Family Rule.** One family carries the entire product. Emphasis is weight (500 →
700 → 800), never italic, never a second face, never letter-spaced small caps standing in
for a heading.

**The Tabular Number Rule.** Every number the household reads or compares is
`font-variant-numeric: tabular-nums` and right-aligned in its column: quantities, prices,
times, totals, dates, the household code. A quantity that shifts sideways as it is typed
is a quantity the eye has to re-find.

## Layout

The application is a shell (`.concha`) at `min-height: 100dvh` with a top bar, a page, and
a navigation that changes place. Everything is centred inside a **75rem (1200px)** maximum
with 24px side gutters on desktop and 16px on mobile — the top bar, the page and the
warning strips all share that one measure so nothing steps out of the column.

**The unit.** `--u: 0.5rem` (8px) is the module of the whole layout. Every padding, gap,
inset and radius in this system is a multiple of it: half (4), one (8), one-and-a-quarter
(10), one-and-a-half (12), two (16), two-and-a-half (20 — a module's own padding), three
(24), four (32 — the sign-in card), six (48 — the page's bottom air).

**The bento.** Início is a grid: two columns below 1024px, four above, with a 16px gutter.
Three modules span two columns (`.bento-2`) so dinner leads at double width and the list
and the day sit beside it; the book and Finanças take one column each. Every grid child is
`min-width: 0` so long dish names ellipsize instead of blowing the column out.

**The week packs itself.** The seven day modules are laid out with CSS columns at a 19rem
column width rather than a grid, so a short Tuesday tucks under a short Monday instead of
leaving a band of porcelain the height of the tallest day. Reading order runs down each
column, like a paper week sheet.

**Two-pane pages.** Above 1024px, Ementa splits 2fr / 3fr (dinners left, list right) and
Livro splits 3fr / 2fr (dishes left, pantry right), both `align-items: start` so one pane
does not stretch to match the other. Below 1024px they stack.

**Responsive behaviour.** The single breakpoint that reshapes the product is **48rem
(768px)**: above it the navigation is a row of pills in the top bar and the page reserves
no bottom space; below it the pills move to a fixed, blurred, translucent thumb bar at the
bottom of the screen, gaining icons and losing size, and the shell reserves 80px plus the
safe-area inset so nothing ever ends underneath it. `scroll-padding-bottom` matches, so a
field scrolled into view never lands behind the bar. **64rem (1024px)** is the second
breakpoint and only widens grids.

**Page entrance.** A page arrives with a 360ms rise (10px up, fade in) on the `--mola`
curve. Under `prefers-reduced-motion: reduce` that animation is removed and every
transition and animation in the product collapses to 0.01ms.

### Named Rules

**The Eight Rule.** 8px rules every gap, every padding and every radius. A value that is
not a multiple of 8 needs a reason written next to it; the only standing exceptions are
hairlines, the 2px focus and check rings, and the 6–8px author dot.

**The Unclipped Quantity Rule.** A truncated quantity is a wrong purchase. The quantity
column in the shopping list measures itself in `ch` against the longest value present —
with tabular numerals 1ch is one digit — clamped between 48px and 11rem, so it opens for
"500 g + 2 un" and closes again when the list is all "2 un". It is the item name, never the
number, that gives up the width.

## Elevation & Depth

This system is lifted, not flat and not layered. Modules sit a few millimetres above the
porcelain on genuinely offset, softly blurred shadows — the shadow falls downward and is
tinted with the ink colour rather than pure black, so it reads as light in a warm room
rather than as a grey halo. There are exactly two elevations and the second one is a
*state*: at rest a module carries the low shadow; on hover, when it is today, or when a
popover needs to sit above everything, it carries the high one.

### Shadow Vocabulary

- **Módulo** (`box-shadow: 0 10px 30px -18px rgb(28 27 32 / 0.22), 0 1px 2px rgb(28 27 32 / 0.05)`):
  The resting elevation of every module, the week navigation pill group, and an opened
  dinner pastille. Two layers — a wide soft drop and a hairline contact shadow.
- **Alta** (`box-shadow: 0 18px 44px -20px rgb(28 27 32 / 0.30), 0 2px 4px rgb(28 27 32 / 0.06)`):
  Hover on a touchable module, today's day module, floating popovers (the account panel,
  the suggestion list), and the sign-in card, which is permanently at this level because
  nothing else is on screen with it.

### Named Rules

**The Light-and-Lift Rule.** State is light and elevation, never a border colour. Today's
day module raises to the high shadow and takes a soft gradient wash of its own hue from
the top edge down to white at 42% — plus a small filled "hoje" pill to say the rest in
words. An earlier version of this ringed the module in its hue; the ring was removed
because a coloured outline reads as an error state and as a card-inside-a-card at the same
time. Selection, currency and openness are all expressed the same way: more colour, more
lift.

**The True Shadow Rule.** Shadows are offset and blurred, never a symmetric glow. A
`box-shadow` with a zero y-offset spreading evenly in all directions is a halo, and this
world does not have haloes. The only zero-offset shadows in the system are `inset` rings —
the 2px focus ring on a field and the 2px aro of an unchecked check — which are strokes
drawn inside the shape, not elevation.

## Shapes

Everything is a soft rectangle or a full pill; there are no sharp corners anywhere in the
product and no decorative shapes at all.

**The radius ladder scales with the container.** A module takes 24px (20px on mobile,
where it is physically smaller); an icon tile,
popover, dinner pastille or inline confirmation takes 16px; a field, a text button, a menu
item, a book row and the small 36px tile inside an envelope take 12px; a list-row inline
input takes 8px; an inline code span takes 6px; the focus ring rounds at 4px; the 23px
bars of the year strip take 3px. The rule is proportional: the bigger the thing, the rounder
the corner, so a small chip inside a big module never looks like a scaled-down copy of it
— and a bar so small that 8px would round it into a lozenge takes 3px instead, because a
lozenge would falsify the height that is the whole point of the bar.

**Pills are for things that act or that name a state.** Full 999px radius marks the
primary button, the navigation items, the chips, the author tags, the "hoje" badge, the
week navigation buttons, the check circle, and the author dot. If it is round-ended, you
can press it or it is telling you what something currently is.

**Meters are pills, bars are rectangles.** A meter that fills left to right — the pace of
the month, an envelope, one of its parts — is a 999px track with a 999px fill, 6px tall
(4px for a part). A bar that encodes height in a series — the twelve months of the year
strip — is a small rectangle at 3px, because round ends on a short bar read as a value the
bar does not have.

**Borders are almost absent.** There is one hairline in the system — `1px solid #e7e4da`
between consecutive rows inside a module, at the top of a totals row, and along the top of
the mobile thumb bar. Nothing else has a border. Fields have no border at all: they are a
5% ink wash on white that deepens on hover and turns white with a 2px inset ink ring on
focus.

**Icons have one geometry.** Every icon is drawn on a 24×24 viewBox at 1.8 stroke width
with round caps and round joins, filled only where a shape is genuinely solid (the three
dots of an overflow menu, a fish's eye). Rendered at 20px by default, 16–18px inside rows
and fields, and 14px inside the small tiles of an envelope or a year row.

### Named Rules

**The No Card In A Card Rule.** A module never contains another surface. Inside it,
hierarchy is made of type, weight, space and — sparingly — one hairline. A grouped set of
rows indents by half a tile (24px) to show it belongs to the row above; it does not get a
background, a border or a shadow of its own.

## Components

### Buttons

- **Shape:** Full pill (999px) for the primary; 12px for text and icon buttons.
- **Primary — Pílula:** Ink fill (#1c1b20) with white label, 800 weight at body size,
  12px × 24px padding. This is the one button that commits: sign in, create account,
  resend. There is never more than one on a screen.
- **Hover / Active / Disabled:** Hover lightens the ink 14% toward white; active scales to
  0.97; disabled drops to 45% opacity and stops the scale. All transitions are 160ms on
  `--mola`.
- **Text button (`botao-texto`):** Label-size, 800 weight, secondary ink, no background.
  Negative margins pull its padding back so the label still aligns optically with the text
  around it. Hover paints a 6% ink wash and darkens to full ink. The danger variant swaps
  the ink for #b4432c and washes 8% of it on hover — text only, never a red fill.
- **Icon button (`botao-gelo`):** 32×32, 12px radius, transparent, tertiary ink. Hover
  washes 7% ink and darkens; active scales to 0.94. Used for the overflow menu on a row
  and for the account button in the top bar.

### Chips

- **Style:** Pill, no border, background `--cor-chip` (the area hue at 8% over white),
  label at 12px / 800 in a deeper mix of the same hue (42% hue into ink). A trailing count
  in 700 weight and a slightly lighter mix rides inside the same chip.
- **State:** Hover deepens the background to `--cor-premido` (20%); active scales to 0.96;
  disabled falls back to a 4% ink wash with tertiary ink. Chips are actions here — a set of
  shopping items to pour into the list — not filters, so there is no selected state.

### Cards / Containers

The module is the only container in the system.

- **Corner Style:** 24px, 20px below 768px.
- **Background:** Pure white on the porcelain floor. Today's module additionally takes a
  vertical wash of its own hue from the top edge to white at 42%.
- **Shadow Strategy:** Resting `--sombra-modulo`; `--sombra-alta` on hover and for today.
- **Border:** None.
- **Internal Padding:** 20px (2.5 × unit) on all sides.
- **Touchable variant:** The whole module is a `<button>` — see The One Gesture Rule.
  Hover lifts it 2px and raises the shadow; press scales it to 0.985 and drops the shadow
  back down, so it presses into the floor. A module that has no destination yet (Finanças)
  keeps the shape and drops all of the motion.

### Inputs / Fields

- **Style:** No border. A 5% ink wash on white at 12px radius, 12px × 16px padding, body
  size at 600 weight. Field names sit above in label size / 800 / secondary ink.
- **Focus:** Background goes pure white and a 2px inset ink ring is drawn inside the shape.
  Nothing moves and nothing glows.
- **Hover / Error:** Hover deepens the wash to 7%. `aria-invalid` swaps the inset ring for
  the danger colour.
- **Search variant:** The same field with 44px of start padding and a drawn magnifier in
  tertiary ink placed inside it.
- **Household code variant:** 0.35em tracking, uppercase, 800 weight, tabular figures — it
  is read aloud and copied by hand.
- **Inline writing (`escrita`):** Where the family writes into a row, the field is
  invisible until touched: no background, inherits the row's own type, and paints a 5% ink
  wash on hover / 7% on focus. It is always `box-sizing: border-box` because the auto-grow
  measurement adds its own padding on every pass otherwise.

### Navigation

- **Style:** Five destinations, always all five — Início, Semana, Ementa, Livro, Finanças —
  in that order, with Finanças present and designed while it is still "em breve".
- **Desktop (≥768px):** A row of pills in the top bar, body size at 700 weight, secondary
  ink, no icons. Hover paints a 6% ink wash; the current page is a solid ink pill with
  white label. Press scales to 0.97.
- **Mobile (<768px):** A fixed bottom thumb bar — 92% white with a 14px backdrop blur and a
  single hairline on top — where each item stacks a drawn icon over an 11px / 700 label and
  the current page keeps the same solid ink pill. It respects `env(safe-area-inset-bottom)`
  and the shell reserves its height so no content ends beneath it.

### The Módulo (signature)

The defining component. A module is a self-contained white surface that shows one area's
real data at reading size: an icon tile in the area's hue, a title, a right-aligned count
or status in the metadata ink, and then either a display-size hero value (tonight's
dinner), a sample list of up to three real rows, or one plain sentence of empty state. It
is never a label with an arrow. Its empty state is a sentence inside the module, never a
separate empty screen.

**The One Gesture Rule.** A module has exactly one opening gesture, not a dust of little
buttons. On Início the entire module is the button and tapping anywhere in it swells the
area into its full page. Inside a page, the same rule holds one level down: a dinner
pastille opens the day, a book row opens the dish, a row's overflow menu is the single
extra affordance and it lives in one place at the end of the row.

### The Visto (signature)

The check that a shopping item gets. A 28px circle drawn as a 2px inset ring in the
module's hue at 38% over white; hover takes the ring to full hue; pressed scales to 0.9.
Checked, it fills with the hue at full strength and the drawn tick scales up from 0.5 into
place over 220ms. Completing an item plays a single 320ms overshoot to 1.12 — the one
flourish in the product, and it is spent on the moment a thing leaves the list. The hit
area extends 8px beyond the circle in every direction via a pseudo-element, so the target
is 44px in the supermarket aisle while the drawing stays 28px.

A completed row strikes through in the area's hue at 55% opacity and drops both the name
and the number to tertiary ink — and because the family's text lives in inline fields, the
strike is applied to the field itself, skipping fields still showing their placeholder.

### Rows (`fila`)

- **Structure:** A 40px-minimum flex row — check or tile, then a body column of name over
  metadata, then the numeric columns right-aligned, then the overflow button.
- **Separation:** A single hairline between consecutive rows. No background, no radius, no
  padding box: this is where The No Card In A Card Rule is enforced.
- **Mobile:** The overflow button leaves the flow entirely, absolutely positioned at the
  end of the row and revealed only on `:focus-within`, so it never takes width away from a
  quantity or a price.
- **Chosen:** Where rows can be picked in bulk, the check drops the row's own hue and
  wears the danger colour — choosing what to delete is one action, not one per category —
  and the row takes a 6% danger wash. The per-row overflow menu withdraws while choosing,
  so there is only one way to act at a time.

### The Tira (signature)

The week's dinners as a horizontal strip of seven pastilles, 96px wide each, at 16px
radius on a 4% ink wash, showing the abbreviated day, the date in tabular figures, and the
dish clamped to two lines with a reserved 2.6em minimum so the strip never jitters as
dishes are chosen. Hover tints to the chip mix; today carries the chip tint at rest; the
open day fills with the tile tint and lifts onto the resting module shadow. The strip
scrolls horizontally with its scrollbar hidden and a 32px mask fade at the trailing edge —
and it carries 48px of trailing padding so the fade never bites the last pastille when you
reach the end.

### The Pista (signature)

The month's pace. A single 16px track at full pill radius holds two marks: a **corridor**
— a 12% ink wash between two 1.5px rules, sitting where an even spend rate would put the
household today, with a tolerance band either side — and the **fill**, the tile-green
amount actually spent, turning danger red only once it passes the whole budget. Above the
track sits the spent figure at display size with "de {budget}" beside it in strong; below
it a pill-shaped **selo** carries the verdict in words — *a bom ritmo*, *acima do ritmo*,
*ainda é cedo para dizer* — each with its own 10–14% wash and 78–80% derived text.

The pace is built to refuse a verdict it cannot support. It covers variable envelopes
only, so the rent landing on the 8th cannot make a Tuesday look lost; it says nothing at
all before day 7; and with no ceiling anywhere it drops the track entirely and says *sem
orçamento posto*, because an empty meter is a control pretending to have data.

### The Envelope (signature)

A category and its month, as a row that opens. Closed: a 36px tile at 12px radius, the
name with a chevron, the amount right-aligned at 800 tabular, a 6px meter, then a foot
line carrying the editable ceiling and the movement count. Open: the same row with a
drawer below it holding the name field, the category's parts — each with its own ceiling,
count and 4px meter — an inline row to add another part, and the month's movements.

Three rules hold it together. **The ceiling belongs to whoever has it:** a burst parent
never paints a healthy part red, so the state that colours a meter and its words is
computed per envelope and per part, not inherited. **A parent with priced parts is the
sum of its parts:** set 700 on rent and 120 on power and the parent reads 820 and stops
being editable, because two numbers claiming to be the same envelope is how a spreadsheet
starts lying. And **the same component serves both economies:** an income envelope is the
identical drawing with different words — *pôr uma previsão*, *faltam*, *20,00 € acima* —
and above target is folha green, never danger.

The grid decides its own columns with a container query at 34rem, not a media query: the
narrow column of a two-column page is wide on a 1440px screen and still narrow, and a
viewport-based rule truncated "Ordenado" to "Ord…" inside it.

**The Consequence Rule.** Registering a gasto is not a number changing — the envelope
takes the blow, and that visible consequence is the whole reward for having registered.
The tile flashes its category hue with a white icon for 700ms, the total counts to its new
figure over 450ms, the ceiling line counts with it so the two numbers never contradict
each other mid-flight, and the stretch of meter between where the bar was and where it
landed lights up at 40% hue and settles. That lit stretch is the only thing on the screen
that says *how much*. None of it ever fires on mount: a page that opens shows its numbers
already true.

### The Balanço (signature)

The month in three numbers — in, out, left — as one module of three columns divided by
hairlines, never three cards. Each column is a label, the real figure at display size, the
estimate beneath it, and the difference spelled out with its sign and its meaning
(*+16,00 € acima do previsto*). Colour follows the words and never leads: above is folha
green on income and danger on spending, because the same arithmetic means opposite things
on the two sides. On a phone the three columns become three stacked rows and the dividing
hairline moves from the side to the top.

**The No Verdict Without A Number Rule.** A column judges only when its estimate is real:
spending needs at least one ceiling set (committed bills alone are a part of a budget, not
a budget), the net needs both sides. Where the estimate is missing the column says what is
missing — *sem tecto posto* — and drops the difference line entirely rather than reporting
a difference against zero. A red verdict a household did nothing to earn is the fastest
way to teach it to stop reading verdicts.

### The Dobra

A module that opens, for the things consulted rather than asked: the month's book, the
supplier rules. Closed it is one line — the title as a button with a leading chevron, and
its count still on the right, so a shut drawer still informs. The chevron rotates 90° on
opening and the body arrives on the standard 240ms entrance. It is the same one-gesture
doctrine as the module itself, applied to a whole section.

### The Faixa do ano

The year on a phone. Fifteen columns cannot be scrolled sideways into sense on a 390px
screen — that layout opens on zero months — so below 48rem the year table is replaced,
not adapted: one faixa per category, with the name, the year total, twelve 23px bars whose
heights are relative to that row's own biggest month, the month initials beneath, and the
average across the months that actually had movement. The shape of the year reads at a
glance; the exact figure for one month lives in the month view, one tap away. Above 48rem
the table returns, with its first column and its Total column pinned.

The strip draws itself once per entry into the view: each bar rises from the baseline over
360ms, delayed by its **month** and not by its row, so the sweep runs along the axis of
time with every category moving at the same step — 22ms per month, capped at 260ms, about
620ms end to end. A per-row stagger would read as rows loading; this reads as the year
being drawn, which is what the axis means.

**The Honest Denominator Rule.** An average divides by the months a row actually had
movement, never by the months of the calendar. A household that starts in August has four
months of rent at 847 € and would read 424 — half, wearing the face of a right answer.

### Warning strip (`faixa`)

Developer- and operator-facing messages (missing configuration, a save that did not land)
sit in a full-measure strip above the page rather than in a coloured banner: a marker word
in 12px / 800 / uppercase in the danger colour, then the message in secondary ink at body
size, with any literal value in a small code span on a 6% ink wash. The calm variant drops
the marker to secondary ink. There is no box, no icon and no fill — the strip is type on
the floor.

## Do's and Don'ts

### Do:

- **Do** set a single `--cor` on a container and let the formula derive tile (14%), chip
  (8%), pressed (20%) and text (78%). Adding a new area means adding one hex, not five.
- **Do** keep every gap, padding and radius a multiple of 8px.
- **Do** make numbers tabular and right-aligned — quantities, prices, times, totals, dates,
  the household code.
- **Do** express state as a colour wash plus a raised shadow, and add a word (a "hoje" pill,
  a count) when the wash alone could be ambiguous.
- **Do** carry hierarchy inside a module with type, weight and space alone.
- **Do** measure a numeric column against its longest real value in `ch` when clipping it
  would change the meaning.
- **Do** draw new icons in `src/componentes/Icones.tsx` on the 24×24 box at 1.8 stroke with
  round caps and joins, matching the existing set.
- **Do** give every control its rest, hover, active, focus-visible and disabled states — the
  focus ring is a 2px ink outline at 2px offset, everywhere.
- **Do** animate a number only when it changes while someone is watching. On mount every
  figure is already its final value.
- **Do** reduce movement rather than erase it under `prefers-reduced-motion`: spatial
  motion goes, colour, opacity and a meter settling at 120ms stay, because a gesture that
  stops being confirmed loses information, not decoration.
- **Do** give a module exactly one opening gesture and make the whole surface the target.
- **Do** write empty states as one sentence inside the module.
- **Do** collect a repeated gesture into one. Where a list asks for the same press over and
  over — filing seventy statement lines — the choices are made down the list and a single
  floating action, rounded and shadowed so the list clearly passes beneath it, commits the
  batch. It exists only while it has something to do; a bar parked in a list is a divider
  pretending to be an action.
- **Do** ask once, in the line, before a destructive bulk action: the button becomes
  "Apagar 12" beside a "deixar estar" and a plain sentence saying there is no way back. No
  modal — the task needs a second thought, not a protected screen.
- **Do** run a hue through the 78% derivation before it becomes text. Raw honey on white is
  3.2:1; the derived tint is 4.7:1.
- **Do** let a module decide its own column count from its own width with a container
  query. The screen's width is not the module's width.
- **Do** compute a state — burst, reached, over, under — on the thing that has it, so a
  parent's condition never paints its children.
- **Do** say what is missing when a number has no estimate behind it, and show no
  difference at all rather than a difference against zero.

### Don't:

- **Don't** hand-pick a pastel. Any tint not produced by the formula is a defect.
- **Don't** put a card, a bordered box, a tinted panel or a second shadow inside a module.
- **Don't** use a border colour to signal state — no coloured rings on selected, current or
  open things.
- **Don't** ship a symmetric glow. Shadows are offset and blurred; zero-offset shadows are
  reserved for the inset focus and check rings.
- **Don't** introduce a second font family, an italic, or a sixth type size. Reach for
  weight or space instead — and the fifth step (11px) needs a constraint that a designer
  would accept, not a paragraph that did not fit.
- **Don't** use emoji, an icon library, or photography anywhere in the product.
- **Don't** put a third plane on the screen — porcelain floor, white module, nothing between.
- **Don't** scatter small buttons across a module to make it openable; one gesture, whole
  surface.
- **Don't** let a quantity, price or dish name that the household typed get clipped by a
  fixed-width column.
- **Don't** ship a full-screen empty state where a sentence inside the module will do.
- **Don't** put a button inside a button. The ceiling control lives beside the row that
  opens an envelope, not inside its target — nested buttons are invalid and the inner one
  stops being reachable by keyboard.
- **Don't** draw a meter with nothing to measure. No budget means no track, not an empty
  one.
- **Don't** deliver a verdict from a partial estimate. The pace refuses to judge before day
  7 and without a budget; every other number on the page owes the household the same
  discipline.
- **Don't** scroll a wide table sideways and call it responsive. If the first screen of a
  phone shows no data, the layout is replaced, not adapted.
