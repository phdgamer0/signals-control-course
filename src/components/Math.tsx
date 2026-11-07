import { useState } from 'react'
import { renderTex } from '../lib/tex'

/** Inline math. Usage in TSX: <M>{tex`\frac{1}{s}`}</M>. In MDX prefer $...$. */
export function M({ children }: { children: string }) {
  return <span className="m-inline" dangerouslySetInnerHTML={{ __html: renderTex(children, false) }} />
}

/** Display math with an optional caption and a copy-LaTeX button. */
export function MD({ children, label, copy = true }: { children: string; label?: string; copy?: boolean }) {
  const [copied, setCopied] = useState(false)
  const doCopy = () => {
    navigator.clipboard?.writeText(children).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })
  }
  return (
    <div className="m-display">
      <div className="m-display-inner" dangerouslySetInnerHTML={{ __html: renderTex(children, true) }} />
      {label && <div className="m-label">{label}</div>}
      {copy && (
        <button className="m-copy" onClick={doCopy} title="Copy LaTeX" aria-label="Copy LaTeX">
          {copied ? '✓' : 'TeX'}
        </button>
      )}
    </div>
  )
}
