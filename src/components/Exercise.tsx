import { createContext, useContext, useState, type ReactNode } from 'react'
import { slugify } from '../lib/slug'
import { updateProgress, useProgress } from '../lib/progress'
import { useLesson } from './LessonContext'

const ExCtx = createContext<string>('')

const KIND_LABEL: Record<string, string> = {
  concept: 'Conceptual',
  formula: 'Formula application',
  calc: 'Calculation',
  graph: 'Graph interpretation',
  circuit: 'Circuit analysis',
  problem: 'Full problem',
  prof: "Based on professor's example",
  edge: 'Edge case',
}

export function Exercise({
  title,
  kind = 'problem',
  level = 2,
  children,
}: {
  title: string
  kind?: keyof typeof KIND_LABEL | string
  level?: 1 | 2 | 3
  children?: ReactNode
}) {
  const { moduleId } = useLesson()
  const id = `m${moduleId}-${slugify(title)}`
  const p = useProgress()
  const state = p.exercises[id]
  return (
    <ExCtx.Provider value={id}>
      <section className={`exercise ${state ? `ex-${state}` : ''}`} id={`q-${slugify(title)}`}>
        <header className="exercise-head">
          <span className="ex-kind">{KIND_LABEL[kind] ?? kind}</span>
          <span className="ex-level" title="Difficulty">
            {'●'.repeat(level)}
            {'○'.repeat(3 - level)}
          </span>
          <h4>{title}</h4>
          {state === 'solved' && <span className="ex-state">✓ solved</span>}
        </header>
        <div className="exercise-body">{children}</div>
      </section>
    </ExCtx.Provider>
  )
}

function Reveal({ label, children, onOpen, cls }: { label: string; children?: ReactNode; onOpen?: () => void; cls: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`reveal ${cls} ${open ? 'open' : ''}`}>
      <button
        className="reveal-btn"
        aria-expanded={open}
        onClick={() => {
          if (!open) onOpen?.()
          setOpen(!open)
        }}
      >
        <span className="chev" aria-hidden>
          ▸
        </span>
        {open ? `Hide ${label.toLowerCase()}` : label}
      </button>
      {open && <div className="reveal-body">{children}</div>}
    </div>
  )
}

export function Hint({ children }: { children?: ReactNode }) {
  return (
    <Reveal label="Show hint" cls="reveal-hint">
      {children}
    </Reveal>
  )
}

export function Solution({ children }: { children?: ReactNode }) {
  const id = useContext(ExCtx)
  const p = useProgress()
  const solved = p.exercises[id] === 'solved'
  return (
    <Reveal
      label="Reveal solution"
      cls="reveal-solution"
      onOpen={() =>
        id &&
        updateProgress((q) => {
          if (!q.exercises[id]) q.exercises[id] = 'revealed'
        })
      }
    >
      {children}
      {id && (
        <label className="solved-toggle">
          <input
            type="checkbox"
            checked={solved}
            onChange={(e) =>
              updateProgress((q) => {
                q.exercises[id] = e.target.checked ? 'solved' : 'revealed'
              })
            }
          />
          I solved this correctly on my own
        </label>
      )}
    </Reveal>
  )
}
