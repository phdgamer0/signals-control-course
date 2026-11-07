import type { ComponentProps } from 'react'
import { Answer, Def, Figure, Intuition, KeyFormula, Mistake, Note, Procedure, Src, Step, Term, Tip, Uncertain } from './Boxes'
import { Example } from './Example'
import { Exercise, Hint, Solution } from './Exercise'
import { M, MD } from './Math'
import { Plot } from './Plot'
import { Explorer, Readout } from './Explorer'
import { SPlane } from './SPlane'

/** Components available in every lesson MDX file without importing. */
export const mdxComponents = {
  table: (p: ComponentProps<'table'>) => (
    <div className="table-wrap">
      <table {...p} />
    </div>
  ),
  Answer,
  Def,
  Example,
  Exercise,
  Explorer,
  Figure,
  Hint,
  Intuition,
  KeyFormula,
  M,
  MD,
  Mistake,
  Note,
  Plot,
  Procedure,
  Readout,
  Solution,
  SPlane,
  Src,
  Step,
  Term,
  Tip,
  Uncertain,
}
