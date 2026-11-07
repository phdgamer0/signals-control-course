// Publishes dist/ to the gh-pages branch (GitHub Pages source). Run via `npm run deploy`.
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const sh = (c, cwd = 'dist') => execSync(c, { cwd, stdio: 'inherit' })
const remote = execSync('git remote get-url origin').toString().trim()
writeFileSync('dist/.nojekyll', '')
sh('git init -q -b gh-pages')
sh('git add -A')
sh('git commit -q -m "Deploy site"')
sh(`git push -f ${remote} gh-pages`)
