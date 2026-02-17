import Parser from 'rss-parser';
import type { TrendItem } from '../../../domain/types';

const parser = new Parser();

export async function fetchRss(feedUrl: string, sourceTag: TrendItem['source'], limit = 20) {
  const feed = await parser.parseURL(feedUrl);
  return (feed.items || []).slice(0, limit).map((it, idx) => ({
    id: `${sourceTag}-rss-${idx}-${(it.link || it.title || '').slice(0, 20)}`,
    source: sourceTag,
    title: it.title || 'Untitled',
    url: it.link,
    publishedAt: it.isoDate,
    rawScore: undefined,
    tags: ['rss'],
  })) satisfies TrendItem[];
}
