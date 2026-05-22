# Deploy · 上线步骤

完整流程: **本地跑通 → 推 GitHub → Cloudflare Pages 接管 → DNS 指向**.
首次大约 30–45 分钟, 之后每次 `git push` 自动重新部署。

---

## 0. Prerequisites

- Node ≥ 20: 检查 `node --version`
- Git
- GitHub 账号
- 已购域名 `woodsettler.com`
- Cloudflare 账号 (免费)

---

## 1. 本地跑起来

```bash
cd geez-wood
npm install
npm run dev      # http://localhost:4321
```

确认浏览器打开能看到首页, 没有 console error。

```bash
npm run build    # 出错就修, 必须能通过
```

`dist/` 里应该有一堆 HTML — 这就是要部署的东西。

---

## 2. 推 GitHub

如果还没初始化 git:

```bash
cd ..                    # 退到包含 geez-wood/ 的目录
git init
git add .
git commit -m "initial: geez wood v0.1"
```

在 GitHub 网站创建一个新 repo (名字随意, 我建议 `geez-wood-site`)。 不要勾任何 README/license/gitignore (那些已经有了)。

把本地连上 GitHub:

```bash
git remote add origin https://github.com/<your-username>/geez-wood-site.git
git branch -M main
git push -u origin main
```

---

## 3. Cloudflare Pages 接管

1. 登录 [Cloudflare](https://dash.cloudflare.com) → 左侧 **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. 选你刚才的 repo
3. 配置:
   - **Project name:** `geez-wood` (会变成 URL: `geez-wood.pages.dev`)
   - **Production branch:** `main`
   - **Framework preset:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `geez-wood` ← **重要** (因为 Astro 在子目录里)
   - **Environment variables:** 无
4. **Save and Deploy**

构建大概 60 秒。 完成后访问 `https://geez-wood.pages.dev` 验证。

---

## 4. 接你的域名 woodsettler.com

### 4a. 把域名 DNS 托管给 Cloudflare (如果还没)

在 Cloudflare → **Websites** → **Add a site** → 输入 `woodsettler.com` → 选 Free plan。

Cloudflare 会给你两个 nameserver, 类似:
```
adam.ns.cloudflare.com
nina.ns.cloudflare.com
```

去你买域名的注册商 (godaddy / namesilo / cloudflare 自己) 把 nameserver 改成这两个。 等 5–30 分钟生效。

### 4b. Pages 项目接域名

在 Pages 项目 → **Custom domains** → **Set up a custom domain** → 输入 `woodsettler.com` → 它自动创建 CNAME 记录指向 `geez-wood.pages.dev`。

也可以加 `www.woodsettler.com` (推荐顺手加)。

等几分钟 DNS 生效, 访问 `https://woodsettler.com` 应该就是你的站了, 自动 HTTPS。

---

## 5. 以后怎么更新

```bash
# 写一篇新文章
echo "---\ntitle: New essay\ndate: 2026-06-01\n---\n\n正文..." > geez-wood/src/content/essays/new-essay.md

# 提交 + 推
git add .
git commit -m "essay: new essay"
git push

# Cloudflare 自动构建 + 部署, 大概 60 秒后上线
```

---

## 故障排查

**`npm run build` 失败**: 看 error 里指明的文件, 多半是 markdown frontmatter 字段不对 (比如缺 `date` 或者 `stage` 拼错)。
**Cloudflare 部署失败**: 看构建 log。 常见: root directory 没填对 (应该是 `geez-wood`)。
**域名连不上**: nameserver 变更需要时间, 最长 24 小时。 用 `dig woodsettler.com` 看是否已经指向 cloudflare。

---

## 可选下一步

### 接 Buttondown 收 letter 订阅 (免费 100 个)

1. 注册 [buttondown.email](https://buttondown.email)
2. 在 Settings → API & integrations 拿到表单 URL
3. 在 `src/site.config.js` 把 `FEATURES.lettersForm` 改成 `true`
4. (后续我会加一个 BUTTONDOWN_FORM_URL 配置位)

### 接 Formspree 收明信片消息 (免费 50 条/月)

1. 注册 [formspree.io](https://formspree.io)
2. 创建表单, 拿到 form endpoint
3. 在 `src/site.config.js` 把 `FEATURES.contactForm` 改成 `true`
4. 配置 endpoint (后续我会加这部分)

### 不用 Cloudflare, 用 Vercel 也行

Vercel 流程基本相同 — 也是连 git → 自动部署 → 加域名。
唯一差别: Root Directory 在 Vercel 叫做 **Root Directory** (一样), 填 `geez-wood`。

---

## 文件清单 (deploy 用到的)

| 文件 | 是 | 否 |
|---|---|---|
| `geez-wood/dist/` | 提交到 git? | ❌ 自动构建生成, gitignore |
| `geez-wood/node_modules/` | 提交? | ❌ gitignore |
| `geez-wood/.astro/` | 提交? | ❌ gitignore |
| `geez-wood/public/**` | 提交? | ✅ 字体、grain.png 等 |
| `geez-wood/src/**` | 提交? | ✅ 你的全部代码和内容 |
