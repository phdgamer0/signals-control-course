import { renderTex } from './tex'

/** Render a plain string containing $...$ inline math segments. */
export function Rich({ s }: { s: string }) {
  const parts = s.split(/(\$[^$]+\$)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('$') && p.endsWith('$') && p.length > 1 ? (
          <span key={i} dangerouslySetInnerHTML={{ __html: renderTex(p.slice(1, -1)) }} />
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}
