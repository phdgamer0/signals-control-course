import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

/** Right-hand "on this page" outline, built from the rendered lesson headings, with scroll-spy. */
export function Outline({ moduleId, version }: { moduleId: string; version: number }) {
  const [items, setItems] = useState<{ id: string; text: string; level: number }[]>([])
  const [active, setActive] = useState('')
  useEffect(() => {
    const hs = Array.from(document.querySelectorAll<HTMLElement>('.lesson-content h2[id], .lesson-content h3[id]'))
    setItems(hs.map((h) => ({ id: h.id, text: h.textContent ?? '', level: h.tagName === 'H2' ? 2 : 3 })))
    const obs = new IntersectionObserver(
      (es) => {
        const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (vis[0]) setActive(vis[0].target.id)
      },
      { rootMargin: '0px 0px -70% 0px' },
    )
    hs.forEach((h) => obs.observe(h))
    return () => obs.disconnect()
  }, [moduleId, version])
  if (!items.length) return null
  return (
    <nav className="outline" aria-label="On this page">
      <div className="outline-head">On this page</div>
      <ul>
        {items.map((i) => (
          <li key={i.id} className={`lvl${i.level} ${active === i.id ? 'active' : ''}`}>
            <Link to={`/m/${moduleId}/${i.id}`}>{i.text}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
