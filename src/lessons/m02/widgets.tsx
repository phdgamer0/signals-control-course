import { Circuit, R, C, L, V, W, Arrow, Vlabel, Dot } from '../../components/Circuit'
import { Explorer, Readout, fmtNum } from '../../components/Explorer'
import { Plot } from '../../components/Plot'
import { SPlane } from '../../components/SPlane'
import { SvgTex } from '../../components/SvgTex'
import { M } from '../../components/Math'
import { tex } from '../../lib/tex'

/* ------------------------------------------------------------------ */
/*  1. The three test inputs (pages 1, 2, 9, 10)                       */
/* ------------------------------------------------------------------ */

const BLUE = '#93c5fd'
const PINK = '#f9a8d4'
const AMBER = '#fbbf24'
const TEAL = '#5eead4'

/** Professor's step graph (p. 1): jump at t = 0 to level A. Drawn with A = 1.5 so that "A" is visibly not 1. */
export function StepFunctionPlot() {
  const A = 1.5
  return (
    <Plot
      x={[-2, 6]}
      y={[-0.2, 2]}
      xLabel="t"
      yLabel="x(t)"
      series={[{ points: [[-2, 0], [0, 0], [0, A], [6, A]], label: 'x(t) = A·u(t)', color: BLUE }]}
      hlines={[{ y: A, label: 'A' }]}
      title="Step function (basamak fonksiyonu), drawn with A = 1.5"
    />
  )
}

/** Professor's impulse graph (p. 2 and p. 10): an arrow at t = 0. The arrow's height shows its AREA (strength), not a value. */
export function ImpulsePlot() {
  return (
    <Plot
      x={[-2, 6]}
      y={[-0.2, 1.4]}
      xLabel="t"
      yLabel="δ(t)"
      series={[
        { points: [[-2, 0], [6, 0]], label: '', color: BLUE },
        { points: [[0, 1]], stem: true, label: 'δ(t): area 1 concentrated at t = 0', color: BLUE },
      ]}
      title="Unit impulse (birim impulse): the arrow's height is drawn as its area, 1"
    />
  )
}

/** Professor's ramp graph (p. 2): slope A, dashed guides through (1, A). */
export function RampFunctionPlot() {
  const A = 1.5
  return (
    <Plot
      x={[-2, 4]}
      y={[-0.3, 5]}
      xLabel="t"
      yLabel="x(t)"
      series={[
        { points: [[-2, 0], [0, 0], [4, 4 * A]], label: 'x(t) = A·t, t ≥ 0', color: BLUE },
        { points: [[1, 0], [1, A]], dash: true, color: '#8b98a8' },
        { points: [[0, A], [1, A]], dash: true, color: '#8b98a8' },
      ]}
      points={[{ x: 1, y: A, label: '(1,\\,A)' }]}
      title="Ramp function (rampa fonksiyonu), drawn with A = 1.5"
    />
  )
}

/** Scaled and shifted versions of the three inputs. */
export function TestInputExplorer() {
  return (
    <Explorer
      title="Scaled and shifted test inputs"
      params={[
        { name: 'A', label: 'A', min: -2, max: 3, step: 0.1, value: 2 },
        { name: 't0', label: 't_0', min: 0, max: 3, step: 0.1, value: 1, unit: 's' },
      ]}
    >
      {({ A, t0 }) => (
        <>
          <Plot
            x={[-1, 6]}
            y={[Math.min(-0.5, A * 5.2), Math.max(1, A * 5.2)]}
            xLabel="t (s)"
            yLabel="x(t)"
            series={[
              { points: [[-1, 0], [t0, 0], [t0, A], [6, A]], label: 'A·u(t − t0)', color: BLUE },
              { points: [[-1, 0], [t0, 0], [6, A * (6 - t0)]], label: 'A·(t − t0)·u(t − t0)', color: PINK },
              { points: [[t0, A]], stem: true, label: 'A·δ(t − t0) (arrow = area A)', color: AMBER },
            ]}
            vlines={[{ x: t0, label: 't_0' }]}
          />
          <Readout
            rows={[
              [tex`\text{step: level}`, A],
              [tex`\text{ramp: slope}`, A],
              [tex`\text{impulse: area}`, A],
              [tex`\text{all start at } t_0`, `${fmtNum(t0)}\\,\\text{s}`],
            ]}
          />
        </>
      )}
    </Explorer>
  )
}

/** A steep ramp u_ε(t) becomes the unit step as ε→0; its derivative is a pulse of height 1/ε and area 1 → δ(t). */
export function StepToImpulseExplorer() {
  return (
    <Explorer
      title="Why δ(t) = du/dt: shrink the rise time ε of a 'nearly-step'"
      params={[{ name: 'eps', label: '\\varepsilon', min: 0.05, max: 2, step: 0.05, value: 1, unit: 's' }]}
    >
      {({ eps }) => (
        <>
          <Plot
            x={[-1, 4]}
            y={[-0.1, 1.3]}
            xLabel="t (s)"
            yLabel="u_ε(t)"
            series={[{ points: [[-1, 0], [0, 0], [eps, 1], [4, 1]], label: 'u_ε(t): rises from 0 to 1 in ε seconds', color: BLUE }]}
            title="The 'nearly-step' u_ε(t)"
          />
          <Plot
            x={[-1, 4]}
            y={[-0.5, 21]}
            xLabel="t (s)"
            yLabel="du_ε/dt"
            series={[
              { points: [[-1, 0], [0, 0], [0, 1 / eps], [eps, 1 / eps], [eps, 0], [4, 0]], label: 'du_ε/dt: pulse of height 1/ε, width ε', color: AMBER },
            ]}
            title="Its derivative: a pulse whose area is always 1"
          />
          <Readout
            rows={[
              [tex`\text{pulse width } \varepsilon`, eps],
              [tex`\text{pulse height } 1/\varepsilon`, 1 / eps],
              [tex`\text{area} = \varepsilon\cdot\frac{1}{\varepsilon}`, 1],
            ]}
          />
        </>
      )}
    </Explorer>
  )
}

/* ------------------------------------------------------------------ */
/*  2. Stability sketches (page 3), as real functions                   */
/* ------------------------------------------------------------------ */

/** Left graph of p. 3: "Kararlı Sistem". Illustrative functions. */
export function StablePlot() {
  const s = 0.45
  const wd = 2.2
  return (
    <Plot
      x={[0, 10]}
      y={[0, 1.7]}
      xLabel="t"
      yLabel="y(t)"
      series={[
        { fn: (t) => 1 - Math.exp(-s * t) * (Math.cos(wd * t) + (s / wd) * Math.sin(wd * t)), label: 'oscillating but decaying', color: BLUE },
        { fn: (t) => 1 - Math.exp(-0.9 * t), label: 'smooth, no overshoot', color: PINK },
      ]}
      hlines={[{ y: 1, label: '\\text{giriş (input)}' }]}
      title="Kararlı sistem (stable system): both outputs stay bounded and settle"
    />
  )
}

/** Right graph of p. 3: unstable responses. Illustrative functions. */
export function UnstablePlot() {
  return (
    <Plot
      x={[0, 10]}
      y={[0, 3.6]}
      xLabel="t"
      yLabel="y(t)"
      series={[
        { fn: (t) => 1 + 0.08 * (Math.exp(0.35 * t) - 1), label: 'exponential growth', color: BLUE },
        { fn: (t) => 1 + 0.05 * Math.exp(0.3 * t) * Math.sin(2.5 * t), label: 'oscillation with growing amplitude', color: PINK },
      ]}
      hlines={[{ y: 1, label: '\\text{giriş (input)}' }]}
      title="Unstable (kararsız) system: bounded input, unbounded output"
    />
  )
}

/* ------------------------------------------------------------------ */
/*  3. Annotated unit-step response (page 4) — custom SVG               */
/* ------------------------------------------------------------------ */

type StepMeasures = {
  tr: number
  tp: number
  ymax: number
  m: number
  ts: number
  tFirstEntry: number
}

function underdamped(K: number, z: number, wn: number) {
  const sd = Math.sqrt(1 - z * z)
  const wd = wn * sd
  return (t: number) => (t < 0 ? 0 : K * (1 - Math.exp(-z * wn * t) * (Math.cos(wd * t) + (z / sd) * Math.sin(wd * t))))
}

/** Measures read numerically off the sampled curve (exactly what you would do on a plotted response). */
function measure(y: (t: number) => number, K: number, tol: number, Tlong: number): StepMeasures {
  const N = 20000
  const dt = Tlong / N
  let tr = NaN
  let tp = 0
  let ymax = -Infinity
  let lastOut = 0
  let tFirstEntry = NaN
  let prev = y(0)
  for (let i = 1; i <= N; i++) {
    const t = i * dt
    const v = y(t)
    if (isNaN(tr) && prev < K && v >= K) tr = t - dt + ((K - prev) / (v - prev)) * dt
    if (v > ymax) {
      ymax = v
      tp = t
    }
    const out = Math.abs(v - K) > tol * K
    if (out) lastOut = t
    if (!out && isNaN(tFirstEntry)) tFirstEntry = t
    prev = v
  }
  return { tr, tp, ymax, m: ymax - K, ts: lastOut + dt, tFirstEntry }
}

function Head({ x, y, dir, color }: { x: number; y: number; dir: 'u' | 'd'; color: string }) {
  const s = dir === 'u' ? -1 : 1
  return <path d={`M${x},${y} L${x - 5},${y - s * 9} L${x + 5},${y - s * 9} z`} fill={color} />
}

/** The professor's annotated unit step response, drawn from a real underdamped curve. */
export function AnnotatedStepResponse({ K = 0.9, zeta = 0.3, wn = 1, tolPct = 2 }: { K?: number; zeta?: number; wn?: number; tolPct?: number }) {
  const tol = tolPct / 100
  const y = underdamped(K, zeta, wn)
  const Tlong = 12 / (zeta * wn)
  const ms = measure(y, K, tol, Tlong)
  const T = Math.max(ms.ts * 1.25, ms.tp * 2.2)
  const Ymax = Math.max(1, ms.ymax) * 1.15
  const Wd = 700
  const H = 400
  const pad = { l: 78, r: 130, t: 56, b: 46 }
  const sx = (t: number) => pad.l + (t / T) * (Wd - pad.l - pad.r)
  const sy = (v: number) => H - pad.b - (v / Ymax) * (H - pad.t - pad.b)
  let path = ''
  for (let i = 0; i <= 600; i++) {
    const t = (T * i) / 600
    path += `${i ? 'L' : 'M'}${sx(t).toFixed(1)},${sy(y(t)).toFixed(1)}`
  }
  const muted = 'var(--muted)'
  const fg = 'var(--fg)'
  const xEnd = Wd - pad.r + 8
  const essX = Wd - pad.r + 28
  const showY1 = Math.abs(K - 1) > 0.015
  return (
    <figure className="figure">
      <div className="figure-body">
        <svg viewBox={`0 0 ${Wd} ${H}`} style={{ width: '100%', maxWidth: 820 }} role="img" aria-label="annotated unit step response">
          {/* tolerance band */}
          <rect x={pad.l} width={xEnd - pad.l} y={sy(K * (1 + tol))} height={sy(K * (1 - tol)) - sy(K * (1 + tol))} fill="rgba(94,234,212,0.10)" />
          {/* axes */}
          <line x1={pad.l} y1={H - pad.b} x2={Wd - pad.r + 40} y2={H - pad.b} stroke={fg} strokeWidth={1.4} />
          <path d={`M${Wd - pad.r + 48},${H - pad.b} l-10,-5 l0,10 z`} fill={fg} />
          <line x1={pad.l} y1={H - pad.b} x2={pad.l} y2={pad.t - 30} stroke={fg} strokeWidth={1.4} />
          <path d={`M${pad.l},${pad.t - 38} l-5,10 l10,0 z`} fill={fg} />
          <SvgTex x={pad.l + 8} y={pad.t - 32} t="y(t)" align="l" size={15} />
          <SvgTex x={Wd - pad.r + 52} y={H - pad.b + 2} t="t" align="l" size={15} />
          {/* reference and steady-state lines */}
          <line x1={pad.l} x2={xEnd} y1={sy(1)} y2={sy(1)} stroke={muted} strokeDasharray="6 5" />
          <SvgTex x={pad.l - 6} y={sy(1) + (showY1 && K < 1 ? -6 : 0)} t="r(t)=1" align="r" size={13} />
          {showY1 && (
            <>
              <line x1={pad.l} x2={xEnd} y1={sy(K)} y2={sy(K)} stroke={muted} strokeDasharray="6 5" />
              <SvgTex x={pad.l - 6} y={sy(K) + (K < 1 ? 8 : -8)} t="y_{ss}" align="r" size={13} />
            </>
          )}
          {/* curve */}
          <path d={path} fill="none" stroke={TEAL} strokeWidth={2.4} strokeLinejoin="round" />
          {/* t_r */}
          {isFinite(ms.tr) && (
            <>
              <line x1={sx(ms.tr)} x2={sx(ms.tr)} y1={sy(K)} y2={H - pad.b} stroke={muted} strokeDasharray="4 4" />
              <SvgTex x={sx(ms.tr)} y={H - pad.b + 18} t="t_r" size={14} />
            </>
          )}
          {/* t_p and overshoot m */}
          <line x1={sx(ms.tp)} x2={sx(ms.tp)} y1={sy(ms.ymax)} y2={H - pad.b} stroke={muted} strokeDasharray="4 4" />
          <SvgTex x={sx(ms.tp)} y={H - pad.b + 18} t="t_p" size={14} />
          {ms.m > 0.01 && (
            <g>
              <line x1={sx(ms.tp)} x2={sx(ms.tp)} y1={sy(ms.ymax) + 9} y2={sy(K) - 9} stroke={BLUE} strokeWidth={2.4} />
              <Head x={sx(ms.tp)} y={sy(ms.ymax)} dir="u" color={BLUE} />
              <Head x={sx(ms.tp)} y={sy(K)} dir="d" color={BLUE} />
              <SvgTex x={sx(ms.tp) - 10} y={sy(ms.ymax) - 16} t="m" align="r" size={16} color={BLUE} />
            </g>
          )}
          {/* t_s */}
          <line x1={sx(ms.ts)} x2={sx(ms.ts)} y1={sy(y(ms.ts))} y2={H - pad.b - 1} stroke={muted} strokeDasharray="4 4" />
          <Head x={sx(ms.ts)} y={H - pad.b} dir="d" color={muted} />
          <SvgTex x={sx(ms.ts)} y={H - pad.b + 18} t="t_s" size={14} />
          {/* transient / steady-state labels */}
          <line x1={sx(ms.ts)} x2={sx(ms.ts)} y1={pad.t - 6} y2={pad.t + 10} stroke={fg} />
          <path d={`M${sx(ms.ts) - 6},${pad.t + 2} l-60,0`} stroke={fg} />
          <path d={`M${sx(ms.ts) - 66},${pad.t + 2} l8,-4 l0,8 z`} fill={fg} />
          <path d={`M${sx(ms.ts) + 6},${pad.t + 2} l60,0`} stroke={fg} />
          <path d={`M${sx(ms.ts) + 66},${pad.t + 2} l-8,-4 l0,8 z`} fill={fg} />
          <text x={sx(ms.ts) - 10} y={pad.t - 12} textAnchor="end" fill={fg} fontSize={13}>
            Geçici Durum (transient)
          </text>
          <text x={sx(ms.ts) + 10} y={pad.t - 12} textAnchor="start" fill={fg} fontSize={13}>
            Kalıcı Durum (steady state)
          </text>
          {/* e_ss */}
          {showY1 ? (
            <g>
              <line x1={essX} x2={essX} y1={sy(Math.max(1, K))} y2={sy(Math.min(1, K))} stroke="#7dd3fc" strokeWidth={1.4} strokeDasharray="2 3" />
              <line x1={essX} x2={essX} y1={sy(Math.max(1, K)) - 22} y2={sy(Math.max(1, K)) - 8} stroke="#7dd3fc" strokeWidth={2} />
              <Head x={essX} y={sy(Math.max(1, K))} dir="d" color="#7dd3fc" />
              <line x1={essX} x2={essX} y1={sy(Math.min(1, K)) + 22} y2={sy(Math.min(1, K)) + 8} stroke="#7dd3fc" strokeWidth={2} />
              <Head x={essX} y={sy(Math.min(1, K))} dir="u" color="#7dd3fc" />
              <SvgTex x={essX + 10} y={(sy(1) + sy(K)) / 2} t="e_{ss}" align="l" size={15} color="#7dd3fc" />
            </g>
          ) : (
            <SvgTex x={essX} y={sy(1) - 18} t="e_{ss}=0" align="l" size={14} color="#7dd3fc" />
          )}
        </svg>
      </div>
      <figcaption>
        Unit step response with the professor&apos;s annotations (p. 4). Curve: a real underdamped response with <M>{`y_{ss}=${fmtNum(K, 3)}`}</M>; shaded band = ±{tolPct}% of <M>{'y_{ss}'}</M>.
      </figcaption>
    </figure>
  )
}

/** Interactive version of the annotated figure, with the measured values. */
export function StepCriteriaExplorer() {
  return (
    <Explorer
      title="Unit step response: measure t_r, t_p, m, t_s, e_ss"
      params={[
        { name: 'K', label: 'y_{ss}', min: 0.6, max: 1.2, step: 0.01, value: 0.9 },
        { name: 'zeta', label: '\\text{damping knob } \\xi', min: 0.1, max: 0.9, step: 0.01, value: 0.3 },
        { name: 'wn', label: '\\text{speed knob } \\omega_n', min: 0.5, max: 5, step: 0.1, value: 1, unit: 'rad/s' },
        { name: 'tol', label: '\\text{tolerance}', min: 1, max: 10, step: 1, value: 2, unit: '\\%' },
      ]}
    >
      {({ K, zeta, wn, tol }) => {
        const y = underdamped(K, zeta, wn)
        const ms = measure(y, K, tol / 100, 12 / (zeta * wn))
        return (
          <>
            <AnnotatedStepResponse K={K} zeta={zeta} wn={wn} tolPct={tol} />
            <Readout
              rows={[
                [tex`y_{ss}`, K],
                [tex`e_{ss}=1-y_{ss}`, 1 - K],
                [tex`t_r\ (\text{first time } y=y_{ss})`, `${fmtNum(ms.tr)}\\,\\text{s}`],
                [tex`t_p`, `${fmtNum(ms.tp)}\\,\\text{s}`],
                [tex`y_{max}=y(t_p)`, ms.ymax],
                [tex`m=y_{max}-y_{ss}`, ms.m],
                [tex`m\ \text{as \% of } y_{ss}`, `${fmtNum((100 * ms.m) / K, 3)}\\%`],
                [tex`t_s\ (\text{stays in band})`, `${fmtNum(ms.ts)}\\,\\text{s}`],
                [tex`\text{first entry into band}`, `${fmtNum(ms.tFirstEntry)}\\,\\text{s}`],
              ]}
            />
          </>
        )
      }}
    </Explorer>
  )
}

/** Response used in the "reading parameters" example: y(t) = 0.8[1 − e^{−t}(cos 2t + 0.5 sin 2t)]. */
export function ReadingExamplePlot() {
  const y = (t: number) => 0.8 * (1 - Math.exp(-t) * (Math.cos(2 * t) + 0.5 * Math.sin(2 * t)))
  return (
    <Plot
      x={[0, 6]}
      y={[0, 1.1]}
      xLabel="t (s)"
      yLabel="y(t)"
      series={[{ fn: y, label: 'y(t)', color: TEAL }]}
      hlines={[{ y: 1, label: 'r=1' }, { y: 0.8, label: 'y_{ss}=0.8' }]}
      bands={[{ y1: 0.784, y2: 0.816 }]}
      vlines={[{ x: 1.0172, label: 't_r' }, { x: Math.PI / 2, label: 't_p' }]}
      points={[{ x: Math.PI / 2, y: 0.8 * (1 + Math.exp(-Math.PI / 2)), label: '0.966' }]}
      title="A measured step response (hover to read values)"
    />
  )
}

/* ------------------------------------------------------------------ */
/*  4. Circuits                                                         */
/* ------------------------------------------------------------------ */

/** Series RC circuit exactly as drawn on p. 7. */
export function RCCircuit() {
  return (
    <Circuit w={380} h={210} caption="Series RC circuit (p. 7): input V_s, output V_c across the capacitor, loop current I.">
      <V x1={70} y1={165} x2={70} y2={55} label="V_s" plus="b" flip />
      <W p={[[70, 55], [70, 40], [120, 40]]} />
      <R x1={120} y1={40} x2={210} y2={40} label="R" />
      <W p={[[210, 40], [280, 40]]} />
      <Arrow x={240} y={40} dir="r" label="I" />
      <C x1={280} y1={40} x2={280} y2={180} label="C" flip />
      <W p={[[70, 165], [70, 180], [280, 180]]} />
      <Vlabel a={[315, 82]} b={[315, 140]} label="V_c" side="r" />
    </Circuit>
  )
}

/** Series RL circuit for an additional example. */
export function RLCircuit() {
  return (
    <Circuit w={380} h={210} caption="Series RL circuit (additional example): input V_s, output the loop current i(t).">
      <V x1={70} y1={165} x2={70} y2={55} label="V_s" plus="b" flip />
      <W p={[[70, 55], [70, 40], [120, 40]]} />
      <R x1={120} y1={40} x2={210} y2={40} label="R" />
      <W p={[[210, 40], [280, 40]]} />
      <Arrow x={240} y={40} dir="r" label="i(t)" />
      <L x1={280} y1={40} x2={280} y2={180} label="L" flip />
      <W p={[[70, 165], [70, 180], [280, 180]]} />
      <Vlabel a={[315, 82]} b={[315, 140]} label="V_L" side="r" />
    </Circuit>
  )
}

/** Series RC circuit with the output taken across R (additional example). */
export function RCOutputRCircuit() {
  return (
    <Circuit w={400} h={210} caption="Same loop, but now the output is the resistor voltage V_R (additional example).">
      <V x1={70} y1={165} x2={70} y2={55} label="V_s" plus="b" flip />
      <W p={[[70, 55], [70, 40], [130, 40]]} />
      <C x1={130} y1={40} x2={210} y2={40} label="C" />
      <W p={[[210, 40], [280, 40]]} />
      <Dot x={280} y={40} />
      <Arrow x={245} y={40} dir="r" label="I" />
      <R x1={280} y1={40} x2={280} y2={180} label="R" flip />
      <W p={[[70, 165], [70, 180], [280, 180]]} />
      <Vlabel a={[315, 82]} b={[315, 140]} label="V_R" side="r" />
    </Circuit>
  )
}

/** Preview: the RC capacitor voltage for a constant (step) source, V_c(t) = V(1 − e^{−t/RC}). */
export function RCStepExplorer() {
  return (
    <Explorer
      title="Preview: RC circuit driven by a step V_s = V·u(t)"
      params={[
        { name: 'R', label: 'R', min: 1, max: 100, step: 1, value: 10, unit: 'kΩ' },
        { name: 'C', label: 'C', min: 10, max: 100, step: 5, value: 100, unit: 'μF' },
        { name: 'V', label: 'V', min: 1, max: 12, step: 0.5, value: 5, unit: 'V' },
      ]}
    >
      {({ R: Rk, C: Cu, V: Vv }) => {
        const tau = Rk * 1e3 * Cu * 1e-6
        const T = 6 * tau
        return (
          <>
            <Plot
              x={[0, T]}
              y={[0, Vv * 1.15]}
              xLabel="t (s)"
              yLabel="V_c(t)"
              series={[
                { points: [[0, Vv], [T, Vv]], label: 'V_s = V (input)', color: '#8b98a8', dash: true },
                { fn: (t) => Vv * (1 - Math.exp(-t / tau)), label: 'V_c(t) = V(1 − e^(−t/RC))', color: TEAL },
              ]}
              bands={[{ y1: 0.98 * Vv, y2: Vv * 1.02 }]}
              vlines={[{ x: tau, label: 'RC' }, { x: tau * Math.log(50), label: 't_s\\,(2\\%)' }]}
              points={[{ x: tau, y: Vv * (1 - Math.exp(-1)), label: '0.632\\,V' }]}
            />
            <Readout
              rows={[
                [tex`RC`, `${fmtNum(tau)}\\,\\text{s}`],
                [tex`V_c(\infty)=y_{ss}`, `${fmtNum(Vv)}\\,\\text{V}`],
                [tex`e_{ss}`, 0],
                [tex`m`, `0\\ (\\text{no overshoot})`],
                [tex`t_s\,(2\%)=RC\ln 50`, `${fmtNum(tau * Math.log(50))}\\,\\text{s}`],
                [tex`t_r\ (0\to y_{ss})`, `\\infty`],
              ]}
            />
          </>
        )
      }}
    </Explorer>
  )
}

/* ------------------------------------------------------------------ */
/*  5. e^{st} and the s-plane (page 8)                                  */
/* ------------------------------------------------------------------ */

export function ExpSTExplorer() {
  return (
    <Explorer
      title="What does the point s = σ + jω mean in time?"
      params={[
        { name: 'sig', label: '\\sigma', min: -1, max: 0.5, step: 0.05, value: -0.3 },
        { name: 'w', label: '\\omega', min: 0, max: 6, step: 0.1, value: 3, unit: 'rad/s' },
      ]}
    >
      {({ sig, w }) => {
        const kind =
          Math.abs(sig) < 1e-9 && w < 1e-9
            ? tex`e^{0}=1:\ \text{constant (sabit)}`
            : w < 1e-9
              ? sig < 0
                ? tex`\text{pure decay (sönüm)}`
                : tex`\text{pure growth (yükselme)}`
              : Math.abs(sig) < 1e-9
                ? tex`\text{pure oscillation (salınım)}`
                : sig < 0
                  ? tex`\text{decaying oscillation}`
                  : tex`\text{growing oscillation}`
        const top = Math.max(1.2, Math.exp(sig * 10) * 1.05)
        return (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <div style={{ flex: '2 1 360px', minWidth: 0 }}>
                <Plot
                  x={[0, 10]}
                  y={[-Math.min(top, 4), Math.min(top, 4)]}
                  xLabel="t (s)"
                  series={[
                    { fn: (t) => Math.exp(sig * t) * Math.cos(w * t), label: 'Re e^(st) = e^(σt)·cos ωt', color: TEAL },
                    { fn: (t) => Math.exp(sig * t), label: 'envelope e^(σt)', color: AMBER, dash: true },
                    { fn: (t) => -Math.exp(sig * t), color: AMBER, dash: true },
                  ]}
                />
              </div>
              <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                <SPlane poles={[{ re: sig, im: w, label: 's' }]} range={1.5} imRange={7} size={220} />
              </div>
            </div>
            <Readout
              rows={[
                [tex`s`, `${fmtNum(sig, 3)}${w >= 0 ? '+' : '-'}j${fmtNum(Math.abs(w), 3)}`],
                [tex`\text{behaviour}`, kind],
                [tex`|e^{st}|=e^{\sigma t}\text{ at } t=10`, Math.exp(sig * 10)],
              ]}
            />
          </>
        )
      }}
    </Explorer>
  )
}

/* ------------------------------------------------------------------ */
/*  6. The Laplace integral, evaluated numerically (pages 9–10)         */
/* ------------------------------------------------------------------ */

export function LaplaceIntegralExplorer() {
  return (
    <Explorer
      title="The Laplace integral as an area: check 1/s and 1/s²"
      params={[{ name: 's', label: 's\\ (\\text{real}, >0)', min: 0.2, max: 3, step: 0.05, value: 1 }]}
    >
      {({ s }) => {
        // trapezoid rule on [0, 60/s] — the integrand is negligible after that
        const Tend = 60 / s
        const N = 6000
        const h = Tend / N
        let I1 = 0
        let I2 = 0
        for (let i = 0; i <= N; i++) {
          const t = i * h
          const wgt = i === 0 || i === N ? 0.5 : 1
          I1 += wgt * Math.exp(-s * t)
          I2 += wgt * t * Math.exp(-s * t)
        }
        I1 *= h
        I2 *= h
        return (
          <>
            <Plot
              x={[0, 8]}
              y={[0, 1.1]}
              xLabel="t"
              series={[
                { fn: (t) => Math.exp(-s * t), label: 'u(t)·e^(−st)', color: BLUE },
                { fn: (t) => t * Math.exp(-s * t), label: 't·e^(−st)', color: PINK },
              ]}
              title="Integrands of L{u} and L{r}: the areas under these curves are F(s)"
            />
            <Readout
              rows={[
                [tex`\int_0^\infty e^{-st}dt\ \text{(numerical)}`, I1],
                [tex`1/s`, 1 / s],
                [tex`\int_0^\infty t\,e^{-st}dt\ \text{(numerical)}`, I2],
                [tex`1/s^2`, 1 / (s * s)],
              ]}
            />
          </>
        )
      }}
    </Explorer>
  )
}
