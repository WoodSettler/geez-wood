# Geez Wood

> a small, slow wood — notes, code, half-thoughts.
> by **Ting** · [woodsettler.com](https://woodsettler.com)

This is the source for [woodsettler.com](https://woodsettler.com), built with [Astro](https://astro.build).

---

## ※ Site Map (Single Source of Truth)

See [`SITE_MAP.md`](./SITE_MAP.md) — **it is the truth source for site structure.**
Every URL, page name, and content type lives there. Change it FIRST when restructuring.

---

## Quickstart

You need **Node 20+** and **git**.

```bash
# 1. Install dependencies
cd geez-wood
npm install

# 2. Start the dev server (http://localhost:4321)
npm run dev

# 3. Build for production (output → dist/)
npm run build

# 4. Preview the production build
npm run preview
```

---

## How to write

### A new essay

Drop a `.md` into `src/content/essays/`:

```markdown
---
title: "vibe-coding 之后"
summary: "用 ai 写代码这半年, 我学到了什么"
date: 2026-05-14
type: essay        # essay | field | letter | project
tags: [vibe-coding, ai]
readingMin: 8
featured: false
---

正文从这里开始. dropcap 会自动加在第一段...
```

The site rebuilds automatically.

### A new wood note

Drop a `.md` into `src/content/notes/`:

```markdown
---
title: "compost vs vault"
summary: "我的笔记不是 zettelkasten — 它更像一堆腐叶。"
stage: seedling           # seedling | growing | evergreen
created: 2026-05-22
lastWatered: 2026-05-22
tags: [process, notes]
backlinks: [compost, vibe-coding]   # ids of other notes
---
```

### A new letter

Drop a `.md` into `src/content/letters/` with `number`, `title`, `date`.

### A new book / track / link

Drop a JSON file into `src/content/books/` (or extend the schema in `src/content/config.js`).

---

## Project structure

```
geez-wood/
├── public/                  # static assets (fonts, grain, favicon)
│   ├── fonts/
│   ├── grain.png
│   └── favicon.svg
├── src/
│   ├── site.config.js       # ◀ name / brand / domain / nav / feature flags
│   ├── content/
│   │   ├── config.js        # content collection schemas
│   │   ├── essays/          # ◀ your writing
│   │   ├── notes/           # ◀ your wood notes
│   │   ├── letters/         # ◀ your monthly dispatches
│   │   └── books/           # books.json or per-book JSON files
│   ├── components/          # Astro components (Nav, Footer, Mark, ...)
│   ├── layouts/             # Base.astro
│   ├── pages/               # each .astro = a URL
│   │   ├── index.astro      # /
│   │   ├── writing/
│   │   ├── wood/
│   │   ├── ...
│   │   └── rss.xml.js
│   └── styles/
│       └── tokens.css       # design tokens, fonts, base resets
├── package.json
├── astro.config.mjs
├── SITE_MAP.md              # ◀ site structure truth source
└── README.md                # ◀ you are here
```

---

## Customize

### Change name / brand / domain

Open [`src/site.config.js`](./src/site.config.js). One file.

### Feature flags

`src/site.config.js`'s `FEATURES` object:

```js
export const FEATURES = {
  lettersForm:  false,  // show subscribe form (after wiring Buttondown etc.)
  contactForm:  false,  // use in-page form (default: mailto:)
  cmdkSearch:   false,  // show ⌘K search button
  analytics:    false,  // intentionally off
};
```

### Design tokens

`src/styles/tokens.css` — all colors, fonts, spacing live as CSS custom properties.

---

## Deploy

See [`DEPLOY.md`](./DEPLOY.md). Cloudflare Pages is recommended (free, fast).

The short version:

1. Push this repo to GitHub.
2. In Cloudflare Pages: Connect to Git → select repo → set build command `npm run build`, output directory `dist`.
3. Add your domain (`woodsettler.com`) under **Custom domains**. Cloudflare provides DNS records.
4. Every `git push` triggers a rebuild.

---

## Roadmap

- [x] Foundation: layout, nav, footer, brand mark, tokens
- [x] Home page (`/`)
- [x] Sample essay + sample note
- [ ] `/writing` essay index
- [ ] `/writing/[slug]` article template w/ marginalia
- [ ] `/wood` cluster map (interactive graph)
- [ ] `/wood/[slug]` single note w/ backlinks
- [ ] `/collections` (books / listening / links)
- [ ] `/now`
- [ ] `/about` (+ `/about/colophon`)
- [ ] `/contact` (mailto form)
- [ ] RSS feeds (all / wood / letters)
- [ ] 404 page

---

## Credits

- Type: [Latitude, Director, Louise, Abordage](https://velvetyne.fr/) by Velvetyne · OFL
- Body type: [Source Serif 4](https://fonts.google.com/specimen/Source+Serif+4) · OFL
- Mono: [JetBrains Mono](https://www.jetbrains.com/lp/mono/) · OFL
- License (content): CC BY-NC 4.0
- License (code): MIT
