import { Circuit, R, C, V, W, Dot, Gnd, Arrow, Vlabel, Port } from '../../components/Circuit'
import { BD, Block, Sum, Line, Pick, Lbl } from '../../components/BlockDiagram'
import { Explorer, Readout, fmtNum } from '../../components/Explorer'
import { Plot } from '../../components/Plot'
import { SPlane } from '../../components/SPlane'
import { tex } from '../../lib/tex'

/* Consistent colours: impulse = pink, step = teal, ramp = amber, input = blue, tangents = violet */
const C_IMP = '#f9a8d4'
const C_STEP = '#5eead4'
const C_RAMP = '#fbbf24'
const C_IN = '#93c5fd'
const C_TAN = '#c4b5fd'
const C_ERR = '#fca5a5'

const ex = Math.exp

/* ------------------------------------------------------------------ */
/* Block diagrams                                                      */
/* ------------------------------------------------------------------ */

/** Unity-feedback loop as drawn in the notes: R(s) → Σ → E(s) → [G] → Y(s), feedback from the output. */
function UnityLoop({ g, signs = true, caption }: { g: string; signs?: boolean; caption: string }) {
  return (
    <BD w={520} h={160} caption={caption}>
      <Lbl x={30} y={52} t="R(s)" />
      <Line p={[[55, 70], [146, 70]]} />
      {signs ? <Sum x={160} y={70} signs={{ l: '+', b: '-' }} /> : <Sum x={160} y={70} />}
      <Line p={[[174, 70], [255, 70]]} />
      <Lbl x={215} y={52} t="E(s)" />
      <Block x={300} y={70} t={g} w={90} h={50} />
      <Line p={[[345, 70], [470, 70]]} />
      <Pick x={420} y={70} />
      <Lbl x={496} y={70} t="Y(s)" />
      <Line p={[[420, 70], [420, 135], [160, 135], [160, 84]]} />
    </BD>
  )
}

export const FirstOrderLoopBD = () => (
  <UnityLoop g={tex`\frac{1}{\tau s}`} caption="Standard first-order loop (notes p. 1): forward path 1/(τs), unity negative feedback." />
)
export const Ex1LoopBD = () => <UnityLoop g={tex`\frac{4}{s+1}`} caption="Example 1 (notes p. 5): G(s) = 4/(s+1) with unity negative feedback." />
export const Ex2LoopBD = () => (
  <UnityLoop
    g={tex`\frac{s}{s+1}`}
    signs={false}
    caption="Example 2 (notes p. 8): G(s) = s/(s+1). The notes draw no signs at Σ; the 1 + G denominator used in the solution means negative feedback."
  />
)
export const GeneralLoopBD = () => (
  <UnityLoop g={tex`\frac{K}{s+a}`} caption="A common exam loop: G(s) = K/(s+a) with unity negative feedback." />
)

/** The integrator view of the standard loop: E = R − Y, then y' = e/τ. */
export function IntegratorViewBD() {
  return (
    <BD w={560} h={160} caption="Same loop, read in the time domain: the block 1/(τs) integrates the error and scales it by 1/τ, so dy/dt = e(t)/τ.">
      <Lbl x={30} y={52} t="r(t)" />
      <Line p={[[55, 70], [146, 70]]} />
      <Sum x={160} y={70} signs={{ l: '+', b: '-' }} />
      <Line p={[[174, 70], [255, 70]]} />
      <Lbl x={215} y={52} t="e(t)" />
      <Block x={300} y={70} t="\frac{1}{\tau}\!\int" w={90} h={50} />
      <Line p={[[345, 70], [470, 70]]} />
      <Pick x={420} y={70} />
      <Lbl x={500} y={70} t="y(t)" />
      <Line p={[[420, 70], [420, 135], [160, 135], [160, 84]]} />
    </BD>
  )
}

/* ------------------------------------------------------------------ */
/* RC circuit (physical twin)                                          */
/* ------------------------------------------------------------------ */

export function RCCircuit() {
  return (
    <Circuit w={380} h={200} caption="Series RC circuit: input v_s(t), output the capacitor voltage v_c(t). Its transfer function is 1/(RCs+1), a first-order system with τ = RC.">
      <V x1={40} y1={160} x2={40} y2={40} label="v_s(t)" plus="b" flip />
      <W p={[[40, 40], [100, 40]]} />
      <R x1={100} y1={40} x2={200} y2={40} label="R" />
      <W p={[[200, 40], [280, 40]]} />
      <Dot x={280} y={40} />
      <C x1={280} y1={40} x2={280} y2={160} label="C" />
      <W p={[[40, 160], [280, 160]]} />
      <Arrow x={240} y={40} dir="r" label="i(t)" />
      <W p={[[280, 40], [340, 40]]} />
      <W p={[[280, 160], [340, 160]]} />
      <Dot x={280} y={160} />
      <Port x={340} y={40} />
      <Port x={340} y={160} />
      <Vlabel a={[340, 62]} b={[340, 140]} label="v_c(t)" side="r" />
      <Gnd x={160} y={160} />
    </Circuit>
  )
}

/* ------------------------------------------------------------------ */
/* Graphs from the notes (τ = 1 s so the axis reads directly in units of τ) */
/* ------------------------------------------------------------------ */

const tauTicks = [
  { x: 1, label: '\\tau' },
  { x: 2, label: '2\\tau' },
  { x: 3, label: '3\\tau' },
  { x: 4, label: '4\\tau' },
  { x: 5, label: '5\\tau' },
]

/** p. 1: impulse response (1/τ)e^{-t/τ} with the tangent at t = 0 hitting the axis at τ. */
export function ImpulsePlot() {
  return (
    <Plot
      title="Unit impulse response y(t) = (1/τ)e^(−t/τ)   (drawn with τ = 1 s, so the axis is in units of τ)"
      x={[0, 6]}
      y={[0, 1.1]}
      xLabel="t (s)"
      yLabel="y(t)"
      series={[
        { fn: (t) => ex(-t), label: 'y(t) = (1/τ) e^(−t/τ)', color: C_IMP },
        { fn: (t) => 1 - t, label: 'tangent at t = 0 (slope −1/τ²)', color: C_TAN, dash: true },
      ]}
      vlines={tauTicks}
      points={[
        { x: 0, y: 1, label: '\\tfrac{1}{\\tau}' },
        { x: 1, y: ex(-1), label: '0.368\\cdot\\tfrac{1}{\\tau}' },
        { x: 1, y: 0, label: '\\text{tangent hits }0\\text{ at }\\tau' },
      ]}
    />
  )
}

/** p. 3: step response 1 − e^{-t/τ}, tangent from origin reaching 1 at τ. */
export function StepPlot() {
  return (
    <Plot
      title="Unit step response y(t) = 1 − e^(−t/τ)   (τ = 1 s)"
      x={[0, 6]}
      y={[0, 1.15]}
      xLabel="t (s)"
      yLabel="y(t)"
      series={[
        { fn: (t) => 1 - ex(-t), label: 'y(t) = 1 − e^(−t/τ)', color: C_STEP },
        { fn: (t) => t, label: 'tangent at t = 0 (slope 1/τ)', color: C_TAN, dash: true },
      ]}
      hlines={[{ y: 1, label: 'r(t)=1', color: C_IN }]}
      bands={[{ y1: 0.98, y2: 1.02 }]}
      vlines={tauTicks}
      points={[
        { x: 1, y: 1 - ex(-1), label: '0.632' },
        { x: 4, y: 1 - ex(-4), label: '0.982' },
        { x: 5, y: 1 - ex(-5), label: '0.993' },
      ]}
    />
  )
}

/** p. 4: ramp response t − τ + τe^{-t/τ}, parallel to the input with gap τ. */
export function RampPlot() {
  const tau = 1
  return (
    <Plot
      title="Unit ramp response y(t) = t − τ + τe^(−t/τ)   (τ = 1 s)"
      x={[0, 6]}
      y={[0, 6]}
      xLabel="t (s)"
      yLabel="y(t)"
      series={[
        { fn: (t) => t, label: 'r(t) = t', color: C_IN, dash: true },
        { fn: (t) => t - tau + tau * ex(-t / tau), label: 'y(t)', color: C_RAMP },
        { fn: (t) => tau * (1 - ex(-t / tau)), label: 'e(t) = r − y = τ(1 − e^(−t/τ))', color: C_ERR },
        { points: [[5, 4], [5, 5]], label: 'gap = τ', color: C_TAN, width: 3 },
      ]}
      hlines={[{ y: tau, label: 'e_{ss}=\\tau', color: C_ERR }]}
      points={[{ x: 5, y: 4.5, label: '\\tau' }]}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Example 1: T = 4/(s+5) = 0.8/(0.2s+1)                               */
/* ------------------------------------------------------------------ */

export function Ex1StepPlot() {
  return (
    <Plot
      title="Example 1 — unit step response y(t) = 0.8(1 − e^(−5t))"
      x={[0, 1.5]}
      y={[0, 1.15]}
      xLabel="t (s)"
      yLabel="y(t)"
      series={[
        { fn: (t) => 0.8 * (1 - ex(-5 * t)), label: 'y(t)', color: C_STEP },
        { fn: (t) => 4 * t, label: 'tangent at 0 (slope 4)', color: C_TAN, dash: true },
      ]}
      hlines={[
        { y: 1, label: 'r(t)=1', color: C_IN },
        { y: 0.8, label: 'y_{ss}=0.8', color: C_STEP },
      ]}
      vlines={[
        { x: 0.2, label: '\\tau=0.2' },
        { x: 1, label: '5\\tau=1' },
      ]}
      points={[
        { x: 0.2, y: 0.8 * (1 - ex(-1)), label: '0.506' },
        { x: 1.3, y: 0.9, label: 'e_{ss}=0.2' },
      ]}
    />
  )
}

export function Ex1ImpulsePlot() {
  return (
    <Plot
      title="Example 1 — unit impulse response y(t) = 4e^(−5t)"
      x={[0, 1.5]}
      y={[0, 4.4]}
      xLabel="t (s)"
      yLabel="y(t)"
      series={[
        { fn: (t) => 4 * ex(-5 * t), label: 'y(t) = 4e^(−5t)', color: C_IMP },
        { fn: (t) => 4 - 20 * t, label: 'tangent at 0 (slope −20)', color: C_TAN, dash: true },
      ]}
      vlines={[
        { x: 0.2, label: '\\tau=0.2' },
        { x: 1, label: '5\\tau=1' },
      ]}
      points={[{ x: 0, y: 4, label: 'y(0^+)=4' }]}
    />
  )
}

export function Ex1RampPlot() {
  return (
    <Plot
      title="Example 1 — unit ramp response y(t) = 0.8t − 0.16 + 0.16e^(−5t)"
      x={[0, 5]}
      y={[0, 5]}
      xLabel="t (s)"
      yLabel="y(t)"
      series={[
        { fn: (t) => t, label: 'r(t) = t', color: C_IN, dash: true },
        { fn: (t) => 0.8 * t - 0.16 + 0.16 * ex(-5 * t), label: 'y(t)', color: C_RAMP },
        { fn: (t) => 0.2 * t + 0.16 - 0.16 * ex(-5 * t), label: 'e(t) = 0.2t + 0.16 − 0.16e^(−5t)', color: C_ERR },
      ]}
      points={[
        { x: 4, y: 3.04, label: 'y(4)\\approx3.04' },
        { x: 4, y: 0.96, label: 'e(4)\\approx0.96' },
      ]}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Example 2: T = s/(2s+1) = 0.5 − 0.25/(s+0.5)                        */
/* ------------------------------------------------------------------ */

export function Ex2ImpulsePlot() {
  return (
    <Plot
      title="Example 2 — unit impulse response y(t) = 0.5δ(t) − 0.25e^(−0.5t)   (true time scale, τ = 2 s)"
      x={[0, 10]}
      y={[-0.35, 0.6]}
      xLabel="t (s)"
      yLabel="y(t)"
      series={[
        { points: [[0, 0.5]], stem: true, label: 'impulse of area 0.5 (arrow height is symbolic)', color: C_IN },
        { fn: (t) => -0.25 * ex(-0.5 * t), label: 'regular part −0.25e^(−0.5t)', color: C_IMP },
      ]}
      vlines={[
        { x: 1, label: 't=1' },
        { x: 2, label: '\\tau=2' },
        { x: 8, label: '4\\tau=8' },
      ]}
      points={[
        { x: 0, y: -0.25, label: 'y(0^+)=-0.25' },
        { x: 1, y: -0.25 * ex(-0.5), label: '-0.152' },
      ]}
    />
  )
}

export function Ex2StepPlot() {
  return (
    <Plot
      title="Example 2 with a unit step input — y(t) = 0.5e^(−0.5t)"
      x={[0, 10]}
      y={[0, 1.1]}
      xLabel="t (s)"
      yLabel="y(t)"
      series={[{ fn: (t) => 0.5 * ex(-0.5 * t), label: 'y(t) = 0.5e^(−0.5t)', color: C_STEP }]}
      hlines={[{ y: 1, label: 'r(t)=1', color: C_IN }]}
      points={[{ x: 0, y: 0.5, label: 'y(0^+)=0.5' }]}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Additional examples                                                 */
/* ------------------------------------------------------------------ */

/** "Measured" step response used for the τ-reading example: K = 1.6, τ = 0.75 s. */
export function MeasuredStepPlot() {
  const K = 1.6
  const tau = 0.75
  const pts: [number, number][] = []
  for (let i = 0; i <= 24; i++) {
    const t = i * 0.25
    pts.push([t, Math.round(K * (1 - ex(-t / tau)) * 1000) / 1000])
  }
  return (
    <Plot
      title="A measured unit step response (dots = samples every 0.25 s)"
      x={[0, 6]}
      y={[0, 1.8]}
      xLabel="t (s)"
      yLabel="y(t)"
      series={[
        { points: pts, label: 'measured samples', color: C_STEP, dash: true, width: 1.2 },
        { fn: (t) => (K / tau) * t, label: 'tangent drawn at t = 0', color: C_TAN, dash: true },
      ]}
      hlines={[
        { y: K, label: 'y_{ss}=1.6' },
        { y: 0.632 * K, label: '0.632\\,y_{ss}=1.011' },
      ]}
      vlines={[{ x: tau, label: 't=0.75' }]}
      points={pts.map(([x, y]) => ({ x, y, color: C_STEP }))}
    />
  )
}

/** Example: 10/(2s+1). */
export function TenOverPlot() {
  return (
    <Plot
      title="Unit step response of T(s) = 10/(2s+1): y(t) = 10(1 − e^(−t/2))"
      x={[0, 12]}
      y={[0, 11]}
      xLabel="t (s)"
      yLabel="y(t)"
      series={[
        { fn: (t) => 10 * (1 - ex(-t / 2)), label: 'y(t)', color: C_STEP },
        { fn: (t) => 5 * t, label: 'tangent at 0 (slope K/τ = 5)', color: C_TAN, dash: true },
      ]}
      hlines={[{ y: 10, label: 'y_{ss}=10' }]}
      bands={[{ y1: 9.8, y2: 10.2 }]}
      vlines={[
        { x: 2, label: '\\tau=2' },
        { x: 8, label: '4\\tau=8' },
      ]}
      points={[{ x: 2, y: 10 * (1 - ex(-1)), label: '6.32' }]}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Interactive: τ and K explorer                                       */
/* ------------------------------------------------------------------ */

export function FirstOrderExplorer() {
  return (
    <Explorer
      title="First-order system T(s) = K/(τs+1): impulse, step and ramp responses together"
      params={[
        { name: 'tau', label: '\\tau', min: 0.2, max: 2.5, step: 0.05, value: 1, unit: 's' },
        { name: 'K', label: 'K', min: 0.2, max: 2, step: 0.05, value: 1 },
      ]}
    >
      {({ tau, K }) => {
        const p = -1 / tau
        const essStep = 1 - K
        const essRamp = Math.abs(K - 1) < 1e-9 ? tau : K < 1 ? Infinity : -Infinity
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '0.5rem', alignItems: 'start' }}>
              <SPlane
                poles={[{ re: p, im: 0, label: `-1/\\tau=${fmtNum(p, 3)}` }]}
                range={6}
                imRange={3}
                size={220}
                caption="Pole at s = −1/τ. Farther left ⇒ smaller τ ⇒ faster response."
              />
              <Readout
                rows={[
                  ['T(s)', `\\dfrac{${fmtNum(K, 3)}}{${fmtNum(tau, 3)}s+1}`],
                  ['\\text{pole } s=-1/\\tau', p],
                  ['y_{\\delta}(0^+)=K/\\tau', K / tau],
                  ['\\text{impulse slope at }0=-K/\\tau^2', -K / tau ** 2],
                  ['\\text{step slope at }0=K/\\tau', K / tau],
                  ['y_{step}(\\tau)=0.632K', 0.632 * K],
                  ['t_s\\approx4\\tau\\;(98\\%)', 4 * tau],
                  ['5\\tau\\;(99.3\\%)', 5 * tau],
                  ['y_{ss}\\text{ (step)}=K', K],
                  ['e_{ss}\\text{ (step)}=1-K', essStep],
                  ['e_{ss}\\text{ (ramp)}', essRamp],
                ]}
              />
            </div>
            <Plot
              title="Unit impulse response  y(t) = (K/τ)e^(−t/τ)"
              x={[0, 10]}
              y={[0, 10.5]}
              xLabel="t (s)"
              yLabel="y(t)"
              height={220}
              series={[
                { fn: (t) => (K / tau) * ex(-t / tau), label: 'impulse response', color: C_IMP },
                { fn: (t) => (K / tau) * (1 - t / tau), label: 'tangent at 0', color: C_TAN, dash: true },
              ]}
              vlines={[
                { x: tau, label: '\\tau' },
                { x: 4 * tau, label: '4\\tau' },
              ]}
              points={[{ x: 0, y: K / tau, label: 'K/\\tau' }]}
            />
            <Plot
              title="Unit step response  y(t) = K(1 − e^(−t/τ))"
              x={[0, 10]}
              y={[0, 2.2]}
              xLabel="t (s)"
              yLabel="y(t)"
              height={240}
              series={[
                { fn: (t) => K * (1 - ex(-t / tau)), label: 'step response', color: C_STEP },
                { fn: (t) => (K / tau) * t, label: 'tangent at 0', color: C_TAN, dash: true },
              ]}
              hlines={[
                { y: 1, label: 'r=1', color: C_IN },
                { y: K, label: 'y_{ss}=K', color: C_STEP },
              ]}
              bands={[{ y1: 0.98 * K, y2: 1.02 * K }]}
              vlines={[
                { x: tau, label: '\\tau' },
                { x: 4 * tau, label: '4\\tau' },
              ]}
              points={[{ x: tau, y: K * (1 - ex(-1)), label: '0.632K' }]}
            />
            <Plot
              title="Unit ramp response  y(t) = K(t − τ + τe^(−t/τ))"
              x={[0, 10]}
              y={[0, 20]}
              xLabel="t (s)"
              yLabel="y(t)"
              height={240}
              series={[
                { fn: (t) => t, label: 'r(t) = t', color: C_IN, dash: true },
                { fn: (t) => K * (t - tau + tau * ex(-t / tau)), label: 'ramp response', color: C_RAMP },
                { fn: (t) => K * (t - tau), label: 'asymptote K(t − τ)', color: C_TAN, dash: true, width: 1.2 },
              ]}
              vlines={[{ x: tau, label: '\\tau' }]}
            />
          </>
        )
      }}
    </Explorer>
  )
}

/* ------------------------------------------------------------------ */
/* Interactive: loop G = K/(s+a) — open-loop vs closed-loop pole       */
/* ------------------------------------------------------------------ */

export function LoopExplorer() {
  return (
    <Explorer
      title="Unity feedback around G(s) = K/(s+a): how feedback moves the pole"
      params={[
        { name: 'K', label: 'K', min: 0.5, max: 12, step: 0.5, value: 4 },
        { name: 'a', label: 'a', min: 0.5, max: 4, step: 0.5, value: 1 },
      ]}
    >
      {({ K, a }) => {
        const tauOL = 1 / a
        const tauCL = 1 / (a + K)
        const dc = K / (a + K)
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '0.5rem', alignItems: 'start' }}>
              <SPlane
                poles={[
                  { re: -a, im: 0.6, label: '\\text{open: }-a', color: '#93c5fd' },
                  { re: -(a + K), im: -0.6, label: '\\text{closed: }-(a+K)', color: '#f9a8d4' },
                ]}
                range={17}
                imRange={3}
                size={220}
                caption="Blue: open-loop pole −a (drawn slightly above the axis). Pink: closed-loop pole −(a+K) (drawn slightly below). Both lie on the real axis."
              />
              <Readout
                rows={[
                  ['T(s)=\\dfrac{K}{s+a+K}', `\\dfrac{${fmtNum(K, 3)}}{s+${fmtNum(a + K, 3)}}`],
                  ['\\tau_{OL}=1/a', tauOL],
                  ['\\tau_{CL}=1/(a+K)', tauCL],
                  ['\\text{DC gain }K/(a+K)', dc],
                  ['e_{ss}\\text{ (step)}=a/(a+K)', a / (a + K)],
                  ['t_s\\approx4\\tau_{CL}', 4 * tauCL],
                  ['e_{ss}\\text{ (ramp)}', '\\infty'],
                ]}
              />
            </div>
            <Plot
              title="Closed-loop unit step response y(t) = K/(a+K) · (1 − e^(−(a+K)t))"
              x={[0, 5]}
              y={[0, 1.15]}
              xLabel="t (s)"
              yLabel="y(t)"
              height={240}
              series={[{ fn: (t) => dc * (1 - ex(-(a + K) * t)), label: 'closed-loop step response', color: C_STEP }]}
              hlines={[
                { y: 1, label: 'r=1', color: C_IN },
                { y: dc, label: 'y_{ss}', color: C_STEP },
              ]}
              vlines={[{ x: Math.min(4 * tauCL, 5), label: '4\\tau_{CL}' }]}
            />
          </>
        )
      }}
    </Explorer>
  )
}
