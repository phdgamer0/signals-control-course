import type { ComponentType } from 'react'

export interface ModuleInfo {
  id: string
  title: string
  tr: string
  source: string
  pages: number
  blurb: string
  load: () => Promise<{ default: ComponentType<any> }>
}

export const modules: ModuleInfo[] = [
  {
    id: '01',
    title: 'Introduction and Fundamental Concepts',
    tr: 'Giriş ve Temel Kavramlar',
    source: '01 Giriş ve Temel Kavramlar.pdf',
    pages: 9,
    blurb: '',
    load: () => import('../lessons/m01/index.mdx'),
  },
  {
    id: '02',
    title: 'Input, Output and Stability',
    tr: 'Giriş-Çıkış-Kararlılık',
    source: '02 Giriş-Çıkış-Kararlılık.pdf',
    pages: 10,
    blurb: '',
    load: () => import('../lessons/m02/index.mdx'),
  },
  {
    id: '03',
    title: 'The Laplace Transform',
    tr: 'Laplace Dönüşümü',
    source: '03 Laplace Dönüşümü.pdf',
    pages: 15,
    blurb: '',
    load: () => import('../lessons/m03/index.mdx'),
  },
  {
    id: '04',
    title: 'Block Diagrams and Flow Diagrams',
    tr: 'Blok Şemalar ve Akış Şemaları',
    source: '04-Blok-Şemalar-ve-Akış-Şemaları.pdf',
    pages: 4,
    blurb: '',
    load: () => import('../lessons/m04/index.mdx'),
  },
  {
    id: '05',
    title: 'Modeling Electrical Systems',
    tr: 'Elektriksel Sistemlerin Modellenmesi',
    source: '05 Elektriksel Sistemlerin Modellenmesi.pdf',
    pages: 6,
    blurb: '',
    load: () => import('../lessons/m05/index.mdx'),
  },
  {
    id: '06',
    title: 'First-Order Systems: Time Response',
    tr: 'Birinci Derece Sistemlerin Zaman Tepkesi',
    source: '06 Birinci Derece Sistemlerim Zaman Tepkesi.pdf',
    pages: 9,
    blurb: '',
    load: () => import('../lessons/m06/index.mdx'),
  },
  {
    id: '07',
    title: 'Second-Order Systems: Time Response',
    tr: 'İkinci Derece Sistemlerin Zaman Tepkesi',
    source: '07 İkinci Derece Sistemlerim Zaman Tepkesi.pdf',
    pages: 17,
    blurb: '',
    load: () => import('../lessons/m07/index.mdx'),
  },
  {
    id: '08',
    title: 'Dominant Poles and Mathematical Definitions',
    tr: 'Baskın Kutuplar ve Matematiksel Tanımlar',
    source: '08 Baskın Kutuplar ve Matematiksel Tanımlar.pdf',
    pages: 10,
    blurb: '',
    load: () => import('../lessons/m08/index.mdx'),
  },
]

export const moduleById = (id: string) => modules.find((m) => m.id === id)
