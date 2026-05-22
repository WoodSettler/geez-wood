import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../../site.config.js';

export async function GET(context) {
  const notes = await getCollection('notes', ({ data }) => !data.draft);
  // Only growing + evergreen — seedlings are too raw for syndication
  const ready = notes.filter(n => n.data.stage !== 'seedling');
  return rss({
    title: `${SITE.brand} — wood notes (growing + evergreen)`,
    description: 'Notes from the wood — growing and evergreen only.',
    site: context.site,
    items: ready
      .sort((a, b) => b.data.lastWatered.valueOf() - a.data.lastWatered.valueOf())
      .map(n => ({
        title: n.data.title,
        pubDate: n.data.lastWatered,
        description: n.data.summary || '',
        link: `/wood/${n.slug}/`,
        categories: [n.data.stage, ...n.data.tags],
      })),
    customData: `<language>zh-CN</language>`,
  });
}
