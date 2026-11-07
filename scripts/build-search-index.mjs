// Builds src/data/sections.json (sidebar section lists) and src/data/searchIndex.json
// (full-text search) from the lesson MDX sources. Run automatically by `npm run dev/build`.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import GithubSlugger from 'github-slugger'

// Must stay identical to src/lib/slug.ts
function slugify(s) {
  return s
    .toLowerCase()
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

const ids = ['01', '02', '03', '04', '05', '06', '07', '08']
const sections = {}
const entries = []

const clean = (t) =>
  t
    .replace(/^import .*$/gm, '')
    .replace(/^export .*$/gm, '')
    .replace(/<\/?[A-Za-z][^>]*?>/gs, ' ')
    .replace(/\{\/\*.*?\*\/\}/gs, ' ')
    .replace(/[*_`#>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`${name}=(?:"([^"]*)"|\\{(\\d+)\\}|'([^']*)')`))
  return m ? (m[1] ?? m[2] ?? m[3]) : undefined
}

for (const id of ids) {
  const file = `src/lessons/m${id}/index.mdx`
  if (!existsSync(file)) {
    sections[id] = []
    continue
  }
  const src = readFileSync(file, 'utf8')
  const slugger = new GithubSlugger()
  sections[id] = []
  let cur = { id: '', title: 'Introduction', text: [] }
  const flush = () => {
    const text = clean(cur.text.join('\n'))
    if (text || cur.id) entries.push({ m: id, id: cur.id, title: cur.title, kind: 'section', text })
  }
  for (const line of src.split('\n')) {
    const h = line.match(/^(#{2,3})\s+(.*)$/)
    if (h) {
      const title = h[2].trim()
      const sid = slugger.slug(title)
      flush()
      cur = { id: sid, title, text: [] }
      if (h[1] === '##') sections[id].push({ id: sid, title })
      else entries.push({ m: id, id: sid, title, kind: 'subsection', text: '' })
      continue
    }
    cur.text.push(line)
    for (const tag of line.match(/<(Example|Exercise|Def)\b[^>]*>/g) ?? []) {
      const kind = tag.slice(1).split(/\s/)[0]
      if (kind === 'Def') {
        const term = attr(tag, 'term')
        entries.push({ m: id, id: cur.id, title: term, tr: attr(tag, 'tr'), kind: 'definition', text: '' })
      } else {
        const title = attr(tag, 'title')
        if (!title) continue
        const anchor = (kind === 'Example' ? 'ex-' : 'q-') + slugify(title)
        entries.push({
          m: id,
          id: anchor,
          title,
          kind: kind.toLowerCase(),
          section: cur.title,
          exKind: attr(tag, 'kind'),
          level: attr(tag, 'level'),
          prof: kind === 'Example' ? !!attr(tag, 'src') : undefined,
        })
      }
    }
    for (const tag of line.match(/<Term\b[^>]*>/g) ?? []) {
      entries.push({ m: id, id: cur.id, title: attr(tag, 'en'), tr: attr(tag, 'tr'), kind: 'term', text: '' })
    }
  }
  flush()
}

writeFileSync('src/data/sections.json', JSON.stringify(sections, null, 1))
writeFileSync('src/data/searchIndex.json', JSON.stringify(entries))
console.log(`search index: ${entries.length} entries`)
