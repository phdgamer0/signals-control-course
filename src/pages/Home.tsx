import { Link } from 'react-router-dom'
import { modules } from '../data/modules'
import { entries } from '../data/search'
import sections from '../data/sections.json'
import { useProgress } from '../lib/progress'
import { slugify } from '../lib/slug'

const secs = sections as Record<string, { id: string; title: string }[]>

export default function Home() {
  const p = useProgress()
  const exercises = entries.filter((e) => e.kind === 'exercise')
  const exByModule = (m: string) => exercises.filter((e) => e.m === m)
  const solvedIn = (m: string) => exByModule(m).filter((e) => p.exercises[`m${m}-${slugify(e.title)}`] === 'solved').length
  const doneCount = modules.filter((m) => p.completed[m.id]).length
  const solvedTotal = modules.reduce((a, m) => a + solvedIn(m.id), 0)
  const firstUnfinished = modules.find((m) => !p.completed[m.id]) ?? modules[0]
  const cont = p.last ?? `/m/${firstUnfinished.id}`
  const examples = entries.filter((e) => e.kind === 'example')

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-kicker">Sayısal Denetim · Kontrol Sistemleri</div>
        <h1>Signals &amp; Control Systems</h1>
        <p className="hero-lead">
          An interactive, step-by-step course built directly from the professor's eight handwritten lectures. From what a control system is,
          through the Laplace transform, block diagrams and circuit modeling, to the time response of first- and second-order systems and
          dominant poles. Every formula is derived, every example is solved, and every module ends with exercises whose solutions stay hidden until
          you ask.
        </p>
        <div className="hero-actions">
          <Link to={cont} className="btn btn-primary">
            {p.last ? 'Continue learning →' : 'Start Module 01 →'}
          </Link>
          <Link to="/formulas" className="btn">
            Formula reference
          </Link>
          <Link to="/practice" className="btn">
            Practice
          </Link>
        </div>
        <div className="stats">
          <div>
            <b>
              {doneCount}/{modules.length}
            </b>
            <span>modules completed</span>
          </div>
          <div>
            <b>
              {solvedTotal}/{exercises.length}
            </b>
            <span>exercises solved</span>
          </div>
          <div>
            <b>{examples.length}</b>
            <span>worked examples</span>
          </div>
          <div className="progressbar" aria-label="Overall progress">
            <i style={{ width: `${(doneCount / modules.length) * 100}%` }} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="home-h2">Modules</h2>
        <div className="module-grid">
          {modules.map((m) => {
            const total = exByModule(m.id).length
            const solved = solvedIn(m.id)
            const status = p.completed[m.id] ? 'Completed' : p.visited[m.id] ? 'In progress' : 'Not started'
            return (
              <Link key={m.id} to={`/m/${m.id}`} className={`module-card ${p.completed[m.id] ? 'done' : ''}`}>
                <div className="mc-top">
                  <span className="mc-num">{m.id}</span>
                  <span className={`mc-status s-${status.replace(' ', '-').toLowerCase()}`}>{status}</span>
                </div>
                <h3>{m.title}</h3>
                <div className="mc-tr">{m.tr}</div>
                <ul className="mc-secs">
                  {(secs[m.id] ?? []).slice(0, 5).map((s) => (
                    <li key={s.id}>{s.title}</li>
                  ))}
                  {(secs[m.id]?.length ?? 0) > 5 && <li className="more">+ {secs[m.id].length - 5} more sections</li>}
                </ul>
                <div className="mc-foot">
                  <span>{m.pages} pages of notes</span>
                  <span>
                    {solved}/{total} exercises
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="howto">
        <h2 className="home-h2">How to use this course</h2>
        <ol>
          <li>Read each module in order — later modules (06–08) use the Laplace tools from 03 and the block diagrams from 04 constantly.</li>
          <li>Work through every worked example with pen and paper before reading the next step.</li>
          <li>
            Try every exercise yourself <em>before</em> revealing the solution, then tick “I solved this correctly” — your progress is stored in this
            browser.
          </li>
          <li>
            Turkish terms from the lecture notes are shown next to the English ones (e.g. <b>Stability</b> <span className="tr">(Kararlılık)</span>) so
            you recognise them in the exam.
          </li>
          <li>
            Small grey tags like <span className="src">Source: Lecture 03, p. 7</span> point to the page of the handwritten notes for cross-checking.
          </li>
        </ol>
      </section>
    </div>
  )
}
