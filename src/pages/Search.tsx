import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { entries, fold, type Entry } from '../data/search'
import { moduleById } from '../data/modules'
import { formulasByModule } from '../data/formulas'
import { M } from '../components/Math'

const KIND_LABEL: Record<string, string> = {
  section: 'Section',
  subsection: 'Subsection',
  example: 'Worked example',
  exercise: 'Exercise',
  definition: 'Definition',
  term: 'Term',
  formula: 'Formula',
}

type Hit = Entry & { score: number; snippet?: string; tex?: string; link: string }

export default function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const hits = useMemo(() => search(q), [q])
  return (
    <div className="page search-page">
      <h1>Search</h1>
      <p className="lead">
        {q ? (
          <>
            {hits.length} result{hits.length === 1 ? '' : 's'} for <b>“{q}”</b> (English and Turkish terms both match; Turkish letters are optional).
          </>
        ) : (
          'Type in the search box in the sidebar.'
        )}
      </p>
      <ul className="search-results">
        {hits.slice(0, 80).map((h, i) => (
          <li key={i}>
            <Link to={h.link}>
              <span className="sr-kind">{KIND_LABEL[h.kind]}</span>
              <span className="sr-title">
                {h.title}
                {h.tr && <span className="tr"> · {h.tr}</span>}
              </span>
              <span className="sr-mod">
                Module {h.m} · {moduleById(h.m)?.title}
              </span>
              {h.tex && (
                <span className="sr-tex">
                  <M>{h.tex}</M>
                </span>
              )}
              {h.snippet && <span className="sr-snippet">…{h.snippet}…</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function search(q: string): Hit[] {
  const terms = fold(q).split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  const out: Hit[] = []
  const add = (e: Entry, link: string, extra: Partial<Hit> = {}) => {
    const title = fold(e.title ?? '') + ' ' + fold(e.tr ?? '')
    const body = fold(e.text ?? '') + ' ' + fold(e.section ?? '')
    let score = 0
    for (const t of terms) {
      const inTitle = title.includes(t)
      const inBody = body.includes(t)
      if (!inTitle && !inBody) return
      score += inTitle ? 10 : 1
    }
    if (e.kind === 'definition' || e.kind === 'term') score += 3
    if (e.kind === 'formula') score += 2
    let snippet: string | undefined
    if (e.text) {
      const ft = fold(e.text)
      const at = ft.indexOf(terms[0])
      if (at >= 0) snippet = e.text.slice(Math.max(0, at - 70), at + 110)
    }
    out.push({ ...e, score, snippet, link, ...extra })
  }
  for (const e of entries) add(e, `/m/${e.m}${e.id ? '/' + e.id : ''}`)
  for (const [m, fs] of Object.entries(formulasByModule))
    for (const f of fs)
      add(
        { m, id: f.id, title: f.name, tr: f.tr, kind: 'formula', text: f.vars.join(' ') + ' ' + f.conditions + ' ' + f.tex },
        `/formulas#f-${m}-${f.id}`,
        { tex: f.tex },
      )
  // de-duplicate terms that appear many times
  const seen = new Set<string>()
  return out
    .sort((a, b) => b.score - a.score)
    .filter((h) => {
      const k = h.kind + h.m + h.title + h.id
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
}
