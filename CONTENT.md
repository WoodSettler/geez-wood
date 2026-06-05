# 改内容指南 · Geez Wood

> 这份文件告诉你：想改网站上的某段文字，去改哪个文件。
> **改完 → `git push` → Cloudflare 自动构建上线**（约 1 分钟）。本地想先看效果就 `npm run dev`。

---

## 真源在哪

- **真源 = `src/content/`**（站点构建时读取的就是这里）。
- `draft/` 只是你的**个人草稿区**，不影响线上。想清楚了再把内容落到 `src/content/`。

---

## 用后台改（Keystatic）—— 推荐

1. `npm run dev` → 浏览器开 **http://localhost:4321/keystatic**
2. 表单里改：文章 / 笔记 / 在听 / 在读 / 各固定页。封面图可直接上传（落到 `public/covers/`）。
3. 点 Save → 直接**写回对应的 `.md` / `.json` 文件**，dev 页面实时刷新。
4. 满意后 `git push` → Cloudflare 自动构建上线。

**它怎么不影响线上**：Keystatic 只在 `astro dev`（本地）启用。`npm run build`（Cloudflare 跑的）是**纯静态**，不打包后台、`/keystatic` 不会上线、不需服务器。

**两个注意**：
- ✍️ **长文逐字保留**：用 Keystatic 编辑文章/about 的**正文（markdown 正文区）**时，保存可能会轻微重排 markdown 格式。要逐字不动你的散文，就用编辑器（VS Code / Obsidian）改正文；**用 Keystatic 管结构化字段、元数据、新建条目、在听/在读**最稳。
- 🔗 **改字段名要改两处**：`keystatic.config.ts`（后台表单）和 `src/content/config.js`（Astro 校验）描述同一份数据。**加/改字段时两个文件都要动**——纯改内容不受影响。

---

## 一、流式内容（随时增删，一个文件一条）

| 想改/加什么 | 去哪 | 格式 |
|---|---|---|
| 文章 | `src/content/essays/*.md` | YAML 头部 + 正文 |
| wood 笔记 | `src/content/notes/*.md` | YAML 头部 + 正文 |
| 在听（唱片/播客） | `src/content/listening/*.json` | JSON，封面图放 `public/covers/listening/` |
| 在读（书） | `src/content/books/*.json` | JSON |
| 站名/域名/导航/页脚 | `src/site.config.js` | JS 配置 |

加一篇文章 = 在 `essays/` 扔个 `.md`；加一张唱片 = 在 `listening/` 扔个 `.json`。无需改模板。

---

## 二、固定页面文案（在 `src/content/pages/*.md`）

每个固定页面的文字都在这里，**改文字不用碰 `.astro`**。
- 头部 YAML = 结构化字段（标题、列表、卡片…）。
- 正文区 = 长文（仅 `about` 有：你的自我介绍随笔就是该文件的正文）。
- 含 `<b>`/`<a>`/`<em>` 的字段是**有意保留的内联格式**，照着写即可。
- 字段里的 `{name}` `{location}` `{domain}` `{github}` `{email}` `{date}` 是**占位符**，构建时自动替换成真实值，别手填。

| 页面 | 文件 | 主要可改字段 |
|---|---|---|
| 首页 `/` | `pages/home.md` | hero（标语三行、manifesto、三个按钮）、三个区块标题、now 缩略条四格 |
| `/now` | `pages/now.md` | 标题、导语、`facets`（在做/在读/在听/在想 的每条）、footer |
| `/about` | `pages/about.md` | 头部 taglines、factsheet、名言、`beliefs` 三条、落款、onward 卡片；**正文随笔=该文件正文区** |
| `/contact` | `pages/contact.md` | 联系语、reply 数字、cta 卡片、四个渠道卡（key/why）、回信说明 |
| `/about/colophon` | `pages/colophon.md` | `blocks`：typography/color/tech/thanks/license 各行 |
| `/wood` | `pages/wood.md` | 大标题、导语 |
| `/collections` | `pages/collections.md` | 标题、导语、三个分节标题、两条 “还在搭” |
| `/writing` | `pages/writing.md` | 导语、空状态文案 |

> ⚠️ **首页 now 缩略条 与 `/now` 是两份独立文案**——想同步，`home.md` 的 `nowStrip` 和 `now.md` 的 `facets` 都要改。

---

## 三、什么时候还得找 Claude

- 新增/删除**页面**或**内容类型**
- 改**版式 / 视觉 / 配色 / 组件结构**（比如新的卡片样式、新的页面布局）
- 改 URL/slug 规则、导航结构

这些属于“结构/设计”，改之前先动 `SITE_MAP.md`。**改文字则完全自助。**
