import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { modules } from '../data/modules'
import sections from '../data/sections.json'
import { useProgress } from '../lib/progress'

const secs = sections as Record<string, { id: string; title: string }[]>

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname])
  return (
    <div className={`app ${open ? 'nav-open' : ''}`}>
      <header className="topbar">
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          ☰
        </button>
        <Link to="/" className="brand-sm">
          Signals &amp; Control
        </Link>
      </header>
      <Sidebar />
      <div className="scrim" onClick={() => setOpen(false)} />
      <main className="main">{children}</main>
    </div>
  )
}

function Sidebar() {
  const p = useProgress()
  const loc = useLocation()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const curModule = loc.pathname.match(/^\/m\/(\d\d)/)?.[1]
  return (
    <aside className="sidebar">
      <Link to="/" className="brand">
        <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden>
          <rect width="32" height="32" rx="7" fill="var(--panel-2)" />
          <path d="M3 24 C9 24 9 6 16 6 S22 18 29 16" stroke="var(--accent)" strokeWidth="2.6" fill="none" />
        </svg>
        <span>
          <b>Signals &amp; Control</b>
          <small>Sayısal Denetim · Course</small>
        </span>
      </Link>
      <form
        className="search"
        onSubmit={(e) => {
          e.preventDefault()
          if (q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`)
        }}
      >
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            if (e.target.value.trim().length > 1) nav(`/search?q=${encodeURIComponent(e.target.value.trim())}`, { replace: loc.pathname === '/search' })
          }}
          placeholder="Search EN / TR terms, formulas…"
          aria-label="Search the course"
        />
      </form>
      <nav className="side-nav">
        <NavLink to="/" end>
          Course overview
        </NavLink>
        <NavLink to="/formulas">Formula reference</NavLink>
        <NavLink to="/practice">Practice — all exercises</NavLink>
        <div className="side-heading">Modules</div>
        {modules.map((m) => {
          const active = curModule === m.id
          return (
            <div key={m.id} className={`side-module ${active ? 'active' : ''}`}>
              <NavLink to={`/m/${m.id}`} className="side-mod-link">
                <span className={`mod-dot ${p.completed[m.id] ? 'done' : p.visited[m.id] ? 'seen' : ''}`}>{p.completed[m.id] ? '✓' : m.id}</span>
                <span className="mod-title">{m.title}</span>
              </NavLink>
              {active && secs[m.id]?.length > 0 && (
                <ul className="side-sections">
                  {secs[m.id].map((s) => (
                    <li key={s.id}>
                      <Link to={`/m/${m.id}/${s.id}`}>{s.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
