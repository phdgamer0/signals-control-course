import { useState } from 'react'
import { Link } from 'react-router-dom'
import { modules } from '../data/modules'
import { entries } from '../data/search'
import { useProgress } from '../lib/progress'
import { slugify } from '../lib/slug'

const KIND: Record<string, string> = {
  concept: 'Conceptual',
  formula: 'Formula',
  calc: 'Calculation',
  graph: 'Graph',
  circuit: 'Circuit',
  problem: 'Full problem',
  prof: "Professor's example",
  edge: 'Edge case',
}

export default function Practice() {
  const p = useProgress()
  const [filter, setFilter] = useState<'all' | 'todo' | 'solved'>('all')
  const ex = entries.filter((e) => e.kind === 'exercise')
  return (
    <div className="page">
      <h1>Practice</h1>
      <p className="lead">
        All {ex.length} exercises across the course. Each opens inside its lesson, where you can try it, reveal the full worked solution, and mark it
        solved.
      </p>
      <div className="chip-row">
        {(['all', 'todo', 'solved'] as const).map((f) => (
          <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'todo' ? 'Not yet solved' : 'Solved'}
          </button>
        ))}
      </div>
      {modules.map((m) => {
        const list = ex
          .filter((e) => e.m === m.id)
          .filter((e) => {
            const s = p.exercises[`m${m.id}-${slugify(e.title)}`] === 'solved'
            return filter === 'all' || (filter === 'solved' ? s : !s)
          })
        if (!list.length) return null
        return (
          <section key={m.id} className="practice-module">
            <h2>
              <span className="mod-num">{m.id}</span> {m.title}
            </h2>
            <ul className="practice-list">
              {list.map((e) => {
                const st = p.exercises[`m${m.id}-${slugify(e.title)}`]
                return (
                  <li key={e.id} className={st ? `st-${st}` : ''}>
                    <span className="pl-state">{st === 'solved' ? '✓' : st === 'revealed' ? '◐' : '○'}</span>
                    <Link to={`/m/${m.id}/${e.id}`}>{e.title}</Link>
                    <span className="pl-kind">{KIND[e.exKind ?? 'problem'] ?? e.exKind}</span>
                    <span className="pl-level">{'●'.repeat(+(e.level ?? 2))}</span>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
