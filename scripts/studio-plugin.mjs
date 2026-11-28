import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB 防呆线（Cloudflare Pages 硬上限 25 MiB）

function runCmd(cmd, args, cwd, timeout = 120000) {
  return execFileAsync(cmd, args, {
    cwd,
    timeout,
    maxBuffer: 10 * 1024 * 1024,
    windowsHide: true,
    shell: process.platform === 'win32' && cmd === 'npm',
  });
}

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); }
    });
  });
}

// 解析单篇 essay frontmatter（轻量读取标题/日期/草稿态）
function parseEssayMeta(filePath, slug) {
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    const stat = fs.statSync(filePath);
    const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || '';
    const title = (fm.match(/^title:\s*(.+)$/m)?.[1] || slug).trim().replace(/^['"]|['"]$/g, '');
    const date = (fm.match(/^date:\s*(.+)$/m)?.[1] || '').trim().replace(/^['"]|['"]$/g, '');
    const draft = /^draft:\s*true\b/m.test(fm);
    return { slug, title, date, draft, mtimeMs: stat.mtimeMs, url: `/writing/${encodeURIComponent(slug)}` };
  } catch {
    return { slug, title: slug, date: '', draft: false, mtimeMs: 0, url: `/writing/${encodeURIComponent(slug)}` };
  }
}

// 扫描 public/ 与未提交改动中超过 20 MB 的文件（防 Cloudflare Pages 25 MiB 报错）
function scanLargeFiles(rootDir) {
  const oversized = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === 'node_modules' || ent.name === '.git' || ent.name === 'dist') continue;
        walk(full);
      } else {
        const size = fs.statSync(full).size;
        if (size > MAX_FILE_BYTES) {
          oversized.push({
            path: path.relative(rootDir, full).replace(/\\/g, '/'),
            sizeMB: Number((size / (1024 * 1024)).toFixed(2)),
          });
        }
      }
    }
  };
  walk(path.join(rootDir, 'public'));
  return oversized;
}

// 解码 git porcelain 里被八进制转义的中文文件名
function decodeGitPath(p) {
  const trimmed = p.trim();
  if (!(trimmed.startsWith('"') && trimmed.endsWith('"'))) return trimmed;
  const inner = trimmed.slice(1, -1);
  const bytes = [];
  for (let i = 0; i < inner.length; i++) {
    if (inner[i] === '\\' && /^[0-7]{3}/.test(inner.slice(i + 1, i + 4))) {
      bytes.push(parseInt(inner.slice(i + 1, i + 4), 8));
      i += 3;
    } else if (inner[i] === '\\' && i + 1 < inner.length) {
      bytes.push(inner.charCodeAt(++i));
    } else {
      for (const b of Buffer.from(inner[i], 'utf8')) bytes.push(b);
    }
  }
  return Buffer.from(bytes).toString('utf8');
}

// 根据改动文件推导最应该预览的前台路由
function guessPreviewTarget(filePath) {
  const norm = filePath.replace(/\\/g, '/');
  const mEssay = norm.match(/^src\/content\/essays\/(.+)\.(md|mdoc)$/);
  if (mEssay) return { url: `/writing/${encodeURIComponent(mEssay[1])}`, label: `文章 · ${mEssay[1]}` };
  if (norm.startsWith('src/content/listening/') || norm.startsWith('src/content/books/') || norm === 'src/content/pages/collections.md') {
    return { url: '/collections', label: 'Collections' };
  }
  if (norm === 'src/content/pages/now.md') return { url: '/now', label: 'Now' };
  if (norm === 'src/content/pages/about.md') return { url: '/about', label: 'About' };
  if (norm === 'src/content/pages/writing.md') return { url: '/writing', label: 'Writing 列表' };
  if (norm === 'src/pages/index.astro' || norm === 'src/site.config.js') return { url: '/', label: '首页' };
  return null;
}

async function collectStatus(rootDir) {
  const { stdout } = await runCmd('git', ['status', '--porcelain=v1', '-uall'], rootDir);
  const changes = stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const code = line.slice(0, 2).trim() || 'M';
      const rawPath = line.slice(3);
      const file = decodeGitPath(rawPath.includes(' -> ') ? rawPath.split(' -> ').pop() : rawPath);
      const abs = path.join(rootDir, file);
      const mtimeMs = fs.existsSync(abs) ? fs.statSync(abs).mtimeMs : 0;
      return { code, file, mtimeMs, preview: guessPreviewTarget(file) };
    });

  const essaysDir = path.join(rootDir, 'src/content/essays');
  const dirtySet = new Set(changes.map((c) => c.file));
  const essays = fs.existsSync(essaysDir)
    ? fs.readdirSync(essaysDir)
        .filter((f) => /\.(md|mdoc)$/.test(f))
        .map((f) => {
          const slug = f.replace(/\.(md|mdoc)$/, '');
          const meta = parseEssayMeta(path.join(essaysDir, f), slug);
          return { ...meta, dirty: dirtySet.has(`src/content/essays/${f}`) };
        })
        .sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.mtimeMs - a.mtimeMs)
    : [];

  const recentEdited = changes
    .filter((c) => c.preview)
    .sort((a, b) => b.mtimeMs - a.mtimeMs)[0]?.preview || null;

  let branch = 'main';
  try {
    const b = await runCmd('git', ['rev-parse', '--abbrev-ref', 'HEAD'], rootDir);
    branch = b.stdout.trim() || 'main';
  } catch {}

  let ahead = 0;
  try {
    const a = await runCmd('git', ['rev-list', '--count', `origin/${branch}..HEAD`], rootDir);
    ahead = parseInt(a.stdout.trim(), 10) || 0;
  } catch {}

  const oversized = scanLargeFiles(rootDir);

  return {
    branch,
    ahead,
    changes,
    essays,
    recentEdited,
    oversized,
    clean: changes.length === 0 && ahead === 0,
  };
}

/**
 * Vite Dev Plugin — 仅在本地 `astro dev` 时挂载 /studio 与 /api/studio/*。
 * 生产 `astro build` 完全不会加载本插件，线上零残留、零暴露。
 */
export function studioPlugin() {
  let rootDir = process.cwd();
  let publishing = false;

  return {
    name: 'geez-wood-studio',
    apply: 'serve',
    configResolved(cfg) {
      rootDir = cfg.root || process.cwd();
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlObj = new URL(req.url || '/', 'http://127.0.0.1');
        const pathname = urlObj.pathname;

        // 1) 工作台首页 /studio
        if (pathname === '/studio' || pathname === '/studio/') {
          const htmlPath = path.join(rootDir, 'scripts/studio.html');
          try {
            const html = fs.readFileSync(htmlPath, 'utf8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('Cache-Control', 'no-store');
            res.end(html);
          } catch (err) {
            res.statusCode = 500;
            res.end(`Studio UI missing: ${err.message}`);
          }
          return;
        }

        // 2) 查询当前状态、文章列表、最近改动与大文件检测
        if (pathname === '/api/studio/status' && req.method === 'GET') {
          try {
            const status = await collectStatus(rootDir);
            sendJson(res, 200, { ok: true, ...status });
          } catch (err) {
            sendJson(res, 500, { ok: false, error: err.message });
          }
          return;
        }

        // 3) 同步远端（git pull --ff-only）
        if (pathname === '/api/studio/pull' && req.method === 'POST') {
          try {
            const { stdout, stderr } = await runCmd('git', ['pull', '--ff-only', 'origin', 'main'], rootDir);
            sendJson(res, 200, { ok: true, log: (stdout + '\n' + stderr).trim() || '已与远端同步' });
          } catch (err) {
            sendJson(res, 400, { ok: false, error: (err.stderr || err.stdout || err.message).trim() });
          }
          return;
        }

        // 4) 一键校验构建并推送上线（大文件拦截 → npm run build → git add/commit/push）
        if (pathname === '/api/studio/publish' && req.method === 'POST') {
          if (publishing) {
            sendJson(res, 409, { ok: false, error: '正在发布中，请稍候…' });
            return;
          }
          publishing = true;
          const logs = [];
          try {
            const body = await readBody(req);
            const st = await collectStatus(rootDir);

            if (st.oversized.length > 0) {
              const list = st.oversized.map((f) => `${f.path} (${f.sizeMB} MB)`).join('、');
              sendJson(res, 400, {
                ok: false,
                step: 'size-check',
                error: `检测到超过 20 MB 的大文件（Cloudflare Pages 上限 25 MiB）：${list}。请删除或压缩后再发布。`,
              });
              return;
            }

            if (st.changes.length === 0 && st.ahead === 0) {
              sendJson(res, 200, { ok: true, noop: true, message: '当前没有未发布的本地改动。' });
              return;
            }

            let commitMsg = (body.message || '').trim();
            if (st.changes.length > 0) {
              // 生成默认提交说明
              if (!commitMsg) {
                const names = st.changes
                  .filter((c) => c.preview)
                  .map((c) => c.preview.label);
                const uniq = [...new Set(names)].slice(0, 3);
                commitMsg = uniq.length > 0
                  ? `内容更新: ${uniq.join('、')}`
                  : `内容更新 (${st.changes.length} 项改动)`;
              }

              // Step 1: 本地静态构建校验
              logs.push('▶ 正在执行 npm run build 校验…');
              const buildRes = await runCmd('npm', ['run', 'build'], rootDir, 180000);
              logs.push(buildRes.stdout.split(/\r?\n/).slice(-6).join('\n').trim());

              // Step 2: git add & commit
              logs.push(`▶ 正在提交：${commitMsg}`);
              await runCmd('git', ['add', '-A'], rootDir);
              const commitRes = await runCmd('git', ['commit', '-m', commitMsg], rootDir);
              logs.push(commitRes.stdout.trim());
            } else {
              commitMsg = `推送 ${st.ahead} 个本地待发布提交`;
              logs.push(`▶ 检测到 ${st.ahead} 个本地待推送提交，跳过重复提交直接推送…`);
            }

            // Step 3: 若远端有新提交（例如自动化周报），先安全 rebase 再 push
            logs.push('▶ 正在同步并推送到 origin/main…');
            try {
              await runCmd('git', ['pull', '--rebase', 'origin', st.branch], rootDir);
            } catch (pullErr) {
              // 若拉取失败则尝试取消 rebase 并报给用户
              await runCmd('git', ['rebase', '--abort'], rootDir).catch(() => {});
              throw new Error(`同步远端失败（可能存在冲突）：${(pullErr.stderr || pullErr.message).trim()}`);
            }

            const pushRes = await runCmd('git', ['push', 'origin', st.branch], rootDir);
            logs.push((pushRes.stderr || pushRes.stdout || 'push ok').trim());

            const sha = (await runCmd('git', ['rev-parse', '--short', 'HEAD'], rootDir)).stdout.trim();
            sendJson(res, 200, {
              ok: true,
              commit: sha,
              message: commitMsg,
              liveUrl: 'https://woodsettler.com',
              log: logs.filter(Boolean).join('\n\n'),
            });
          } catch (err) {
            logs.push('✖ ' + (err.stderr || err.stdout || err.message || String(err)).trim());
            sendJson(res, 500, {
              ok: false,
              error: (err.stderr || err.message || '发布失败').trim().split(/\r?\n/).slice(-4).join('\n'),
              log: logs.join('\n\n'),
            });
          } finally {
            publishing = false;
          }
          return;
        }

        next();
      });
    },
  };
}
