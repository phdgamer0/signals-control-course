// Verifies that formula `section`/`example` anchors and in-lesson #/m/NN/<id> links point at real ids.
import { readFileSync, readdirSync } from 'node:fs'

const idx = JSON.parse(readFileSync('src/data/searchIndex.json', 'utf8'))
const ids = {}
for (const e of idx) (ids[e.m] ??= new Set()).add(e.id)
let bad = 0
const report = (msg) => (bad++, console.log(msg))

for (const m of Object.keys(ids)) {
  const f = readFileSync(`src/lessons/m${m}/formulas.ts`, 'utf8')
  for (const [, k, v] of f.matchAll(/\b(section|example):\s*'([^']+)'/g))
    if (!ids[m].has(v)) report(`m${m} formulas.ts ${k} -> missing id "${v}"`)
  for (const file of readdirSync(`src/lessons/m${m}`)) {
    const s = readFileSync(`src/lessons/m${m}/${file}`, 'utf8')
    for (const [, tm, tid] of s.matchAll(/#\/m\/(\d\d)\/([^)\s"'#]+)/g))
      if (!ids[tm]?.has(decodeURIComponent(tid))) report(`m${m}/${file}: link -> #/m/${tm}/${tid} missing`)
  }
}
console.log(bad ? `${bad} broken link(s)` : 'links: all OK')
process.exit(bad ? 1 : 0)
