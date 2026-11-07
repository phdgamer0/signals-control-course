# Authoring guide — lesson modules

This is the contract for writing a lesson module. Read it fully before writing.

## Files you own (module NN)

| File | Purpose |
|---|---|
| `src/lessons/mNN/index.mdx` | The lesson itself (Markdown + JSX + `$…$` LaTeX) |
| `src/lessons/mNN/widgets.tsx` | Module-specific diagrams/circuits/interactive widgets (TSX), imported by `index.mdx` |
| `src/lessons/mNN/formulas.ts` | Formula-reference entries for this module (`Formula[]`, see `src/data/formulaTypes.ts`) |
| `docs/manifest/mNN.md` | Source-traceability checklist for this module (format below) |

Do not edit any other file. If a shared component is genuinely missing something, build what you need locally in `widgets.tsx` (you can compose the shared primitives) and mention it in your final report.

## Audience and voice

- Written in **English**; Turkish terms from the notes appear beside English ones: `<Term en="Stability" tr="Kararlılık" />` (inline) or in `<Def term="…" tr="…">`.
- The reader is technically capable, comfortable with algebra, but meets control systems for the **first time**. Intuition first → then mathematics → then show how the maths expresses the intuition. Concrete physical examples (a room heater, a car, an RC circuit) beat abstract wording.
- Never skip algebra steps. If a step needs an identity (Euler, partial fractions, a trig identity, L'Hôpital…), state the identity briefly right before using it.
- Not academic, not padded. Clear, direct, warm.

## Source fidelity (critical)

- The professor's handwritten notes are the curriculum. The transcript for your module (path given in your brief) is a faithful page-by-page transcription; the page images are also available. When the transcript is ambiguous, look at the page image.
- Cover **every** topic, definition, formula, derivation, figure, circuit and example in the source. Do not add curriculum that isn't in the notes (no Routh–Hurwitz, root locus, Bode, Mason's rule, state space… unless the notes contain it). Clarifying mathematics needed to understand the notes is fine.
- Preserve the professor's notation (e.g. ξ for damping ratio if the notes use ξ, $m$ for overshoot, $y(t)$ vs $c(t)$, $T(s)$ for the closed-loop TF).
- Where the professor made a slip (flagged as [NOTE] in the transcripts), present the correct mathematics and add an `<Uncertain>` or `<Note title="Correction to the notes">` box saying what the notes say, what is correct and why — so the student is not confused when comparing.
- Put `<Src p="7" />` (page of this module's PDF) next to definitions, key formulas, figures and examples that come from the notes. Use `<Src p="3" l="02" />` to cite another lecture.
- Professor's examples: `<Example title="…" src="7">` (src = page). Additional examples you create: `<Example title="…">` (no src) — the UI labels them "Additional teaching example".

## Required lesson structure (adapt headings to the material)

Use `##` for main sections (they appear in the sidebar) and `###` for subsections (they appear in the right-hand outline). Headings become anchor ids automatically (GitHub slug style), so keep them reasonably short and unique within the module.

1. `## What is this about?` — the problem the topic solves, why an engineer needs it, what it lets us predict, physical interpretation, a concrete example before terminology, and "after this module you can…".
2. Content sections following the order of the notes. For each formula: show it, explain every symbol, what it computes, why it exists, where it comes from (full derivation when it follows from the material), assumptions, physical meaning, when/how to use it.
3. Graphs: reproduce every graph in the notes with real plotted functions (`<Plot>`), explain axes, curves, initial/final behaviour, key points, how parameters change it, connection to the equation, **how to sketch it by hand in an exam**.
4. Circuits: draw every circuit with `Circuit` primitives; explain components, laws (KVL/KCL/element laws), how the equations → differential equation → transfer function → behaviour chain works (only as far as the notes go).
5. Worked examples: all of the professor's examples, solved step by step with `<Step>`s, plus several additional examples per technique (varying numbers, different cases from the notes, a common-mistake example, a harder one within the curriculum). Each: given, asked, method & why, substitution, every intermediate calculation, result in `<Answer>`, interpretation, a sanity check.
6. Edge cases that the material actually involves (zero/limiting parameters, sign changes, repeated roots, improper TFs, where a theorem doesn't apply…), explaining why the result changes.
7. `## How to solve exam problems` (or per-technique `<Procedure>` boxes): recognising the problem type, typical givens, what is asked, method choice, step list, common mistakes (`<Mistake>`), verification, variations.
8. `## Practice exercises` — at the end, 10–20 exercises (more for big modules) mixing kinds: `concept`, `formula`, `calc`, `graph`, `circuit`, `problem`, `prof` (based on professor's example), `edge`. Difficulty `level={1|2|3}`. Every exercise has a `<Solution>` with final answer, full derivation, every calculation, reasoning, and a verification. Optional `<Hint>`. Exercise **titles must be unique within the module** (they become ids). Questions must be answerable from the notes' material only.

Depth matters more than brevity. A big module (03, 07) will be long — that is expected. No placeholders, no "coming soon", no TODOs.

## MDX syntax rules (read carefully — violations break the build)

- Inline math `$…$`, display math on its own lines:
  ```
  $$
  T(s)=\frac{Y(s)}{R(s)}
  $$
  ```
  Leave a blank line before and after `$$` blocks.
- Outside math, `{`, `}`, `<` and `>` are JSX syntax. Never write them in prose. Write "t > 0" as `$t>0$`. For a literal brace in prose use `\{`... simpler: put it in math.
- Components with Markdown content need **blank lines** between the opening tag, the content, and the closing tag:
  ```
  <Note>

  Text with $x$ and **bold**.

  </Note>
  ```
  A single short line is OK inline: `<Hint>Compare with $\frac{1}{\tau s+1}$.</Hint>`.
- Do not indent Markdown inside components by 4+ spaces (it becomes a code block). Keep content flush-left.
- JSX attribute values are plain strings — no LaTeX rendering inside attributes except where noted (Plot labels, `label` props in diagrams are rendered by KaTeX). In JS expressions inside `{…}` remember backslashes must be escaped (`'\\tau'`) or use `String.raw`.
- `<Term>` and `<Src>` are self-closing.
- Use `\,`, `\cdot`, `\dfrac` freely; KaTeX supports `\begin{aligned}`, `\begin{cases}`, `\boxed{}`, `\underbrace{}`, `\overbrace{}`, `\cancel{}`. Macros `\L` (= \mathcal{L}) and `\Li` (= \mathcal{L}^{-1}) exist. Use `\xi` if the notes use ξ.
- Use decimal points in English text (0.8) but you may mention the notes' comma notation once (0,8).
- Tables: GFM tables work; math inside cells is fine.
- Import widgets at the top: `import { RCStep, StepExplorer } from './widgets'`.

## Global components (available in MDX without import)

| Component | Use |
|---|---|
| `<Term en tr />` | Inline English term + Turkish |
| `<Def term tr>…</Def>` | Definition box |
| `<Intuition>`, `<Note title?>`, `<Tip title?>` (exam tip), `<Mistake title?>`, `<Uncertain title?>` | Callouts |
| `<Procedure title>` + ordered list | Exam solving recipe |
| `<KeyFormula title?>` + `$$…$$` | Highlighted key result |
| `<Src p l? />` | "Source: Lecture NN, p. X" tag |
| `<Example title src?>` with `<Step title?>` children and `<Answer>` | Worked example (steps auto-numbered) |
| `<Exercise title kind level>` with problem text, optional `<Hint>`, required `<Solution>` | Practice question with hidden answer |
| `<Figure caption>` | Wrapper for any custom SVG |
| `<Plot …/>` | SVG function plot (see below) |
| `<Explorer params title>{(p) => …}</Explorer>` | Sliders + render prop (better defined in widgets.tsx) |
| `<Readout rows={[['t_s', 4]]} />` | Table of computed values (keys are LaTeX; values number or LaTeX string) |
| `<SPlane poles zeros range lines caption />` | s-plane with × poles / ○ zeros |
| `<M>`, `<MD>` | Inline / display math from a string (in TSX). In MDX prefer `$`. |

### Plot (`src/components/Plot.tsx`)

```tsx
<Plot
  x={[0, 10]}            // x range
  y={[0, 1.2]}           // optional y range (auto otherwise)
  xLabel="t (s)" yLabel="y(t)"
  series={[{ fn: t => 1 - Math.exp(-t), label: 'y(t)' }, { fn: t => t, label: 'tangent', dash: true },
           { points: [[0,0],[1,1]], label: 'data' }, { points: [[0,1]], stem: true, label: 'δ(t)' }]}
  hlines={[{ y: 1, label: 'y_{ss}=1' }]}   // labels are LaTeX
  vlines={[{ x: 1, label: '\\tau' }]}
  points={[{ x: 1, y: 0.632, label: '0.632' }]}
  bands={[{ y1: 0.98, y2: 1.02 }]}         // e.g. ±2% band
  title="…" height={300}
/>
```
Impulses: draw as a `stem` series (or points + a note). Colours default to a palette; pass `color` to match a meaning consistently.
Use real functions so the graph is mathematically exact. In MDX, `fn: t => …` arrow functions work inside `{…}` but complicated plots are cleaner as named exports in `widgets.tsx`.

### Circuits (`src/components/Circuit.tsx`)

```tsx
import { Circuit, R, C, L, V, I, Sw, W, Dot, Port, Gnd, T, Arrow, Vlabel } from '../../components/Circuit'
<Circuit w={360} h={200} caption="…">
  <V x1={40} y1={160} x2={40} y2={40} label="V_s" plus="b" flip />  {/* + at (x2,y2) */}
  <W p={[[40,40],[100,40]]} />
  <R x1={100} y1={40} x2={200} y2={40} label="R" />                 {/* label above (horizontal) / right (vertical); flip to swap */}
  <C x1={280} y1={40} x2={280} y2={160} label="C" />
  <L x1={…} … label="L" />
  <Arrow x={240} y={40} dir="r" label="i(t)" />                     {/* current direction */}
  <Port x={330} y={40} />                                           {/* open terminal */}
  <Vlabel a={[330,62]} b={[330,140]} label="v_o(t)" side="r" />     {/* + at a, − at b */}
  <Dot x={280} y={40} /> <Gnd x={160} y={160} /> <T x={…} y={…} t="Z_C = \frac{1}{sC}" />
</Circuit>
```
Two-terminal parts need axis-aligned endpoints; body is centered, leads fill the rest (R body 44, L 48, C 12, sources 36 — leave room). Labels are LaTeX. Pass `iec` on `<Circuit>` for box resistors if the professor draws boxes. Match the professor's topology, polarities, current directions and labels exactly.

### Block diagrams (`src/components/BlockDiagram.tsx`)

```tsx
import { BD, Block, Sum, Line, Pick, Lbl } from '../../components/BlockDiagram'
<BD w={520} h={170} caption="…">
  <Lbl x={30} y={50} t="R(s)" />
  <Line p={[[55,70],[146,70]]} />                 {/* arrow at end */}
  <Sum x={160} y={70} signs={{ l: '+', b: '-' }} />  {/* r = 14 */}
  <Block x={305} y={70} t="\frac{1}{\tau s}" w={90} h={48} />   {/* centered at x,y */}
  <Pick x={420} y={70} />                         {/* take-off point */}
  <Line p={[[420,70],[420,140],[160,140],[160,85]]} />
</BD>
```
Arrow lines should end at the edge of the target (block edge = x ± w/2, sum edge = ±14). `Node`/`Branch` exist for signal-flow graphs (only if the notes have them).

### Interactive widgets

Make interactions that genuinely help: e.g. slide τ and see a first-order response; slide ξ, ω_n and watch the step response and pole positions move together; move a zero and see overshoot change; change R, C and see the RC charging curve. Build them in `widgets.tsx` with `Explorer` + `Plot` + `SPlane` + `Readout`. Compute values with the same formulas taught in the lesson and show them in a `Readout`. Do not build gratuitous widgets.

### TSX conventions

- `import { tex } from '../../lib/tex'` gives `tex` = `String.raw` for LaTeX strings in TSX.
- Keep widgets small and typed; no new dependencies.

## formulas.ts

```ts
import type { Formula } from '../../data/formulaTypes'
import { tex } from '../../lib/tex'
const formulas: Formula[] = [
  {
    id: 'closed-loop-tf',
    name: 'Closed-loop transfer function (negative feedback)',
    tr: 'Genel transfer fonksiyonu',
    tex: tex`T(s)=\frac{C(s)}{R(s)}=\frac{G(s)}{1+G(s)H(s)}`,
    vars: ['$G(s)$ — forward-path transfer function', '$H(s)$ — feedback-path transfer function'],
    conditions: 'Single loop with negative feedback; for positive feedback the sign becomes $1-GH$.',
    section: 'negative-feedback',        // heading slug in index.mdx (lowercase, spaces → '-', punctuation removed; non-ASCII letters kept)
    example: 'ex-deriving-the-closed-loop-transfer-function',  // 'ex-' + slugify(example title) — see src/lib/slug.ts
    page: '7',
    key: true,                            // ≤ 6 per module appear in the lesson sidebar
  },
]
export default formulas
```
Cover every important formula of the module (typically 8–25). `section` must match a real `##`/`###` heading id: GitHub-slugger rules — lowercase, remove punctuation except `-` and spaces, spaces → `-` (e.g. "Negative feedback: C/R" → `negative-feedback-cr`). Prefer simple ASCII headings so slugs are predictable. `example` ids use `slugify` from `src/lib/slug.ts` (Turkish letters transliterated, non-alphanumerics → `-`, max 60 chars) prefixed with `ex-`.

## docs/manifest/mNN.md

```
## Module NN — <PDF file name>

| Page | Item | Type | Website location | Status |
|---|---|---|---|---|
| 1 | Definition of … | definition | § What is a control system? | ✅ explained |
| 3 | Fig: open-loop block diagram | diagram | § Open-loop systems (BD reconstructed) | ✅ reconstructed |
| 6 | Example: RC circuit step response | example (prof) | § … → Example "…" | ✅ solved & verified |
| 14 | Final answer missing e^{-t} | correction | § … Note box | ✅ corrected & flagged |

Additional teaching examples: N · Exercises: N
Uncertain items: …
```
Types: topic, definition, formula, derivation, graph, circuit, diagram, example (prof), remark, correction. One row per item — every item in the transcript's summary inventory must appear. Mark ✅ only for items actually incorporated.

## Verification before you finish

1. `node scripts/check-mdx.mjs src/lessons/mNN/index.mdx` — must print OK.
2. `node scripts/check-katex.mjs src/lessons/mNN` — must report no errors.
3. `npx tsc --noEmit -p .` — no errors in **your** files (other modules may be mid-edit by other writers; ignore their errors).
4. Independently verify every numerical result in examples and exercises (node or `python3 -I` with the standard library — numpy/sympy are not installed). Check partial-fraction coefficients by recombining, check time responses at t=0 and t→∞ against the initial/final value theorems, check plotted curves pass through the stated points.
5. Do **not** run `npm run build`, `npm run dev`, or start servers (other writers are working concurrently; the integrator builds).
