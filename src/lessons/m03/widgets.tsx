import { useState } from 'react'
import { Explorer, Readout } from '../../components/Explorer'
import { Plot, type Series } from '../../components/Plot'
import { SPlane, type PZ } from '../../components/SPlane'
import { MD } from '../../components/Math'
import { tex } from '../../lib/tex'

const exp = Math.exp
const cos = Math.cos
const sin = Math.sin
const SQ2 = Math.SQRT2
const SQ3 = Math.sqrt(3)
const deg = (d: number) => (d * Math.PI) / 180

/* ------------------------------------------------------------------ */
/* Basic signals (p1–p2 sketches)                                       */
/* ------------------------------------------------------------------ */

export function StepPlot() {
  return (
    <Plot
      title="Unit step u(t) — Birim basamak"
      x={[-1, 4]}
      y={[-0.2, 1.4]}
      height={220}
      xLabel="t"
      yLabel="u(t)"
      samples={1000}
      series={[{ fn: (t) => (t < 0 ? 0 : 1), label: 'u(t)', color: '#5eead4' }]}
      points={[{ x: 0, y: 1, label: '1' }]}
    />
  )
}

export function RampPlot() {
  return (
    <Plot
      title="Unit ramp r(t) — Birim rampa"
      x={[-1, 4]}
      y={[-0.3, 4]}
      height={220}
      xLabel="t"
      yLabel="r(t)"
      series={[{ fn: (t) => (t < 0 ? 0 : t), label: 'r(t) = t·u(t)', color: '#fbbf24' }]}
      points={[{ x: 1, y: 1, label: 'slope\\ 1' }]}
    />
  )
}

export function ImpulsePlot() {
  return (
    <Plot
      title="Unit impulse δ(t) — Birim impulse (arrow = area 1, not height 1)"
      x={[-1, 4]}
      y={[-0.2, 1.4]}
      height={220}
      xLabel="t"
      yLabel="δ(t)"
      series={[
        { fn: () => 0, label: 'δ(t) = 0 for t ≠ 0', color: '#93c5fd' },
        { points: [[0, 1]], stem: true, label: 'impulse of area 1 at t = 0', color: '#f9a8d4' },
      ]}
    />
  )
}

/** Narrow pulses of width ε and height 1/ε: all have area 1 and approach δ(t). */
export function ImpulseLimitExplorer() {
  return (
    <Explorer
      title="The impulse as the limit of ever-narrower pulses of area 1"
      params={[{ name: 'eps', label: '\\varepsilon', min: 0.1, max: 2, step: 0.05, value: 1, unit: 's' }]}
    >
      {({ eps }) => (
        <>
          <Plot
            x={[-0.5, 3]}
            y={[0, 10.5]}
            height={240}
            xLabel="t"
            yLabel="p(t)"
            samples={1400}
            series={[{ fn: (t) => (t >= 0 && t < eps ? 1 / eps : 0), label: 'pulse: height 1/ε, width ε', color: '#f9a8d4' }]}
          />
          <Readout
            rows={[
              ['\\text{height } 1/\\varepsilon', 1 / eps],
              ['\\text{area}', 1],
              [tex`\L\{p\}=\frac{1-e^{-\varepsilon s}}{\varepsilon s}\ \text{at } s=1`, (1 - exp(-eps)) / eps],
            ]}
          />
        </>
      )}
    </Explorer>
  )
}

/* ------------------------------------------------------------------ */
/* s-shift (multiplication by an exponential)                           */
/* ------------------------------------------------------------------ */

export function SShiftExplorer() {
  return (
    <Explorer
      title="Multiplying by e^(−at) damps the signal and shifts the poles left by a"
      params={[
        { name: 'a', label: 'a', min: -0.4, max: 2, step: 0.05, value: 0.5 },
        { name: 'w', label: '\\omega', min: 0.5, max: 6, step: 0.1, value: 3, unit: 'rad/s' },
      ]}
    >
      {({ a, w }) => {
        const yr: [number, number] = a < 0 ? [-3.5, 3.5] : [-1.25, 1.25]
        return (
          <>
            <Plot
              x={[0, 8]}
              y={yr}
              height={260}
              xLabel="t (s)"
              series={[
                { fn: (t) => sin(w * t), label: 'sin ωt  (poles ±jω)', color: '#64748b', width: 1.4 },
                { fn: (t) => exp(-a * t), label: 'envelope ±e^(−at)', color: '#fbbf24', dash: true, width: 1.5 },
                { fn: (t) => -exp(-a * t), color: '#fbbf24', dash: true, width: 1.5 },
                { fn: (t) => exp(-a * t) * sin(w * t), label: 'e^(−at) sin ωt', color: '#5eead4' },
              ]}
            />
            <SPlane
              range={Math.max(3, a + 1)}
              imRange={Math.max(4, w + 1)}
              size={260}
              poles={[
                { re: 0, im: w, label: 'j\\omega', color: '#64748b' },
                { re: 0, im: -w, color: '#64748b' },
                { re: -a, im: w, label: '-a+j\\omega', color: '#5eead4' },
                { re: -a, im: -w, color: '#5eead4' },
              ]}
              caption="Grey: poles of ω/(s²+ω²). Teal: poles of ω/((s+a)²+ω²) — every pole moved by −a along the real axis."
            />
            <Readout
              rows={[
                [tex`F_1(s)=\L\{\sin\omega t\}`, '\\frac{' + w.toFixed(1) + '}{s^2+' + (w * w).toFixed(2) + '}'],
                [tex`F(s)=F_1(s+a)`, '\\frac{' + w.toFixed(1) + '}{(s' + (a >= 0 ? '+' : '-') + Math.abs(a).toFixed(2) + ')^2+' + (w * w).toFixed(2) + '}'],
                ['\\text{poles}', (-a).toFixed(2) + '\\pm j' + w.toFixed(1)],
                [tex`\text{envelope at } t=2`, exp(-2 * a)],
              ]}
            />
          </>
        )
      }}
    </Explorer>
  )
}

/* ------------------------------------------------------------------ */
/* Time shift                                                            */
/* ------------------------------------------------------------------ */

export function TimeShiftExplorer() {
  const f = (t: number) => (t < 0 ? 0 : 1 - exp(-t))
  return (
    <Explorer
      title="Time shift: f(t − t₀)·u(t − t₀) ↔ e^(−s t₀)·F(s)"
      params={[{ name: 't0', label: 't_0', min: 0, max: 4, step: 0.1, value: 1.5, unit: 's' }]}
    >
      {({ t0 }) => (
        <>
          <Plot
            x={[-0.5, 9]}
            y={[-0.1, 1.15]}
            height={240}
            xLabel="t (s)"
            series={[
              { fn: f, label: 'f(t) = (1 − e^(−t))u(t)', color: '#64748b', dash: true },
              { fn: (t) => f(t - t0), label: 'f(t − t₀)u(t − t₀)', color: '#5eead4' },
            ]}
            vlines={[{ x: t0, label: 't_0' }]}
          />
          <Readout
            rows={[
              ['F(s)', tex`\frac{1}{s(s+1)}`],
              [tex`\L\{f(t-t_0)\}`, '\\frac{e^{-' + t0.toFixed(1) + 's}}{s(s+1)}'],
            ]}
          />
        </>
      )}
    </Explorer>
  )
}

/* ------------------------------------------------------------------ */
/* FVT failure illustrations                                             */
/* ------------------------------------------------------------------ */

export function FvtFailPlot() {
  return (
    <Plot
      title="Where the final value theorem lies"
      x={[0, 10]}
      y={[-1, 3]}
      height={260}
      xLabel="t (s)"
      series={[
        { fn: (t) => 1 - cos(2 * t), label: '1 − cos 2t  (poles ±j2: FVT would say 1)', color: '#fbbf24' },
        { fn: (t) => -5 + 5 * exp(t), label: '−5 + 5eᵗ  (pole +1: FVT would say −5)', color: '#fca5a5' },
        { fn: (t) => 0.5 * (1 - exp(-t) * (cos(SQ3 * t) - sin(SQ3 * t) / SQ3)), label: 'p7 example (LHP poles: FVT valid, 0.5)', color: '#5eead4' },
      ]}
      hlines={[{ y: 1, label: '\\text{FVT}=1\\ (\\text{wrong})' }, { y: 0.5, label: 'f(\\infty)=0.5' }]}
    />
  )
}

/* ------------------------------------------------------------------ */
/* p7 IVT/FVT example                                                    */
/* ------------------------------------------------------------------ */

/** f(t) for F(s) = (s+2)/(s(s^2+2s+4)): 0.5 − 0.5 e^{-t}(cos√3t − sin√3t/√3). */
export function P7IvtFvtPlot() {
  const f = (t: number) => 0.5 - 0.5 * exp(-t) * (cos(SQ3 * t) - sin(SQ3 * t) / SQ3)
  return (
    <Plot
      title="f(t) for F(s) = (s+2)/[s(s²+2s+4)] — starts at 0, settles at 0.5"
      x={[0, 7]}
      y={[0, 0.8]}
      height={240}
      xLabel="t (s)"
      series={[{ fn: f, label: 'f(t)', color: '#5eead4' }]}
      hlines={[{ y: 0.5, label: 'f(\\infty)=\\lim_{s\\to0}sF(s)=0.5' }]}
      points={[{ x: 0, y: 0, label: 'f(0^+)=0' }]}
    />
  )
}

/* ------------------------------------------------------------------ */
/* p14: as written vs corrected                                          */
/* ------------------------------------------------------------------ */

export function P14ComparePlot() {
  return (
    <Plot
      title="p14: the answer as written vs. the corrected answer"
      x={[0, 10]}
      y={[-0.8, 0.8]}
      height={250}
      xLabel="t (s)"
      series={[
        { fn: (t) => (exp(-t) * cos(t - deg(45))) / SQ2 - 0.5 * exp(-2 * t), label: 'correct: (1/√2)e^(−t)cos(t−45°) − ½e^(−2t)', color: '#5eead4' },
        { fn: (t) => cos(t - deg(45)) / SQ2 - 0.5 * exp(-2 * t), label: 'as written (no e^(−t)): never dies out', color: '#fca5a5', dash: true },
      ]}
      hlines={[{ y: 0, label: 'f(\\infty)=0' }]}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Partial-fraction / time-response viewer                               */
/* ------------------------------------------------------------------ */

interface Term {
  label: string
  fn: (t: number) => number
}
interface PFCase {
  key: string
  name: string
  F: string
  expansion: string
  ft: string
  Fs: (s: number) => number
  Fexp: (s: number) => number
  terms: Term[]
  extra?: Series[]
  poles: PZ[]
  range: number
  T: number
  y?: [number, number]
  ivt: string
  fvt: string
  note: string
}

const CASES: PFCase[] = [
  {
    key: 'p10',
    name: 'p10 · distinct real',
    F: tex`F(s)=\frac{s^2+2s+2}{(s+1)(s+2)(s-3)}`,
    expansion: tex`=\frac{-1/4}{s+1}+\frac{2/5}{s+2}+\frac{17/20}{s-3}`,
    ft: tex`f(t)=-\tfrac14 e^{-t}+\tfrac25 e^{-2t}+\tfrac{17}{20}e^{3t}`,
    Fs: (s) => (s * s + 2 * s + 2) / ((s + 1) * (s + 2) * (s - 3)),
    Fexp: (s) => -0.25 / (s + 1) + 0.4 / (s + 2) + 0.85 / (s - 3),
    terms: [
      { label: '−¼e^(−t)', fn: (t) => -0.25 * exp(-t) },
      { label: '⅖e^(−2t)', fn: (t) => 0.4 * exp(-2 * t) },
      { label: '(17/20)e^(3t)', fn: (t) => 0.85 * exp(3 * t) },
    ],
    poles: [
      { re: -1, im: 0, label: '-1' },
      { re: -2, im: 0, label: '-2' },
      { re: 3, im: 0, label: '3', color: '#fca5a5' },
    ],
    range: 4,
    T: 1.2,
    ivt: tex`\lim_{s\to\infty}sF(s)=1`,
    fvt: tex`\text{not valid (pole at }+3)`,
    note: 'The pole at s = +3 (right half-plane) produces a growing exponential that dominates everything. f(0) = −¼ + ⅖ + 17/20 = 1, as the initial value theorem predicts.',
  },
  {
    key: 'p12',
    name: 'p12 · repeated real',
    F: tex`F(s)=\frac{s+3}{(s+1)^3(s+2)}`,
    expansion: tex`=\frac{2}{(s+1)^3}-\frac{1}{(s+1)^2}+\frac{1}{s+1}-\frac{1}{s+2}`,
    ft: tex`f(t)=t^2e^{-t}-te^{-t}+e^{-t}-e^{-2t}`,
    Fs: (s) => (s + 3) / ((s + 1) ** 3 * (s + 2)),
    Fexp: (s) => 2 / (s + 1) ** 3 - 1 / (s + 1) ** 2 + 1 / (s + 1) - 1 / (s + 2),
    terms: [
      { label: 't²e^(−t)', fn: (t) => t * t * exp(-t) },
      { label: '−te^(−t)', fn: (t) => -t * exp(-t) },
      { label: 'e^(−t)', fn: (t) => exp(-t) },
      { label: '−e^(−2t)', fn: (t) => -exp(-2 * t) },
    ],
    poles: [
      { re: -1, im: 0, label: '-1\\ (\\times 3)' },
      { re: -2, im: 0, label: '-2' },
    ],
    range: 3,
    T: 10,
    ivt: tex`\lim_{s\to\infty}sF(s)=0`,
    fvt: tex`\lim_{s\to0}sF(s)=0`,
    note: 'A triple pole gives t²e^(−t), te^(−t) and e^(−t): the polynomial factors make the terms rise before the exponential wins. All four start-values cancel: f(0) = 0 + 0 + 1 − 1 = 0.',
  },
  {
    key: 'p14',
    name: 'p14 · complex + real',
    F: tex`F(s)=\frac{s+1}{(s+2)(s^2+2s+2)}`,
    expansion: tex`=\frac{-1/2}{s+2}+\frac{K}{s+1-j}+\frac{K^*}{s+1+j},\quad K=\tfrac{1}{2\sqrt2}\angle-45^\circ`,
    ft: tex`f(t)=\tfrac{1}{\sqrt2}e^{-t}\cos(t-45^\circ)-\tfrac12 e^{-2t}`,
    Fs: (s) => (s + 1) / ((s + 2) * (s * s + 2 * s + 2)),
    Fexp: (s) => {
      // K/(s+1-j) + K*/(s+1+j) = 2 Re{K/(s+1-j)} for real s, K = (1-j)/4
      const kr = 0.25
      const ki = -0.25
      const dr = s + 1
      const di = -1
      const den = dr * dr + di * di
      const re = (kr * dr + ki * di) / den
      return -0.5 / (s + 2) + 2 * re
    },
    terms: [
      { label: '(1/√2)e^(−t)cos(t−45°)', fn: (t) => (exp(-t) * cos(t - deg(45))) / SQ2 },
      { label: '−½e^(−2t)', fn: (t) => -0.5 * exp(-2 * t) },
    ],
    extra: [{ fn: (t) => cos(t - deg(45)) / SQ2 - 0.5 * exp(-2 * t), label: 'as written in notes (wrong)', color: '#fca5a5', dash: true, width: 1.4 }],
    poles: [
      { re: -2, im: 0, label: '-2' },
      { re: -1, im: 1, label: '-1+j' },
      { re: -1, im: -1, label: '-1-j' },
    ],
    range: 3,
    T: 10,
    y: [-0.8, 0.8],
    ivt: tex`\lim_{s\to\infty}sF(s)=0`,
    fvt: tex`\lim_{s\to0}sF(s)=0`,
    note: 'Complex poles −1 ± j → a cosine of frequency ω = 1 inside the envelope e^(−t). Without the e^(−t) (red dashed, as written on p14) the cosine would never decay — which contradicts the FVT value 0.',
  },
  {
    key: 'p15',
    name: 'p15 · completing the square',
    F: tex`F(s)=\frac{s+2}{s^2+2s+4}`,
    expansion: tex`=\frac{s+1}{(s+1)^2+(\sqrt3)^2}+\frac{1}{\sqrt3}\cdot\frac{\sqrt3}{(s+1)^2+(\sqrt3)^2}`,
    ft: tex`f(t)=e^{-t}\cos\sqrt3t+\tfrac{1}{\sqrt3}e^{-t}\sin\sqrt3t=1.155\,e^{-t}\cos(\sqrt3t-30^\circ)`,
    Fs: (s) => (s + 2) / (s * s + 2 * s + 4),
    Fexp: (s) => (s + 1) / ((s + 1) ** 2 + 3) + 1 / ((s + 1) ** 2 + 3),
    terms: [
      { label: 'e^(−t)cos√3t', fn: (t) => exp(-t) * cos(SQ3 * t) },
      { label: '(1/√3)e^(−t)sin√3t', fn: (t) => (exp(-t) * sin(SQ3 * t)) / SQ3 },
    ],
    extra: [
      { fn: (t) => (2 / SQ3) * exp(-t), label: 'envelope ±1.155e^(−t)', color: '#94a3b8', dash: true, width: 1.2 },
      { fn: (t) => (-2 / SQ3) * exp(-t), color: '#94a3b8', dash: true, width: 1.2 },
    ],
    poles: [
      { re: -1, im: SQ3, label: '-1+j\\sqrt3' },
      { re: -1, im: -SQ3, label: '-1-j\\sqrt3' },
    ],
    range: 3,
    T: 6,
    ivt: tex`\lim_{s\to\infty}sF(s)=1`,
    fvt: tex`\lim_{s\to0}sF(s)=0`,
    note: 'Two pieces with the same envelope e^(−t) and the same frequency √3 merge into a single shifted cosine of amplitude √(1 + 1/3) = 1.155 and phase −30°.',
  },
  {
    key: 'cplx',
    name: 'extra · 10/(s(s²+2s+5))',
    F: tex`F(s)=\frac{10}{s(s^2+2s+5)}`,
    expansion: tex`=\frac{2}{s}+\frac{K}{s+1-j2}+\frac{K^*}{s+1+j2},\quad K=-1+j0.5`,
    ft: tex`f(t)=2+2.236\,e^{-t}\cos(2t+153.4^\circ)`,
    Fs: (s) => 10 / (s * (s * s + 2 * s + 5)),
    Fexp: (s) => 2 / s - (2 * (s + 1) + 2) / ((s + 1) ** 2 + 4),
    terms: [
      { label: '2 (step)', fn: () => 2 },
      { label: '2.236e^(−t)cos(2t+153.4°)', fn: (t) => Math.sqrt(5) * exp(-t) * cos(2 * t + deg(153.435)) },
    ],
    poles: [
      { re: 0, im: 0, label: '0' },
      { re: -1, im: 2, label: '-1+j2' },
      { re: -1, im: -2, label: '-1-j2' },
    ],
    range: 3,
    T: 7,
    ivt: tex`\lim_{s\to\infty}sF(s)=0`,
    fvt: tex`\lim_{s\to0}sF(s)=2`,
    note: 'A pole at the origin produces a constant (the final value); the complex pair adds a decaying oscillation that is exactly −2 at t = 0, so f starts at 0.',
  },
  {
    key: 'ode',
    name: 'extra · ODE with initial conditions',
    F: tex`Y(s)=\frac{2s^2+9s+6}{s(s+2)(s+3)}`,
    expansion: tex`=\frac{1}{s}+\frac{2}{s+2}-\frac{1}{s+3}`,
    ft: tex`y(t)=1+2e^{-2t}-e^{-3t}`,
    Fs: (s) => (2 * s * s + 9 * s + 6) / (s * (s + 2) * (s + 3)),
    Fexp: (s) => 1 / s + 2 / (s + 2) - 1 / (s + 3),
    terms: [
      { label: '1', fn: () => 1 },
      { label: '2e^(−2t)', fn: (t) => 2 * exp(-2 * t) },
      { label: '−e^(−3t)', fn: (t) => -exp(-3 * t) },
    ],
    extra: [{ fn: (t) => 1 - 3 * exp(-2 * t) + 2 * exp(-3 * t), label: 'if initial conditions are forgotten (wrong)', color: '#fca5a5', dash: true, width: 1.4 }],
    poles: [
      { re: 0, im: 0, label: '0' },
      { re: -2, im: 0, label: '-2' },
      { re: -3, im: 0, label: '-3' },
    ],
    range: 4,
    T: 4,
    ivt: tex`\lim_{s\to\infty}sY(s)=2`,
    fvt: tex`\lim_{s\to0}sY(s)=1`,
    note: "y'' + 5y' + 6y = 6u(t) with y(0) = 2, y'(0) = −1. The curve starts at 2 with slope −1 and settles at 1. Dropping the initial conditions (red dashed) gives a curve starting at 0 — a different problem.",
  },
]

export function PartialFractionViewer({ initial = 'p10' }: { initial?: string }) {
  const [key, setKey] = useState(initial)
  const c = CASES.find((x) => x.key === key) ?? CASES[0]
  const total = (t: number) => c.terms.reduce((acc, term) => acc + term.fn(t), 0)
  const series: Series[] = [
    ...c.terms.map((term) => ({ fn: term.fn, label: term.label, dash: true, width: 1.6 })),
    ...(c.extra ?? []),
    { fn: total, label: 'f(t) = sum of terms', color: 'var(--fg)', width: 2.8 },
  ]
  const s0 = 1.5
  return (
    <div className="explorer">
      <div className="explorer-head">
        <span className="explorer-badge">Interactive</span>
        <span className="explorer-title">Partial fractions → time response: see each term's contribution</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '4px 0 8px' }}>
        {CASES.map((x) => (
          <button
            key={x.key}
            className={'btn' + (x.key === key ? ' btn-primary' : '')}
            style={{ padding: '4px 10px', fontSize: 13 }}
            onClick={() => setKey(x.key)}
          >
            {x.name}
          </button>
        ))}
      </div>
      <MD copy={false}>{c.F + c.expansion}</MD>
      <MD copy={false}>{c.ft}</MD>
      <Plot key={c.key} x={[0, c.T]} y={c.y} height={280} xLabel="t (s)" series={series} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 auto' }}>
          <SPlane poles={c.poles} range={c.range} size={220} caption="Poles of F(s)" />
        </div>
        <div style={{ flex: '1 1 260px' }}>
          <Readout
            rows={[
              ['F(1.5)\\ \\text{(original fraction)}', c.Fs(s0)],
              ['F(1.5)\\ \\text{(sum of partial fractions)}', c.Fexp(s0)],
              [tex`f(0^+)\ \text{from the terms}`, total(1e-9)],
              [tex`\text{IVT}`, c.ivt],
              ['f(t)\\ \\text{at}\\ t=' + c.T, total(c.T)],
              [tex`\text{FVT}`, c.fvt],
            ]}
          />
          <p style={{ fontSize: 14, color: 'var(--muted)', margin: '6px 0' }}>{c.note}</p>
        </div>
      </div>
    </div>
  )
}
