import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'

// Served from https://phdgamer0.github.io/signals-control-course/
export default defineConfig({
  base: '/signals-control-course/',
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeSlug, [rehypeKatex, { strict: false, throwOnError: false, macros: { '\\L': '\\mathcal{L}', '\\Li': '\\mathcal{L}^{-1}' } }]],
        providerImportSource: undefined,
      }),
    },
    react({ include: /\.(jsx|tsx|mdx)$/ }),
  ],
  build: { chunkSizeWarningLimit: 5000 },
})
