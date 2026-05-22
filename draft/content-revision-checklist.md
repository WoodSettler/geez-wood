# 内容修订清单 · v1.0 上线后

按导航顺序逐页过一遍。完成一项打勾 (`- [x]`)。

最后更新: 2026-05-22

---

## 顶部导航 6 个主页面

- [x] **1. 首页** — `src/pages/index.astro` (HERO 完成 · § 01/§ 02 由内容拉取 · § 03 Now strip 仍是静态硬编码, 留到下轮)
- [ ] **2. Writing 列表页** — ⚠️ 缺失 (SITE_MAP 写了 `/writing` 但 `pages/writing/index.astro` 不存在, 只有 `[slug].astro`)
- [x] **3. Wood 列表页** — `src/pages/wood/index.astro` (A 面包屑 + C blurb 改完 · 其余保留)
- [ ] **4. Collections** — `src/pages/collections/index.astro`
- [ ] **5. Now** — `src/pages/now.astro`
- [ ] **6. About** — `src/pages/about.astro`

## 子页面 / 详情模板

- [ ] **7. 单篇 essay 模板** — `src/pages/writing/[slug].astro`
- [ ] **8. 单篇 wood note 模板** — `src/pages/wood/[slug].astro`
- [ ] **9. Colophon (技术致谢)** — `src/pages/about/colophon.astro`
- [ ] **10. Tag 聚合页** — `src/pages/tag/[tag].astro`

## 公共组件 / 全局

- [ ] **11. Nav 顶部导航** — `src/components/Nav.astro`
- [ ] **12. Footer 页脚** — `src/components/Footer.astro`
- [ ] **13. Base 布局** — `src/layouts/Base.astro`
- [ ] **14. 站点全局配置** — `src/site.config.js` (品牌名 / nav / 域名 / feature flags)

## 工具页

- [ ] **15. Contact** — `src/pages/contact.astro`
- [ ] **16. 404** — `src/pages/404.astro`

## 内容 (文字本体)

- [ ] **17. 6 篇 essays** — `src/content/essays/*.md`
  - [ ] `ai-是新的笔记本.md`
  - [ ] `compost.md`
  - [ ] `hello-wood.md`
  - [ ] `slow-web.md`
  - [ ] `vibe-coding-之后.md`
  - [ ] `why-i-left-vscode.md`
- [ ] **18. 12 条 wood notes** — `src/content/notes/*.md`
  - [ ] `ai-as-pencil.md`
  - [ ] `compost-vs-vault.md`
  - [ ] `compost.md`
  - [ ] `dark-mode.md`
  - [ ] `fragmentary.md`
  - [ ] `prompt-instrument.md`
  - [ ] `rss-死掉吗.md`
  - [ ] `settle-not-manage.md`
  - [ ] `slow-web.md`
  - [ ] `tend-not-publish.md`
  - [ ] `vibe-coding.md`
  - [ ] `vibe-tools.md`

---

## ⚠️ SITE_MAP 声称有、但 `src/pages/` 里没建的页面

(改这些之前要先在 SITE_MAP 里确认是否还要做)

- `/writing` 列表页
- `/writing/letters` 月度信列表 + `[n]` 详情
- `/collections/books/[id]` 单本书页
- `letters` 内容集合本身
