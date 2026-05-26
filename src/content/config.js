/**
 * Content collections — schema for Markdown / data files in src/content/.
 * Add a new essay → drop a .md into src/content/essays/
 * Add a new wood note → drop a .md into src/content/notes/
 *
 * Frontmatter fields below are the contract. Astro validates at build.
 */
import { defineCollection, z } from 'astro:content';

const essays = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    subtitle:    z.string().optional(),
    summary:     z.string().optional(),
    date:        z.coerce.date(),
    updated:     z.coerce.date().optional(),
    type:        z.enum(['essay', 'field', 'letter', 'project']).default('essay'),
    tags:        z.array(z.string()).default([]),
    readingMin:  z.number().optional(),
    featured:    z.boolean().default(false),
    draft:       z.boolean().default(false),
    cover:       z.string().optional(),    // path to image in public/
  }),
});

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title:        z.string(),
    summary:      z.string().optional(),
    stage:        z.enum(['seedling', 'growing', 'evergreen']).default('seedling'),
    created:      z.coerce.date(),
    lastWatered:  z.coerce.date(),
    tags:         z.array(z.string()).default([]),
    backlinks:    z.array(z.string()).default([]),   // ids of other notes
    draft:        z.boolean().default(false),
  }),
});

const letters = defineCollection({
  type: 'content',
  schema: z.object({
    number:   z.number(),
    title:    z.string(),
    date:     z.coerce.date(),
    summary:  z.string().optional(),
    draft:    z.boolean().default(false),
  }),
});

const books = defineCollection({
  type: 'data',
  schema: z.object({
    title:    z.string(),
    titleZh:  z.string().optional(),
    author:   z.string(),
    year:     z.number().optional(),
    status:   z.enum(['reading', 'finished', 'paused', 'want']),
    rating:   z.number().min(0).max(5).optional(),
    progress: z.number().min(0).max(100).optional(),
    note:     z.string().optional(),
    coverTint: z.enum(['t', 's', 'u', 'p', 'n']).default('n'),
    date:     z.coerce.date().optional(),
  }),
});

const listening = defineCollection({
  type: 'data',
  schema: z.object({
    title:     z.string(),                                          // 专辑 / 单曲 / 节目名
    artist:    z.string(),                                          // 演出者 / 主播
    year:      z.number().optional(),
    kind:      z.enum(['album', 'track', 'podcast']).default('album'),
    status:    z.enum(['loop', 'new', 'paused']).default('new'),    // 封面右上角徽标
    why:       z.string().optional(),                               // 一句心情
    cover:     z.string().optional(),                               // 真封面图, public 相对路径
    coverTint: z.enum(['t', 's', 'u', 'p', 'n']).default('n'),      // 无 cover 时的兜底色块
    link:      z.string().optional(),                               // 点封面跳转的站内 URL (如关联 essay)
    date:      z.coerce.date().optional(),                          // 加入日期, 用于排序
  }),
});

export const collections = { essays, notes, letters, books, listening };
