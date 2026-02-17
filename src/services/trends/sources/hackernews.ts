import axios from 'axios';
import type { TrendItem } from '../../../domain/types';

export async function fetchHackerNewsTop(limit = 20): Promise<TrendItem[]> {
  const topIds = await axios.get<number[]>('https://hacker-news.firebaseio.com/v0/topstories.json');
  const ids = topIds.data.slice(0, limit);

  const items = await Promise.all(
    ids.map(async (id) => {
      const r = await axios.get<any>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      const it = r.data;
      return {
        id: `hn-${it.id}`,
        source: 'hackernews',
        title: it.title,
        url: it.url || `https://news.ycombinator.com/item?id=${it.id}`,
        publishedAt: it.time ? new Date(it.time * 1000).toISOString() : undefined,
        rawScore: it.score,
        tags: ['hn'],
      } satisfies TrendItem;
    }),
  );

  return items;
}
