import { BD, Block, Sum, Line, Pick, Lbl } from '../../components/BlockDiagram'
import { Explorer, Readout, fmtNum } from '../../components/Explorer'
import { Plot } from '../../components/Plot'
import { SPlane } from '../../components/SPlane'
import { SvgTex } from '../../components/SvgTex'
import { Figure } from '../../components/Boxes'
import { tex } from '../../lib/tex'

/* ------------------------------------------------------------------ */
/* Shared maths (same formulas as taught in the lesson)                */
/* ------------------------------------------------------------------ */

const { exp, sin, cos, sqrt, PI, acos } = Math

const COL = {
  full: '#5eead4',
  approx: '#f9a8d4',
  third: '#fbbf24',
  blue: '#93c5fd',
  violet: '#c4b5fd',
  green: '#86efac',
  red: '#fca5a5',
}

/** Unit step response of ω_n²/(s²+2ξω_n s+ω_n²), 0<ξ<1 (Module 07 / p.5 of the notes). */
export function step2(xi: number, wn: number) {
  const a = xi * wn
  const w = wn * sqrt(1 - xi * xi)
  const k = xi / sqrt(1 - xi * xi)
  return (t: number) => (t < 0 ? 0 : 1 - exp(-a * t) * (cos(w * t) + k * sin(w * t)))
}

/** dy/dt of step2 = impulse response = ω_n/√(1-ξ²) e^{-αt} sin ωt (p.7). */
export function impulse2(xi: number, wn: number) {
  const a = xi * wn
  const w = wn * sqrt(1 - xi * xi)
  return (t: number) => (t < 0 ? 0 : (wn / sqrt(1 - xi * xi)) * exp(-a * t) * sin(w * t))
}

/** The formula values of the control criteria (p.6–8). */
export function criteria(xi: number, wn: number) {
  const a = xi * wn
  const w = wn * sqrt(1 - xi * xi)
  const th = acos(xi)
  const m = exp((-xi * PI) / sqrt(1 - xi * xi))
  return { a, w, th, tr: (PI - th) / w, tp: PI / w, m, ts2: 4 / a, ts5: 3 / a }
}

/** Numerically measured features of a step response y with final value yss. */
function measure(y: (t: number) => number, T: number, yss: number, tol = 0.02, N = 6000) {
  let pk = -Infinity
  let tpk = 0
  let tr = NaN
  let ts = 0
  const dt = T / N
  for (let i = 1; i <= N; i++) {
    const t = i * dt
    const v = y(t)
    if (v > pk) {
      pk = v
      tpk = t
    }
    if (isNaN(tr) && v >= yss) tr = t
    if (Math.abs(v - yss) > tol * Math.abs(yss)) ts = t
  }
  return { pk, tpk, tr, ts, m: (pk - yss) / yss }
}

/**
 * Step response of K / ((s+p)(s² + 2a s + a² + w²)) by partial fractions:
 * residue at 0, real residue at −p, complex residue at −a+jw (taken twice, real part).
 */
function step3(K: number, p: number, a: number, w: number) {
  const wn2 = a * a + w * w
  const Rp = K / (-p * ((a - p) ** 2 + w * w))
  // R = K / (s1 (s1+p) (2jw)), s1 = -a + jw
  const mul = (x: [number, number], y: [number, number]): [number, number] => [x[0] * y[0] - x[1] * y[1], x[0] * y[1] + x[1] * y[0]]
  const d = mul(mul([-a, w], [p - a, w]), [0, 2 * w])
  const den = d[0] ** 2 + d[1] ** 2
  const R: [number, number] = [(K * d[0]) / den, (-K * d[1]) / den]
  const dc = K / (p * wn2)
  const y = (t: number) => (t < 0 ? 0 : dc + Rp * exp(-p * t) + 2 * exp(-a * t) * (R[0] * cos(w * t) - R[1] * sin(w * t)))
  return { y, Rp, dc }
}

const deg = (r: number) => (r * 180) / PI
const n4 = (v: number) => fmtNum(v, 4)

/* ------------------------------------------------------------------ */
/* p.2 — dominant pole example                                         */
/* ------------------------------------------------------------------ */

export function DominantExamplePlot() {
  const full = (t: number) => 1 - (10 / 9) * exp(-t) + (1 / 9) * exp(-10 * t)
  const drop = (t: number) => 1 - (10 / 9) * exp(-t)
  const reduced = (t: number) => 1 - exp(-t)
  return (
    <Plot
      x={[0, 6]}
      y={[-0.15, 1.1]}
      xLabel="t (s)"
      yLabel="y(t)"
      title="T(s) = 10/((s+10)(s+1)): full step response vs dominant-pole approximations"
      series={[
        { fn: full, label: 'exact y(t) = 1 − (10/9)e^(−t) + (1/9)e^(−10t)', color: COL.full, width: 3 },
        { fn: drop, label: '1 − (10/9)e^(−t)  (far term dropped)', color: COL.approx, dash: true },
        { fn: reduced, label: '1 − e^(−t)  (reduced model 1/(s+1))', color: COL.blue, dash: true },
        { fn: (t) => (1 / 9) * exp(-10 * t), label: '(1/9)e^(−10t)  (far-pole term)', color: COL.third },
      ]}
      hlines={[{ y: 1, label: 'y(\\infty)=1' }]}
      vlines={[{ x: 0.5, label: 't=0.5' }]}
      points={[{ x: 0.5, y: full(0.5), label: '0.3268' }]}
    />
  )
}

export function DominantTermsPlot() {
  return (
    <Plot
      x={[0, 5]}
      y={[-1.15, 0.15]}
      xLabel="t (s)"
      yLabel="term"
      title="The two transient terms separately"
      series={[
        { fn: (t) => -(10 / 9) * exp(-t), label: '−(10/9)e^(−t)  (s1 = −1, τ = 1)', color: COL.approx },
        { fn: (t) => (1 / 9) * exp(-10 * t), label: '(1/9)e^(−10t)  (s2 = −10, τ = 0.1)', color: COL.third },
      ]}
      vlines={[{ x: 0.1, label: '\\tau_2' }, { x: 1, label: '\\tau_1' }]}
      points={[
        { x: 0.5, y: -(10 / 9) * exp(-0.5), label: '-0.674' },
        { x: 0.5, y: (1 / 9) * exp(-5), label: '0.00075' },
      ]}
    />
  )
}

/* ------------------------------------------------------------------ */
/* p.3–4 — effect of a zero                                            */
/* ------------------------------------------------------------------ */

const yP3 = (t: number) => 1 - 0.75 * exp(-3 * t) * sin(4 * t) - exp(-3 * t) * cos(4 * t)
const dyP3 = (t: number) => 6.25 * exp(-3 * t) * sin(4 * t)

export function ZeroEffectPlot() {
  return (
    <Plot
      x={[0, 2]}
      y={[0, 1.25]}
      xLabel="t (s)"
      yLabel="y(t)"
      title="Step responses of 25/(s²+6s+25) without a zero, with a zero at −25 and at −5 (same DC gain)"
      series={[
        { fn: yP3, label: 'y(t): no zero', color: COL.full },
        { fn: (t) => 1 - 0.5 * exp(-3 * t) * sin(4 * t) - exp(-3 * t) * cos(4 * t), label: 'y1(t): zero at −25', color: COL.blue },
        { fn: (t) => 1 + 0.5 * exp(-3 * t) * sin(4 * t) - exp(-3 * t) * cos(4 * t), label: 'y2(t): zero at −5', color: COL.approx },
      ]}
      hlines={[{ y: 1 }]}
      points={[
        { x: 0.7854, y: 1.0948, label: '1.095' },
        { x: 0.7404, y: 1.097, label: '' },
        { x: 0.5086, y: 1.1945, label: '1.195' },
      ]}
    />
  )
}

/* ------------------------------------------------------------------ */
/* p.5 — generic underdamped response with all criteria                */
/* ------------------------------------------------------------------ */

export function CriteriaSketchPlot() {
  const xi = 0.4
  const wn = 1
  const c = criteria(xi, wn)
  const y = step2(xi, wn)
  return (
    <Plot
      x={[0, 14]}
      y={[0, 1.35]}
      xLabel="t (s)"
      yLabel="y(t)"
      title="Underdamped step response (ξ = 0.4, ωn = 1 rad/s) with the control criteria"
      series={[{ fn: y, label: 'y(t)', color: COL.full, width: 3 }]}
      hlines={[{ y: 1, label: 'y_{ss}=1' }]}
      bands={[{ y1: 0.98, y2: 1.02 }]}
      vlines={[
        { x: c.tr, label: 't_r' },
        { x: c.tp, label: 't_p' },
        { x: c.ts2, label: 't_s' },
      ]}
      points={[
        { x: c.tr, y: 1, label: '' },
        { x: c.tp, y: 1 + c.m, label: 'm = 0.254' },
      ]}
    />
  )
}

/* Pole geometry: θ, π − θ, α, ω, ω_n */
export function PoleAngleFigure() {
  const W = 400
  const H = 290
  const ox = 290
  const oy = 145
  const sc = 22
  const a = 3
  const w = 4
  const px = ox - a * sc
  const py = oy - w * sc
  const arc = (r: number, f0: number, f1: number) => {
    const pts: string[] = []
    for (let i = 0; i <= 30; i++) {
      const f = f0 + ((f1 - f0) * i) / 30
      pts.push(`${(ox + r * cos(f)).toFixed(1)},${(oy - r * sin(f)).toFixed(1)}`)
    }
    return pts.join(' ')
  }
  const th = Math.atan2(w, a) // θ measured from the negative real axis
  return (
    <Figure caption="Geometry of the upper pole s = −α + jω: |s| = ωn, cos θ = α/ωn = ξ. Measured from the positive real axis the pole's angle is π − θ — this is the angle that appears in t_r.">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: 440, width: '100%' }} role="img" aria-label="pole angle">
        <line x1={20} y1={oy} x2={W - 10} y2={oy} stroke="var(--muted)" />
        <line x1={ox} y1={H - 10} x2={ox} y2={10} stroke="var(--muted)" />
        <SvgTex x={W - 12} y={oy + 14} t="\sigma" align="r" size={13} color="var(--muted)" />
        <SvgTex x={ox + 8} y={16} t="j\omega" align="l" size={13} color="var(--muted)" />
        {/* rays */}
        <line x1={ox} y1={oy} x2={px} y2={py} stroke={COL.approx} strokeWidth={2} />
        <line x1={ox} y1={oy} x2={px} y2={oy + w * sc} stroke={COL.approx} strokeWidth={1.2} strokeDasharray="4 4" />
        {/* α and ω legs */}
        <line x1={px} y1={py} x2={px} y2={oy} stroke={COL.blue} strokeDasharray="4 3" />
        <line x1={px} y1={oy - 2} x2={ox} y2={oy - 2} stroke={COL.third} strokeWidth={2} />
        {/* angle arcs */}
        <polyline points={arc(34, PI, PI - th)} fill="none" stroke={COL.full} strokeWidth={2} />
        <polyline points={arc(20, 0, PI - th)} fill="none" stroke={COL.violet} strokeWidth={1.6} />
        {/* poles */}
        {[py, oy + w * sc].map((yy, i) => (
          <g key={i} stroke={COL.approx} strokeWidth={2.6}>
            <line x1={px - 6} y1={yy - 6} x2={px + 6} y2={yy + 6} />
            <line x1={px - 6} y1={yy + 6} x2={px + 6} y2={yy - 6} />
          </g>
        ))}
        <SvgTex x={px - 8} y={py - 4} t="-\alpha+j\omega" align="r" size={13} />
        <SvgTex x={px - 8} y={oy + w * sc + 4} t="-\alpha-j\omega" align="r" size={13} />
        <SvgTex x={(px + ox) / 2 - 10} y={(py + oy) / 2 - 12} t="\omega_n" size={13} color={COL.approx} />
        <SvgTex x={px - 6} y={(py + oy) / 2} t="\omega" align="r" size={13} color={COL.blue} />
        <SvgTex x={(px + ox) / 2} y={oy + 12} t="\alpha=\xi\omega_n" size={12} color={COL.third} />
        <SvgTex x={ox - 44} y={oy - 18} t="\theta" size={13} color={COL.full} />
        <SvgTex x={ox + 22} y={oy - 26} t="\pi-\theta" align="l" size={13} color={COL.violet} />
      </svg>
    </Figure>
  )
}

/* p.7 — dy/dt and peaks */
export function PeakDerivativePlot() {
  const xi = 0.4
  const wn = 1
  const c = criteria(xi, wn)
  return (
    <Plot
      x={[0, 14]}
      y={[-0.3, 1.35]}
      xLabel="t (s)"
      title="y(t) and its derivative dy/dt (ξ = 0.4, ωn = 1): extrema of y where dy/dt = 0, i.e. ωt = π, 2π, 3π, …"
      series={[
        { fn: step2(xi, wn), label: 'y(t)', color: COL.full, width: 3 },
        { fn: impulse2(xi, wn), label: 'dy/dt = ωn/√(1−ξ²) e^(−αt) sin ωt', color: COL.third },
      ]}
      hlines={[{ y: 1 }]}
      vlines={[
        { x: c.tp, label: '\\pi/\\omega' },
        { x: 2 * c.tp, label: '2\\pi/\\omega' },
        { x: 3 * c.tp, label: '3\\pi/\\omega' },
      ]}
      points={[
        { x: c.tp, y: 1 + c.m, label: '\\max' },
        { x: 2 * c.tp, y: 1 - c.m * c.m, label: '\\min' },
      ]}
    />
  )
}

/* p.8 — envelope and settling time */
export function EnvelopePlot() {
  const xi = 0.4
  const wn = 1
  const c = criteria(xi, wn)
  const k = 1 / sqrt(1 - xi * xi)
  const meas = measure(step2(xi, wn), 20, 1, 0.02)
  return (
    <Plot
      x={[0, 14]}
      y={[0, 1.55]}
      xLabel="t (s)"
      yLabel="y(t)"
      title="Settling: the oscillation lives inside the envelope 1 ± e^(−ξωn t)/√(1−ξ²) (ξ = 0.4, ωn = 1)"
      series={[
        { fn: step2(xi, wn), label: 'y(t)', color: COL.full, width: 3 },
        { fn: (t) => 1 + k * exp(-c.a * t), label: '1 ± e^(−ξωn t)/√(1−ξ²)  (exact envelope)', color: COL.approx, dash: true },
        { fn: (t) => 1 - k * exp(-c.a * t), color: COL.approx, dash: true },
        { fn: (t) => 1 + exp(-c.a * t), label: '1 ± e^(−ξωn t)  (notes\' approximation)', color: COL.blue, dash: true },
        { fn: (t) => 1 - exp(-c.a * t), color: COL.blue, dash: true },
      ]}
      bands={[{ y1: 0.98, y2: 1.02 }]}
      vlines={[
        { x: c.ts2, label: 't_s=4/\\xi\\omega_n' },
        { x: meas.ts, label: '\\text{true}' },
      ]}
    />
  )
}

/* ------------------------------------------------------------------ */
/* p.9–10 — worked example                                              */
/* ------------------------------------------------------------------ */

export function ExampleBD() {
  return (
    <BD w={560} h={170} caption="Unity negative feedback system of the example (p. 9): G(s) = 70/(s²+12s+30), H = 1">
      <Lbl x={40} y={50} t="R(s)" />
      <Line p={[[20, 70], [136, 70]]} />
      <Sum x={150} y={70} signs={{ l: '+', b: '-' }} />
      <Line p={[[164, 70], [245, 70]]} />
      <Lbl x={205} y={50} t="E(s)" />
      <Block x={320} y={70} t="\frac{70}{s^2+12s+30}" w={150} h={54} />
      <Line p={[[395, 70], [530, 70]]} />
      <Pick x={460} y={70} />
      <Lbl x={515} y={50} t="Y(s)" />
      <Line p={[[460, 70], [460, 140], [150, 140], [150, 84]]} />
    </BD>
  )
}

export function ExampleResponsePlot() {
  const y = (t: number) => 0.7 * (1 - exp(-6 * t) * (cos(8 * t) + 0.75 * sin(8 * t)))
  const c = criteria(0.6, 10)
  return (
    <Plot
      x={[0, 1]}
      y={[0, 0.85]}
      xLabel="t (s)"
      yLabel="y(t)"
      title="y(t) = 0.7[1 − e^(−6t)(cos 8t + 0.75 sin 8t)]"
      series={[{ fn: y, label: 'y(t)', color: COL.full, width: 3 }]}
      hlines={[
        { y: 0.766, label: '0.766' },
        { y: 0.7, label: '0.7' },
      ]}
      bands={[{ y1: 0.686, y2: 0.714 }]}
      vlines={[
        { x: c.tr, label: 't_r' },
        { x: c.tp, label: 't_p' },
        { x: c.ts2, label: 't_s' },
      ]}
      points={[
        { x: c.tr, y: 0.7, label: '0.277' },
        { x: c.tp, y: 0.7 * (1 + c.m), label: '(0.393,\\,0.766)' },
      ]}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Interactive 1 — criteria explorer                                   */
/* ------------------------------------------------------------------ */

export function CriteriaExplorer() {
  return (
    <Explorer
      title="Control criteria of the underdamped 2nd-order step response"
      params={[
        { name: 'xi', label: '\\xi', min: 0.05, max: 0.95, step: 0.01, value: 0.6 },
        { name: 'wn', label: '\\omega_n', min: 1, max: 20, step: 0.5, value: 10, unit: 'rad/s' },
        { name: 'band', label: '\\text{band }(\\%)', min: 2, max: 5, step: 3, value: 2 },
      ]}
    >
      {({ xi, wn, band }) => {
        const c = criteria(xi, wn)
        const y = step2(xi, wn)
        const tol = band / 100
        const ts = band === 2 ? c.ts2 : c.ts5
        const T = Math.max(1.3 * ts, 2.2 * c.tp)
        const meas = measure(y, Math.max(T, 12 / c.a), 1, tol, 12000)
        const R = wn * 1.25
        return (
          <>
            <Plot
              x={[0, T]}
              y={[0, Math.max(1.25, 1 + c.m + 0.1)]}
              xLabel="t (s)"
              yLabel="y(t)"
              series={[{ fn: y, label: 'y(t)', color: COL.full, width: 3 }]}
              hlines={[{ y: 1 }]}
              bands={[{ y1: 1 - tol, y2: 1 + tol }]}
              vlines={[
                { x: c.tr, label: 't_r' },
                { x: c.tp, label: 't_p' },
                { x: ts, label: 't_s' },
              ]}
              points={[
                { x: c.tr, y: 1, label: '' },
                { x: c.tp, y: 1 + c.m, label: 'm' },
              ]}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ flex: '1 1 260px' }}>
                <SPlane
                  poles={[
                    { re: -c.a, im: c.w, label: `-${n4(c.a)}+j${n4(c.w)}` },
                    { re: -c.a, im: -c.w },
                  ]}
                  lines={[
                    { re: -c.a, im: c.w },
                    { re: -c.a, im: -c.w, dash: true },
                  ]}
                  range={R}
                  imRange={R}
                  size={240}
                  caption={`θ = cos⁻¹ξ = ${deg(c.th).toFixed(2)}° (angle between the pole ray and the negative real axis)`}
                />
              </div>
              <div style={{ flex: '1 1 260px' }}>
                <Readout
                  rows={[
                    [tex`\alpha=\xi\omega_n`, c.a],
                    [tex`\omega=\omega_n\sqrt{1-\xi^2}`, c.w],
                    [tex`\theta=\cos^{-1}\xi`, `${n4(deg(c.th))}^\\circ = ${n4(c.th)}\\,\\text{rad}`],
                    [tex`t_r=(\pi-\theta)/\omega`, `${n4(c.tr)}\\,\\text{s}`],
                    [tex`t_p=\pi/\omega`, `${n4(c.tp)}\\,\\text{s}`],
                    [tex`\%m=100\,e^{-\xi\pi/\sqrt{1-\xi^2}}`, `${n4(100 * c.m)}\\,\\%`],
                    [band === 2 ? tex`t_s=4/(\xi\omega_n)` : tex`t_s=3/(\xi\omega_n)`, `${n4(ts)}\\,\\text{s}`],
                    [tex`t_s\ \text{measured on the curve}`, `${n4(meas.ts)}\\,\\text{s}`],
                  ]}
                />
              </div>
            </div>
          </>
        )
      }}
    </Explorer>
  )
}

/* ------------------------------------------------------------------ */
/* Interactive 2 — far pole explorer                                   */
/* ------------------------------------------------------------------ */

export function FarPoleExplorer() {
  return (
    <Explorer
      title="Dominant-pole explorer: add a real pole at s = −p to 25/(s²+6s+25)"
      params={[{ name: 'p', label: 'p', min: 1, max: 60, step: 0.5, value: 15 }]}
    >
      {({ p }) => {
        const third = step3(25 * p, p, 3, 4)
        const approx = yP3
        const mf = measure(third.y, 4, 1, 0.02, 8000)
        const ma = measure(approx, 4, 1, 0.02, 8000)
        const R = Math.max(7, p * 1.15)
        return (
          <>
            <Plot
              x={[0, 2.5]}
              y={[0, 1.25]}
              xLabel="t (s)"
              yLabel="y(t)"
              series={[
                { fn: third.y, label: 'full: 25p/((s+p)(s²+6s+25))', color: COL.third, width: 3 },
                { fn: approx, label: 'dominant pair only: 25/(s²+6s+25)', color: COL.full, dash: true },
              ]}
              hlines={[{ y: 1 }]}
              bands={[{ y1: 0.98, y2: 1.02 }]}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ flex: '1 1 260px' }}>
                <SPlane
                  poles={[
                    { re: -3, im: 4, label: '-3+j4' },
                    { re: -3, im: -4 },
                    { re: -p, im: 0, label: `-${p}`, color: COL.third },
                  ]}
                  range={R}
                  imRange={6}
                  size={220}
                  caption="Dominant pair at −3 ± j4 (closest to the jω axis); the extra pole moves with the slider."
                />
              </div>
              <div style={{ flex: '1 1 260px' }}>
                <Readout
                  rows={[
                    [tex`p/\alpha\ \ (\text{distance ratio})`, p / 3],
                    [tex`\tau_{far}=1/p`, `${n4(1 / p)}\\,\\text{s}`],
                    [tex`\text{residue of far pole } -\tfrac{25}{(p-3)^2+16}`, third.Rp],
                    [tex`\%m\ \text{full / approx}`, `${n4(100 * mf.m)}\\ /\\ ${n4(100 * ma.m)}`],
                    [tex`t_p\ \text{full / approx}`, `${n4(mf.tpk)}\\ /\\ ${n4(ma.tpk)}\\,\\text{s}`],
                    [tex`t_s\,(2\%)\ \text{full / approx}`, `${n4(mf.ts)}\\ /\\ ${n4(ma.ts)}\\,\\text{s}`],
                  ]}
                />
              </div>
            </div>
          </>
        )
      }}
    </Explorer>
  )
}

/* ------------------------------------------------------------------ */
/* Interactive 3 — zero explorer                                       */
/* ------------------------------------------------------------------ */

export function ZeroExplorer() {
  return (
    <Explorer
      title="Zero explorer: T(s) = (25/z)(s+z)/(s²+6s+25), DC gain kept at 1"
      params={[{ name: 'z', label: 'z', min: 1.5, max: 60, step: 0.5, value: 5 }]}
    >
      {({ z }) => {
        const yz = (t: number) => yP3(t) + dyP3(t) / z
        const mz = measure(yz, 4, 1, 0.02, 8000)
        const m0 = measure(yP3, 4, 1, 0.02, 8000)
        const coef = -0.75 + 6.25 / z
        const R = Math.max(7, z * 1.15)
        return (
          <>
            <Plot
              x={[0, 2.5]}
              y={[0, Math.max(1.3, mz.pk + 0.08)]}
              xLabel="t (s)"
              yLabel="y(t)"
              series={[
                { fn: yP3, label: 'y(t) (no zero)', color: COL.full, dash: true },
                { fn: yz, label: 'y_z(t) = y + (1/z)·dy/dt', color: COL.approx, width: 3 },
                { fn: (t) => dyP3(t) / z, label: '(1/z)·dy/dt', color: COL.violet },
              ]}
              hlines={[{ y: 1 }]}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ flex: '1 1 260px' }}>
                <SPlane
                  poles={[
                    { re: -3, im: 4, label: '-3+j4' },
                    { re: -3, im: -4 },
                  ]}
                  zeros={[{ re: -z, im: 0, label: `-${z}` }]}
                  range={R}
                  imRange={6}
                  size={220}
                />
              </div>
              <div style={{ flex: '1 1 260px' }}>
                <Readout
                  rows={[
                    [tex`y_z=1-e^{-3t}\cos4t+c\,e^{-3t}\sin4t,\ c`, coef],
                    [tex`\%m\ \text{with zero / without}`, `${n4(100 * mz.m)}\\ /\\ ${n4(100 * m0.m)}`],
                    [tex`t_p\ \text{with / without}`, `${n4(mz.tpk)}\\ /\\ ${n4(m0.tpk)}\\,\\text{s}`],
                    [tex`t_r\ \text{with / without}`, `${n4(mz.tr)}\\ /\\ ${n4(m0.tr)}\\,\\text{s}`],
                  ]}
                />
              </div>
            </div>
          </>
        )
      }}
    </Explorer>
  )
}
