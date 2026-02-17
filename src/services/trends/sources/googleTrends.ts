import type { TrendItem } from '../../../domain/types';

/**
 * Provider interface so you can swap implementations:
 * - SerpApi Google Trends
 * - DataForSEO Trends
 * - Unofficial library
 */
export type GoogleTrendsProvider = {
  fetchDailyTrends: (geo: string) => Promise<TrendItem[]>;
};

// Placeholder implementation to keep compile passing
export const DummyGoogleTrendsProvider: GoogleTrendsProvider = {
  async fetchDailyTrends(geo: string) {
    return [
      {
        id: `gt-dummy-${geo}-1`,
        source: 'googletrends',
        title: 'Placeholder: connect a trends provider (SerpApi/DataForSEO/unofficial lib)',
        url: undefined,
        publishedAt: new Date().toISOString(),
        rawScore: 1,
        tags: ['placeholder'],
      },
    ];
  },
};
