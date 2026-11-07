import { renderTex } from '../lib/tex'

/** KaTeX label positioned inside an SVG. (x, y) is the anchor; align picks which side of the label sits on it. */
export function SvgTex({
  x,
  y,
  t,
  align = 'c',
  size = 14,
  color,
}: {
  x: number
  y: number
  t: string
  align?: 'c' | 'l' | 'r' | 't' | 'b'
  size?: number
  color?: string
}) {
  const W = 260
  const H = 70
  const justify = align === 'l' ? 'flex-start' : align === 'r' ? 'flex-end' : 'center'
  const items = align === 't' ? 'flex-start' : align === 'b' ? 'flex-end' : 'center'
  const fx = align === 'l' ? x : align === 'r' ? x - W : x - W / 2
  const fy = align === 't' ? y : align === 'b' ? y - H : y - H / 2
  return (
    <foreignObject x={fx} y={fy} width={W} height={H} style={{ overflow: 'visible', pointerEvents: 'none' }}>
      <div
        style={{
          width: W,
          height: H,
          display: 'flex',
          justifyContent: justify,
          alignItems: items,
          fontSize: size,
          color: color ?? 'var(--fg)',
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
        }}
        dangerouslySetInnerHTML={{ __html: renderTex(t, false) }}
      />
    </foreignObject>
  )
}
