import { useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { SvgTex } from './SvgTex'

export const PALETTE = ['#5eead4', '#f9a8d4', '#fbbf24', '#93c5fd', '#c4b5fd', '#86efac', '#fca5a5']

export interface Series {
  fn?: (x: number) => number
  points?: [number, number][]
  label?: string
  color?: string
  dash?: boolean
  width?: number
  /** draw as a step/stem plot of points */
  stem?: boolean
}
export interface Mark {
  x?: number
  y?: number
  label?: string
  color?: string
}
export interface PlotProps {
  series: Series[]
  x: [number, number]
  y?: [number, number]
  xLabel?: string
  yLabel?: string
  hlines?: Mark[]
  vlines?: Mark[]
  points?: (Mark & { x: number; y: number })[]
  /** shaded horizontal band, e.g. the ±2% settling band */
  bands?: { y1: number; y2: number; color?: string; label?: string }[]
  height?: number
  samples?: number
  legend?: boolean
  title?: string
  children?: ReactNode
}

function niceStep(span: number, target = 6) {
  const raw = span / target
  const p = Math.pow(10, Math.floor(Math.log10(raw)))
  const m = raw / p
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p
}
function ticks(a: number, b: number, target = 6) {
  const s = niceStep(b - a, target)
  const out: number[] = []
  for (let v = Math.ceil(a / s) * s; v <= b + s * 1e-9; v += s) out.push(Math.abs(v) < s * 1e-9 ? 0 : v)
  return out
}
const fmt = (v: number) => {
  const r = Math.round(v * 1000) / 1000
  return Math.abs(r) >= 1000 || (Math.abs(r) < 0.01 && r !== 0) ? r.toExponential(1) : String(r)
}

/** Lightweight SVG function plotter with hover read-out. */
export function Plot({
  series,
  x,
  y,
  xLabel = 't',
  yLabel,
  hlines = [],
  vlines = [],
  points = [],
  bands = [],
  height = 300,
  samples = 400,
  legend = true,
  title,
}: PlotProps) {
  const W = 640
  const H = height
  const pad = { l: 52, r: 18, t: 16, b: 40 }
  const data = useMemo(
    () =>
      series.map((s) => {
        if (s.points) return s.points
        const pts: [number, number][] = []
        for (let i = 0; i <= samples; i++) {
          const xv = x[0] + ((x[1] - x[0]) * i) / samples
          const yv = s.fn!(xv)
          pts.push([xv, yv])
        }
        return pts
      }),
    [series, x, samples],
  )
  const yr = useMemo<[number, number]>(() => {
    if (y) return y
    let lo = Infinity
    let hi = -Infinity
    data.forEach((d) =>
      d.forEach(([, v]) => {
        if (isFinite(v)) {
          lo = Math.min(lo, v)
          hi = Math.max(hi, v)
        }
      }),
    )
    hlines.forEach((h) => h.y !== undefined && ((lo = Math.min(lo, h.y)), (hi = Math.max(hi, h.y))))
    if (!isFinite(lo)) return [0, 1]
    if (lo > 0) lo = 0
    if (hi < 0) hi = 0
    const m = (hi - lo || 1) * 0.08
    return [lo - (lo < 0 ? m : 0), hi + m]
  }, [y, data, hlines])
  const sx = (v: number) => pad.l + ((v - x[0]) / (x[1] - x[0])) * (W - pad.l - pad.r)
  const sy = (v: number) => H - pad.b - ((v - yr[0]) / (yr[1] - yr[0])) * (H - pad.t - pad.b)
  const clampY = (v: number) => Math.max(pad.t - 40, Math.min(H - pad.b + 40, sy(v)))
  const ref = useRef<SVGSVGElement>(null)
  const clipId = 'clip' + useId().replace(/:/g, '')
  const [hx, setHx] = useState<number | null>(null)

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * W
    if (px < pad.l || px > W - pad.r) return setHx(null)
    setHx(x[0] + ((px - pad.l) / (W - pad.l - pad.r)) * (x[1] - x[0]))
  }

  return (
    <div className="plot">
      {title && <div className="plot-title">{title}</div>}
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="plot-svg"
        onPointerMove={onMove}
        onPointerLeave={() => setHx(null)}
        role="img"
        aria-label={title ?? 'plot'}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={pad.l} y={pad.t} width={W - pad.l - pad.r} height={H - pad.t - pad.b} />
          </clipPath>
        </defs>
        {ticks(yr[0], yr[1], 5).map((v) => (
          <g key={'y' + v}>
            <line x1={pad.l} x2={W - pad.r} y1={sy(v)} y2={sy(v)} className="grid" />
            <text x={pad.l - 6} y={sy(v) + 4} className="tick" textAnchor="end">
              {fmt(v)}
            </text>
          </g>
        ))}
        {ticks(x[0], x[1], 8).map((v) => (
          <g key={'x' + v}>
            <line y1={pad.t} y2={H - pad.b} x1={sx(v)} x2={sx(v)} className="grid" />
            <text x={sx(v)} y={H - pad.b + 16} className="tick" textAnchor="middle">
              {fmt(v)}
            </text>
          </g>
        ))}
        {yr[0] <= 0 && yr[1] >= 0 && <line x1={pad.l} x2={W - pad.r} y1={sy(0)} y2={sy(0)} className="axis" />}
        {x[0] <= 0 && x[1] >= 0 && <line y1={pad.t} y2={H - pad.b} x1={sx(0)} x2={sx(0)} className="axis" />}
        <g clipPath={`url(#${clipId})`}>
          {bands.map((b, i) => (
            <rect
              key={i}
              x={pad.l}
              width={W - pad.l - pad.r}
              y={sy(Math.max(b.y1, b.y2))}
              height={Math.abs(sy(b.y1) - sy(b.y2))}
              fill={b.color ?? 'rgba(94,234,212,0.10)'}
            />
          ))}
          {hlines.map((h, i) => (
            <line key={i} x1={pad.l} x2={W - pad.r} y1={sy(h.y!)} y2={sy(h.y!)} className="refline" stroke={h.color} />
          ))}
          {vlines.map((h, i) => (
            <line key={i} y1={pad.t} y2={H - pad.b} x1={sx(h.x!)} x2={sx(h.x!)} className="refline" stroke={h.color} />
          ))}
          {data.map((d, i) => {
            const s = series[i]
            const col = s.color ?? PALETTE[i % PALETTE.length]
            if (s.stem)
              return (
                <g key={i}>
                  {d.map(([a, b], j) => (
                    <g key={j}>
                      <line x1={sx(a)} x2={sx(a)} y1={sy(0)} y2={sy(b)} stroke={col} strokeWidth={2} />
                      <circle cx={sx(a)} cy={sy(b)} r={3.5} fill={col} />
                    </g>
                  ))}
                </g>
              )
            let path = ''
            let pen = false
            d.forEach(([a, b]) => {
              if (!isFinite(b)) {
                pen = false
                return
              }
              path += `${pen ? 'L' : 'M'}${sx(a).toFixed(2)},${clampY(b).toFixed(2)}`
              pen = true
            })
            return (
              <path
                key={i}
                d={path}
                fill="none"
                stroke={col}
                strokeWidth={s.width ?? 2.2}
                strokeDasharray={s.dash ? '6 5' : undefined}
                strokeLinejoin="round"
              />
            )
          })}
        </g>
        {hlines.map(
          (h, i) =>
            h.label && <SvgTex key={'hl' + i} x={W - pad.r - 4} y={sy(h.y!) - 10} t={h.label} align="r" size={12} color={h.color ?? 'var(--muted)'} />,
        )}
        {vlines.map(
          (h, i) => h.label && <SvgTex key={'vl' + i} x={sx(h.x!) + 4} y={pad.t + 10} t={h.label} align="l" size={12} color={h.color ?? 'var(--muted)'} />,
        )}
        {points.map((p, i) => (
          <g key={'p' + i}>
            <circle cx={sx(p.x)} cy={sy(p.y)} r={4.5} fill={p.color ?? 'var(--accent-2)'} stroke="var(--bg)" strokeWidth={1.5} />
            {p.label && <SvgTex x={sx(p.x) + 8} y={sy(p.y) - 12} t={p.label} align="l" size={12} />}
          </g>
        ))}
        <text x={W - pad.r} y={H - 6} className="axis-label" textAnchor="end">
          {xLabel}
        </text>
        {yLabel && (
          <text x={12} y={pad.t + 2} className="axis-label" textAnchor="start" dominantBaseline="hanging" transform={`rotate(0)`}>
            {yLabel}
          </text>
        )}
        {hx !== null && (
          <g>
            <line y1={pad.t} y2={H - pad.b} x1={sx(hx)} x2={sx(hx)} className="hover-line" />
            {series.map((s, i) => {
              if (!s.fn) return null
              const v = s.fn(hx)
              if (!isFinite(v) || v < yr[0] || v > yr[1]) return null
              return <circle key={i} cx={sx(hx)} cy={sy(v)} r={3.5} fill={s.color ?? PALETTE[i % PALETTE.length]} />
            })}
          </g>
        )}
      </svg>
      <div className="plot-foot">
        {legend && (
          <div className="legend">
            {series.map(
              (s, i) =>
                s.label && (
                  <span key={i} className="legend-item">
                    <i style={{ background: s.color ?? PALETTE[i % PALETTE.length] }} className={s.dash ? 'dash' : ''} />
                    {s.label}
                  </span>
                ),
            )}
          </div>
        )}
        <div className="readout">
          {hx !== null &&
            `${xLabel.split(' ')[0]} = ${fmt(hx)}` +
              series
                .filter((s) => s.fn)
                .map((s) => `   ${s.label ?? 'y'} = ${fmt(s.fn!(hx))}`)
                .join('')}
        </div>
      </div>
    </div>
  )
}
