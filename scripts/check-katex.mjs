// Reports KaTeX errors in $...$ / $$...$$ of lesson MDX files and in tex`...` / tex strings of formulas.ts:
// node scripts/check-katex.mjs src/lessons/m03
import katex from 'katex'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const macros = { '\\L': '\\mathcal{L}', '\\Li': '\\mathcal{L}^{-1}' }
let bad = 0
const test = (src, file, display) => {
  try {
    katex.renderToString(src, { throwOnError: true, displayMode: display, macros: { ...macros }, strict: false })
  } catch (e) {
    bad++
    console.log(`${file}: ${e.message.split('\n')[0]}\n    in: ${src.slice(0, 160)}`)
  }
}
for (const dir of process.argv.slice(2)) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    const s = readFileSync(p, 'utf8')
    if (f.endsWith('.mdx')) {
      const noCode = s.replace(/```[\s\S]*?```/g, '')
      for (const m of noCode.matchAll(/\$\$([\s\S]+?)\$\$/g)) test(m[1], p, true)
      const inl = noCode.replace(/\$\$[\s\S]+?\$\$/g, '')
      for (const m of inl.matchAll(/(?<![\\$])\$([^$\n]+?)\$/g)) test(m[1], p, false)
    }
    if (f.endsWith('.ts') || f.endsWith('.tsx')) {
      for (const m of s.matchAll(/tex`([^`]*)`/g)) test(m[1], p, true)
      for (const m of s.matchAll(/String\.raw`([^`]*)`/g)) test(m[1], p, true)
    }
  }
}
console.log(bad ? `${bad} KaTeX error(s)` : 'KaTeX: all OK')
process.exit(bad ? 1 : 0)
