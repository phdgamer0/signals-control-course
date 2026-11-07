import { BD, Block, Sum, Line, Pick, Lbl } from '../../components/BlockDiagram'
import { Explorer, Readout } from '../../components/Explorer'
import { Plot } from '../../components/Plot'

/** Two-line centred text for blocks / labels (Turkish labels from the notes). */
const two = (a: string, b: string) => '\\begin{array}{c}\\text{' + a + '}\\\\\\text{' + b + '}\\end{array}'
const txt = (a: string) => '\\text{' + a + '}'

/* ------------------------------------------------------------------ */
/* p.1 — the simplest picture of a control system                      */
/* ------------------------------------------------------------------ */
export function SimpleSystemBD() {
  return (
    <BD w={470} h={120} caption="p. 1 — Giriş (input) → Kontrol sistemi (control system) → Çıkış (output)">
      <Lbl x={45} y={55} t={txt('Giriş')} />
      <Lbl x={45} y={78} t={txt('(input)')} size={11} />
      <Line p={[[80, 55], [170, 55]]} />
      <Block x={230} y={55} w={120} h={60} t={two('Kontrol', 'sistemi')} />
      <Line p={[[290, 55], [380, 55]]} />
      <Lbl x={420} y={55} t={txt('Çıkış')} />
      <Lbl x={420} y={78} t={txt('(output)')} size={11} />
    </BD>
  )
}

/* ------------------------------------------------------------------ */
/* p.3 — open-loop structure                                           */
/* ------------------------------------------------------------------ */
export function OpenLoopBD() {
  return (
    <BD w={630} h={140} caption="p. 3 — Open-loop control system (açık çevrim): Kontrolcü = controller, Uygulama sinyali = actuating signal, Sistem = plant. No feedback path.">
      <Lbl x={40} y={75} t={txt('Giriş')} />
      <Line p={[[75, 75], [150, 75]]} />
      <Block x={210} y={75} w={120} h={50} t={txt('Kontrolcü')} />
      <Line p={[[270, 75], [380, 75]]} />
      <Lbl x={325} y={45} t={two('Uygulama', 'sinyali')} size={12} />
      <Block x={440} y={75} w={120} h={50} t={txt('Sistem')} />
      <Line p={[[500, 75], [560, 75]]} />
      <Lbl x={595} y={75} t={txt('Çıkış')} />
    </BD>
  )
}

/* ------------------------------------------------------------------ */
/* p.4 — closed-loop structure                                         */
/* ------------------------------------------------------------------ */
export function ClosedLoopBD() {
  return (
    <BD w={700} h={225} caption="p. 4 — Closed-loop control system (kapalı çevrim): Hata kontrolü = error detector (comparator), Hata sinyali = error signal, Uygulama sinyali = actuating signal, Geri-besleme elemanları = feedback elements (sensor + instrumentation).">
      <Lbl x={40} y={75} t={txt('Giriş')} />
      <Line p={[[70, 75], [136, 75]]} />
      <Sum x={150} y={75} signs={{ l: '+', b: '-' }} />
      <Lbl x={150} y={33} t={two('Hata', 'kontrolü')} size={11} />
      <Line p={[[164, 75], [250, 75]]} />
      <Lbl x={207} y={103} t={two('Hata', 'sinyali')} size={11} />
      <Block x={310} y={75} w={120} h={50} t={txt('Kontrolcü')} />
      <Line p={[[370, 75], [460, 75]]} />
      <Lbl x={415} y={45} t={two('Uygulama', 'sinyali')} size={12} />
      <Block x={520} y={75} w={120} h={50} t={txt('Sistem')} />
      <Line p={[[580, 75], [640, 75]]} />
      <Pick x={610} y={75} />
      <Lbl x={670} y={75} t={txt('Çıkış')} />
      <Line p={[[610, 75], [610, 185], [450, 185]]} />
      <Block x={380} y={185} w={140} h={52} t={two('Geri-besleme', 'elemanları')} />
      <Line p={[[310, 185], [150, 185], [150, 89]]} />
    </BD>
  )
}

/* ------------------------------------------------------------------ */
/* p.7 — canonical single loop R, E, G, H, C                           */
/* ------------------------------------------------------------------ */
export function FeedbackLoopBD({ sign = '-', annotate = false, caption }: { sign?: '+' | '-'; annotate?: boolean; caption?: string }) {
  return (
    <BD w={490} h={190} caption={caption ?? 'p. 7 — Negative-feedback loop: R = reference input, E = error, G = forward block, H = feedback block, C = output.'}>
      <Lbl x={30} y={55} t="R" />
      <Line p={[[20, 75], [126, 75]]} />
      <Sum x={140} y={75} signs={{ l: '+', b: sign }} />
      <Line p={[[154, 75], [240, 75]]} />
      <Lbl x={197} y={58} t="E" />
      <Block x={280} y={75} w={80} h={44} t="G" />
      <Line p={[[320, 75], [440, 75]]} />
      <Pick x={390} y={75} />
      <Lbl x={460} y={75} t="C" />
      <Line p={[[390, 75], [390, 155], [310, 155]]} />
      <Block x={280} y={155} w={60} h={40} t="H" />
      <Line p={[[250, 155], [140, 155], [140, 89]]} />
      {annotate && (
        <>
          <Lbl x={415} y={115} t="C" size={12} />
          <Lbl x={195} y={140} t="CH" size={12} />
          <Lbl x={197} y={30} t={sign === '-' ? 'E=R-CH' : 'E=R+CH'} size={12} />
        </>
      )}
    </BD>
  )
}

/* ------------------------------------------------------------------ */
/* p.8 — open loop with disturbance N(s)                               */
/* ------------------------------------------------------------------ */
export function OpenLoopNoiseBD() {
  return (
    <BD w={630} h={150} caption="p. 8 — Open-loop system with a disturbance (bozucu giriş / gürültü) N(s) entering between G_a and G_b.">
      <Lbl x={40} y={80} t="R(s)" />
      <Line p={[[20, 100], [140, 100]]} />
      <Block x={190} y={100} w={100} h={44} t="G_a" />
      <Line p={[[240, 100], [326, 100]]} />
      <Sum x={340} y={100} signs={{ l: '+', t: '+' }} />
      <Lbl x={340} y={22} t="N(s)" />
      <Line p={[[340, 38], [340, 86]]} />
      <Line p={[[354, 100], [430, 100]]} />
      <Block x={480} y={100} w={100} h={44} t="G_b" />
      <Line p={[[530, 100], [575, 100]]} />
      <Lbl x={603} y={100} t="C(s)" />
    </BD>
  )
}

/* ------------------------------------------------------------------ */
/* p.9 — closed loop with disturbance N(s)                             */
/* ------------------------------------------------------------------ */
export function ClosedLoopNoiseBD() {
  return (
    <BD w={720} h={215} caption="p. 9 — Closed-loop system with disturbance N(s). The notes write no signs on the second summing junction; both inputs are + (as on p. 8).">
      <Lbl x={40} y={80} t="R(s)" />
      <Line p={[[20, 100], [116, 100]]} />
      <Sum x={130} y={100} signs={{ l: '+', b: '-' }} />
      <Line p={[[144, 100], [220, 100]]} />
      <Block x={270} y={100} w={100} h={44} t="G_a" />
      <Line p={[[320, 100], [396, 100]]} />
      <Sum x={410} y={100} signs={{ l: '+', t: '+' }} />
      <Lbl x={410} y={22} t="N(s)" />
      <Line p={[[410, 38], [410, 86]]} />
      <Line p={[[424, 100], [500, 100]]} />
      <Block x={550} y={100} w={100} h={44} t="G_b" />
      <Line p={[[600, 100], [665, 100]]} />
      <Pick x={630} y={100} />
      <Lbl x={692} y={100} t="C(s)" />
      <Line p={[[630, 100], [630, 180], [400, 180]]} />
      <Block x={370} y={180} w={60} h={40} t="H" />
      <Line p={[[340, 180], [130, 180], [130, 114]]} />
    </BD>
  )
}

/* ------------------------------------------------------------------ */
/* p.5 — on/off versus linear (gain) handling of the error             */
/* ------------------------------------------------------------------ */
export function ControllerCharacteristic() {
  return (
    <Plot
      x={[-2, 2]}
      y={[-1.2, 1.4]}
      xLabel="error e"
      yLabel="actuating signal u"
      height={260}
      title="How a controller turns the error into an actuating signal"
      series={[
        { fn: (e) => (e > 0 ? 1 : 0), label: 'on/off (aç/kapa)', width: 2.5 },
        { fn: (e) => 0.5 * e, label: 'gain: u = K·e, K = 0.5', dash: true },
      ]}
      hlines={[{ y: 1, label: 'u_{\\max}\\ (\\text{ON})' }]}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Interactive: how feedback makes T insensitive to G                  */
/* ------------------------------------------------------------------ */
const Tcl = (G: number, H: number) => G / (1 + G * H)
const pct = (v: number) => `${(+v.toFixed(2)).toString()}\\,\\%`

export function FeedbackSensitivityExplorer() {
  return (
    <Explorer
      title="Negative feedback: T = G/(1+GH) and its sensitivity to G"
      params={[
        { name: 'G', label: 'G', min: 1, max: 200, step: 1, value: 10 },
        { name: 'H', label: 'H', min: 0.05, max: 2, step: 0.05, value: 1 },
        { name: 'd', label: '\\Delta G/G', min: -50, max: 50, step: 5, value: -20, unit: '\\%' },
      ]}
    >
      {({ G, H, d }) => {
        const T = Tcl(G, H)
        const G2 = G * (1 + d / 100)
        const T2 = Tcl(G2, H)
        const clChange = (T2 / T - 1) * 100
        const inv = 1 / H
        const gMax = 200
        return (
          <>
            <Plot
              x={[0, gMax]}
              y={[0, inv * 1.15]}
              xLabel="G"
              yLabel="T"
              height={250}
              title="Closed-loop gain T as G grows (H fixed)"
              series={[{ fn: (g) => Tcl(g, H), label: 'T = G/(1+GH)' }]}
              hlines={[{ y: inv, label: '1/H' }]}
              points={[{ x: G, y: T, label: 'T' }, ...(G2 <= gMax ? [{ x: G2, y: T2, label: "T'" }] : [])]}
            />
            <Plot
              x={[-50, 50]}
              y={[45, 155]}
              xLabel="change of G (%)"
              yLabel="output (% of nominal)"
              height={250}
              title="Same change in G: open loop vs closed loop"
              series={[
                { fn: (x) => 100 + x, label: 'open loop (C = G·R)', dash: true },
                { fn: (x) => (100 * Tcl(G * (1 + x / 100), H)) / T, label: 'closed loop (C = T·R)' },
              ]}
              hlines={[{ y: 100, label: '\\text{nominal}' }]}
              vlines={[{ x: d, label: '\\Delta G/G' }]}
            />
            <Readout
              rows={[
                ['GH\\ (\\text{loop gain})', G * H],
                ['1+GH', 1 + G * H],
                ['T=\\dfrac{G}{1+GH}', T],
                ['\\text{ideal } 1/H', inv],
                ['\\dfrac{1/H-T}{1/H}=\\dfrac{1}{1+GH}', pct(100 / (1 + G * H))],
                ["G'=G(1+\\Delta G/G)", G2],
                ["T'=\\dfrac{G'}{1+G'H}", T2],
                ['\\text{open-loop output change}', pct(d)],
                ['\\text{closed-loop output change}', pct(clChange)],
              ]}
            />
          </>
        )
      }}
    </Explorer>
  )
}

/* ------------------------------------------------------------------ */
/* Interactive: disturbance N in open vs closed loop                   */
/* ------------------------------------------------------------------ */
export function DisturbanceExplorer() {
  return (
    <Explorer
      title="Disturbance N: open loop vs closed loop (constant gains)"
      params={[
        { name: 'Ga', label: 'G_a', min: 1, max: 50, step: 1, value: 10 },
        { name: 'Gb', label: 'G_b', min: 0.5, max: 5, step: 0.5, value: 2 },
        { name: 'H', label: 'H', min: 0.1, max: 2, step: 0.1, value: 1 },
        { name: 'R', label: 'R', min: 0, max: 5, step: 0.5, value: 1 },
        { name: 'N', label: 'N', min: -1, max: 1, step: 0.1, value: 0.5 },
      ]}
    >
      {({ Ga, Gb, H, R, N }) => {
        const L = Ga * Gb * H
        const olN = Gb * N
        const clN = (Gb * N) / (1 + L)
        const clR = ((Ga * Gb) / (1 + L)) * R
        const m = Math.max(0.2, 1.3 * Math.abs(Gb * N))
        const t0 = 4
        return (
          <>
            <Plot
              x={[0, 10]}
              y={[-m, m]}
              xLabel="t (door opened at t = 4)"
              yLabel="output change caused by N"
              height={250}
              title="Deviation of the output caused by the disturbance"
              series={[
                { fn: (t) => (t >= t0 ? olN : 0), label: 'open loop: Gb·N', dash: true },
                { fn: (t) => (t >= t0 ? clN : 0), label: 'closed loop: Gb·N/(1+Ga·Gb·H)' },
              ]}
              vlines={[{ x: t0, label: 'N\\ \\text{applied}' }]}
            />
            <Readout
              rows={[
                ['G_aG_bH', L],
                ['1+G_aG_bH\\ (\\text{attenuation})', 1 + L],
                ['\\text{open loop: } C_N=G_bN', olN],
                ['\\text{closed loop: } C_N=\\dfrac{G_bN}{1+G_aG_bH}', clN],
                ['\\text{closed loop: } C_R=\\dfrac{G_aG_bR}{1+G_aG_bH}', clR],
                ['\\text{closed loop total } C=C_R+C_N', clR + clN],
                ['\\text{desired output } R/H', R / H],
              ]}
            />
          </>
        )
      }}
    </Explorer>
  )
}
