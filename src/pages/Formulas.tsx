import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { modules } from '../data/modules'
import { formulasByModule } from '../data/formulas'
import { MD } from '../components/Math'
import { Rich } from '../lib/rich'

export default function Formulas() {
  const loc = useLocation()
  useEffect(() => {
    const h = loc.hash.slice(1)
    if (h) document.getElementById(h)?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [loc.hash])
  return (
    <div className="page formulas-page">
      <h1>Formula reference</h1>
      <p className="lead">
        Every important formula from the eight lectures, with its variables, when it applies, and links back to the explanation and a worked example.
        This is a reference — the <em>why</em> lives in the lessons.
      </p>
      <nav className="chip-row">
        {modules.map((m) => (
          <a key={m.id} href={`#/formulas#m${m.id}`} onClick={(e) => (e.preventDefault(), document.getElementById(`m${m.id}`)?.scrollIntoView())} className="chip">
            {m.id} · {m.title}
          </a>
        ))}
      </nav>
      {modules.map((m) => (
        <section key={m.id} id={`m${m.id}`} className="formula-module">
          <h2>
            <span className="mod-num">{m.id}</span> {m.title} <span className="tr">· {m.tr}</span>
          </h2>
          <div className="formula-list">
            {(formulasByModule[m.id] ?? []).map((f) => (
              <div key={f.id} className="formula-card" id={`f-${m.id}-${f.id}`}>
                <div className="fc-head">
                  <h3>{f.name}</h3>
                  {f.tr && <span className="tr-chip">{f.tr}</span>}
                </div>
                <MD>{f.tex}</MD>
                <ul className="fc-vars">
                  {f.vars.map((v, i) => (
                    <li key={i}>
                      <Rich s={v} />
                    </li>
                  ))}
                </ul>
                <div className="fc-cond">
                  <b>Applies when:</b> <Rich s={f.conditions} />
                </div>
                <div className="fc-links">
                  <Link to={`/m/${m.id}/${f.section}`}>Explanation →</Link>
                  {f.example && <Link to={`/m/${m.id}/${f.example}`}>Worked example →</Link>}
                  {f.page && <span className="src">Lecture {m.id}, p. {f.page}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
