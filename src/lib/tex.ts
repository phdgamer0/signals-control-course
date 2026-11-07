import katex from 'katex'

export const tex = String.raw

const macros = {
  '\\L': '\\mathcal{L}',
  '\\Li': '\\mathcal{L}^{-1}',
}

const cache = new Map<string, string>()

export function renderTex(src: string, display = false): string {
  const key = (display ? 'D' : 'I') + src
  let html = cache.get(key)
  if (html === undefined) {
    html = katex.renderToString(src, { displayMode: display, throwOnError: false, strict: false, macros: { ...macros } })
    cache.set(key, html)
  }
  return html
}
