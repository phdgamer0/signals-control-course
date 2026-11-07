import type { ReactNode } from 'react'
import { slugify } from '../lib/slug'
import { useLesson } from './LessonContext'

/**
 * Worked example. `src` = page(s) in the notes when the example is the professor's own;
 * omit it for additional teaching examples.
 */
export function Example({ title, src, children }: { title: string; src?: string | number; children?: ReactNode }) {
  const { moduleId } = useLesson()
  return (
    <section className={`example ${src ? 'example-prof' : 'example-added'}`} id={`ex-${slugify(title)}`}>
      <header className="example-head">
        <span className="example-kind">Worked example</span>
        <h4>{title}</h4>
        <span className={`origin ${src ? 'origin-prof' : 'origin-added'}`}>
          {src ? `Professor's example · Lecture ${moduleId}, p. ${src}` : 'Additional teaching example'}
        </span>
      </header>
      <div className="example-body">{children}</div>
    </section>
  )
}
