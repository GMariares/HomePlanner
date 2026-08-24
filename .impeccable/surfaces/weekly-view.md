---
version: 1
slug: "weekly-view"
primary_target: "weekly view"
related_targets: []
---

# Surface brief — Weekly view

Mode: **Operate.** The visitor completes a task; scanability, consistency and the real
usage scene outrank expression. Brand lives in precise details.

## 1. Job and audience

The household's shared answer to "what is this week?" — every member, every commitment,
every meal, every dated obligation on one surface.

Two arrivals, one surface:

- **Phone, 7:40am, one hand, sunlight on the screen.** Three seconds. What is today,
  what is next, who needs to be where. Reading.
- **Desktop, evening, seated.** Building the week — adding blocks, assigning people,
  moving things, planning meals. Writing.

The surface adapts its ambition to the device rather than shipping one compromise.

## 2. Outcome and proof

**Primary task:** understand the shape of the week in one glance, and change it without
leaving the screen.

**Success:** the family stops checking a separate calendar app. The week is settled here.

**Product-specific truth this surface proves:** the five areas share one household
context. Friday holds Mom's show *and* Friday's dinner *and* the school form that is
still not done — a calendar app cannot show that, because it only holds one of the three.

**Evidence:** none exists. All content on this surface is authored sample content until
the household enters its own; it must be recognizable as sample and never presented as
real household data.

## 3. Selected direction — A Caderneta

Chosen by the user over the assigned roll (Ementa da Semana) and over the category
standard. Its familiarity was disclosed at selection and accepted.

**Visual authority:** the Portuguese school agenda — ruled week-per-opening, printed day
headers, ballpoint, red margin rule, the teacher's *Visto* stamp, sewn gutter, ribbon
marker. The world is pinned; its softest rendition is not. Cream, parchment and
lamplight are out of scope — the caderneta's real paper is cool and slightly blue-grey,
and its covers are saturated.

**Structural thesis — printed versus written.** The application's structure is *printed*:
day headers, rules, labels, tabs, all fixed and authoritative. The family's content is
*ink*: saturated ballpoint ultramarine, sitting on the rule. Two registers that never mix.
This one rule carries the whole identity and needs no ornament to do it.

**Colour strategy: full palette, four named roles** — printed (cool paper ground and pale
rules), written (ballpoint ultramarine, carrying every entry and therefore a large share
of the surface), correction (margin red), acknowledged (stamp violet). A saturated cover
colour dresses the shell and tabs. Light ground is binding, forced by the 7:40am kitchen:
the primary register must survive direct sunlight.

**Typography — no handwriting face anywhere.** The written register is carried by ink
colour, weight and the baseline sitting on the rule, never by a script font; a
handwriting face here is costume and costs legibility on the one device that matters
most. Printed register: a sturdy European grotesque or schoolbook serif, set in caps with
wide tracking for day headers. One contained exception: the household's own name on the
cover may be set in a real hand, as a name label on a school book is.

**Focal moment:** today. The ribbon marker and today's ruled block lead the phone
viewport; the rest of the week runs below it.

**Signature interaction:** you write on the line. There is no edit mode — every entry is
editable exactly where it sits. Moving an item to another day strikes it through and
rewrites it on the new line, keeping the history visible the way a real agenda does.

**Cross-surface reach** (why this world survives the whole product, not just this screen):
finance becomes the ruled ledger opening; meals are written into the week; the shopping
list is the tear-out page; and the personal information holder is the identity page at
the front of the agenda — which is literally what a school caderneta's first pages carry:
name, blood type, emergency contacts.

**Raises carried from the directions the roll declined** — disciplines, not clothes,
carried forward openly rather than silently dropped when the pick won:

- *Scale courage (from Alphabet Storm):* day names and each day's lead entry are set at
  poster scale, not UI-label scale.
- *Specimen discipline (from Bitmap Specimen):* four type sizes with wide jumps and
  nothing in between. No smooth ramp.
- *One object (from HyperCard):* reading and writing are two modes of the same thing —
  the origin of the no-edit-mode rule above.

**Honest risk:** the ruled agenda is where nearly every planner app already lives. This
direction earns its place only through the printed/written split and the no-edit-mode
rule. Executed as a soft notebook theme with a script font and a paper texture, it
collapses into the category default and the choice was wasted.

## 4. Scope and boundaries

**In scope:** the weekly view as a production-ready screen at both device postures —
events and blocks, dated tasks, and the week's meals; reading, adding, editing, moving,
completing; empty and dense states.

**Out of scope, and untouched:** the meal planner itself and shopping-list generation;
the finance area; the personal records page; authentication and household setup;
navigation shell beyond what this screen needs to sit in.

**Anti-goals:** an hour-grid week calendar; a script/handwriting typeface; paper
photo-texture; a separate edit mode; gamification of household chores; any invented
household data presented as real.

## 5. States and ranges

Density is confirmed **light: up to about ten entries per week.** Design for that and
survive more.

- **Typical:** 1–2 entries on most days; two or three days empty.
- **Empty day:** ruled and waiting. Not a void, not an illustration, not "Nothing
  planned!" — the rules are simply clear. This is the state the direction was chosen for.
- **Empty week (first run):** the opening exists, printed and ruled, before any content.
- **Busy day:** 5+ entries — must degrade honestly rather than scroll-trap the phone.
- **Overflow:** an entry with a long title must not reflow the day's structure.
- **Moved / completed / cancelled:** struck through and rewritten; stamped; struck.
  State restyles the line in place and never removes it silently.
- **Loading, offline, and save failure:** the household relies on this at 7:40am with bad
  kitchen signal. Offline read is a requirement, not a nicety.

## 6. Interaction and layout

- **Week-per-opening.** Desktop is a true two-page opening with a centre gutter — the
  week divided across it, the week's undated list on the right. Phone collapses the
  opening into a vertical run of ruled days; the gutter becomes the section break.
- **The rule is the row.** Every day renders its rules regardless of content.
- **The red margin is the status gutter** — today's marker, and what is still unfinished.
- **Attribution:** each household member is identifiable at a glance without reading.
  Exact mechanism is open (see below) — colour is the obvious candidate but must not be
  the *only* channel.
- **Completion is a stamp**, not a checkbox.
- **Motion:** minimal and paper-honest. Nothing slides that a page would not.
- **Responsiveness:** phone-first for reading, desktop-first for planning; both are
  primary, neither is the fallback.

## 7. Constraints and open decisions

**Binding:** React + Vite + TypeScript + Tailwind over Supabase with row-level security;
installable PWA; euro and Portuguese conventions (dd/mm/yyyy, comma decimal,
Monday-first weeks); interface language Portuguese (pt-PT) throughout; multi-user
household from the first screen.

**Accessibility:** touch targets sized for one-handed use in motion; contrast validated in
direct sunlight, not on a desk monitor; person attribution must not rely on colour alone.

**A builder must not invent these — they are open:**

- Whether children have their own accounts, and whether their view differs.
- The night register (the 22:00 desktop session). A dark mode is plausible as the cover
  inverted, but it is not decided here.
- Whether the week's meals appear as full entries or as a distinct band per day.
- Recurring entries: how the school-year rhythm is expressed and edited.
- Real household member names, real commitments, real anything.
