import { createContext, useContext, type ReactNode } from 'react'
import { SvgTex } from './SvgTex'

/**
 * Circuit-drawing primitives (SVG). Coordinates are in viewBox units.
 * Two-terminal parts are drawn between (x1,y1) and (x2,y2), which should be axis-aligned;
 * the symbol body is centered and the rest is filled with lead wire.
 */

const Style = createContext<{ iec: boolean }>({ iec: false })

export function Circuit({
  w,
  h,
  iec = false,
  caption,
  children,
  maxWidth,
}: {
  w: number
  h: number
  iec?: boolean
  caption?: ReactNode
  children?: ReactNode
  maxWidth?: number
}) {
  return (
    <figure className="circuit">
      <svg viewBox={`0 0 ${w} ${h}`} style={{ maxWidth: maxWidth ?? w * 1.25 }} role="img" aria-label="circuit diagram">
        <Style.Provider value={{ iec }}>
          <g className="ckt">{children}</g>
        </Style.Provider>
      </svg>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

type TwoTerm = {
  x1: number
  y1: number
  x2: number
  y2: number
  label?: string
  /** put the label on the other side */
  flip?: boolean
  /** extra label shift along the normal */
  lo?: number
}

function geom({ x1, y1, x2, y2 }: TwoTerm) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy)
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI
  return { len, ang, cx: (x1 + x2) / 2, cy: (y1 + y2) / 2, ux: dx / len, uy: dy / len }
}

function TwoTerminal(props: TwoTerm & { body: number; children: ReactNode }) {
  const { x1, y1, x2, y2, label, flip, lo = 0, body } = props
  const g = geom(props)
  const half = body / 2
  const a = [g.cx - g.ux * half, g.cy - g.uy * half]
  const b = [g.cx + g.ux * half, g.cy + g.uy * half]
  // normal: horizontal parts → label above, vertical parts → label right
  const horizontal = Math.abs(g.uy) < 0.5
  let nx = horizontal ? 0 : 1
  let ny = horizontal ? -1 : 0
  if (flip) {
    nx = -nx
    ny = -ny
  }
  const off = 24 + lo
  return (
    <g>
      <line x1={x1} y1={y1} x2={a[0]} y2={a[1]} />
      <line x1={b[0]} y1={b[1]} x2={x2} y2={y2} />
      <g transform={`translate(${g.cx} ${g.cy}) rotate(${g.ang})`}>{props.children}</g>
      {label && (
        <SvgTex
          x={g.cx + nx * off}
          y={g.cy + ny * off}
          t={label}
          align={horizontal ? 'c' : nx > 0 ? 'l' : 'r'}
          size={14}
        />
      )}
    </g>
  )
}

export function R(p: TwoTerm) {
  const { iec } = useContext(Style)
  return (
    <TwoTerminal {...p} body={44}>
      {iec ? (
        <rect x={-22} y={-8} width={44} height={16} className="fill-bg" />
      ) : (
        <polyline points="-22,0 -18,-8 -11,8 -4,-8 3,8 10,-8 17,8 22,0" fill="none" />
      )}
    </TwoTerminal>
  )
}

export function C(p: TwoTerm) {
  return (
    <TwoTerminal {...p} body={12}>
      <line x1={-6} y1={0} x2={-4} y2={0} />
      <line x1={4} y1={0} x2={6} y2={0} />
      <line x1={-4} y1={-14} x2={-4} y2={14} strokeWidth={2.6} />
      <line x1={4} y1={-14} x2={4} y2={14} strokeWidth={2.6} />
    </TwoTerminal>
  )
}

export function L(p: TwoTerm) {
  return (
    <TwoTerminal {...p} body={48}>
      <path d="M-24,0 a6,7 0 0 1 12,0 a6,7 0 0 1 12,0 a6,7 0 0 1 12,0 a6,7 0 0 1 12,0" fill="none" transform="scale(1,-1)" />
    </TwoTerminal>
  )
}

/** Voltage source. `plus` = which terminal is positive: 'b' means (x2,y2). `ac` draws a sine source. */
export function V(p: TwoTerm & { plus?: 'a' | 'b'; ac?: boolean }) {
  const s = p.plus === 'a' ? -1 : 1
  return (
    <TwoTerminal {...p} body={36}>
      <circle r={18} className="fill-bg" />
      {p.ac ? (
        <path d="M-9,0 C-5,-10 -1,-10 0,0 S5,10 9,0" fill="none" />
      ) : (
        <>
          {/* + and − drawn upright regardless of rotation is not needed: they are symmetric */}
          <text x={s * 8} y={4} className="ckt-sign" textAnchor="middle" transform={`rotate(${-geom(p).ang} ${s * 8} 0)`}>
            +
          </text>
          <text x={-s * 8} y={4} className="ckt-sign" textAnchor="middle" transform={`rotate(${-geom(p).ang} ${-s * 8} 0)`}>
            −
          </text>
        </>
      )}
    </TwoTerminal>
  )
}

/** Current source with arrow pointing toward (x2,y2) (or toward a if dir='a'). */
export function I(p: TwoTerm & { dir?: 'a' | 'b' }) {
  const s = p.dir === 'a' ? -1 : 1
  return (
    <TwoTerminal {...p} body={36}>
      <circle r={18} className="fill-bg" />
      <line x1={-s * 10} y1={0} x2={s * 8} y2={0} />
      <path d={`M${s * 10},0 L${s * 3},-5 L${s * 3},5 z`} className="fill-fg" />
    </TwoTerminal>
  )
}

/** Switch; closed=false draws it open. */
export function Sw(p: TwoTerm & { closed?: boolean }) {
  return (
    <TwoTerminal {...p} body={36}>
      <circle cx={-16} cy={0} r={2.5} className="fill-fg" />
      <circle cx={16} cy={0} r={2.5} className="fill-fg" />
      {p.closed ? <line x1={-16} y1={0} x2={16} y2={0} /> : <line x1={-16} y1={0} x2={14} y2={-14} />}
    </TwoTerminal>
  )
}

/** Plain wire through a list of points. */
export function W({ p }: { p: [number, number][] }) {
  return <polyline points={p.map((q) => q.join(',')).join(' ')} fill="none" />
}

export const Dot = ({ x, y }: { x: number; y: number }) => <circle cx={x} cy={y} r={3.5} className="fill-fg" />

/** Open terminal (port), e.g. where v_i or v_o is applied/measured. */
export const Port = ({ x, y }: { x: number; y: number }) => <circle cx={x} cy={y} r={4} className="fill-bg" />

export function Gnd({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + 8} />
      <line x1={x - 12} y1={y + 8} x2={x + 12} y2={y + 8} />
      <line x1={x - 7} y1={y + 13} x2={x + 7} y2={y + 13} />
      <line x1={x - 2.5} y1={y + 18} x2={x + 2.5} y2={y + 18} />
    </g>
  )
}

/** TeX label at a point. */
export const T = ({ x, y, t, align, size }: { x: number; y: number; t: string; align?: 'c' | 'l' | 'r' | 't' | 'b'; size?: number }) => (
  <SvgTex x={x} y={y} t={t} align={align} size={size ?? 14} />
)

/** Current arrow drawn on top of a wire segment, pointing in direction (dx,dy). */
export function Arrow({ x, y, dir = 'r', label, flip }: { x: number; y: number; dir?: 'r' | 'l' | 'u' | 'd'; label?: string; flip?: boolean }) {
  const rot = { r: 0, d: 90, l: 180, u: 270 }[dir]
  const horiz = dir === 'r' || dir === 'l'
  return (
    <g>
      <path d="M6,0 L-5,-5.5 L-5,5.5 z" transform={`translate(${x} ${y}) rotate(${rot})`} className="ckt-arrow" />
      {label && <SvgTex x={x + (horiz ? 0 : flip ? -12 : 12)} y={y + (horiz ? (flip ? 16 : -16) : 0)} t={label} align={horiz ? 'c' : flip ? 'r' : 'l'} size={13} />}
    </g>
  )
}

/** Voltage polarity marks between two points (+ at a, − at b) with a label in between. */
export function Vlabel({ a, b, label, side = 'r' }: { a: [number, number]; b: [number, number]; label: string; side?: 'r' | 'l' | 'c' }) {
  const mx = (a[0] + b[0]) / 2
  const my = (a[1] + b[1]) / 2
  return (
    <g className="vlabel">
      <text x={a[0]} y={a[1] + 5} textAnchor="middle" className="ckt-sign accent">
        +
      </text>
      <text x={b[0]} y={b[1] + 5} textAnchor="middle" className="ckt-sign accent">
        −
      </text>
      <SvgTex x={mx} y={my} t={label} align={side === 'c' ? 'c' : side === 'r' ? 'l' : 'r'} size={14} color="var(--accent)" />
    </g>
  )
}
