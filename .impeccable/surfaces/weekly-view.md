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

## 3. Selected direction — Os Módulos (replaced A Caderneta, 2026-08-25)

The notebook world was rejected by the owner. The week now lives in the **Os Módulos**
world (seed 08e5058a; rules in DESIGN.md): each day is a floating white module on the
porcelain ground, laid in a responsive grid (`auto-fill, minmax(19rem, 1fr)`), with
"Esta semana" (undated) as one more module at the end. Today's module carries an inset
ring in the week's iris hue and an "hoje" pill — light, never a border color change of
meaning. Entries are rows of type and space (`.fila`): author dot-chip in the member's
ink, autosized text, tabular time on the right, a round check (`Visto`) for tasks, a
kebab menu for move/delete. A blank row with a plus glyph closes every module — writing
in it creates the entry, exactly the old behavior. Page header: display title, week
interval, and the pill week navigator.

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
