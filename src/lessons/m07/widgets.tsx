import { Circuit, R, C, L, V, W, Port, Arrow, Vlabel } from '../../components/Circuit'
import { BD, Block, Sum, Line, Pick, Lbl } from '../../components/BlockDiagram'
import { Explorer, Readout, fmtNum } from '../../components/Explorer'
import { Plot, type Series } from '../../components/Plot'
import { SPlane } from '../../components/SPlane'
import { MD } from '../../components/Math'
import { tex } from '../../lib/tex'

/* ------------------------------------------------------------------ */
/* Response formulas — exactly the ones derived in the lesson          */
/* T(s) = K * wn^2 / (s^2 + 2 xi wn s + wn^2), zero initial conditions  */
/* ------------------------------------------------------------------ */

export type Kind = 'imp' | 'step' | 'ramp'
export type DampCase = 'over' | 'crit' | 'under' | 'undamped'

const { exp, sin, cos, sqrt, atan2, PI } = Math

export function caseOf(xi: number): DampCase {
  if (Math.abs(xi - 1) < 1e-9) return 'crit'
  if (xi > 1) return 'over'
  if (xi < 1e-9) return 'undamped'
  return 'under'
}

/** Unit impulse / step / ramp response of the standard second-order system (DC gain K). */
export function response(kind: Kind, xi: number, wn: number, K = 1): (t: number) => number {
  const c = caseOf(xi)
  let f: (t: number) => number
  if (c === 'over') {
    const r = wn * sqrt(xi * xi - 1)
    const p1 = xi * wn - r
    const p2 = xi * wn + r
    const d = p2 - p1
    f =
      kind === 'imp'
        ? (t) => ((wn * wn) / d) * (exp(-p1 * t) - exp(-p2 * t))
        : kind === 'step'
          ? (t) => 1 - (p2 * exp(-p1 * t) - p1 * exp(-p2 * t)) / d
          : (t) => t - (2 * xi) / wn + ((p2 / p1) * exp(-p1 * t) - (p1 / p2) * exp(-p2 * t)) / d
  } else if (c === 'crit') {
    f =
      kind === 'imp'
        ? (t) => wn * wn * t * exp(-wn * t)
        : kind === 'step'
          ? (t) => 1 - exp(-wn * t) - wn * t * exp(-wn * t)
          : (t) => t - 2 / wn + t * exp(-wn * t) + (2 / wn) * exp(-wn * t)
  } else {
    const a = xi * wn
    const w = wn * sqrt(1 - xi * xi)
    const th = atan2(sqrt(1 - xi * xi), xi)
    f =
      kind === 'imp'
        ? (t) => (wn / sqrt(1 - xi * xi)) * exp(-a * t) * sin(w * t)
        : kind === 'step'
          ? (t) => 1 - (exp(-a * t) / sqrt(1 - xi * xi)) * sin(w * t + th)
          : (t) => t - (2 * xi) / wn + (1 / w) * exp(-a * t) * sin(w * t + 2 * th)
  }
  return (t) => (t < 0 ? 0 : K * f(t))
}

const XI_COL: Record<string, string> = { '0.25': '#f9a8d4', '1': '#5eead4', '2': '#fbbf24' }
const RAMP_COL = '#93c5fd'

/* ------------------------------------------------------------------ */
/* Block diagrams                                                      */
/* ------------------------------------------------------------------ */

/** Unity negative feedback loop as drawn on pp. 1, 2 and 15. */
export function UnityLoop({ G, caption, bw = 130 }: { G: string; caption?: string; bw?: number }) {
  const bx = 300
  return (
    <BD w={540} h={170} caption={caption}>
      <Lbl x={40} y={50} t="R(s)" />
      <Line p={[[20, 70], [126, 70]]} />
      <Sum x={140} y={70} signs={{ l: '+', b: '-' }} />
      <Line p={[[154, 70], [bx - bw / 2, 70]]} />
      <Lbl x={(154 + bx - bw / 2) / 2} y={52} t="E(s)" />
      <Block x={bx} y={70} t={G} w={bw} h={56} />
      <Line p={[[bx + bw / 2, 70], [520, 70]]} />
      <Pick x={460} y={70} />
      <Lbl x={500} y={50} t="Y(s)" />
      <Line p={[[460, 70], [460, 145], [140, 145], [140, 84]]} />
    </BD>
  )
}

export const StandardLoopBD = () => (
  <UnityLoop
    G={tex`\frac{\omega_n^2}{s(s+2\xi\omega_n)}`}
    bw={140}
    caption="Standard second-order control system (p. 1): unity negative feedback around ω_n²/[s(s+2ξω_n)]."
  />
)
export const Example1BD = () => (
  <UnityLoop G={tex`\frac{2}{s^2+2s+2}`} caption="Example 1 (p. 2): unity negative feedback around G(s) = 2/(s²+2s+2)." />
)
export const Example2BD = () => (
  <UnityLoop G={tex`\frac{20}{s^2+4s+5}`} caption="Example 2 (p. 15): unity negative feedback around G(s) = 20/(s²+4s+5)." />
)

/** Closed-loop equivalent block. */
export function ClosedLoopBlock() {
  return (
    <BD w={420} h={100} caption="The whole loop collapses into one block: the closed-loop transfer function T(s).">
      <Lbl x={40} y={30} t="R(s)" />
      <Line p={[[20, 50], [110, 50]]} />
      <Block x={210} y={50} t={tex`\frac{\omega_n^2}{s^2+2\xi\omega_n s+\omega_n^2}`} w={200} h={56} />
      <Line p={[[310, 50], [400, 50]]} />
      <Lbl x={380} y={30} t="Y(s)" />
    </BD>
  )
}

/** Series RLC (physical analogue). */
export function SeriesRLC() {
  return (
    <Circuit w={440} h={200} caption="Series RLC circuit with the output taken across C — a physical second-order system (see Module 05).">
      <V x1={40} y1={160} x2={40} y2={40} label="v_i(t)" plus="b" flip />
      <W p={[[40, 40], [80, 40]]} />
      <R x1={80} y1={40} x2={180} y2={40} label="R" />
      <L x1={180} y1={40} x2={290} y2={40} label="L" />
      <W p={[[290, 40], [330, 40]]} />
      <C x1={330} y1={40} x2={330} y2={160} label="C" />
      <W p={[[40, 160], [330, 160]]} />
      <W p={[[330, 40], [400, 40]]} />
      <W p={[[330, 160], [400, 160]]} />
      <Port x={400} y={40} />
      <Port x={400} y={160} />
      <Arrow x={70} y={40} dir="r" label="i(t)" />
      <Vlabel a={[400, 62]} b={[400, 140]} label="v_o(t)" side="r" />
    </Circuit>
  )
}

/* ------------------------------------------------------------------ */
/* Professor's families: xi = 0.25, 1, 2 (drawn here with wn = 1)       */
/* ------------------------------------------------------------------ */

const fam = (kind: Kind): Series[] =>
  ['0.25', '1', '2'].map((x) => ({ fn: response(kind, +x, 1), label: `ξ = ${x}`, color: XI_COL[x] }))

export function ImpulseFamily() {
  return (
    <Plot
      x={[0, 16]}
      xLabel="ω_n t"
      yLabel="y(t)/ω_n"
      series={fam('imp')}
      title="Unit impulse responses, ω_n = 1 (p. 4)"
      points={[
        { x: atan2(sqrt(1 - 0.0625), 0.25) / sqrt(1 - 0.0625), y: response('imp', 0.25, 1)(atan2(sqrt(1 - 0.0625), 0.25) / sqrt(1 - 0.0625)), label: '\\xi=0.25' },
        { x: 1, y: exp(-1), label: '\\xi=1' },
      ]}
    />
  )
}

export function StepFamily() {
  return (
    <Plot
      x={[0, 16]}
      y={[0, 1.9]}
      xLabel="ω_n t"
      yLabel="y(t)"
      series={fam('step')}
      hlines={[{ y: 1, label: 'y_{ss}=1' }]}
      title="Unit step responses, ω_n = 1 (p. 10)"
    />
  )
}

export function RampFamily() {
  return (
    <Plot
      x={[0, 12]}
      y={[0, 12]}
      xLabel="ω_n t"
      yLabel="ω_n y(t)"
      series={[{ fn: (t) => t, label: 'r(t) = t', dash: true, color: RAMP_COL }, ...fam('ramp')]}
      title="Unit ramp responses, ω_n = 1 (p. 14) — lags 2ξ/ω_n = 0.5, 2, 4"
    />
  )
}

/** Zoom on the first instants of the step response: every curve leaves with zero slope. */
export function InitialSlopeZoom() {
  return (
    <Plot
      x={[0, 1]}
      y={[0, 0.45]}
      xLabel="ω_n t"
      yLabel="y(t)"
      series={[
        ...fam('step'),
        { fn: (t) => 0.5 * t * t, label: '≈ ω_n²t²/2 (all ξ)', dash: true, color: '#c4b5fd' },
      ]}
      title="Zoom on 0 ≤ ω_n t ≤ 1: the step response starts tangent to the t-axis"
    />
  )
}

/* ------------------------------------------------------------------ */
/* Example 2: T = 20/(s^2+4s+25) = 0.8 * 25/(s^2+2*0.4*5 s+25)          */
/* ------------------------------------------------------------------ */

const EX2 = { xi: 0.4, wn: 5, K: 0.8 }
const ex2 = (k: Kind) => response(k, EX2.xi, EX2.wn, EX2.K)
const TH2 = atan2(sqrt(0.84), 0.4)
const W2 = sqrt(21)

export function Ex2Impulse() {
  const tp = TH2 / W2
  return (
    <Plot
      x={[0, 3]}
      xLabel="t (s)"
      yLabel="y(t)"
      series={[
        { fn: ex2('imp'), label: '4.364 e⁻²ᵗ sin 4.58t' },
        { fn: (t) => 4.364 * exp(-2 * t), label: 'envelope ±4.364 e⁻²ᵗ', dash: true, color: '#94a3b8', width: 1.2 },
        { fn: (t) => -4.364 * exp(-2 * t), dash: true, color: '#94a3b8', width: 1.2 },
      ]}
      y={[-2, 4.5]}
      points={[{ x: tp, y: ex2('imp')(tp), label: '(0.253,\\,2.41)' }]}
      title="Example 2 — unit impulse response (p. 16 sketch)"
    />
  )
}

export function Ex2Step() {
  const tp = PI / W2
  return (
    <Plot
      x={[0, 3]}
      y={[0, 1.15]}
      xLabel="t (s)"
      yLabel="y(t)"
      series={[{ fn: ex2('step'), label: '0.8[1 − e⁻²ᵗ(cos 4.58t + 0.436 sin 4.58t)]' }]}
      hlines={[{ y: 1, label: '1' }, { y: 0.8, label: 'y_{ss}=0.8' }]}
      points={[{ x: tp, y: ex2('step')(tp), label: '(0.686,\\,1.003)' }]}
      title="Example 2 — unit step response (p. 16 sketch)"
    />
  )
}

export function Ex2Ramp() {
  return (
    <Plot
      x={[0, 4]}
      y={[0, 4]}
      xLabel="t (s)"
      yLabel="y(t)"
      series={[
        { fn: (t) => t, label: 'r(t) = t', dash: true, color: RAMP_COL },
        { fn: ex2('ramp'), label: 'y(t) = 0.8t − 0.128 + 0.1746 e⁻²ᵗ sin(4.58t + 132.84°)' },
        { fn: (t) => 0.8 * t - 0.128, label: 'asymptote 0.8t − 0.128', dash: true, color: '#94a3b8', width: 1.2 },
      ]}
      title="Example 2 — unit ramp response: the error t − y(t) grows without bound (p. 17 sketch)"
    />
  )
}

/** Numerical evidence for the 2θ correction. Points come from an RK4 simulation of y''+4y'+25y = 20t. */
export function RampPhaseCheck() {
  const wrong = (t: number) => 0.8 * t - 0.128 + (0.8 / W2) * exp(-2 * t) * sin(W2 * t + TH2)
  return (
    <Plot
      x={[0, 1.2]}
      y={[-0.05, 0.85]}
      xLabel="t (s)"
      yLabel="y(t)"
      series={[
        { fn: ex2('ramp'), label: 'phase 2θ = 132.84° (correct)', color: '#5eead4' },
        { fn: wrong, label: 'phase θ = 66.42° (as in the notes)', color: '#fca5a5', dash: true },
        {
          points: [
            [0, 0],
            [0.1, 0.00299],
            [0.3, 0.06178],
            [0.5, 0.20812],
            [1, 0.68569],
          ],
          stem: true,
          label: 'numerical ODE solution',
          color: '#fbbf24',
        },
      ]}
      title="Example 2 ramp response near t = 0: only the 2θ version matches the ODE and starts at 0"
    />
  )
}

/* ------------------------------------------------------------------ */
/* Generic trio for worked examples                                    */
/* ------------------------------------------------------------------ */

export function ResponseTrio({ xi, wn, K = 1, tEnd, title }: { xi: number; wn: number; K?: number; tEnd?: number; title?: string }) {
  const T = tEnd ?? autoEnd(xi, wn)
  return (
    <div>
      <Plot x={[0, T]} xLabel="t (s)" yLabel="impulse" height={200} series={[{ fn: response('imp', xi, wn, K), label: 'impulse response' }]} title={title} />
      <Plot
        x={[0, T]}
        xLabel="t (s)"
        yLabel="step"
        height={200}
        series={[{ fn: response('step', xi, wn, K), label: 'step response', color: '#f9a8d4' }]}
        hlines={[{ y: K, label: `y_{ss}=${fmtNum(K)}` }]}
      />
      <Plot
        x={[0, T]}
        xLabel="t (s)"
        yLabel="ramp"
        height={200}
        series={[
          { fn: (t) => t, label: 'r(t) = t', dash: true, color: RAMP_COL },
          { fn: response('ramp', xi, wn, K), label: 'ramp response', color: '#fbbf24' },
        ]}
      />
    </div>
  )
}

function autoEnd(xi: number, wn: number) {
  const c = caseOf(xi)
  const sigma = c === 'over' ? xi * wn - wn * sqrt(xi * xi - 1) : xi * wn
  const byDecay = sigma > 1e-6 ? 6 / sigma : Infinity
  return Math.max(1, Math.min(byDecay, 25 / wn))
}

/** Undamped limit and the approach to critical damping. */
export function LimitPlots() {
  return (
    <>
      <Plot
        x={[0, 20]}
        y={[0, 2.1]}
        xLabel="ω_n t"
        yLabel="y(t)"
        series={[
          { fn: response('step', 0, 1), label: 'ξ = 0: 1 − cos ω_n t', color: '#fca5a5' },
          { fn: response('step', 0.1, 1), label: 'ξ = 0.1', color: '#f9a8d4' },
        ]}
        hlines={[{ y: 1 }]}
        title="ξ → 0: the oscillation no longer dies out"
      />
      <Plot
        x={[0, 10]}
        xLabel="ω_n t"
        yLabel="y(t)/ω_n"
        series={[
          { fn: response('imp', 0.7, 1), label: 'ξ = 0.7', color: '#c4b5fd' },
          { fn: response('imp', 0.9, 1), label: 'ξ = 0.9', color: '#93c5fd' },
          { fn: response('imp', 0.99, 1), label: 'ξ = 0.99', color: '#f9a8d4' },
          { fn: response('imp', 1, 1), label: 'ξ = 1: ω_n² t e^(−ω_n t)', color: '#5eead4', dash: true },
        ]}
        title="ξ → 1⁻: the underdamped impulse response merges smoothly into the critical one"
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Main interactive explorer                                           */
/* ------------------------------------------------------------------ */

const CASE_NAME: Record<DampCase, string> = {
  over: 'Overdamped (aşırı sönümlü), ξ > 1: real, distinct roots',
  crit: 'Critically damped (kritik sönümlü), ξ = 1: real, repeated root',
  under: 'Underdamped (düşük sönümlü), 0 < ξ < 1: complex-conjugate roots',
  undamped: 'Undamped limit, ξ = 0: roots on the jω axis (underdamped formulas with α = 0)',
}

const CASE_FORMULAS: Record<DampCase, string> = {
  over: tex`\begin{aligned}
&p_{1,2}=\xi\omega_n\mp\omega_n\sqrt{\xi^2-1}\\
&\text{impulse: } y=\tfrac{\omega_n^2}{p_2-p_1}\left(e^{-p_1t}-e^{-p_2t}\right)\\
&\text{step: } y=1-\tfrac{p_2e^{-p_1t}-p_1e^{-p_2t}}{p_2-p_1}\\
&\text{ramp: } y=t-\tfrac{2\xi}{\omega_n}+\tfrac{1}{p_2-p_1}\left(\tfrac{p_2}{p_1}e^{-p_1t}-\tfrac{p_1}{p_2}e^{-p_2t}\right)
\end{aligned}`,
  crit: tex`\begin{aligned}
&s_{1,2}=-\omega_n\\
&\text{impulse: } y=\omega_n^2\,t\,e^{-\omega_nt}\\
&\text{step: } y=1-e^{-\omega_nt}-\omega_nt\,e^{-\omega_nt}\\
&\text{ramp: } y=t-\tfrac{2}{\omega_n}+t\,e^{-\omega_nt}+\tfrac{2}{\omega_n}e^{-\omega_nt}
\end{aligned}`,
  under: tex`\begin{aligned}
&s_{1,2}=-\alpha\pm j\omega,\ \alpha=\xi\omega_n,\ \omega=\omega_n\sqrt{1-\xi^2}\\
&\text{impulse: } y=\tfrac{\omega_n}{\sqrt{1-\xi^2}}e^{-\alpha t}\sin\omega t\\
&\text{step: } y=1-\tfrac{e^{-\alpha t}}{\sqrt{1-\xi^2}}\sin(\omega t+\theta)\\
&\text{ramp: } y=t-\tfrac{2\xi}{\omega_n}+\tfrac{1}{\omega}e^{-\alpha t}\sin(\omega t+2\theta)
\end{aligned}`,
  undamped: tex`\begin{aligned}
&s_{1,2}=\pm j\omega_n,\ \theta=90^\circ\\
&\text{impulse: } y=\omega_n\sin\omega_nt\\
&\text{step: } y=1-\cos\omega_nt\\
&\text{ramp: } y=t-\tfrac{1}{\omega_n}\sin\omega_nt
\end{aligned}`,
}

export function SecondOrderExplorer() {
  return (
    <Explorer
      title="Second-order system: poles and responses"
      params={[
        { name: 'xi', label: '\\xi', min: 0, max: 2.5, step: 0.01, value: 0.4 },
        { name: 'wn', label: '\\omega_n', min: 0.5, max: 6, step: 0.1, value: 2, unit: 'rad/s' },
      ]}
    >
      {({ xi, wn }) => {
        const c = caseOf(xi)
        const T = autoEnd(xi, wn)
        let poles: { re: number; im: number; label?: string }[]
        let rows: [string, string | number][]
        const essRamp = (2 * xi) / wn
        if (c === 'over') {
          const r = wn * sqrt(xi * xi - 1)
          const p1 = xi * wn - r
          const p2 = xi * wn + r
          poles = [
            { re: -p1, im: 0, label: '-p_1' },
            { re: -p2, im: 0, label: '-p_2' },
          ]
          rows = [
            ['p_1', p1],
            ['p_2', p2],
            ['s_1,\\ s_2', `${fmtNum(-p1)},\\ ${fmtNum(-p2)}`],
            ['p_1p_2=\\omega_n^2', p1 * p2],
          ]
        } else if (c === 'crit') {
          poles = [
            { re: -wn, im: 0.0001, label: '-\\omega_n\\ (\\times2)' },
            { re: -wn, im: -0.0001 },
          ]
          rows = [
            ['s_{1,2}', -wn],
            ['p=\\omega_n', wn],
          ]
        } else {
          const a = xi * wn
          const w = wn * sqrt(1 - xi * xi)
          const th = atan2(sqrt(1 - xi * xi), xi)
          poles = [
            { re: -a, im: w, label: '-\\alpha+j\\omega' },
            { re: -a, im: -w, label: '-\\alpha-j\\omega' },
          ]
          rows = [
            ['\\alpha=\\xi\\omega_n', a],
            ['\\omega=\\omega_n\\sqrt{1-\\xi^2}', w],
            ['\\theta', `${fmtNum((th * 180) / PI)}^\\circ = ${fmtNum(th)}\\,\\text{rad}`],
            ['2\\theta', `${fmtNum((2 * th * 180) / PI)}^\\circ`],
            ['s_{1,2}', `${fmtNum(-a)}\\pm j${fmtNum(w)}`],
          ]
        }
        const span = Math.max(...poles.map((p) => Math.abs(p.re)), ...poles.map((p) => Math.abs(p.im)), 1)
        rows.push(['e_{ss}\\ \\text{(impulse, step)}', 0], ['e_{ss}\\ \\text{(ramp)}=2\\xi/\\omega_n', essRamp])
        return (
          <div>
            <p>
              <strong>{CASE_NAME[c]}</strong>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ flex: '1 1 300px' }}>
                <SPlane
                  poles={poles}
                  range={span * 1.25}
                  imRange={span * 1.25}
                  lines={c === 'under' ? [{ re: poles[0].re, im: poles[0].im, dash: true }] : []}
                  caption={c === 'under' ? 'Dashed ray: length ω_n, angle θ from the negative real axis (cos θ = ξ).' : 'Closed-loop poles (system roots).'}
                />
              </div>
              <div style={{ flex: '1 1 260px' }}>
                <Readout rows={rows} />
              </div>
            </div>
            <MD copy={false}>{CASE_FORMULAS[c]}</MD>
            <Plot x={[0, T]} xLabel="t (s)" yLabel="impulse" height={190} series={[{ fn: response('imp', xi, wn), label: 'unit impulse response' }]} />
            <Plot
              x={[0, T]}
              xLabel="t (s)"
              yLabel="step"
              height={190}
              series={[{ fn: response('step', xi, wn), label: 'unit step response', color: '#f9a8d4' }]}
              hlines={[{ y: 1, label: '1' }]}
            />
            <Plot
              x={[0, T]}
              xLabel="t (s)"
              yLabel="ramp"
              height={190}
              series={[
                { fn: (t) => t, label: 'r(t) = t', dash: true, color: RAMP_COL },
                { fn: response('ramp', xi, wn), label: 'unit ramp response', color: '#fbbf24' },
                { fn: (t) => t - essRamp, label: 'asymptote t − 2ξ/ω_n', dash: true, color: '#94a3b8', width: 1.2 },
              ]}
            />
          </div>
        )
      }}
    </Explorer>
  )
}
