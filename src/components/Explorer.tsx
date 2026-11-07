import { useState, type ReactNode } from 'react'
import { renderTex } from '../lib/tex'

export interface Param {
  name: string
  /** KaTeX label, e.g. "\\zeta" */
  label: string
  min: number
  max: number
  step: number
  value: number
  unit?: string
}

/** Slider panel + render prop. Interactive widgets are built on top of this. */
export function Explorer({
  params,
  title,
  children,
}: {
  params: Param[]
  title?: string
  children: (p: Record<string, number>) => ReactNode
}) {
  const init = Object.fromEntries(params.map((p) => [p.name, p.value]))
  const [v, setV] = useState<Record<string, number>>(init)
  return (
    <div className="explorer">
      <div className="explorer-head">
        <span className="explorer-badge">Interactive</span>
        {title && <span className="explorer-title">{title}</span>}
        <button className="explorer-reset" onClick={() => setV(init)}>
          Reset
        </button>
      </div>
      <div className="explorer-controls">
        {params.map((p) => (
          <label key={p.name} className="slider">
            <span className="slider-label" dangerouslySetInnerHTML={{ __html: renderTex(`${p.label} = ${+v[p.name].toFixed(4)}${p.unit ? `\\,\\text{${p.unit}}` : ''}`) }} />
            <input
              type="range"
              min={p.min}
              max={p.max}
              step={p.step}
              value={v[p.name]}
              onChange={(e) => setV({ ...v, [p.name]: +e.target.value })}
            />
          </label>
        ))}
      </div>
      <div className="explorer-body">{children(v)}</div>
    </div>
  )
}

/** Small read-out table of computed quantities next to a plot. */
export function Readout({ rows }: { rows: [string, string | number][] }) {
  return (
    <div className="readout-grid">
      {rows.map(([k, val], i) => (
        <div key={i} className="readout-row">
          <span dangerouslySetInnerHTML={{ __html: renderTex(k) }} />
          <span className="readout-val" dangerouslySetInnerHTML={{ __html: renderTex(typeof val === 'number' ? fmtNum(val) : val) }} />
        </div>
      ))}
    </div>
  )
}
export const fmtNum = (v: number, d = 4) => (isFinite(v) ? String(+v.toPrecision(d)) : v > 0 ? '\\infty' : v < 0 ? '-\\infty' : '\\text{—}')
