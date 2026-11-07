import { Suspense, lazy, useEffect, useMemo, useState, type ComponentType } from 'react'
import { Link, useParams } from 'react-router-dom'
import { moduleById, modules } from '../data/modules'
import { formulasByModule } from '../data/formulas'
import { LessonContext } from '../components/LessonContext'
import { mdxComponents } from '../components/mdx'
import { Outline } from '../components/Outline'
import { M } from '../components/Math'
import { updateProgress, useProgress } from '../lib/progress'
import NotFound from './NotFound'

const lazyCache = new Map<string, ComponentType<any>>()
function getLesson(id: string) {
  let c = lazyCache.get(id)
  if (!c) {
    c = lazy(moduleById(id)!.load)
    lazyCache.set(id, c)
  }
  return c
}

export default function Lesson() {
  const { id = '', section } = useParams()
  const mod = moduleById(id)
  const p = useProgress()
  const [ready, setReady] = useState(0)
  const Content = useMemo(() => (mod ? getLesson(mod.id) : null), [mod])

  useEffect(() => {
    if (!mod) return
    updateProgress((q) => {
      q.visited[mod.id] = true
      q.last = `/m/${mod.id}${section ? '/' + section : ''}`
    })
  }, [mod, section])

  // scroll to the requested section once content is rendered
  useEffect(() => {
    if (!ready) return
    if (section) {
      const el = document.getElementById(section) ?? document.getElementById(decodeURIComponent(section))
      if (el) {
        el.scrollIntoView({ block: 'start' })
        el.classList.add('flash')
        setTimeout(() => el.classList.remove('flash'), 1400)
        return
      }
    }
    window.scrollTo(0, 0)
  }, [ready, section, id])

  if (!mod || !Content) return <NotFound />
  const idx = modules.indexOf(mod)
  const prev = modules[idx - 1]
  const next = modules[idx + 1]
  const keyFormulas = (formulasByModule[mod.id] ?? []).filter((f) => f.key)
  const done = !!p.completed[mod.id]

  return (
    <LessonContext.Provider value={{ moduleId: mod.id }}>
      <div className="lesson-layout">
        <article className="lesson">
          <header className="lesson-header">
            <div className="lesson-kicker">Module {mod.id}</div>
            <h1>{mod.title}</h1>
            <div className="lesson-tr">{mod.tr}</div>
            <div className="lesson-source">
              Source: <code>{mod.source}</code> · {mod.pages} handwritten pages
            </div>
          </header>
          <div className="lesson-content">
            <Suspense fallback={<div className="loading">Loading lesson…</div>}>
              <Mounted key={mod.id} onMount={() => setReady((r) => r + 1)}>
                <Content components={mdxComponents} />
              </Mounted>
            </Suspense>
          </div>
          <footer className="lesson-footer">
            <button
              className={`btn ${done ? 'btn-done' : 'btn-primary'}`}
              onClick={() =>
                updateProgress((q) => {
                  q.completed[mod.id] = !done
                })
              }
            >
              {done ? '✓ Module completed (click to undo)' : 'Mark module as completed'}
            </button>
            <div className="pager">
              {prev ? (
                <Link to={`/m/${prev.id}`} className="pager-link">
                  <small>← Previous</small>
                  {prev.title}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link to={`/m/${next.id}`} className="pager-link right">
                  <small>Next →</small>
                  {next.title}
                </Link>
              ) : (
                <Link to="/practice" className="pager-link right">
                  <small>Next →</small>
                  Practice all exercises
                </Link>
              )}
            </div>
          </footer>
        </article>
        <aside className="rail">
          <Outline moduleId={mod.id} version={ready} />
          {keyFormulas.length > 0 && (
            <div className="rail-formulas">
              <div className="outline-head">Key formulas</div>
              {keyFormulas.map((f) => (
                <Link key={f.id} to={`/m/${mod.id}/${f.section}`} className="rail-formula" title={f.name}>
                  <span className="rf-name">{f.name}</span>
                  <M>{f.tex}</M>
                </Link>
              ))}
              <Link to={`/formulas#m${mod.id}`} className="rail-more">
                All formulas →
              </Link>
            </div>
          )}
        </aside>
      </div>
    </LessonContext.Provider>
  )
}

function Mounted({ onMount, children }: { onMount: () => void; children: React.ReactNode }) {
  useEffect(() => {
    // wait one frame so KaTeX/MDX output is in the DOM
    const t = requestAnimationFrame(() => onMount())
    return () => cancelAnimationFrame(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <>{children}</>
}
