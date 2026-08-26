---
target: the finance section
total_score: 26
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 4
timestamp: 2026-08-26T18-34-15Z
slug: src-componentes-financas-tsx
---
⚠️ DEGRADED: single-context (session policy forbids the Agent tool unless the user requests it; A and B ran sequentially in one context)

Target: `src/componentes/Financas.tsx` and the modules it composes · Mode: Operate
Evidence: 6 live screens at 1440 and 390 (month, year, first run, no-budget), keyboard/contrast/target probes, `detect.mjs` over `src/`.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Pace, counts and banners excellent — but with no ceilings the summary reports a false "+1054,79 € acima do previsto" |
| 2 | Match System / Real World | 3 | Household vocabulary throughout; native date field renders `08/26/2026` beside `26/08` dates in the same view |
| 3 | User Control and Freedom | 2 | No undo anywhere; a 90-line import cannot be undone despite the `importacoes` table existing for it |
| 4 | Consistency and Standards | 3 | One component serves both natures; two disclosure idioms (envelope chevron inline, dobra chevron leading) |
| 5 | Error Prevention | 2 | Bad amount silently disables the button with no message; duplicate category names and shadowing supplier keys pass |
| 6 | Recognition Rather Than Recall | 3 | "chave" — the concept that makes auto-filing work — lives only inside a collapsed module |
| 7 | Flexibility and Efficiency | 2 | No shortcut to the amount field; date eats 4 tab stops; no search/filter/bulk edit in a 400-movement month |
| 8 | Aesthetic and Minimalist Design | 3 | 9 modules, 2966px on a phone; 1299,79 € appears twice under two labels 250px apart |
| 9 | Error Recovery | 2 | Optimistic deletes not rolled back on failure; row vanishes, banner 3000px away |
| 10 | Help and Documentation | 3 | Every module explains itself in one line; nothing explains compromissos, which have no creation UI |
| **Total** | | **26/40** | **Acceptable — significant improvements needed** |

## Design Specificity Verdict

Strongly authored, not category-interchangeable: the pace corridor with tolerance and no verdict before day 7; "faltam"/"passou"/"certo no tecto"/"não conta"; the summed-ceiling rule with its stated reason; the supplier learning loop. The exception is the newest element — "O mês, em três números" is the most interchangeable piece (actual-vs-planned with a green/red delta is every budgeting app's opener) and has the worst failure mode.

Deterministic scan: 7 findings across `src/`, all advisory drift in the shared world, none in the finance components — `design-system-font-size 0.6875rem` (modulos.css:102, 659, 989 — an undocumented 5th type step), `design-system-radius` (index.css:80, modulos.css:242, :507), and one warning, `design-system-font` at modulos.css:507 (the mono stack on `.faixa code`, legitimate but undeclared). Underneath all seven: DESIGN.md is one documenter pass behind and describes no envelope, pace, three-number or dobra component.

Visual overlays: not attempted — no user-visible browser is exposed in this remote session. Full-page captures and scripted DOM probes used instead.

## Overall Impression

The month view is close to genuinely good; two things hold it back — one wrong, one misplaced. Wrong: the three numbers pass judgement using an estimate they don't have, hardest in the state every new house starts in. Misplaced: the summary took the position the phone needs for the register. The page contains its own counter-example — "sem orçamento posto · ponha um tecto nas categorias" sits 250px below "+1054,79 € acima do previsto" in red.

## What's Working

- The summed ceiling is a real idea, executed: 700 + 120 makes Casa 820, the parent field is taken away, and the reason is stated in the drawer.
- The nature-aware envelope: one component, two economies, only the words change.
- Copy that carries the model — the interface teaches its own accounting one line per module.

## Priority Issues

[P0] The summary judges on an estimate it doesn't have. With no ceilings — every house's first month — `previstoSaida` collapses to the compromissos alone: "Saiu 1299,79 € · previsto 245,00 € · +1054,79 € acima do previsto" in red, and a net computed against -245,00 €. Fix: gate each number on whether its estimate is real, not on whether it is zero; costs judge only when orcamentoTotal > 0, the net only when both sides do. → /impeccable harden

[P1] The phone's primary action is below the fold. At 390×844 `.registo-valor` sits at y=917, behind 567px of summary and 250px of pace. Fix: CSS `order` under the 47.99rem breakpoint — register, pace, summary. → /impeccable adapt

[P1] The year view shows no year on a phone. The table opens on the name column and sticky Total with all twelve months scrolled out, Média hidden, clipped header glyphs left as debris, and no scroll affordance. Fix: a real phone year view (12 micro-bars per row, or a month strip). → /impeccable adapt

[P1] The yearly average divides by the wrong denominator. `mesesDecorridos` counts calendar months, not months with data: four months of 847 €/month average to 424. Fix: divide per row by months with movement, or add a second, correctly-scoped average. → /impeccable harden

[P1] `--c-lista` as body text fails contrast at 3.24:1 — `.balanco-aviso` and `.importar-alocar`, both bypassing the world's own `--cor-texto` derivation. → /impeccable audit

## Persona Red Flags

Alex (power user): no search/filter/sort in a 400-movement book; no bulk edit though PorAlocar proves the batching pattern; no shortcut to the amount field; date costs 4 tab presses; instant delete with no undo.

Jordan (first-timer): opens to a red verdict they did nothing to earn; "tecto", "previsto", "chave", "compromisso" undefined, and the module that would explain the last two is collapsed; "Já prometido" is read-only with no way to create a compromisso; no save confirmation on a ceiling edit.

Sam (a11y): every control has an accessible name, aria-expanded is wired on both disclosures, Enter opens an envelope, focus ring is a real 2px token. Fails: "lembrar" target 68×17 (under 24px); bars carry no aria equivalent for degree; the "não guardado" banner is 3000px away with no focus move or live-region priority.

Diogo (project persona, supermarket queue): must scroll past two reporting modules to type an amount; sees `08/26/2026` in the register while the book below reads `26/08`.

## Cognitive Load

3 of 8 fail — moderate. Single focus ✗ (primary task below the fold on mobile). Visual hierarchy ✗ (three modules at equal weight; 1299,79 € twice under two labels). Minimal choices ✗ (3 sides + up to 12 root chips + subcategory chips at the primary action). Passing: chunking, grouping, one-thing-at-a-time, working memory, progressive disclosure.

Emotional journey: peak at the import ("90 para entrar · 13 arrumam-se sozinhas"); valley at the first month, currently the worst-designed state rather than the most cared-for; good ending on two quiet collapsed drawers.

## Minor Observations

- `-245,00 €` uses a hyphen-minus while the register's sign glyph is a true minus — two minus signs on one page.
- The pace bar renders an empty grey track when no budget exists.
- First-run copy says "uma dúzia de categorias"; the seed is now 15 including income and transfers.
- The first-run screen shows the Mês/Ano toggle, which leads to an empty year.
- 11px (0.6875rem) is a de-facto sixth type step in three places.
- The year table's Média header cell still renders on mobile though the column is hidden, leaving a clipped glyph.
- `Comprometido` is entirely read-only, yet feeds the "previsto" the summary judges against.

## Questions to Consider

- Why does the summary get to judge on day 1 with no budget when the pace refuses to?
- One page that reorders, or two entry points — register-first phone, report-first desk?
- What would it take for a row of twelve numbers to show its own shape without becoming a chart?
- What if setting a ceiling started from what they actually spent, rather than an empty field?
