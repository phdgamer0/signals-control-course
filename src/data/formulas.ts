import type { Formula } from './formulaTypes'
import f01 from '../lessons/m01/formulas'
import f02 from '../lessons/m02/formulas'
import f03 from '../lessons/m03/formulas'
import f04 from '../lessons/m04/formulas'
import f05 from '../lessons/m05/formulas'
import f06 from '../lessons/m06/formulas'
import f07 from '../lessons/m07/formulas'
import f08 from '../lessons/m08/formulas'

export const formulasByModule: Record<string, Formula[]> = {
  '01': f01,
  '02': f02,
  '03': f03,
  '04': f04,
  '05': f05,
  '06': f06,
  '07': f07,
  '08': f08,
}
