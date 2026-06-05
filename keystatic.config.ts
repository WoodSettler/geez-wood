import { config, fields, collection, singleton } from '@keystatic/core';

// ── 复用片段 ───────────────────────────────────────────
// now / 首页的 facet 结构
const facet = (label: string) =>
  fields.object(
    {
      label: fields.text({ label: '标签', defaultValue: label }),
      eb: fields.text({ label: '英文小标' }),
      items: fields.array(fields.text({ label: '条目' }), {
        label: '条目',
        itemLabel: (p) => p.value,
      }),
    },
    { label }
  );

const tintOptions = [
  { label: 't', value: 't' },
  { label: 's', value: 's' },
  { label: 'u', value: 'u' },
  { label: 'p', value: 'p' },
  { label: 'n', value: 'n' },
];

// 留空的正文字段 (固定页用 .md 存, 正文一般空着)
const emptyBody = fields.markdoc({ label: '正文 (一般留空)', extension: 'md' });

export default config({
  storage: { kind: 'local' },

  ui: {
    brand: { name: 'Geez Wood' },
  },

  // ── 流式内容集合 ─────────────────────────────────────
  collections: {
    essays: collection({
      label: '文章 Essays',
      slugField: 'title',
      path: 'src/content/essays/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: '标题' } }),
        subtitle: fields.text({ label: '副标题' }),
        summary: fields.text({ label: '摘要', multiline: true }),
        date: fields.date({ label: '日期' }),
        updated: fields.date({ label: '更新日期' }),
        type: fields.select({
          label: '类型',
          options: [
            { label: 'essay', value: 'essay' },
            { label: 'field', value: 'field' },
            { label: 'letter', value: 'letter' },
            { label: 'project', value: 'project' },
          ],
          defaultValue: 'essay',
        }),
        tags: fields.array(fields.text({ label: 'tag' }), { label: 'Tags', itemLabel: (p) => p.value }),
        readingMin: fields.integer({ label: '阅读分钟' }),
        featured: fields.checkbox({ label: 'Featured' }),
        draft: fields.checkbox({ label: 'Draft' }),
        cover: fields.text({ label: '封面路径 (public 相对)' }),
        body: fields.markdoc({ label: '正文', extension: 'md' }),
      },
    }),

    notes: collection({
      label: 'Wood 笔记',
      slugField: 'title',
      path: 'src/content/notes/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: '标题' } }),
        summary: fields.text({ label: '摘要', multiline: true }),
        stage: fields.select({
          label: '成熟度',
          options: [
            { label: 'seedling', value: 'seedling' },
            { label: 'growing', value: 'growing' },
            { label: 'evergreen', value: 'evergreen' },
          ],
          defaultValue: 'seedling',
        }),
        created: fields.date({ label: '创建' }),
        lastWatered: fields.date({ label: '最近浇水' }),
        tags: fields.array(fields.text({ label: 'tag' }), { label: 'Tags', itemLabel: (p) => p.value }),
        backlinks: fields.array(fields.text({ label: 'note id' }), { label: 'Backlinks', itemLabel: (p) => p.value }),
        draft: fields.checkbox({ label: 'Draft' }),
        body: fields.markdoc({ label: '正文', extension: 'md' }),
      },
    }),

    listening: collection({
      label: '在听 Listening',
      slugField: 'title',
      path: 'src/content/listening/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: '标题 (专辑/单曲/节目)' } }),
        artist: fields.text({ label: '艺人 / 主播' }),
        year: fields.integer({ label: '年份' }),
        kind: fields.select({
          label: '类型',
          options: [
            { label: 'album', value: 'album' },
            { label: 'track', value: 'track' },
            { label: 'podcast', value: 'podcast' },
          ],
          defaultValue: 'album',
        }),
        status: fields.select({
          label: '徽标',
          options: [
            { label: 'loop', value: 'loop' },
            { label: 'new', value: 'new' },
            { label: 'paused', value: 'paused' },
          ],
          defaultValue: 'new',
        }),
        why: fields.text({ label: '一句心情', multiline: true }),
        cover: fields.image({
          label: '封面图',
          directory: 'public/covers/listening',
          publicPath: '/covers/listening/',
        }),
        coverTint: fields.select({ label: '兜底色块', options: tintOptions, defaultValue: 'n' }),
        link: fields.text({ label: '点击跳转 URL' }),
        date: fields.date({ label: '加入日期' }),
      },
    }),

    books: collection({
      label: '在读 Books',
      slugField: 'title',
      path: 'src/content/books/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: '书名' } }),
        titleZh: fields.text({ label: '中文名' }),
        author: fields.text({ label: '作者' }),
        year: fields.integer({ label: '年份' }),
        status: fields.select({
          label: '状态',
          options: [
            { label: 'reading', value: 'reading' },
            { label: 'finished', value: 'finished' },
            { label: 'paused', value: 'paused' },
            { label: 'want', value: 'want' },
          ],
          defaultValue: 'reading',
        }),
        rating: fields.integer({ label: '评分 0-5' }),
        progress: fields.integer({ label: '进度 %' }),
        note: fields.text({ label: '笔记', multiline: true }),
        coverTint: fields.select({ label: '封面色块', options: tintOptions, defaultValue: 'n' }),
        date: fields.date({ label: '日期' }),
      },
    }),
  },

  // ── 固定页面文案 (singletons) ─────────────────────────
  singletons: {
    now: singleton({
      label: 'Now 页',
      path: 'src/content/pages/now',
      format: { contentField: 'body' },
      schema: {
        crumb: fields.text({ label: 'Crumb (含 HTML)' }),
        head: fields.object(
          {
            title: fields.text({ label: '大标题 (含 HTML)' }),
            lead: fields.text({ label: '导语 (含 HTML)', multiline: true }),
          },
          { label: 'Head' }
        ),
        facets: fields.object(
          {
            do: facet('在做'),
            read: facet('在读'),
            hear: facet('在听'),
            think: facet('在想'),
          },
          { label: 'Facets' }
        ),
        footer: fields.text({ label: 'Footer (含 HTML)', multiline: true }),
        body: emptyBody,
      },
    }),

    writing: singleton({
      label: 'Writing 列表页',
      path: 'src/content/pages/writing',
      format: { contentField: 'body' },
      schema: {
        crumb: fields.text({ label: 'Crumb (含 HTML)' }),
        masthead: fields.object(
          {
            eb: fields.text({ label: '英文小标' }),
            introP: fields.text({ label: '导语 (含 HTML)', multiline: true }),
          },
          { label: 'Masthead' }
        ),
        empty: fields.text({ label: '空状态文案 (含 HTML)', multiline: true }),
        body: emptyBody,
      },
    }),

    wood: singleton({
      label: 'Wood 列表页',
      path: 'src/content/pages/wood',
      format: { contentField: 'body' },
      schema: {
        crumb: fields.text({ label: 'Crumb (含 HTML)' }),
        headTitle: fields.text({ label: '大标题 (含 HTML)' }),
        blurb: fields.text({ label: '导语', multiline: true }),
        body: emptyBody,
      },
    }),

    collectionsPage: singleton({
      label: 'Collections 列表页',
      path: 'src/content/pages/collections',
      format: { contentField: 'body' },
      schema: {
        crumb: fields.text({ label: 'Crumb (含 HTML)' }),
        head: fields.object(
          {
            title: fields.text({ label: '大标题 (含 HTML)' }),
            eb: fields.text({ label: '英文小标' }),
            p: fields.text({ label: '导语 (含 HTML)', multiline: true }),
          },
          { label: 'Head' }
        ),
        sections: fields.object(
          {
            books: fields.text({ label: 'books 分节标题 (含 HTML)' }),
            listening: fields.text({ label: 'listening 分节标题 (含 HTML)' }),
            links: fields.text({ label: 'links 分节标题 (含 HTML)' }),
          },
          { label: 'Section headings' }
        ),
        listeningTodo: fields.text({ label: 'listening 占位文案 (含 HTML)', multiline: true }),
        linksTodo: fields.text({ label: 'links 占位文案 (含 HTML)', multiline: true }),
        body: emptyBody,
      },
    }),

    home: singleton({
      label: '首页 Home',
      path: 'src/content/pages/home',
      format: { contentField: 'body' },
      schema: {
        hero: fields.object(
          {
            season: fields.text({ label: '季节' }),
            line1: fields.text({ label: '标题第 1 行' }),
            line2: fields.text({ label: '标题第 2 行' }),
            line3: fields.text({ label: '标题第 3 行' }),
            manifesto: fields.text({ label: '宣言 (含 HTML)', multiline: true }),
            ctaPrimary: fields.text({ label: '按钮·读最新' }),
            ctaWood: fields.text({ label: '按钮·wood' }),
            ctaNow: fields.text({ label: '按钮·now' }),
            scrollHint: fields.text({ label: '滚动提示' }),
          },
          { label: 'Hero' }
        ),
        featured: fields.object(
          {
            kicker: fields.text({ label: 'kicker (含 HTML)' }),
            heading: fields.text({ label: '标题 (含 HTML)' }),
            more: fields.text({ label: 'more 文字' }),
          },
          { label: 'Featured 区' }
        ),
        woodGlimpse: fields.object(
          {
            kicker: fields.text({ label: 'kicker (含 HTML)' }),
            heading: fields.text({ label: '标题 (含 HTML)' }),
            more: fields.text({ label: 'more 文字' }),
            empty: fields.text({ label: '空状态 (含 HTML)' }),
          },
          { label: 'Wood 区' }
        ),
        nowSec: fields.object(
          {
            kicker: fields.text({ label: 'kicker (含 HTML)' }),
            heading: fields.text({ label: '标题 (含 HTML)' }),
            more: fields.text({ label: 'more 文字' }),
            snapshot: fields.text({ label: 'snapshot 文字' }),
            lead: fields.text({ label: 'lead' }),
            seeMore: fields.text({ label: 'see more' }),
          },
          { label: 'Now 区' }
        ),
        nowStrip: fields.object(
          {
            do: fields.object({ label: fields.text({ label: '标签' }), body: fields.text({ label: '内容' }) }, { label: '在做' }),
            read: fields.object({ label: fields.text({ label: '标签' }), body: fields.text({ label: '内容' }) }, { label: '在读' }),
            hear: fields.object({ label: fields.text({ label: '标签' }), body: fields.text({ label: '内容' }) }, { label: '在听' }),
            think: fields.object({ label: fields.text({ label: '标签' }), body: fields.text({ label: '内容' }) }, { label: '在想' }),
          },
          { label: 'Now 缩略条' }
        ),
        body: emptyBody,
      },
    }),

    about: singleton({
      label: 'About 页',
      path: 'src/content/pages/about',
      format: { contentField: 'body' },
      schema: {
        crumb: fields.text({ label: 'Crumb (含 HTML)' }),
        crumbRight: fields.text({ label: 'Crumb 右' }),
        heroGreeting: fields.text({ label: '问候语' }),
        taglines: fields.array(fields.text({ label: 'tagline (含 HTML)', multiline: true }), { label: 'Taglines', itemLabel: (p) => p.value }),
        heroQuote: fields.text({ label: '名言 (含 HTML)', multiline: true }),
        quoteSource: fields.text({ label: '名言出处' }),
        factsheet: fields.array(
          fields.object({ dt: fields.text({ label: '标签' }), dd: fields.text({ label: '值 (含 HTML/占位符)' }) }, { label: '行' }),
          { label: 'Factsheet', itemLabel: (p) => p.fields.dt.value }
        ),
        beliefs: fields.array(
          fields.object({ title: fields.text({ label: '标题' }), body: fields.text({ label: '正文 (含 HTML)', multiline: true }) }, { label: '信念' }),
          { label: '三条信念', itemLabel: (p) => p.fields.title.value }
        ),
        signoff: fields.object(
          { left: fields.text({ label: '左侧文字', multiline: true }), sigSmall: fields.text({ label: '签名小字 (含占位符)' }) },
          { label: '落款' }
        ),
        onward: fields.array(
          fields.object({ href: fields.text({ label: '链接' }), eb: fields.text({ label: 'eb' }), t: fields.text({ label: '标题' }), d: fields.text({ label: '描述' }) }, { label: '卡片' }),
          { label: 'Onward 卡片', itemLabel: (p) => p.fields.t.value }
        ),
        body: fields.markdoc({ label: '自我介绍随笔 (正文)', extension: 'md' }),
      },
    }),

    contact: singleton({
      label: 'Contact 页',
      path: 'src/content/pages/contact',
      format: { contentField: 'body' },
      schema: {
        crumb: fields.text({ label: 'Crumb (含 HTML)' }),
        crumbRight: fields.text({ label: 'Crumb 右' }),
        intro: fields.object(
          { title: fields.text({ label: '标题 (含 HTML)' }), p: fields.text({ label: '导语 (含 HTML)', multiline: true }) },
          { label: 'Intro' }
        ),
        replyRate: fields.array(
          fields.object({ b: fields.text({ label: '数字' }), label: fields.text({ label: '说明' }) }, { label: '项' }),
          { label: '回复率', itemLabel: (p) => p.fields.b.value }
        ),
        cta: fields.object(
          { eb: fields.text({ label: 'eb' }), h2: fields.text({ label: '标题' }), p: fields.text({ label: '说明' }), line2: fields.text({ label: '按钮第 2 行' }) },
          { label: 'CTA 卡' }
        ),
        channelsDivider: fields.object(
          { kicker: fields.text({ label: 'kicker (含 HTML)' }), h2: fields.text({ label: '标题 (含 HTML)' }) },
          { label: '渠道分节' }
        ),
        channels: fields.object(
          {
            email: fields.object({ key: fields.text({ label: 'key' }), why: fields.text({ label: 'why', multiline: true }) }, { label: 'email' }),
            letters: fields.object({ key: fields.text({ label: 'key' }), whyOn: fields.text({ label: '订阅开启时' }), whyOff: fields.text({ label: '订阅关闭时' }) }, { label: 'letters' }),
            rss: fields.object({ key: fields.text({ label: 'key' }), why: fields.text({ label: 'why' }) }, { label: 'rss' }),
            github: fields.object({ key: fields.text({ label: 'key' }), why: fields.text({ label: 'why' }) }, { label: 'github' }),
          },
          { label: '渠道卡' }
        ),
        responseP: fields.text({ label: '回信说明 (含 HTML)', multiline: true }),
        body: emptyBody,
      },
    }),

    colophon: singleton({
      label: 'Colophon 页',
      path: 'src/content/pages/colophon',
      format: { contentField: 'body' },
      schema: {
        head: fields.object(
          { title: fields.text({ label: '标题 (含 HTML)' }), lead: fields.text({ label: '导语' }) },
          { label: 'Head' }
        ),
        blocks: fields.array(
          fields.object(
            {
              h2: fields.text({ label: '小节标题' }),
              rows: fields.array(
                fields.object({ dt: fields.text({ label: 'dt' }), dd: fields.text({ label: 'dd (含 HTML/占位符)', multiline: true }) }, { label: '行' }),
                { label: 'rows (dl 行)', itemLabel: (p) => p.fields.dt.value }
              ),
              paras: fields.array(fields.text({ label: '段落 (含 HTML)', multiline: true }), { label: 'paras (段落)', itemLabel: (p) => p.value }),
            },
            { label: '区块' }
          ),
          { label: 'Blocks', itemLabel: (p) => p.fields.h2.value }
        ),
        body: emptyBody,
      },
    }),
  },
});
