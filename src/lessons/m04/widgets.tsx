import { useState, type ReactNode } from 'react'
import { BD, Block, Sum, Line, Pick, Lbl } from '../../components/BlockDiagram'
import { M } from '../../components/Math'

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

type Sign = '+' | '-'

/** Dashed highlight ellipse (the professor circles the loop to reduce next in pink). */
function Ring({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill="none"
      style={{ stroke: 'var(--accent-2)', strokeWidth: 1.6, strokeDasharray: '7 5' }}
    />
  )
}

/** Text with $…$ segments rendered as inline math. */
function Rich({ s }: { s: string }) {
  const parts = s.split('$')
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <M key={i}>{p}</M> : <span key={i}>{p}</span>))}
    </>
  )
}

/** The "is equivalent to" arrow between a before- and after-diagram. */
const Equiv = ({ x, y }: { x: number; y: number }) => <Lbl x={x} y={y} t="\Updownarrow\ \text{equivalent}" size={15} />

const isTall = (t: string) => t.includes('\\frac')

/* ------------------------------------------------------------------ */
/* Basic elements                                                      */
/* ------------------------------------------------------------------ */

export function OperationBlockFig() {
  return (
    <BD w={420} h={90} caption="An operation block (işlem bloğu): the output signal is the input signal multiplied by the block's transfer function.">
      <Lbl x={55} y={28} t="R(s)" />
      <Line p={[[15, 50], [150, 50]]} />
      <Block x={200} y={50} t="G(s)" w={100} />
      <Line p={[[250, 50], [400, 50]]} />
      <Lbl x={330} y={26} t="Y(s)=G(s)\,R(s)" />
    </BD>
  )
}

export function SumFig() {
  return (
    <BD w={360} h={150} caption="Summing junction (Σ): its output is the signed sum of its inputs. Every arrow entering the circle carries its own + or − sign.">
      <Lbl x={50} y={40} t="A(s)" />
      <Line p={[[15, 60], [156, 60]]} />
      <Sum x={170} y={60} signs={{ l: '+', b: '-' }} />
      <Line p={[[170, 140], [170, 74]]} />
      <Lbl x={205} y={128} t="B(s)" />
      <Line p={[[184, 60], [345, 60]]} />
      <Lbl x={270} y={38} t="E(s)=A(s)-B(s)" />
    </BD>
  )
}

export function PickFig() {
  return (
    <BD w={360} h={150} caption="Take-off point (the dot): the same signal is sent along every branch leaving it. It does not split or reduce the signal.">
      <Lbl x={50} y={40} t="X(s)" />
      <Line p={[[15, 60], [340, 60]]} />
      <Pick x={170} y={60} />
      <Line p={[[170, 60], [170, 125], [340, 125]]} />
      <Lbl x={290} y={40} t="X(s)" />
      <Lbl x={290} y={105} t="X(s)" />
    </BD>
  )
}

export function SeriesFig() {
  return (
    <BD w={460} h={210} caption="Blocks in series (cascade): the transfer functions multiply.">
      <Lbl x={30} y={32} t="R" />
      <Line p={[[15, 50], [85, 50]]} />
      <Block x={120} y={50} t="G_1" w={70} />
      <Line p={[[155, 50], [235, 50]]} />
      <Lbl x={195} y={32} t="U" />
      <Block x={270} y={50} t="G_2" w={70} />
      <Line p={[[305, 50], [420, 50]]} />
      <Lbl x={410} y={32} t="Y" />
      <Equiv x={230} y={110} />
      <Lbl x={30} y={152} t="R" />
      <Line p={[[15, 170], [160, 170]]} />
      <Block x={230} y={170} t="G_1G_2" w={140} />
      <Line p={[[300, 170], [420, 170]]} />
      <Lbl x={410} y={152} t="Y" />
    </BD>
  )
}

export function ParallelFig() {
  return (
    <BD w={460} h={300} caption="Blocks in parallel: the same input feeds both blocks and the outputs are added, so the transfer functions add (with the signs at the summing junction).">
      <Lbl x={30} y={82} t="R" />
      <Line p={[[15, 100], [80, 100]]} arrow={false} />
      <Pick x={80} y={100} />
      <Line p={[[80, 100], [80, 50], [185, 50]]} />
      <Block x={220} y={50} t="G_1" w={70} />
      <Line p={[[255, 50], [320, 50], [320, 86]]} />
      <Line p={[[80, 100], [80, 150], [185, 150]]} />
      <Block x={220} y={150} t="G_2" w={70} />
      <Line p={[[255, 150], [320, 150], [320, 114]]} />
      <Sum x={320} y={100} signs={{ t: '+', b: '+' }} />
      <Line p={[[334, 100], [430, 100]]} />
      <Lbl x={420} y={82} t="Y" />
      <Equiv x={230} y={200} />
      <Lbl x={30} y={242} t="R" />
      <Line p={[[15, 260], [160, 260]]} />
      <Block x={230} y={260} t="G_1+G_2" w={140} />
      <Line p={[[300, 260], [430, 260]]} />
      <Lbl x={420} y={242} t="Y" />
    </BD>
  )
}

/* ------------------------------------------------------------------ */
/* Generic single loop (optionally with a pre-block)                   */
/* ------------------------------------------------------------------ */

type B = { t: string; w?: number }

/**
 * One feedback loop: [pre] → Σ → fwd blocks in series → take-off → Y,
 * feedback blocks (listed in signal order, i.e. starting from the take-off point) back into Σ.
 * fb = [] means unity feedback.
 */
export function Loop({
  fwd,
  fb,
  sign = '-',
  pre,
  inLabel = 'R',
  outLabel = 'Y',
  caption,
}: {
  fwd: B[]
  fb: B[]
  sign?: Sign
  pre?: B
  inLabel?: string
  outLabel?: string
  caption?: ReactNode
}) {
  const tallF = fwd.some((b) => isTall(b.t)) || (pre ? isTall(pre.t) : false)
  const y = tallF ? 50 : 45
  const yf = y + (tallF ? 95 : 85)
  const gap = 45
  const els: ReactNode[] = []
  let x = 15
  if (pre) {
    const w = pre.w ?? 70
    els.push(<Line key="pl" p={[[x, y], [x + 55, y]]} />)
    els.push(<Block key="pb" x={x + 55 + w / 2} y={y} t={pre.t} w={w} h={isTall(pre.t) ? 54 : 44} />)
    x = x + 55 + w
  }
  const sx = x + (pre ? 55 : 75) + 14
  els.push(<Line key="in" p={[[x, y], [sx - 14, y]]} />)
  els.push(<Sum key="sum" x={sx} y={y} signs={{ l: '+', b: sign }} />)
  let cur = sx + 14
  fwd.forEach((b, i) => {
    const w = b.w ?? 70
    els.push(<Line key={`fl${i}`} p={[[cur, y], [cur + gap, y]]} />)
    els.push(<Block key={`fb${i}`} x={cur + gap + w / 2} y={y} t={b.t} w={w} h={isTall(b.t) ? 54 : 44} />)
    cur = cur + gap + w
  })
  const px = cur + 55
  const end = cur + 120
  els.push(<Line key="out" p={[[cur, y], [end, y]]} />)
  els.push(<Pick key="pick" x={px} y={y} />)
  // feedback path, right to left
  const fbTotal = fb.reduce((a, b) => a + (b.w ?? 70), 0) + gap * Math.max(fb.length - 1, 0)
  if (fb.length === 0) {
    els.push(<Line key="u" p={[[px, y], [px, yf], [sx, yf], [sx, y + 14]]} />)
  } else {
    const mid = (sx + px) / 2
    let right = mid + fbTotal / 2
    let from: [number, number] = [px, yf]
    els.push(<Line key="d0" p={[[px, y], [px, yf], [right, yf]]} />)
    fb.forEach((b, i) => {
      const w = b.w ?? 70
      if (i > 0) els.push(<Line key={`bl${i}`} p={[from, [right, yf]]} />)
      els.push(<Block key={`bb${i}`} x={right - w / 2} y={yf} t={b.t} w={w} h={isTall(b.t) ? 54 : 44} />)
      from = [right - w, yf]
      right = right - w - gap
    })
    els.push(<Line key="up" p={[from, [sx, yf], [sx, y + 14]]} />)
  }
  return (
    <BD w={end + 20} h={yf + 40} caption={caption}>
      <Lbl x={30} y={y - 18} t={inLabel} />
      <Lbl x={end - 12} y={y - 18} t={outLabel} />
      {els}
    </BD>
  )
}

/** Single block R → [t] → Y. */
export function OneBlock({ t, w = 200, caption, inLabel = 'R', outLabel = 'Y' }: { t: string; w?: number; caption?: ReactNode; inLabel?: string; outLabel?: string }) {
  const tall = isTall(t)
  const y = tall ? 45 : 40
  return (
    <BD w={w + 170} h={y * 2} caption={caption}>
      <Lbl x={30} y={y - 20} t={inLabel} />
      <Line p={[[15, y], [85, y]]} />
      <Block x={85 + w / 2} y={y} t={t} w={w} h={tall ? 60 : 44} />
      <Line p={[[85 + w, y], [w + 155, y]]} />
      <Lbl x={w + 143} y={y - 20} t={outLabel} />
    </BD>
  )
}

/* ------------------------------------------------------------------ */
/* Professor's two-loop example (p. 1)                                 */
/* ------------------------------------------------------------------ */

export function TwoLoopFig({ annotate = false, caption }: { annotate?: boolean; caption?: ReactNode }) {
  return (
    <BD w={660} h={230} caption={caption ?? 'The two-loop system of p. 1, redrawn from the notes.'}>
      <Lbl x={25} y={100} t="R" />
      <Line p={[[15, 120], [96, 120]]} />
      <Sum x={110} y={120} signs={{ l: '+', b: '-' }} />
      <Line p={[[124, 120], [175, 120]]} />
      <Block x={210} y={120} t="G_1" w={70} />
      <Line p={[[245, 120], [296, 120]]} />
      <Sum x={310} y={120} signs={{ l: '+', t: '-' }} />
      <Line p={[[324, 120], [375, 120]]} />
      <Block x={410} y={120} t="G_2" w={70} />
      <Line p={[[445, 120], [515, 120]]} />
      <Pick x={480} y={120} />
      <Lbl x={492} y={102} t="X" />
      <Block x={550} y={120} t="G_3" w={70} />
      <Line p={[[585, 120], [645, 120]]} />
      <Pick x={605} y={120} />
      <Lbl x={640} y={100} t="Y" />
      {/* H2: from Y over the top into Σ2 */}
      <Line p={[[605, 120], [605, 40], [445, 40]]} />
      <Block x={410} y={40} t="H_2" w={70} />
      <Line p={[[375, 40], [310, 40], [310, 106]]} />
      {/* H1: from X under the bottom into Σ1 */}
      <Line p={[[480, 120], [480, 195], [335, 195]]} />
      <Block x={300} y={195} t="H_1" w={70} />
      <Line p={[[265, 195], [110, 195], [110, 134]]} />
      {annotate && (
        <>
          <Lbl x={150} y={102} t="E_1" size={13} />
          <Lbl x={350} y={102} t="E_2" size={13} />
          <Lbl x={270} y={102} t="G_1E_1" size={13} />
          <Lbl x={190} y={177} t="H_1X" size={13} />
          <Lbl x={345} y={22} t="H_2Y" size={13} />
        </>
      )}
    </BD>
  )
}

/**
 * p.1 system after moving the X take-off point forward past G3 to the output.
 * wrong = true draws the common mistake (compensating block 1/G3 forgotten).
 */
export function TwoLoopMovedFig({ wrong = false, ring = false, caption }: { wrong?: boolean; ring?: boolean; caption?: ReactNode }) {
  return (
    <BD w={680} h={235} caption={caption}>
      {ring && <Ring cx={455} cy={82} rx={178} ry={64} />}
      <Lbl x={25} y={100} t="R" />
      <Line p={[[15, 120], [96, 120]]} />
      <Sum x={110} y={120} signs={{ l: '+', b: '-' }} />
      <Line p={[[124, 120], [175, 120]]} />
      <Block x={210} y={120} t="G_1" w={70} />
      <Line p={[[245, 120], [296, 120]]} />
      <Sum x={310} y={120} signs={{ l: '+', t: '-' }} />
      <Line p={[[324, 120], [375, 120]]} />
      <Block x={410} y={120} t="G_2" w={70} />
      <Line p={[[445, 120], [515, 120]]} />
      <Block x={550} y={120} t="G_3" w={70} />
      <Line p={[[585, 120], [665, 120]]} />
      <Pick x={605} y={120} />
      <Pick x={630} y={120} />
      <Lbl x={660} y={100} t="Y" />
      <Line p={[[605, 120], [605, 40], [445, 40]]} />
      <Block x={410} y={40} t="H_2" w={70} />
      <Line p={[[375, 40], [310, 40], [310, 106]]} />
      {wrong ? (
        <>
          <Line p={[[630, 120], [630, 200], [395, 200]]} />
          <Block x={360} y={200} t="H_1" w={70} />
          <Line p={[[325, 200], [110, 200], [110, 134]]} />
        </>
      ) : (
        <>
          <Line p={[[630, 120], [630, 200], [515, 200]]} />
          <Block x={480} y={200} t="\frac{1}{G_3}" w={70} h={50} />
          <Line p={[[445, 200], [395, 200]]} />
          <Block x={360} y={200} t="H_1" w={70} />
          <Line p={[[325, 200], [110, 200], [110, 134]]} />
        </>
      )}
    </BD>
  )
}

/* ------------------------------------------------------------------ */
/* The three reduction rules of p. 3                                   */
/* ------------------------------------------------------------------ */

export function Rule1Fig() {
  return (
    <BD w={520} h={300} caption="Rule 1 (p. 3): moving a summing point from after G₁ to before G₁. The side input X must now pass through 1/G₁ so that, after G₁ multiplies it again, exactly X arrives as before.">
      <Lbl x={25} y={32} t="R" />
      <Line p={[[15, 50], [85, 50]]} />
      <Block x={120} y={50} t="G_1" w={70} />
      <Line p={[[155, 50], [226, 50]]} />
      <Sum x={240} y={50} signs={{ l: '+', b: '+' }} />
      <Line p={[[254, 50], [305, 50]]} />
      <Block x={340} y={50} t="G_2" w={70} />
      <Line p={[[375, 50], [480, 50]]} />
      <Lbl x={470} y={32} t="Y" />
      <Lbl x={25} y={92} t="X" />
      <Line p={[[15, 110], [240, 110], [240, 64]]} />
      <Equiv x={260} y={150} />
      <Lbl x={25} y={182} t="R" />
      <Line p={[[15, 200], [176, 200]]} />
      <Sum x={190} y={200} signs={{ l: '+', b: '+' }} />
      <Line p={[[204, 200], [245, 200]]} />
      <Block x={280} y={200} t="G_1" w={70} />
      <Line p={[[315, 200], [345, 200]]} />
      <Block x={380} y={200} t="G_2" w={70} />
      <Line p={[[415, 200], [490, 200]]} />
      <Lbl x={480} y={182} t="Y" />
      <Lbl x={25} y={242} t="X" />
      <Line p={[[15, 262], [85, 262]]} />
      <Block x={120} y={262} t="\frac{1}{G_1}" w={70} h={50} />
      <Line p={[[155, 262], [190, 262], [190, 214]]} />
    </BD>
  )
}

export function Rule2Fig() {
  return (
    <BD w={520} h={310} caption="Rule 2 (p. 3): moving the take-off point from after G₂ to before G₂. The fed-back signal must still be Y = G₂·(signal before G₂), so a copy of G₂ is put in the feedback path.">
      <Lbl x={25} y={32} t="R" />
      <Line p={[[15, 50], [96, 50]]} />
      <Sum x={110} y={50} signs={{ l: '+', b: '-' }} />
      <Line p={[[124, 50], [185, 50]]} />
      <Block x={220} y={50} t="G_1" w={70} />
      <Line p={[[255, 50], [305, 50]]} />
      <Block x={340} y={50} t="G_2" w={70} />
      <Line p={[[375, 50], [480, 50]]} />
      <Pick x={420} y={50} />
      <Lbl x={470} y={32} t="Y" />
      <Line p={[[420, 50], [420, 110], [110, 110], [110, 64]]} />
      <Equiv x={260} y={150} />
      <Lbl x={25} y={182} t="R" />
      <Line p={[[15, 200], [96, 200]]} />
      <Sum x={110} y={200} signs={{ l: '+', b: '-' }} />
      <Line p={[[124, 200], [185, 200]]} />
      <Block x={220} y={200} t="G_1" w={70} />
      <Line p={[[255, 200], [305, 200]]} />
      <Pick x={280} y={200} />
      <Block x={340} y={200} t="G_2" w={70} />
      <Line p={[[375, 200], [480, 200]]} />
      <Lbl x={470} y={182} t="Y" />
      <Line p={[[280, 200], [280, 272], [245, 272]]} />
      <Block x={210} y={272} t="G_2" w={70} />
      <Line p={[[175, 272], [110, 272], [110, 214]]} />
    </BD>
  )
}

export function Rule3Fig({ sign = '-' }: { sign?: Sign }) {
  const den = sign === '-' ? '1+GH' : '1-GH'
  return (
    <BD
      w={460}
      h={280}
      caption={
        sign === '-'
          ? 'Rule 3 (p. 3): the basic negative-feedback loop is equivalent to one block G/(1+GH).'
          : 'Positive feedback: the same loop with + at the feedback input is equivalent to G/(1−GH).'
      }
    >
      <Lbl x={25} y={32} t="R" />
      <Line p={[[15, 50], [96, 50]]} />
      <Sum x={110} y={50} signs={{ l: '+', b: sign }} />
      <Line p={[[124, 50], [185, 50]]} />
      <Lbl x={155} y={32} t="E" size={13} />
      <Block x={220} y={50} t="G" w={70} />
      <Line p={[[255, 50], [380, 50]]} />
      <Pick x={320} y={50} />
      <Lbl x={370} y={32} t="Y" />
      <Line p={[[320, 50], [320, 118], [255, 118]]} />
      <Block x={220} y={118} t="H" w={70} />
      <Line p={[[185, 118], [110, 118], [110, 64]]} />
      <Lbl x={150} y={102} t="HY" size={13} />
      <Equiv x={230} y={165} />
      <Lbl x={70} y={207} t="R" />
      <Line p={[[55, 228], [160, 228]]} />
      <Block x={230} y={228} t={`\\frac{G}{${den}}`} w={140} h={58} />
      <Line p={[[300, 228], [400, 228]]} />
      <Lbl x={390} y={207} t="Y" />
    </BD>
  )
}

/* ------------------------------------------------------------------ */
/* Professor's three-loop example (p. 4) and its completion            */
/* ------------------------------------------------------------------ */

export function ThreeLoopFig({ labels = true }: { labels?: boolean }) {
  return (
    <BD w={770} h={260} caption="The three-loop example of p. 4 (top diagram), redrawn. Points A and B are labelled here for discussion; the notes do not name them. The sign at the H₁ input of the first Σ is not written on this diagram in the notes — the redrawn diagram below it shows −.">
      <Lbl x={25} y={90} t="R" />
      <Line p={[[15, 110], [76, 110]]} />
      <Sum x={90} y={110} signs={{ l: '+', b: '-' }} />
      <Line p={[[104, 110], [145, 110]]} />
      <Block x={180} y={110} t="G_1" w={70} />
      <Line p={[[215, 110], [266, 110]]} />
      <Sum x={280} y={110} signs={{ l: '+', t: '-', b: '-' }} />
      <Line p={[[294, 110], [345, 110]]} />
      <Block x={380} y={110} t="G_2" w={70} />
      <Line p={[[415, 110], [485, 110]]} />
      <Pick x={450} y={110} />
      <Block x={520} y={110} t="G_3" w={70} />
      <Line p={[[555, 110], [625, 110]]} />
      <Pick x={590} y={110} />
      <Block x={660} y={110} t="G_4" w={70} />
      <Line p={[[695, 110], [760, 110]]} />
      <Pick x={725} y={110} />
      <Lbl x={752} y={90} t="Y" />
      {labels && (
        <>
          <Lbl x={462} y={94} t="A" size={13} />
          <Lbl x={602} y={94} t="B" size={13} />
        </>
      )}
      <Line p={[[590, 110], [590, 35], [475, 35]]} />
      <Block x={440} y={35} t="H_2" w={70} />
      <Line p={[[405, 35], [280, 35], [280, 96]]} />
      <Line p={[[450, 110], [450, 175], [215, 175]]} />
      <Block x={180} y={175} t="H_1" w={70} />
      <Line p={[[145, 175], [90, 175], [90, 124]]} />
      <Line p={[[725, 110], [725, 230], [555, 230]]} />
      <Block x={520} y={230} t="H_3" w={70} />
      <Line p={[[485, 230], [280, 230], [280, 124]]} />
    </BD>
  )
}

export function ThreeLoopMovedFig({ ring = true, caption }: { ring?: boolean; caption?: ReactNode }) {
  return (
    <BD
      w={770}
      h={330}
      caption={
        caption ??
        'p. 4, lower diagram: the H₁ take-off point has been moved forward from A (after G₂) past G₃ and G₄ to the output, so the compensating block 1/(G₃G₄) is inserted. The dashed ring marks the G₂–G₃–H₂ loop (circled in pink in the notes), which is reduced first.'
      }
    >
      {ring && <Ring cx={430} cy={74} rx={190} ry={70} />}
      <Lbl x={25} y={90} t="R" />
      <Line p={[[15, 110], [76, 110]]} />
      <Sum x={90} y={110} signs={{ l: '+', b: '-' }} />
      <Line p={[[104, 110], [145, 110]]} />
      <Block x={180} y={110} t="G_1" w={70} />
      <Line p={[[215, 110], [266, 110]]} />
      <Sum x={280} y={110} signs={{ l: '+', t: '-', b: '-' }} />
      <Line p={[[294, 110], [345, 110]]} />
      <Block x={380} y={110} t="G_2" w={70} />
      <Line p={[[415, 110], [485, 110]]} />
      <Block x={520} y={110} t="G_3" w={70} />
      <Line p={[[555, 110], [625, 110]]} />
      <Pick x={590} y={110} />
      <Block x={660} y={110} t="G_4" w={70} />
      <Line p={[[695, 110], [765, 110]]} />
      <Pick x={715} y={110} />
      <Pick x={740} y={110} />
      <Lbl x={756} y={90} t="Y" />
      <Line p={[[590, 110], [590, 35], [475, 35]]} />
      <Block x={440} y={35} t="H_2" w={70} />
      <Line p={[[405, 35], [280, 35], [280, 96]]} />
      <Line p={[[715, 110], [715, 220], [555, 220]]} />
      <Block x={520} y={220} t="H_3" w={70} />
      <Line p={[[485, 220], [280, 220], [280, 124]]} />
      <Line p={[[740, 110], [740, 290], [505, 290]]} />
      <Block x={460} y={290} t="\frac{1}{G_3G_4}" w={90} h={50} />
      <Line p={[[415, 290], [345, 290]]} />
      <Block x={310} y={290} t="H_1" w={70} />
      <Line p={[[275, 290], [90, 290], [90, 124]]} />
    </BD>
  )
}

/** After the inner loop has been replaced by G_A. */
export function ThreeLoopStepAFig({ ring = true }: { ring?: boolean }) {
  return (
    <BD w={700} h={260} caption="Step 1 of the completion: the ringed loop is replaced by G_A. Σ₂ now has only two inputs. The new ring marks the next loop: G_A, G₄ with feedback H₃.">
      {ring && <Ring cx={430} cy={112} rx={190} ry={66} />}
      <Lbl x={25} y={70} t="R" />
      <Line p={[[15, 90], [76, 90]]} />
      <Sum x={90} y={90} signs={{ l: '+', b: '-' }} />
      <Line p={[[104, 90], [145, 90]]} />
      <Block x={180} y={90} t="G_1" w={70} />
      <Line p={[[215, 90], [266, 90]]} />
      <Sum x={280} y={90} signs={{ l: '+', b: '-' }} />
      <Line p={[[294, 90], [340, 90]]} />
      <Block x={385} y={90} t="G_A" w={90} />
      <Line p={[[430, 90], [480, 90]]} />
      <Block x={515} y={90} t="G_4" w={70} />
      <Line p={[[550, 90], [690, 90]]} />
      <Pick x={600} y={90} />
      <Pick x={640} y={90} />
      <Lbl x={680} y={70} t="Y" />
      <Line p={[[600, 90], [600, 152], [420, 152]]} />
      <Block x={385} y={152} t="H_3" w={70} />
      <Line p={[[350, 152], [280, 152], [280, 104]]} />
      <Line p={[[640, 90], [640, 225], [505, 225]]} />
      <Block x={460} y={225} t="\frac{1}{G_3G_4}" w={90} h={50} />
      <Line p={[[415, 225], [345, 225]]} />
      <Block x={310} y={225} t="H_1" w={70} />
      <Line p={[[275, 225], [90, 225], [90, 104]]} />
    </BD>
  )
}

export const ThreeLoopStepBFig = () => (
  <Loop
    fwd={[{ t: 'G_1' }, { t: 'G_B', w: 80 }]}
    fb={[{ t: '\\frac{1}{G_3G_4}', w: 90 }, { t: 'H_1' }]}
    caption="Step 2: the G_A–G₄–H₃ loop is replaced by G_B. One loop is left; its feedback path is 1/(G₃G₄) followed by H₁."
  />
)

export const ThreeLoopStepCFig = () => (
  <Loop
    fwd={[{ t: 'G_1G_B', w: 100 }]}
    fb={[{ t: '\\frac{H_1}{G_3G_4}', w: 100 }]}
    caption="Step 3: series blocks combined — forward path G₁G_B, feedback path H₁/(G₃G₄). This is exactly Rule 3's loop."
  />
)

export const ThreeLoopFinalFig = () => (
  <OneBlock
    w={400}
    t="\frac{G_1G_2G_3G_4}{1+G_2G_3H_2+G_2G_3G_4H_3+G_1G_2H_1}"
    caption="Step 4: the whole system is one block, T(s)."
  />
)

/* ------------------------------------------------------------------ */
/* Additional-example diagrams                                         */
/* ------------------------------------------------------------------ */

export function ParallelLoopFig() {
  return (
    <BD w={560} h={235} caption="Additional example: two blocks in parallel inside a unity negative-feedback loop.">
      <Lbl x={25} y={82} t="R" />
      <Line p={[[15, 100], [86, 100]]} />
      <Sum x={100} y={100} signs={{ l: '+', b: '-' }} />
      <Line p={[[114, 100], [170, 100]]} arrow={false} />
      <Pick x={170} y={100} />
      <Line p={[[170, 100], [170, 50], [245, 50]]} />
      <Block x={280} y={50} t="G_1" w={70} />
      <Line p={[[315, 50], [390, 50], [390, 86]]} />
      <Line p={[[170, 100], [170, 150], [245, 150]]} />
      <Block x={280} y={150} t="G_2" w={70} />
      <Line p={[[315, 150], [390, 150], [390, 114]]} />
      <Sum x={390} y={100} signs={{ t: '+', b: '+' }} />
      <Line p={[[404, 100], [540, 100]]} />
      <Pick x={470} y={100} />
      <Lbl x={530} y={82} t="Y" />
      <Line p={[[470, 100], [470, 205], [100, 205], [100, 114]]} />
    </BD>
  )
}

export function FeedforwardFig() {
  return (
    <BD w={600} h={210} caption="Additional example: a feed-forward path G₃ adds a second input to Σ₂, which sits after G₁. The loops and the extra path interlock, so the diagram cannot be reduced directly.">
      <Lbl x={25} y={90} t="R" />
      <Line p={[[15, 110], [96, 110]]} />
      <Pick x={50} y={110} />
      <Sum x={110} y={110} signs={{ l: '+', b: '-' }} />
      <Line p={[[124, 110], [185, 110]]} />
      <Block x={220} y={110} t="G_1" w={70} />
      <Line p={[[255, 110], [316, 110]]} />
      <Sum x={330} y={110} signs={{ l: '+', t: '+' }} />
      <Line p={[[344, 110], [405, 110]]} />
      <Block x={440} y={110} t="G_2" w={70} />
      <Line p={[[475, 110], [580, 110]]} />
      <Pick x={530} y={110} />
      <Lbl x={570} y={90} t="Y" />
      <Line p={[[50, 110], [50, 40], [185, 40]]} />
      <Block x={220} y={40} t="G_3" w={70} />
      <Line p={[[255, 40], [330, 40], [330, 96]]} />
      <Line p={[[530, 110], [530, 180], [110, 180], [110, 124]]} />
    </BD>
  )
}

export function FeedforwardMovedFig() {
  return (
    <BD w={600} h={210} caption="Σ₂ moved ahead of G₁ (Rule 1): the feed-forward signal now passes through G₃ and then 1/G₁, drawn as one series block G₃/G₁.">
      <Lbl x={25} y={90} t="R" />
      <Line p={[[15, 110], [96, 110]]} />
      <Pick x={45} y={110} />
      <Sum x={110} y={110} signs={{ l: '+', b: '-' }} />
      <Line p={[[124, 110], [186, 110]]} />
      <Sum x={200} y={110} signs={{ l: '+', t: '+' }} />
      <Line p={[[214, 110], [265, 110]]} />
      <Block x={300} y={110} t="G_1" w={70} />
      <Line p={[[335, 110], [385, 110]]} />
      <Block x={420} y={110} t="G_2" w={70} />
      <Line p={[[455, 110], [580, 110]]} />
      <Pick x={520} y={110} />
      <Lbl x={570} y={90} t="Y" />
      <Line p={[[45, 110], [45, 40], [95, 40]]} />
      <Block x={130} y={40} t="\frac{G_3}{G_1}" w={70} h={50} />
      <Line p={[[165, 40], [200, 40], [200, 96]]} />
      <Line p={[[520, 110], [520, 180], [110, 180], [110, 124]]} />
    </BD>
  )
}

/* ------------------------------------------------------------------ */
/* Step-by-step reduction stepper                                      */
/* ------------------------------------------------------------------ */

type StepDef = { fig: ReactNode; text: string }

function Stepper({ title, steps }: { title: string; steps: StepDef[] }) {
  const [i, setI] = useState(0)
  const n = steps.length
  return (
    <div className="explorer">
      <div className="explorer-head">
        <span className="explorer-badge">Interactive</span>
        <span className="explorer-title">{title}</span>
        <button className="explorer-reset" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>
          ◀ Prev
        </button>
        <span style={{ fontSize: 13, color: 'var(--muted)', minWidth: 64, textAlign: 'center' }}>
          Step {i + 1} / {n}
        </span>
        <button className="explorer-reset" onClick={() => setI(Math.min(n - 1, i + 1))} disabled={i === n - 1}>
          Next ▶
        </button>
      </div>
      <div className="explorer-body">
        <p style={{ margin: '6px 0 0' }}>
          <Rich s={steps[i].text} />
        </p>
        {steps[i].fig}
      </div>
    </div>
  )
}

export function ThreeLoopStepper() {
  return (
    <Stepper
      title="Three-loop example (p. 4), reduced step by step"
      steps={[
        { fig: <ThreeLoopFig />, text: 'The original system. Three loops share parts of the forward path, so none of them can be collapsed with Rule 3 straight away: the $H_1$ loop (from A to $\\Sigma_1$) encloses only part of the $H_2$ loop, and the $H_2$ loop overlaps the $H_3$ loop.' },
        { fig: <ThreeLoopMovedFig />, text: 'Professor\'s move: the $H_1$ take-off point is moved forward from A past $G_3$ and $G_4$ to $Y$. Since $Y=G_3G_4\\cdot A$, the branch must divide by $G_3G_4$ to keep feeding $A$ into $H_1$. Now the $G_2$–$G_3$–$H_2$ loop (ringed) is a clean, self-contained loop.' },
        { fig: <ThreeLoopStepAFig />, text: 'Rule 3 on the ringed loop: $G_A=\\dfrac{G_2G_3}{1+G_2G_3H_2}$ (this is where the notes stop). Next ring: $G_A$, $G_4$ and $H_3$.' },
        { fig: <ThreeLoopStepBFig />, text: 'Rule 3 again, with forward path $G_AG_4$ (series) and feedback $H_3$: $G_B=\\dfrac{G_AG_4}{1+G_AG_4H_3}=\\dfrac{G_2G_3G_4}{1+G_2G_3H_2+G_2G_3G_4H_3}$.' },
        { fig: <ThreeLoopStepCFig />, text: 'Combine series blocks: forward $G_1G_B$, feedback $\\dfrac{H_1}{G_3G_4}$. One canonical loop remains.' },
        { fig: <ThreeLoopFinalFig />, text: 'Rule 3 a last time: $T=\\dfrac{G_1G_B}{1+G_1G_B\\,H_1/(G_3G_4)}$. Clearing the fractions gives the final transfer function.' },
      ]}
    />
  )
}

export function TwoLoopStepper() {
  return (
    <Stepper
      title="Two-loop example (p. 1) solved by reduction instead of algebra"
      steps={[
        { fig: <TwoLoopFig />, text: 'The p. 1 system. The $H_1$ loop ($\\Sigma_1\\to G_1\\to\\Sigma_2\\to G_2\\to X$) and the $H_2$ loop ($\\Sigma_2\\to G_2\\to G_3\\to Y$) share $\\Sigma_2$ and $G_2$ but neither contains the other: they interlock.' },
        { fig: <TwoLoopMovedFig ring />, text: 'Move the take-off point X forward past $G_3$ to $Y$. Since $Y=G_3X$, the branch needs $\\dfrac{1}{G_3}$ to still deliver $X$ to $H_1$. Now the $H_2$ loop (ringed) is self-contained.' },
        { fig: <Loop fwd={[{ t: 'G_1' }, { t: '\\frac{G_2G_3}{1+G_2G_3H_2}', w: 140 }]} fb={[{ t: '\\frac{H_1}{G_3}', w: 80 }]} caption="Inner loop replaced by Rule 3; the feedback blocks 1/G₃ and H₁ combined in series." />, text: 'Rule 3 on the ringed loop gives $\\dfrac{G_2G_3}{1+G_2G_3H_2}$; it is in series with $G_1$. The feedback path is $\\dfrac{H_1}{G_3}$.' },
        { fig: <OneBlock w={260} t="\frac{G_1G_2G_3}{1+G_1G_2H_1+G_2G_3H_2}" caption="Same T(s) as the professor's algebra on p. 2." />, text: 'Rule 3 on the last loop: forward $F=\\dfrac{G_1G_2G_3}{1+G_2G_3H_2}$, loop product $F\\cdot\\dfrac{H_1}{G_3}=\\dfrac{G_1G_2H_1}{1+G_2G_3H_2}$, so $T=\\dfrac{G_1G_2G_3}{1+G_2G_3H_2+G_1G_2H_1}$ — the same result.' },
      ]}
    />
  )
}
