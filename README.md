# Signals & Control Systems — Interactive Course

An interactive, self-study course website built from the eight handwritten lectures of a *Sayısal Denetim / Kontrol Sistemleri* (Signals & Control Systems) course.

**Live site:** https://phdgamer0.github.io/signals-control-course/

| # | Module | Turkish title |
|---|---|---|
| 01 | Introduction and Fundamental Concepts | Giriş ve Temel Kavramlar |
| 02 | Input, Output and Stability | Giriş-Çıkış-Kararlılık |
| 03 | The Laplace Transform | Laplace Dönüşümü |
| 04 | Block Diagrams and Flow Diagrams | Blok Şemalar ve Akış Şemaları |
| 05 | Modeling Electrical Systems | Elektriksel Sistemlerin Modellenmesi |
| 06 | First-Order Systems: Time Response | Birinci Derece Sistemlerin Zaman Tepkesi |
| 07 | Second-Order Systems: Time Response | İkinci Derece Sistemlerin Zaman Tepkesi |
| 08 | Dominant Poles and Mathematical Definitions | Baskın Kutuplar ve Matematiksel Tanımlar |

Each module contains intuitive explanations, Turkish terminology, full derivations (KaTeX), reconstructed graphs/circuits/block diagrams (SVG), interactive explorers, the professor's worked examples, additional examples, exam procedures and practice exercises with hidden solutions.

## Development

```bash
npm install
npm run dev      # builds the search index, starts Vite
npm run build    # production build into dist/
```

- Stack: React 18, TypeScript, Vite, MDX (remark-math + rehype-katex), custom SVG plotting/circuit/block-diagram components. Fully static, deployed to GitHub Pages from the `gh-pages` branch via `npm run deploy`.
- Lesson content: `src/lessons/mNN/` (`index.mdx`, `widgets.tsx`, `formulas.ts`). Authoring conventions: [AUTHORING.md](AUTHORING.md).
- Source traceability: [CONTENT_MANIFEST.md](CONTENT_MANIFEST.md) maps every item of every PDF page to its place on the website.
