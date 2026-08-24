---
version: 1
slug: "ementa"
primary_target: "ementa"
related_targets: []
---

# Surface brief — Ementa e compras

Mode: **Operate.** Two tasks on one page: decide the week's dinners, and hold the list
that comes out of them.

## 1. Job and audience

The same household. Two scenes, both real:

- **Sunday, desktop.** Deciding what the family eats this week, so that one shop covers it.
- **Saturday, supermarket, phone, one hand.** Working down the list, ticking things off.

## 2. Outcome and proof

**Primary task:** plan seven dinners and walk out of the shop with everything they need.

**The mechanism this surface exists to prove:** the list is *derived*. Marking a dish on a
day puts its ingredients on the list. Changing your mind takes them off again. No other
area of HomePlanner can claim that, and neither can a standalone list app.

**Success:** the family stops going to the grocery store every day.

## 3. Selected direction — Tira da semana

The visual world is fixed (A Caderneta, see DESIGN.md). This is a composition decision only;
no durable system change. Chosen by the user from three dealt structures.

**Composition.** The week is a strip across the top — seven ruled cells, one dinner written
in each, the whole plan readable in a glance. Below it the shopping list takes the rest of
the page: ruled at the same pitch, quantity in the right-hand column where the week puts
times, a stamp field to tick each item off.

**Why this one earns its place:** it is the only dealt structure that is the same object on
both devices. In the aisle you hold the list with the plan above it.

**Dish book.** Writing in a day cell opens the house's dishes as an inline menu — the same
component the week uses for moving a line. Choosing one writes the dinner and drops its
ingredients into the list. The chosen dish's ingredients appear as ruled, editable lines
directly beneath the strip: reading and writing are one object, as everywhere else here.

**Honest risk, named at selection:** seven cells across a 390px phone is about 50px each.
Resolved by the strip becoming seven stacked rules on a phone rather than scrolling
sideways — horizontal scroll is the one thing the ruled page avoids everywhere else. The
strip is therefore *not* pixel-identical across devices; it is the same reading order.

## 4. Scope and boundaries

**In scope:** the seven dinners; the dish book with ingredients; the week's shopping list
with quantities, ticking, manual items, and carry-forward of what was not bought.

**Out of scope:** almoço, pequeno-almoço and lanche — the user chose jantar only; recipes,
methods, portions or nutrition; splitting the list by shop; the finance and records areas.

**Anti-goals:** a recipe app; cards as the page structure; a modal for picking a dish; a
separate edit mode for ingredients; any invented dish or family data presented as real.

## 5. States and ranges

- **Typical:** 5–7 dinners planned; a list of 15–30 items; a dish book of 20–30 dishes.
- **Empty book (first run):** no dishes at all. This is the hardest state and the one a new
  family meets first: writing a dinner must create the dish, not require one to exist.
- **Empty list:** ruled and waiting, like an empty day.
- **A day with no dinner planned:** the cell is ruled and blank. Normal, not an error.
- **Bought items:** struck in place, stamped. They stay on the page — the list keeps what
  happened.
- **Carried forward:** anything unbought from an earlier week appears in this week's list,
  marked as carried rather than silently merged.
- **Long names:** an item or dish name that does not fit wraps onto the next rule.

## 6. Interaction and layout

- The rule pitch is the unit here too. One item, one rule.
- **Ticking is the stamp**, in the same column and grammar as a completed task.
- **Provenance is printed:** an item that came from a dish carries that dish's name in the
  printed register. An item written by hand carries nothing.
- Removing a dinner withdraws only the ingredients that are still unbought and untouched.
  Anything bought or hand-edited stays and simply loses its link. Enforced in the database,
  because the dinner can also be deleted from the weekly view.
- **Navigation:** the cover carries printed tabs between *A semana* and *A ementa* — thumb
  tabs, in the printed register.

## 7. Constraints and open decisions

**Binding:** the recorded design system; Portuguese throughout; the household owns every
row; quantities are free text ("2 kg", "1 molho", "meia dúzia") because that is how they
are written by hand.

**Open, and not to be invented:** whether the list should ever group by shop or aisle;
whether a dish should carry portions that scale its quantities; whether past weeks' lists
stay readable or are archived.
