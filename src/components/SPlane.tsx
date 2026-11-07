import { SvgTex } from './SvgTex'

export interface PZ {
  re: number
  im: number
  label?: string
  color?: string
}

/** s-plane (complex plane) with poles (×) and zeros (○). Left half-plane is lightly shaded as the stable region. */
export function SPlane({
  poles = [],
  zeros = [],
  range = 5,
  imRange,
  shade = true,
  size = 300,
  lines = [],
  caption,
}: {
  poles?: PZ[]
  zeros?: PZ[]
  range?: number
  imRange?: number
  shade?: boolean
  size?: number
  /** extra rays/lines from origin, e.g. to show θ for ζ = cos θ */
  lines?: { re: number; im: number; dash?: boolean; color?: string }[]
  caption?: string
}) {
  const W = size * 1.4
  const H = size
  const R = range
  const I = imRange ?? R * (H / W)
  const sx = (v: number) => W / 2 + (v / R) * (W / 2 - 20)
  const sy = (v: number) => H / 2 - (v / I) * (H / 2 - 20)
  return (
    <figure className="splane">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="s-plane">
        {shade && <rect x={0} y={0} width={W / 2} height={H} fill="rgba(94,234,212,0.06)" />}
        {shade && <rect x={W / 2} y={0} width={W / 2} height={H} fill="rgba(252,165,165,0.05)" />}
        <line x1={6} x2={W - 6} y1={H / 2} y2={H / 2} className="axis" markerEnd="url(#arr)" />
        <line y1={H - 6} y2={6} x1={W / 2} x2={W / 2} className="axis" markerEnd="url(#arr)" />
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--muted)" />
          </marker>
        </defs>
        <SvgTex x={W - 10} y={H / 2 + 14} t="\sigma" align="r" size={13} color="var(--muted)" />
        <SvgTex x={W / 2 + 8} y={14} t="j\omega" align="l" size={13} color="var(--muted)" />
        {shade && <text x={10} y={H - 10} className="tick" fill="var(--accent)">stable (LHP)</text>}
        {shade && (
          <text x={W - 10} y={H - 10} className="tick" textAnchor="end" fill="#fca5a5">
            unstable (RHP)
          </text>
        )}
        {lines.map((l, i) => (
          <line key={i} x1={sx(0)} y1={sy(0)} x2={sx(l.re)} y2={sy(l.im)} stroke={l.color ?? 'var(--muted)'} strokeDasharray={l.dash ? '4 4' : undefined} />
        ))}
        {zeros.map((z, i) => (
          <g key={'z' + i}>
            <circle cx={sx(z.re)} cy={sy(z.im)} r={6} fill="none" stroke={z.color ?? '#93c5fd'} strokeWidth={2.2} />
            {z.label && <SvgTex x={sx(z.re)} y={sy(z.im) + 18} t={z.label} size={12} />}
          </g>
        ))}
        {poles.map((p, i) => {
          const x = sx(Math.max(-R, Math.min(R, p.re)))
          const y = sy(Math.max(-I, Math.min(I, p.im)))
          return (
            <g key={'p' + i} stroke={p.color ?? '#f9a8d4'} strokeWidth={2.6}>
              <line x1={x - 6} y1={y - 6} x2={x + 6} y2={y + 6} />
              <line x1={x - 6} y1={y + 6} x2={x + 6} y2={y - 6} />
              {p.label && <SvgTex x={x} y={y + (p.im < 0 ? 18 : -16)} t={p.label} size={12} />}
            </g>
          )
        })}
      </svg>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
