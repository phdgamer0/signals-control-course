import type { ReactNode } from 'react'
import { SvgTex } from './SvgTex'

/** Block-diagram and signal-flow-graph primitives (SVG). */

export function BD({ w, h, caption, children }: { w: number; h: number; caption?: ReactNode; children?: ReactNode }) {
  return (
    <figure className="bd">
      <svg viewBox={`0 0 ${w} ${h}`} style={{ maxWidth: w * 1.2 }} role="img" aria-label="block diagram">
        <defs>
          <marker id="bdarr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="fill-fg" />
          </marker>
        </defs>
        <g className="bdg">{children}</g>
      </svg>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

/** Block centered at (x,y). */
export function Block({ x, y, t, w = 90, h = 48 }: { x: number; y: number; t: string; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={4} className="bd-block" />
      <SvgTex x={x} y={y} t={`\\displaystyle ${t}`} size={15} />
    </g>
  )
}

/** Summing junction with signs placed at the given sides. */
export function Sum({ x, y, r = 14, signs = {} }: { x: number; y: number; r?: number; signs?: Partial<Record<'l' | 't' | 'b' | 'r', '+' | '-'>> }) {
  const pos = { l: [-r - 10, -6], t: [6, -r - 4], b: [6, r + 14], r: [r + 4, -6] } as const
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="bd-sum" />
      <line x1={x - r * 0.7} y1={y - r * 0.7} x2={x + r * 0.7} y2={y + r * 0.7} className="thin" />
      <line x1={x - r * 0.7} y1={y + r * 0.7} x2={x + r * 0.7} y2={y - r * 0.7} className="thin" />
      {Object.entries(signs).map(([k, s]) => (
        <text key={k} x={x + pos[k as 'l'][0]} y={y + pos[k as 'l'][1]} className="bd-sign">
          {s === '-' ? '−' : '+'}
        </text>
      ))}
    </g>
  )
}

/** Directed connection through points; arrowhead at the end. */
export function Line({ p, arrow = true, dash }: { p: [number, number][]; arrow?: boolean; dash?: boolean }) {
  return (
    <polyline
      points={p.map((q) => q.join(',')).join(' ')}
      fill="none"
      markerEnd={arrow ? 'url(#bdarr)' : undefined}
      strokeDasharray={dash ? '5 4' : undefined}
    />
  )
}

/** Take-off (pick-off) point. */
export const Pick = ({ x, y }: { x: number; y: number }) => <circle cx={x} cy={y} r={3.5} className="fill-fg" />

export const Lbl = ({ x, y, t, align, size }: { x: number; y: number; t: string; align?: 'c' | 'l' | 'r' | 't' | 'b'; size?: number }) => (
  <SvgTex x={x} y={y} t={t} align={align} size={size ?? 14} />
)

/** Signal-flow-graph node. */
export function Node({ x, y, t, below }: { x: number; y: number; t?: string; below?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={5} className="fill-fg" />
      {t && <SvgTex x={x} y={y + (below ? 20 : -20)} t={t} size={14} />}
    </g>
  )
}

/**
 * Signal-flow-graph branch from (x1,y1) to (x2,y2) with gain label; `bend` curves it
 * (positive bends to the left of travel direction). Arrowhead at the midpoint.
 */
export function Branch({ x1, y1, x2, y2, t, bend = 0, lo = 14 }: { x1: number; y1: number; x2: number; y2: number; t?: string; bend?: number; lo?: number }) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const nx = dy / len
  const ny = -dx / len
  const cx = mx + nx * bend * 2
  const cy = my + ny * bend * 2
  // point and tangent at t=0.5 on the quadratic Bézier
  const px = 0.25 * x1 + 0.5 * cx + 0.25 * x2
  const py = 0.25 * y1 + 0.5 * cy + 0.25 * y2
  const tx = x2 - x1
  const ty = y2 - y1
  const ang = (Math.atan2(ty, tx) * 180) / Math.PI
  const s = bend < 0 ? -1 : 1
  return (
    <g>
      <path d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`} fill="none" />
      <path d="M6,0 L-5,-5 L-5,5 z" transform={`translate(${px} ${py}) rotate(${ang})`} className="fill-fg" />
      {t && <SvgTex x={px + nx * s * lo} y={py + ny * s * lo} t={t} size={13} />}
    </g>
  )
}
