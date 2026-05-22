# HANDOFF · Geez Wood

> 这份文档写给即将接手部署工作的本地 AI agent (Claude Code / Cursor / 等)。
> 站长 Ting 把整个项目 zip 下载到了本地, 现在希望你 (本地 agent) 帮她跑通、推 GitHub、上 Cloudflare Pages、接上 woodsettler.com 域名。

---

## 0. TL;DR

- **项目类型**: Astro 4 静态站, 纯 JavaScript (无 TypeScript), 纯 ESM
- **实际要部署的目录**: `geez-wood/` — 项目根目录里其他文件是 v0.1 设计稿, 不上线
- **站长名字**: Ting · **品牌**: Geez Wood · **域名**: woodsettler.com
- **核心隐喻**: wood (森林), 不是 garden — 任何出现 "garden" 的地方都视作 typo
- **托管平台**: Cloudflare Pages (Ting 偏好)
- **完工节点**: 域名能访问到 `https://woodsettler.com`, HTTPS 自动续签, 每次 `git push` 触发自动部署

---

## 1. 你的工作分四步

### 步骤 1 · 本地跑通 (15 min)

```bash
cd geez-wood
node --version          # 必须 ≥ 20
npm install             # ~30s
npm run dev             # 应该启动在 http://localhost:4321
npm run build           # 必须能通过, 生成 dist/
```

如果 `npm run dev` 起来后:
- ✅ 首页能显示 Latitude italic 大标题 "a small, slow wood"
- ✅ 顶部有 sprout 标记 (橙色圆 + 绿/黄两片叶子, hover 旋转)
- ✅ Featured 区块拉到了 `hello-wood.md` (或 `vibe-coding-之后.md`)
- ✅ wood glimpse 显示 3 张笔记卡 (带 stage 色点)
- ✅ `/wood` 页有可拖的 cluster map, 18 个节点
- ✅ `/writing/vibe-coding-之后` 显示文章, 有 dropcap 和 § 编号小节标题
- ✅ `/about` `/contact` `/now` `/collections` `/about/colophon` `/404` 都能访问

如果不能, **先解决本地问题再往下走**。 常见问题:

| 症状 | 可能原因 | 修复 |
|---|---|---|
| 字体没加载 (显示成 fallback) | woff2 路径错 | 检查 `public/fonts/*.woff2` 都在 |
| Featured 是 hello-wood, 不是 vibe-coding | featured 字段判断顺序 | `index.astro` 里 `.find(featured)` 应该选中 `vibe-coding-之后.md` (它的 frontmatter `featured: true`) |
| `/wood` 图谱不显示 | wood-cluster.js 没加载 | 检查 `public/wood-cluster.js` 存在 + DevTools network 200 |
| `getCollection('books')` 报错 | books 集合空 | 已用 try/catch 兜底, 但若仍报错就检查 `src/content/config.js` schema |
| build 失败提示 frontmatter | markdown 字段错 | 看错误指向的 .md, 对照 `SITE_MAP.md` "Frontmatter contract" 章节 |

### 步骤 2 · Ting 个人化 (10 min, 跟她确认)

打开 **`src/site.config.js`** 跟她过一遍 (这是唯一一处用户身份配置):

```js
export const SITE = {
  name:        'Ting',                          // ← 确认是否对
  brand:       'Geez Wood',                     // ← 确认
  domain:      'woodsettler.com',               // ← 确认
  url:         'https://woodsettler.com',
  email:       'ting@woodsettler.com',          // ← 改成她真实邮箱
  github:      'https://github.com/ting',       // ← 改成她真实 handle
  mastodon:    '',                              // ← 问她有没有
  location:    '上海',                           // ← 确认
  ...
};
```

也问她要不要现在就改 `src/content/essays/hello-wood.md` 写一段她自己的开场白 — 这是访客落地首页 featured 看到的第一段文字。 其他占位文章 (`vibe-coding-之后.md` 等) 不急, 可以以后慢慢替换。

**留意**: 我 (前一个 agent) 写的占位文章和笔记沿用了一个虚构人物 "chen" 的语气和经历。 Ting 自己可能要改 — 但她明确说过 "占位内容可以以后手动删换", 所以不必现在全清。

### 步骤 3 · 推 GitHub (10 min)

```bash
# 假设项目根目录已 git init (如果没有就 init)
cd geez-wood
git init
git add .
git commit -m "initial: geez wood v1.0"
```

让 Ting 在 GitHub 网站建一个新 repo (推荐名 `geez-wood-site` 或 `woodsettler`)。 **不要勾任何 README/license/gitignore**, 那些项目里已经有了。

```bash
git remote add origin https://github.com/<Ting-username>/geez-wood-site.git
git branch -M main
git push -u origin main
```

如果 Ting 不熟 git, 你可以一行行解释; 如果她熟, 直接给完整指令即可。

### 步骤 4 · Cloudflare Pages + DNS (15 min)

照 **`DEPLOY.md`** 走, 关键点:

1. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → 选 repo
2. **Root directory: `geez-wood`** ← 一定要填, 不然找不到 package.json
3. **Framework preset: Astro** · **Build command: `npm run build`** · **Output: `dist`**
4. 部署成功后, 访问 `https://<project>.pages.dev` 验证
5. Custom domains → 加 `woodsettler.com` 和 `www.woodsettler.com`
6. 如果域名 DNS 还没托管给 Cloudflare, 先去 Cloudflare → Websites → Add Site, 拿到两个 nameserver, 让 Ting 去她买域名的地方换 NS (5–30 分钟生效)

完成后 `https://woodsettler.com` 应该能访问, 自动 HTTPS。

---

## 2. 站点结构 · CLAUDE.md 的最高约定

`geez-wood/SITE_MAP.md` 是 **唯一真源**。 任何对页面、URL、内容类型的改动都必须先改它再改下游代码。 不要凭印象改 URL, 不要把 `wood` 改回 `garden` (除非 Ting 明确要求)。

完整 IA:
- 8 个一级页面: home / writing / wood / collections / now / about / contact / colophon
- 笔记成熟度: `seedling` → `growing` → `evergreen`
- 内容类型: essay / letter / note / book / link / music / project + tag
- URL 风格: 小写、连字符、可含中文、不含 .html、不含 date 前缀

---

## 3. 已知 placeholder · 等 Ting 想做的时候加

不是 bug, 是按 Ting 的选择故意没接的。 她以后可能让你接:

| 功能 | 当前状态 | 怎么接 |
|---|---|---|
| Letter 订阅 (Buttondown) | `FEATURES.lettersForm: false`, 完全隐藏 | (1) 注册 buttondown.email (2) 在 site.config 加 `BUTTONDOWN_FORM_URL` (3) 把订阅按钮 form action 指过去 (4) `FEATURES.lettersForm = true` |
| 联系表单 (Formspree) | 用 mailto: (已实现) | 想加 in-page form 就接 Formspree, 改 `FEATURES.contactForm = true` 并加表单 |
| 单篇文章 marginalia | 暂未实现 | 写 remark plugin 把 markdown 注脚语法变成右栏 sidenote |
| Listening / Links collection | placeholder 文案 | 加 `src/content/listening/*.json` + 在 `collections/index.astro` 渲染那两个 section |
| Letters 列表页 | 没建 | `src/pages/writing/letters/index.astro` 类似 writing index |
| Dark mode | 没加 | Ting 明确说 "暂不要"; 留 token 给将来 |
| Analytics | 没接 | Ting 选 "完全不要" |
| Comments | 没接 | Ting 选 "完全不要" |
| 全站搜索 ⌘K | `FEATURES.cmdkSearch: false` | 未来想加可以接 Pagefind |

**不要主动接以上任何一个**, 除非 Ting 明确说要。 她的选择是基于 "0 订阅者 / 慢" 的设计哲学, 不是疏忽。

---

## 4. 别动的地方

| 文件 | 原因 |
|---|---|
| `public/fonts/*.woff2` | 字体二进制, 来自 Velvetyne OFL · 不要替换 |
| `public/grain.png` | 纸张噪点纹理 · 已 fine-tuned |
| `src/styles/tokens.css` 里的 `:root` 颜色 token | Ting 已确认视觉系统 · 不要为 dark mode 等需求扩展 |
| `public/wood-cluster.js` 里的物理布局算法 | 节点位置是基于 hash 的确定性散布 · 改了所有节点会跳位 |

---

## 5. 验收清单 · 你做完后跟 Ting 一起过

- [ ] `npm run dev` 本地启动正常, 无 console error
- [ ] `npm run build` 通过, `dist/` 大小合理 (估 5–10 MB, 主要是字体)
- [ ] GitHub repo 推送成功, `git push` 触发 Cloudflare 重新部署
- [ ] `https://<project>.pages.dev` 临时域名能访问, 全部页面都通
- [ ] `https://woodsettler.com` 接入完成, HTTPS 自动
- [ ] `https://woodsettler.com/wood` 图谱可拖、可点、可搜索
- [ ] `https://woodsettler.com/rss.xml` 返回有效 XML
- [ ] 404 页正确显示 (访问 `https://woodsettler.com/this-does-not-exist`)
- [ ] Ting 改 site.config.js 里的 email / github 之后, footer 和 contact 页都对应更新

---

## 6. 紧急逃生口

如果 Cloudflare Pages 有奇怪问题搞不定:

- **Vercel** · 同样 root directory 填 `geez-wood`, framework Astro, build `npm run build`, output `dist`。 配置基本一样。
- **Netlify** · 同上。
- **手动 host** · `npm run build` 出 `dist/`, 把 `dist/` 内容扔任何静态 host (S3 / GitHub Pages / Surge) 都能跑。

---

## 7. 写新内容 (Ting 自己以后做)

只需要往 `src/content/` 下扔 markdown:

```bash
# 新文章
cat > src/content/essays/my-new-essay.md << 'EOF'
---
title: "标题"
summary: "一句话摘要 (会显示在 featured)"
date: 2026-06-01
type: essay
tags: [tag1, tag2]
readingMin: 5
featured: false
---

正文从这里开始。 第一段会自动加 dropcap。

## 小节标题

正文。

> 引文。
EOF

git add . && git commit -m "essay: 标题" && git push
# Cloudflare 60 秒后自动重新部署
```

新笔记类似, 扔进 `src/content/notes/`。 字段对照 `SITE_MAP.md` "Frontmatter contract"。

---

## 8. 给 Ting 的小贴士 (转告)

- 写文章不要追频率, 这站设计就是慢的
- `lastWatered` 不一定是 "最后修改时间" — 是 "最后想起这条" 的时间, 手填
- 笔记之间互联用 `backlinks: [slug, slug]`, slug 是另一条笔记的文件名 (不带 .md)
- `seedling` 不用刻意藏, 它会自动显示但不出现在 `/wood/rss.xml`
- 想 preview 文章但不发: frontmatter 加 `draft: true`

---

## 9. 历史

- v0.1 (2026·05): 8 页高保真 HTML 设计稿 + 信息架构 IA 文档 — 项目根目录的 `*.html`, 仅供参考, **不要部署它们**
- v1.0 (2026·05): Astro 迁移 — `geez-wood/` 目录 · 当前要部署的
- 之前的品牌是 "数字花园 / digital garden" — 已废弃, 全面改为 "Geez Wood / wood"

如果 Ting 提到 "数字花园" 或 "garden" 时, 她可能是在说 v0.1 的设计稿。 现在的站是 wood。

---

🌲

— 前一个 agent 写于 2026·05, 留给 Ting 和接手的本地 agent
