# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated to Impeccable, confirmed by the user. React + Vite + TypeScript + Tailwind
on the client; Supabase (Postgres, Auth, Row-Level Security) as the backend.

Chosen because the product is multi-user from day one and every record belongs to a
household rather than an individual — Postgres with RLS expresses that directly. Vite
over Next.js because nothing here needs server rendering or public indexing; this is a
private tool behind a login.

Delivered as an installable PWA so the same build serves phone and desktop. No app
stores, no second design language, no native client.

Deploy target: undecided.

## Users

One household, sharing one home and coordinating with each other. The confirmed
members are two parents and at least one school-age daughter. Every member is a real
user of the product, not a subject recorded inside it — this is multi-user from the
first screen, not a single-user tool with sharing added later.

Undecided: whether children get their own accounts, and whether roles or permissions
differ between parents and children.

## Product Purpose

HomePlanner is the family's single tool for running the household. It replaces the
scattered set of apps, notes, and shared-message threads a family otherwise uses to
answer: who is where, what do we owe, what are we eating, what do we still need to do,
and where is that number written down.

Success is that the family stops keeping household information anywhere else.

## Positioning

Most tools solve exactly one of these jobs. HomePlanner's mechanism is that the five
areas share one household context and feed each other: the week's chosen meals generate
the shopping list, a school obligation becomes both a task and a calendar block, a
recorded expense knows which supplier and which household item it belongs to.

A neighboring calendar app, budgeting app, or meal planner cannot truthfully claim that
connection, because it only holds one of the five.

## Operating Context

Two genuinely different sessions, and the product has to serve both honestly:

- **Phone, in motion.** Kitchen, school run, supermarket aisle, a few seconds at a time.
  Reading the week, ticking off a shopping item, logging an expense as it happens.
  Daily use, on both iOS and Android.
- **Desktop, seated.** Longer, deliberate work — reviewing and categorizing expenses,
  setting budgets, planning the week's meals. The finance work in particular was called
  out as belonging on a PC.

The household's rhythm is weekly (meal plan, shop) and annual (school year: enrolment,
meal plans, books), with money running continuously underneath both.

## Capabilities and Constraints

Five areas, all confirmed by the user:

1. **Scheduler.** Tasks and calendar blocks in one view, attributed to a family member.
   Examples given: take daughter to school; Dad away on a business trip; Mom has a show
   on Friday night. Multi-day and all-day blocks are first-class, not just point events.
2. **Finance manager.** Record expenses and incomes; budget against them. Expenses can
   be allocated to a specific item or category, and the supplier informs that
   allocation. This is the most data-intensive area and the one aimed at desktop.
3. **Meal planner.** Plan the week's meals, then derive a shopping list that covers all
   of them — the stated goal is to stop going to the grocery store every day. The list
   must also accept arbitrary non-meal items, so it is a real shopping list rather than
   a read-only output of the meal plan.
4. **Personal information holder.** Per family member: ID numbers, blood types, access
   codes and similar records.
5. **Tasks.** Standalone household to-dos that are not calendar events. Examples given:
   register daughter in the school meal plan; buy school books; fix the bathroom.

Households: a member belongs to one household at a time. A household is opened by
its first member and joined by the others with a six-letter code, deliberately
drawn from an alphabet without I, O, 0 or 1 because it gets read aloud and written
by hand. Everything written belongs to the household, not to the person who wrote
it; privacy between members is not implemented and remains an undecided product
question.

Locale: Euro, Portuguese conventions — `€`, dd/mm/yyyy, comma as decimal separator,
Monday-first weeks. Single currency; multi-currency was offered and not taken.

Interface language: **Portuguese (pt-PT)**. All labels, copy, dates and errors ship in
Portuguese; English appears nowhere in the interface.

Undecided: budgeting periods; whether the shopping list tracks quantities or only items.

Decided and closed (26/08/2026): income is modelled as its own envelopes with a monthly
forecast, mirroring the expense side. The shopping list and Finanças stay **unconnected** —
no automatic expense from a bought item, no price reconciliation, no shared totals. The
list belongs to the supermarket aisle and the accounts belong to the month; joining them
would put the list in the business of asking for accounts while someone is shopping.

## Brand Commitments

The name **HomePlanner**. The visual world is **Os Módulos** (chosen 2026-08-25,
replacing the earlier notebook world "A Caderneta", which the household owner
rejected): a soft modern consumer-app language — porcelain ground, floating white
modules, one hue per area of the house with every tint derived from it, Manrope,
drawn icon tiles, ink pill actions. Its craft bar is the class of current recipe
apps, Revolut/N26, and Airbnb. Icons are drawn in-house; no photography, no emoji.
Navigation is designed for five areas from day one — Início, Semana, Ementa, Livro,
Finanças — with Finanças present as a designed "em breve" until it is built.
DESIGN.md carries the system's rules; it wins on any visual question.

## Evidence on Hand

None. This is a greenfield repository with no product code, no content, no imagery, no
brand assets, and no real household data.

Future work must not fabricate: family member names beyond the roles stated above,
financial figures, suppliers, meals, testimonials, user counts, pricing, or any claim
about the product being in use. Where a screen needs sample content, it is sample
content and must be recognizable as such.

## Product Principles

1. **One tool, not five apps.** The connections between the areas are the product. A
   feature that cannot reach the household's other data is a missed opportunity, not a
   clean boundary.
2. **Both sessions are real.** Every surface must be honest about whether it serves the
   ten-second phone glance or the hour-long desktop sit. Designing for the average of
   the two serves neither.
3. **Capture must beat the workaround.** If logging an expense or adding a shopping item
   is slower than not doing it, the record rots and the tool dies. Entry friction is a
   product risk, not a polish detail.
4. **Shared by default.** This is a home, not a workplace. The default assumption is that
   household information is visible to the household; privacy between members is an
   exception that must be deliberate.
5. **It holds the family's real records.** ID numbers, money, and a child's schedule.
   Losing data or showing the wrong household's data is the one unrecoverable failure.

## Accessibility & Inclusion

No product-specific requirement was established. Standard practice applies: the product
is used one-handed on a phone, often in poor light or in motion, which makes touch
target size, contrast, and legibility at arm's length practical requirements rather than
compliance checkboxes.

Security posture was asked and answered: standard account-level security covers the
personal information holder. The user considered and declined a hardened vault
(masked values, re-auth to reveal, access auditing) for those records. Revisit only if
the user raises it.
