import { Circuit, R, C, L, V, I, W, Dot, Port, Arrow, Vlabel } from '../../components/Circuit'
import { BD, Block, Line, Lbl } from '../../components/BlockDiagram'
import { Explorer, Readout, fmtNum } from '../../components/Explorer'
import { Plot } from '../../components/Plot'
import { SPlane } from '../../components/SPlane'

/* ------------------------------------------------------------------ */
/* The modelling chain                                                  */
/* ------------------------------------------------------------------ */

export function ChainDiagram() {
  return (
    <BD w={760} h={200} caption="Two routes from a circuit to its time response. Top (I. yol, p. 4): write the differential equation, then Laplace-transform it. Bottom (II. yol, p. 5): Laplace-transform each element first (impedances) and use ordinary circuit rules directly in the s-domain.">
      <Block x={70} y={60} t="\text{Circuit}" w={100} h={44} />
      <Line p={[[120, 60], [215, 60]]} />
      <Lbl x={168} y={30} t="\text{element laws}" size={12} />
      <Lbl x={168} y={44} t="+\,\text{KVL/KCL}" size={12} />
      <Block x={265} y={60} t="\text{ODE in } t" w={100} h={44} />
      <Line p={[[315, 60], [405, 60]]} />
      <Lbl x={360} y={40} t="\mathcal{L}" size={13} />
      <Block x={480} y={60} t="\text{algebra in } s" w={150} h={44} />
      <Line p={[[555, 60], [640, 60]]} />
      <Lbl x={598} y={40} t="\mathcal{L}^{-1}" size={13} />
      <Block x={690} y={60} t="v(t)" w={100} h={44} />
      <Line p={[[70, 82], [70, 150], [480, 150], [480, 82]]} />
      <Lbl x={275} y={168} t="\text{II. yol: } Z_R=R,\ Z_C=\tfrac{1}{sC},\ Z_L=sL \ \text{+ voltage divider}" size={12} />
    </BD>
  )
}

/* ------------------------------------------------------------------ */
/* Element drawings (pages 1–3): time domain and s-domain               */
/* ------------------------------------------------------------------ */

type Kind = 'R' | 'C' | 'L'

export function Element({ kind, s = false }: { kind: Kind; s?: boolean }) {
  const lab = kind === 'R' ? 'R' : kind === 'C' ? 'C' : 'L'
  const Part = kind === 'R' ? R : kind === 'C' ? C : L
  return (
    <Circuit
      w={260}
      h={100}
      maxWidth={300}
      caption={s ? `${kind === 'R' ? 'Resistor' : kind === 'C' ? 'Capacitor' : 'Inductor'} — s-domain labels` : `${kind === 'R' ? 'Resistor' : kind === 'C' ? 'Capacitor' : 'Inductor'} — time domain`}
    >
      <W p={[[20, 45], [80, 45]]} />
      <Arrow x={45} y={45} dir="r" label={s ? 'I(s)' : 'i(t)'} />
      <Part x1={80} y1={45} x2={180} y2={45} label={lab} />
      <W p={[[180, 45], [240, 45]]} />
      <Vlabel a={[95, 78]} b={[165, 78]} label={s ? 'V(s)' : 'v(t)'} side="c" />
    </Circuit>
  )
}

/** Capacitor with initial voltage — series form: V(s) = (1/sC) I(s) + v(0)/s */
export function CapSeriesModel() {
  return (
    <Circuit w={320} h={120} maxWidth={380} caption="Charged capacitor, series form: impedance 1/(sC) in series with a step-voltage source v(0)/s. Reads directly as V(s) = I(s)/(sC) + v(0)/s.">
      <Port x={20} y={50} />
      <W p={[[24, 50], [80, 50]]} />
      <Arrow x={50} y={50} dir="r" label="I(s)" />
      <C x1={80} y1={50} x2={150} y2={50} label="\frac{1}{sC}" lo={6} />
      <W p={[[150, 50], [190, 50]]} />
      <V x1={190} y1={50} x2={260} y2={50} plus="a" label="\frac{v(0)}{s}" lo={8} />
      <W p={[[260, 50], [296, 50]]} />
      <Port x={300} y={50} />
      <Vlabel a={[20, 92]} b={[300, 92]} label="V(s)" side="c" />
    </Circuit>
  )
}

/** Capacitor with initial voltage — parallel form: I(s) = sC V(s) − C v(0) */
export function CapParallelModel() {
  return (
    <Circuit w={320} h={190} maxWidth={380} caption="Charged capacitor, parallel form: impedance 1/(sC) in parallel with a current source C·v(0) pointing toward the + terminal. KCL at the left node gives I(s) = sC·V(s) − C·v(0).">
      <Port x={20} y={80} />
      <W p={[[24, 80], [70, 80]]} />
      <Arrow x={45} y={80} dir="r" label="I(s)" />
      <Dot x={70} y={80} />
      <W p={[[70, 40], [70, 125]]} />
      <W p={[[70, 40], [120, 40]]} />
      <C x1={120} y1={40} x2={200} y2={40} label="\frac{1}{sC}" lo={6} />
      <W p={[[200, 40], [250, 40]]} />
      <W p={[[70, 125], [125, 125]]} />
      <I x1={125} y1={125} x2={195} y2={125} dir="a" label="C\,v(0)" flip />
      <W p={[[195, 125], [250, 125]]} />
      <W p={[[250, 40], [250, 125]]} />
      <Dot x={250} y={80} />
      <W p={[[250, 80], [296, 80]]} />
      <Port x={300} y={80} />
      <Vlabel a={[20, 108]} b={[300, 108]} label="V(s)" side="c" />
    </Circuit>
  )
}

/** Inductor with initial current — series form: V(s) = sL I(s) − L i(0) */
export function IndSeriesModel() {
  return (
    <Circuit w={320} h={120} maxWidth={380} caption="Inductor with initial current, series form: impedance sL in series with a voltage source L·i(0) whose + faces the − terminal. Reads as V(s) = sL·I(s) − L·i(0).">
      <Port x={20} y={50} />
      <W p={[[24, 50], [70, 50]]} />
      <Arrow x={45} y={50} dir="r" label="I(s)" />
      <L x1={70} y1={50} x2={160} y2={50} label="sL" />
      <W p={[[160, 50], [190, 50]]} />
      <V x1={190} y1={50} x2={260} y2={50} plus="b" label="L\,i(0)" />
      <W p={[[260, 50], [296, 50]]} />
      <Port x={300} y={50} />
      <Vlabel a={[20, 92]} b={[300, 92]} label="V(s)" side="c" />
    </Circuit>
  )
}

/** Inductor with initial current — parallel form: I(s) = V(s)/(sL) + i(0)/s */
export function IndParallelModel() {
  return (
    <Circuit w={320} h={190} maxWidth={380} caption="Inductor with initial current, parallel form: impedance sL in parallel with a step-current source i(0)/s in the same direction as I(s). KCL gives I(s) = V(s)/(sL) + i(0)/s.">
      <Port x={20} y={80} />
      <W p={[[24, 80], [70, 80]]} />
      <Arrow x={45} y={80} dir="r" label="I(s)" />
      <Dot x={70} y={80} />
      <W p={[[70, 40], [70, 125]]} />
      <W p={[[70, 40], [115, 40]]} />
      <L x1={115} y1={40} x2={205} y2={40} label="sL" />
      <W p={[[205, 40], [250, 40]]} />
      <W p={[[70, 125], [125, 125]]} />
      <I x1={125} y1={125} x2={195} y2={125} dir="b" label="\frac{i(0)}{s}" flip lo={6} />
      <W p={[[195, 125], [250, 125]]} />
      <W p={[[250, 40], [250, 125]]} />
      <Dot x={250} y={80} />
      <W p={[[250, 80], [296, 80]]} />
      <Port x={300} y={80} />
      <Vlabel a={[20, 108]} b={[300, 108]} label="V(s)" side="c" />
    </Circuit>
  )
}

/* ------------------------------------------------------------------ */
/* Professor's circuits                                                 */
/* ------------------------------------------------------------------ */

/** Page 4: series RC, time domain */
export function RCTime() {
  return (
    <Circuit w={380} h={200} maxWidth={420} caption="Page 4: series RC circuit. Source V_s (+ on top), R on the top wire, C on the right branch; the output V_c is the capacitor voltage.">
      <V x1={60} y1={160} x2={60} y2={50} plus="b" label="V_s" flip />
      <W p={[[60, 50], [130, 50]]} />
      <R x1={130} y1={50} x2={230} y2={50} label="R" />
      <W p={[[230, 50], [290, 50]]} />
      <C x1={290} y1={50} x2={290} y2={160} label="C" flip />
      <W p={[[290, 160], [60, 160]]} />
      <Vlabel a={[325, 78]} b={[325, 134]} label="V_c" side="r" />
    </Circuit>
  )
}

/** Page 5: same RC circuit in the s-domain */
export function RCs() {
  return (
    <Circuit w={400} h={200} maxWidth={440} caption="Page 5 (II. yol): the same circuit with every element replaced by its Laplace form — source 1/s (unit step), R, and the capacitor impedance 1/(sC).">
      <V x1={60} y1={160} x2={60} y2={50} plus="b" label="\frac{1}{s}" flip />
      <W p={[[60, 50], [130, 50]]} />
      <R x1={130} y1={50} x2={230} y2={50} label="R" flip />
      <W p={[[230, 50], [290, 50]]} />
      <C x1={290} y1={50} x2={290} y2={160} label="\frac{1}{sC}" />
      <W p={[[290, 160], [60, 160]]} />
      <Vlabel a={[355, 78]} b={[355, 134]} label="V_c" side="r" />
    </Circuit>
  )
}

/** Page 6: series RLC, time domain */
export function RLCTime() {
  return (
    <Circuit w={420} h={200} maxWidth={460} caption="Page 6: series RLC circuit. Input V_i, R and L on the top wire, C on the right branch; output V_o across C.">
      <V x1={50} y1={160} x2={50} y2={50} plus="b" label="V_i" flip />
      <W p={[[50, 50], [100, 50]]} />
      <R x1={100} y1={50} x2={190} y2={50} label="R" flip />
      <W p={[[190, 50], [210, 50]]} />
      <L x1={210} y1={50} x2={300} y2={50} label="L" flip />
      <W p={[[300, 50], [340, 50]]} />
      <C x1={340} y1={50} x2={340} y2={160} label="C" flip />
      <W p={[[340, 160], [50, 160]]} />
      <Vlabel a={[375, 78]} b={[375, 134]} label="V_o" side="r" />
    </Circuit>
  )
}

/** Page 6: series RLC, s-domain */
export function RLCs() {
  return (
    <Circuit w={420} h={200} maxWidth={460} caption="Page 6: the same RLC circuit in the s-domain: R, Ls and 1/(Cs) behave like resistances in the voltage-divider rule.">
      <V x1={50} y1={160} x2={50} y2={50} plus="b" label="V_i(s)" flip />
      <W p={[[50, 50], [100, 50]]} />
      <R x1={100} y1={50} x2={190} y2={50} label="R" />
      <W p={[[190, 50], [210, 50]]} />
      <L x1={210} y1={50} x2={300} y2={50} label="Ls" />
      <W p={[[300, 50], [340, 50]]} />
      <C x1={340} y1={50} x2={340} y2={160} label="\frac{1}{Cs}" flip />
      <W p={[[340, 160], [50, 160]]} />
      <Vlabel a={[375, 78]} b={[375, 134]} label="V_o(s)" side="r" />
    </Circuit>
  )
}

/* ------------------------------------------------------------------ */
/* Additional-example circuits                                          */
/* ------------------------------------------------------------------ */

/** RC with output across R */
export function RCHighPass() {
  return (
    <Circuit w={380} h={200} maxWidth={420} caption="Same series loop, but C is on the top wire and the output v_R is taken across R.">
      <V x1={60} y1={160} x2={60} y2={50} plus="b" label="V_s" flip />
      <W p={[[60, 50], [150, 50]]} />
      <C x1={150} y1={50} x2={210} y2={50} label="C" />
      <W p={[[210, 50], [290, 50]]} />
      <R x1={290} y1={50} x2={290} y2={160} label="R" flip />
      <W p={[[290, 160], [60, 160]]} />
      <Arrow x={250} y={50} dir="r" label="i(t)" />
      <Vlabel a={[325, 78]} b={[325, 134]} label="v_R" side="r" />
    </Circuit>
  )
}

/** Series RL circuit */
export function RLCircuit() {
  return (
    <Circuit w={380} h={200} maxWidth={420} caption="Series RL circuit: source V_s, R on the top wire, L on the right branch, loop current i(t).">
      <V x1={60} y1={160} x2={60} y2={50} plus="b" label="V_s" flip />
      <W p={[[60, 50], [130, 50]]} />
      <R x1={130} y1={50} x2={230} y2={50} label="R" />
      <W p={[[230, 50], [290, 50]]} />
      <Arrow x={260} y={50} dir="r" label="i(t)" />
      <L x1={290} y1={50} x2={290} y2={160} label="L" flip />
      <W p={[[290, 160], [60, 160]]} />
      <Vlabel a={[325, 78]} b={[325, 134]} label="v_L" side="r" />
    </Circuit>
  )
}

/** RC with charged capacitor, s-domain (series model for C) */
export function RCwithICs() {
  return (
    <Circuit w={420} h={230} maxWidth={460} caption="s-domain circuit of an RC loop whose capacitor starts at v(0)=V_0: the capacitor is replaced by its series model 1/(sC) plus the source V_0/s. V_c(s) is measured across the whole capacitor model (both parts).">
      <V x1={60} y1={185} x2={60} y2={45} plus="b" label="\frac{V_s}{s}" flip />
      <W p={[[60, 45], [130, 45]]} />
      <R x1={130} y1={45} x2={230} y2={45} label="R" />
      <Arrow x={260} y={45} dir="r" label="I(s)" />
      <W p={[[230, 45], [300, 45]]} />
      <C x1={300} y1={45} x2={300} y2={105} label="\frac{1}{sC}" flip lo={-4} />
      <V x1={300} y1={115} x2={300} y2={185} plus="a" label="\frac{V_0}{s}" flip />
      <W p={[[300, 105], [300, 115]]} />
      <W p={[[300, 185], [60, 185]]} />
      <Vlabel a={[350, 60]} b={[350, 172]} label="V_c(s)" side="r" />
    </Circuit>
  )
}

/* ------------------------------------------------------------------ */
/* Plots                                                                */
/* ------------------------------------------------------------------ */

/** Static plot for page 4/5 result, normalised time */
export function RCNormalised() {
  const e = Math.exp(-1)
  return (
    <Plot
      x={[0, 5]}
      y={[0, 1.15]}
      xLabel="t / RC"
      yLabel="V_c (V)"
      series={[
        { fn: (t) => 1 - Math.exp(-t), label: 'V_c(t) = 1 − e^(−t/RC)' },
        { fn: (t) => t, label: 'tangent at t = 0', dash: true },
      ]}
      hlines={[{ y: 1, label: 'V_s = 1' }]}
      vlines={[{ x: 1, label: 't=RC=\\tau' }]}
      points={[
        { x: 1, y: 1 - e, label: '0.632' },
        { x: 2, y: 1 - Math.exp(-2), label: '0.865' },
        { x: 3, y: 1 - Math.exp(-3), label: '0.950' },
        { x: 4, y: 1 - Math.exp(-4), label: '0.982' },
      ]}
    />
  )
}

export function HighPassPlot() {
  return (
    <Plot
      x={[0, 5]}
      y={[0, 1.15]}
      xLabel="t / RC"
      yLabel="volts (V_s = 1)"
      series={[
        { fn: (t) => Math.exp(-t), label: 'v_R(t) = e^(−t/RC)' },
        { fn: (t) => 1 - Math.exp(-t), label: 'v_C(t) = 1 − e^(−t/RC)', dash: true },
      ]}
      points={[{ x: 1, y: Math.exp(-1), label: '0.368' }]}
      hlines={[{ y: 1, label: '1' }]}
    />
  )
}

export function RLPlot() {
  return (
    <Plot
      x={[0, 0.15]}
      y={[0, 0.58]}
      xLabel="t (s)"
      yLabel="i (A)"
      series={[{ fn: (t) => 0.5 * (1 - Math.exp(-40 * t)), label: 'i(t) = 0.5(1 − e^(−40t))' }]}
      hlines={[{ y: 0.5, label: 'V_s/R=0.5\\,\\text{A}' }]}
      vlines={[{ x: 0.025, label: '\\tau=L/R=25\\,\\text{ms}' }]}
      points={[{ x: 0.025, y: 0.5 * (1 - Math.exp(-1)), label: '0.316' }]}
    />
  )
}

export function RCwithICPlot() {
  return (
    <Plot
      x={[0, 5]}
      y={[0, 11]}
      xLabel="t (s)"
      yLabel="v_c (V)"
      series={[
        { fn: (t) => 10 - 6 * Math.exp(-t), label: 'total v_c = 10 − 6e^(−t)' },
        { fn: (t) => 10 * (1 - Math.exp(-t)), label: 'zero-state part 10(1 − e^(−t))', dash: true },
        { fn: (t) => 4 * Math.exp(-t), label: 'initial-condition part 4e^(−t)', dash: true },
      ]}
      hlines={[{ y: 10, label: 'V_s=10' }]}
      points={[
        { x: 0, y: 4, label: 'v(0)=4' },
        { x: 1, y: 10 - 6 * Math.exp(-1), label: '7.79' },
      ]}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Interactive: RC charging                                             */
/* ------------------------------------------------------------------ */

export function RCExplorer() {
  return (
    <Explorer
      title="RC charging: change R, C and the step height"
      params={[
        { name: 'R', label: 'R', min: 1, max: 10, step: 0.1, value: 2, unit: 'k}\\Omega\\text{' },
        { name: 'C', label: 'C', min: 10, max: 500, step: 10, value: 250, unit: '}\\mu\\text{F' },
        { name: 'Vs', label: 'V_s', min: 1, max: 12, step: 0.5, value: 5, unit: 'V' },
      ]}
    >
      {({ R: r, C: c, Vs }) => {
        const tau = r * 1e3 * c * 1e-6 // seconds
        const v = (t: number) => Vs * (1 - Math.exp(-t / tau))
        return (
          <>
            <Plot
              x={[0, 10]}
              y={[0, Vs * 1.15]}
              xLabel="t (s)"
              yLabel="v_c (V)"
              series={[
                { fn: v, label: 'v_c(t) = V_s(1 − e^(−t/RC))' },
                { fn: (t) => (t <= tau ? (Vs * t) / tau : NaN), label: 'tangent at 0', dash: true },
              ]}
              hlines={[{ y: Vs, label: `V_s=${fmtNum(Vs)}\\,\\text{V}` }]}
              vlines={[
                { x: tau, label: '\\tau' },
                ...(5 * tau <= 10 ? [{ x: 5 * tau, label: '5\\tau' }] : []),
              ]}
              points={[{ x: tau, y: v(tau), label: `0.632V_s` }]}
            />
            <Readout
              rows={[
                ['\\tau = RC', `${fmtNum(tau)}\\,\\text{s}`],
                ['v_c(\\tau)=0.632\\,V_s', `${fmtNum(v(tau))}\\,\\text{V}`],
                ['5\\tau\\ (\\text{practically charged})', `${fmtNum(5 * tau)}\\,\\text{s}`],
                ['i(0^+)=V_s/R', `${fmtNum(Vs / r)}\\,\\text{mA}`],
                ['V_c(s)', `\\dfrac{${fmtNum(Vs)}}{s(${fmtNum(tau)}s+1)}`],
              ]}
            />
          </>
        )
      }}
    </Explorer>
  )
}

/* ------------------------------------------------------------------ */
/* Interactive: series RLC step response                                */
/* ------------------------------------------------------------------ */

/** Unit-step response of 1/(a s^2 + b s + 1), a = LC > 0, b = RC >= 0 */
export function rlcStep(a: number, b: number) {
  const wn = 1 / Math.sqrt(a)
  const z = (b / a) / (2 * wn)
  if (Math.abs(z - 1) < 1e-6) return (t: number) => 1 - Math.exp(-wn * t) * (1 + wn * t)
  if (z < 1) {
    const wd = wn * Math.sqrt(1 - z * z)
    return (t: number) => 1 - Math.exp(-z * wn * t) * (Math.cos(wd * t) + (z / Math.sqrt(1 - z * z)) * Math.sin(wd * t))
  }
  const r = Math.sqrt(z * z - 1)
  const p1 = wn * (z - r)
  const p2 = wn * (z + r)
  return (t: number) => 1 + (p2 * Math.exp(-p1 * t) - p1 * Math.exp(-p2 * t)) / (p1 - p2)
}

export function rlcPoles(a: number, b: number) {
  const d = b * b - 4 * a
  if (d >= 0) {
    const sq = Math.sqrt(d)
    return [
      { re: (-b + sq) / (2 * a), im: 0 },
      { re: (-b - sq) / (2 * a), im: 0 },
    ]
  }
  const im = Math.sqrt(-d) / (2 * a)
  return [
    { re: -b / (2 * a), im },
    { re: -b / (2 * a), im: -im },
  ]
}

export function RLCExplorer() {
  return (
    <Explorer
      title="Series RLC: how R, L, C shape the step response"
      params={[
        { name: 'R', label: 'R', min: 0, max: 4, step: 0.05, value: 0.5, unit: '}\\Omega\\text{' },
        { name: 'L', label: 'L', min: 0.2, max: 2, step: 0.05, value: 1, unit: 'H' },
        { name: 'C', label: 'C', min: 0.2, max: 2, step: 0.05, value: 1, unit: 'F' },
      ]}
    >
      {({ R: r, L: l, C: c }) => {
        const a = l * c
        const b = r * c
        const y = rlcStep(a, b)
        const disc = b * b - 4 * a
        const poles = rlcPoles(a, b)
        const kind = Math.abs(disc) < 1e-9 ? '\\text{repeated real pole}' : disc > 0 ? '\\text{two real poles: no oscillation}' : b === 0 ? '\\text{poles on } j\\omega\\text{ axis: endless oscillation}' : '\\text{complex poles: decaying oscillation}'
        const range = Math.max(2, ...poles.map((p) => Math.hypot(p.re, p.im) * 1.3))
        const fmtP = (p: { re: number; im: number }) => (p.im === 0 ? fmtNum(p.re, 3) : `${fmtNum(p.re, 3)} ${p.im > 0 ? '+' : '-'} j${fmtNum(Math.abs(p.im), 3)}`)
        return (
          <>
            <Plot
              x={[0, 30]}
              y={[0, 2.1]}
              xLabel="t (s)"
              yLabel="v_o (V)"
              series={[{ fn: y, label: 'v_o(t), unit-step input' }]}
              hlines={[{ y: 1, label: 'H(0)=1' }]}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
              <SPlane poles={poles.map((p) => ({ ...p }))} range={range} size={220} caption="Roots of LCs² + RCs + 1 (axis rescales automatically)" />
              <Readout
                rows={[
                  ['H(s)', `\\dfrac{1}{${fmtNum(a, 3)}s^2+${fmtNum(b, 3)}s+1}`],
                  ['LC\\ (\\text{s}^2)', a],
                  ['RC\\ (\\text{s})', b],
                  ['(RC)^2-4LC', disc],
                  ['s_{1,2}', `${fmtP(poles[0])},\\ ${fmtP(poles[1])}`],
                  ['\\text{type}', kind],
                ]}
              />
            </div>
          </>
        )
      }}
    </Explorer>
  )
}

