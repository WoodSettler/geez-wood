import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../site.config.js';

export async function GET(context) {
  const essays = await getCollection('essays', ({ data }) => !data.draft);
  return rss({
    title: `${SITE.name} · ${SITE.brand}`,
    description: SITE.tagline,
    site: context.site,
    items: essays
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map(e => ({
        title: e.data.title,
        pubDate: e.data.date,
        description: e.data.summary || '',
        link: `/writing/${e.slug}/`,
        categories: e.data.tags,
      })),
    customData: `<language>zh-CN</language>`,
  });
}
