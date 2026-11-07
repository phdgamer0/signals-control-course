// Fast syntax check of lesson MDX files without a full build: node scripts/check-mdx.mjs src/lessons/m03/index.mdx
import { compile } from '@mdx-js/mdx'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import { readFileSync } from 'node:fs'

let bad = 0
for (const f of process.argv.slice(2)) {
  try {
    await compile(readFileSync(f, 'utf8'), { remarkPlugins: [remarkGfm, remarkMath] })
    console.log(`OK   ${f}`)
  } catch (e) {
    bad++
    console.log(`FAIL ${f}: ${e.message}${e.line ? ` (line ${e.line}:${e.column})` : ''}`)
  }
}
process.exit(bad ? 1 : 0)
