/**
 * Content collections — schema for Markdown / data files in src/content/.
 * Add a new essay → drop a .md into src/content/essays/
 *
 * Frontmatter fields below are the contract. Astro validates at build.
 */
import { defineCollection, z } from 'astro:content';

const essays = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    subtitle:    z.string().nullish(),
    summary:     z.string().nullish(),
    date:        z.coerce.date(),
    updated:     z.coerce.date().nullish(),
    type:        z.enum(['essay', 'field', 'letter', 'project']).default('essay'),
    tags:        z.array(z.string()).default([]),
    readingMin:  z.number().nullish(),
    featured:    z.boolean().default(false),
    draft:       z.boolean().default(false),
    cover:       z.string().nullish(),     // path to image in public/covers/essays/
    music:       z.object({
      title:   z.string().nullish(),
      artist:  z.string().nullish(),
      netease: z.string().nullish(),       // 网易云单曲链接或外链代码
      audio:   z.string().nullish(),       // 本地 MP3 路径 (public/audio/essays/)
    }).nullish(),
  }),
});

const books = defineCollection({
  type: 'data',
  schema: z.object({
    title:    z.string(),
    titleZh:  z.string().nullish(),
    author:   z.string(),
    year:     z.number().nullish(),
    status:   z.enum(['reading', 'finished', 'paused', 'want']),
    rating:   z.number().min(0).max(5).nullish(),
    progress: z.number().min(0).max(100).nullish(),
    note:     z.string().nullish(),
    cover:    z.string().nullish(),        // 真封面图 (public/covers/books/)
    coverTint: z.enum(['t', 's', 'u', 'p', 'n']).default('n'),
    date:     z.coerce.date().nullish(),
  }),
});

const listening = defineCollection({
  type: 'data',
  schema: z.object({
    title:     z.string(),                                          // 专辑 / 单曲 / 节目名
    artist:    z.string(),                                          // 演出者 / 主播
    year:      z.number().nullish(),
    kind:      z.enum(['album', 'track', 'podcast']).default('album'),
    status:    z.enum(['loop', 'new', 'paused']).default('new'),    // 封面右上角徽标
    why:       z.string().nullish(),                                // 一句心情
    cover:     z.string().nullish(),                                // 真封面图, public 相对路径
    coverTint: z.enum(['t', 's', 'u', 'p', 'n']).default('n'),      // 无 cover 时的兜底色块
    link:      z.string().nullish(),                                // 关联站内文章 URL
    listenUrl: z.string().nullish(),                                // 网易云/外链试听直达 URL
    audio:     z.string().nullish(),                                // 本地 MP3 试听路径 (public/audio/listening/)
    tracks:    z.array(z.string()).default([]),                     // 曲目列表（自动生成 /collections/[slug] 详情页）
    gallery:   z.array(z.object({
      src:     z.string(),
      caption: z.string().nullish(),
    })).default([]),                                                // 封套与画册插图
    date:      z.coerce.date().nullish(),                           // 加入日期, 用于排序
  }),
});

// 固定页面的文案层 — 把写死在 .astro 里的文案搬到 src/content/pages/*.md。
// 各页字段形状不同, 故 schema 宽松 (passthrough); 具体形状由各自的 .astro 模板消费。
// 含内联格式 (<b>/<a>/<em>) 的字段用字符串存原样, 模板里 set:html 渲染。
const pages = defineCollection({
  type: 'content',
  schema: z.object({}).passthrough(),
});

export const collections = { essays, books, listening, pages };
