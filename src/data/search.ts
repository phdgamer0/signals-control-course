import index from './searchIndex.json'

export interface Entry {
  m: string
  id: string
  title: string
  kind: 'section' | 'subsection' | 'example' | 'exercise' | 'definition' | 'term' | 'formula'
  text?: string
  tr?: string
  section?: string
  exKind?: string
  level?: string
  prof?: boolean
}

export const entries = index as Entry[]

/** Fold Turkish characters & case so "kararlilik" finds "Kararlılık". */
export const fold = (s: string) =>
  s
    .toLocaleLowerCase('tr')
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/[ıi̇]/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
