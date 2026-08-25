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

## 3. Selected direction — Os Módulos (replaced Tira da semana, 2026-08-25)

The page keeps its two-part anatomy but in the **Os Módulos** world: on wide screens a
2fr/3fr grid — "Os jantares" (leaf hue) beside "A lista" (honey hue) — and stacked in
work order on the phone. The seven dinners are horizontal pastilles in a scrollable
strip; the open day swells below with the dish search, the book's suggestions as icon-tile
rows, and the chosen dish's ingredients as editable rows. The list is rows with a round
check on the left, name with provenance meta beneath, a quantity column that measures
itself in ch against the longest quantity (a cut number is the wrong purchase), an
optional price, and both totals. Bundles are chips. All the hardened behaviors —
autocomplete with remembered quantity/price, Tab-keeps-the-row, hide-bought, quantity
merging, coalesced realtime, retry strips — carried over unchanged.

## 4. Scope and boundaries

**In scope:** the seven dinners; the dish book with ingredients; the week's shopping list
with quantities, ticking, manual items, and carry-forward of what was not bought.

**Out of scope:** almoço, pequeno-almoço and lanche — the user chose jantar only; recipes,
methods, portions or nutrition; splitting the list by shop; the finance and records areas.

**Anti-goals:** a recipe app; cards as the page structure; a modal for picking a dish; a
separate edit mode for ingredients; any invented dish or family data presented as real.

## 4b. Writing the list is the work

Real use showed the list was the slow, fragile part, so the draft row carries the
weight of this surface:

- **Tab moves along the row** — name, quantity, price — and never closes the line. It
  used to commit on blur, which meant tabbing filed the item without its quantity and
  the quantity you typed next landed on the following line.
- **Enter closes the line and leaves the cursor ready for the next one.** Escape clears
  the draft.
- **The house remembers.** Every line written teaches a pantry (`artigos`), learned by a
  database trigger rather than by anyone maintaining it. Typing suggests what this house
  buys, most-bought first; choosing one fills the usual quantity and price. Typing a
  known name and leaving quantity blank borrows the remembered one.
- **Bundles** (`conjuntos`) are things bought together — "Pequeno-almoço". One press adds
  them all, skipping anything already on the list. They live in *O livro* alongside the
  dishes, because a homeless feature is the mistake this project already made once.
- **Price is optional and per household**, off by default. When on, the row gains a price
  column and the list gains a total of what is still to buy — counting only lines that
  carry a price, and saying so.

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

**Removing a dish does not rewrite the past.** Dinners already marked keep the name that
was written, because that is what was eaten; only the dish leaves the book. The confirmation
says so, in the line itself rather than in a modal.

**Open, and not to be invented:** whether the pantry should ever be prunable by hand;
whether a price should be remembered per shop; whether the list should group by shop or aisle;
whether a dish should carry portions that scale its quantities; whether past weeks' lists
stay readable or are archived.
