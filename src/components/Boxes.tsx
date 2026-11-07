import type { ReactNode } from 'react'
import { useLesson } from './LessonContext'

type C = { children?: ReactNode }

/** English term with its Turkish original, inline. */
export function Term({ en, tr }: { en: string; tr: string }) {
  return (
    <span className="term">
      <strong>{en}</strong> <span className="tr">({tr})</span>
    </span>
  )
}

export function Def({ term, tr, children }: C & { term: string; tr?: string }) {
  return (
    <div className="box box-def">
      <div className="box-head">
        <span className="box-kind">Definition</span>
        <span className="def-term">{term}</span>
        {tr && <span className="tr-chip">{tr}</span>}
      </div>
      <div className="box-body">{children}</div>
    </div>
  )
}

function Callout({ kind, icon, title, children }: C & { kind: string; icon: string; title: string }) {
  return (
    <div className={`box box-${kind}`}>
      <div className="box-head">
        <span className="box-icon" aria-hidden>
          {icon}
        </span>
        <span className="box-kind">{title}</span>
      </div>
      <div className="box-body">{children}</div>
    </div>
  )
}

export const Intuition = ({ children, title = 'Intuition' }: C & { title?: string }) => (
  <Callout kind="intuition" icon="◐" title={title}>
    {children}
  </Callout>
)
export const Note = ({ children, title = 'Note' }: C & { title?: string }) => (
  <Callout kind="note" icon="i" title={title}>
    {children}
  </Callout>
)
export const Tip = ({ children, title = 'Exam tip' }: C & { title?: string }) => (
  <Callout kind="tip" icon="★" title={title}>
    {children}
  </Callout>
)
export const Mistake = ({ children, title = 'Common mistake' }: C & { title?: string }) => (
  <Callout kind="mistake" icon="!" title={title}>
    {children}
  </Callout>
)
export const Uncertain = ({ children, title = 'Unclear in the handwritten notes' }: C & { title?: string }) => (
  <Callout kind="uncertain" icon="?" title={title}>
    {children}
  </Callout>
)

/** Exam-oriented solving recipe. Children should be an ordered markdown list. */
export function Procedure({ title, children }: C & { title: string }) {
  return (
    <div className="box box-procedure">
      <div className="box-head">
        <span className="box-icon" aria-hidden>
          ▸
        </span>
        <span className="box-kind">Solving procedure</span>
        <span className="def-term">{title}</span>
      </div>
      <div className="box-body">{children}</div>
    </div>
  )
}

/** Highlighted key result. */
export function KeyFormula({ title, children }: C & { title?: string }) {
  return (
    <div className="key-formula">
      {title && <div className="key-title">{title}</div>}
      {children}
    </div>
  )
}

/** Unobtrusive reference to the lecture notes. p may be "7" or "7–8". */
export function Src({ p, l }: { p: string | number; l?: string }) {
  const { moduleId } = useLesson()
  return (
    <span className="src" title="Location in the professor's handwritten notes">
      Source: Lecture {l ?? moduleId}, p. {p}
    </span>
  )
}

/** A step inside a worked example. */
export function Step({ title, children }: C & { title?: string }) {
  return (
    <div className="step">
      {title && <div className="step-title">{title}</div>}
      <div className="step-body">{children}</div>
    </div>
  )
}

export function Answer({ children }: C) {
  return (
    <div className="answer">
      <span className="answer-label">Result</span>
      <div>{children}</div>
    </div>
  )
}

export function Figure({ caption, children }: C & { caption?: ReactNode }) {
  return (
    <figure className="figure">
      <div className="figure-body">{children}</div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
