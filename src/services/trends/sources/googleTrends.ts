import axios from 'axios';
import type { TrendItem } from '../../../domain/types';
import { createLogger } from '../../../utils/logger';

/**
 * Provider interface so you can swap implementations:
 * - SerpApi Google Trends
 * - DataForSEO Trends
 * - Unofficial library
 */
export type GoogleTrendsProvider = {
  fetchDailyTrends: (geo: string) => Promise<TrendItem[]>;
};

const logger = createLogger('trends:google');
const DATAFORSEO_BASE_URL = 'https://api.dataforseo.com';
const DEFAULT_SEED_KEYWORDS = ['technology'] as const;
const MAX_SEEDS = 3;

type DataForSeoTrendPoint = {
  query?: string;
  topic_title?: string;
  title?: string;
  value?: number | string;
};

type DataForSeoResultItem = {
  type?: string;
  data?: DataForSeoTrendPoint[];
};

type DataForSeoTaskResult = {
  items?: DataForSeoResultItem[];
};

type DataForSeoTask = {
  status_code?: number;
  status_message?: string;
  result?: DataForSeoTaskResult[];
};

type DataForSeoResponse = {
  status_code?: number;
  status_message?: string;
  tasks?: DataForSeoTask[];
};

function normalizeSeeds(raw: string | undefined): string[] {
  const values = (raw ?? '')
    .split(',')
    .map((it) => it.trim())
    .filter(Boolean);

  if (values.length === 0) return [...DEFAULT_SEED_KEYWORDS];
  return values.slice(0, MAX_SEEDS);
}

function normalizeGeoToLocationName(geo: string): string {
  const input = geo.trim();
  if (!input) return 'United States';

  if (/^[a-z]{2}$/i.test(input)) {
    const formatter = new Intl.DisplayNames(['en'], { type: 'region' });
    const resolved = formatter.of(input.toUpperCase());
    if (resolved) return resolved;
  }

  return input;
}

function todayUtcDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function pastUtcDate(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function asNumber(value: number | string | undefined): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return undefined;

  if (value.toLowerCase() === 'breakout') return 101;
  const parsed = Number.parseFloat(value);
  if (Number.isFinite(parsed)) return parsed;
  return undefined;
}

function mapItemTypeToTag(type: string | undefined): string {
  if (!type) return 'trends';
  if (type.includes('queries')) return 'queries';
  if (type.includes('topics')) return 'topics';
  return type;
}

function toSafeIdSlug(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  if (slug) return slug;
  return Buffer.from(value).toString('hex').slice(0, 80);
}

function parseDataForSeo(data: DataForSeoResponse, geo: string): TrendItem[] {
  const deduped = new Map<string, TrendItem>();
  const publishedAt = new Date().toISOString();

  for (const task of data.tasks ?? []) {
    for (const result of task.result ?? []) {
      for (const item of result.items ?? []) {
        for (const point of item.data ?? []) {
          const title = point.query ?? point.topic_title ?? point.title;
          if (!title) continue;

          const cleanTitle = title.trim();
          if (!cleanTitle) continue;

          const rawScore = asNumber(point.value);
          const dedupeKey = cleanTitle.toLowerCase();
          const current = deduped.get(dedupeKey);

          if (current && (current.rawScore ?? 0) >= (rawScore ?? 0)) continue;

          deduped.set(dedupeKey, {
            id: `gt-dataforseo-${geo.toLowerCase()}-${toSafeIdSlug(cleanTitle)}`,
            source: 'googletrends',
            title: cleanTitle,
            publishedAt,
            rawScore,
            tags: ['dataforseo', mapItemTypeToTag(item.type)],
          });
        }
      }
    }
  }

  return [...deduped.values()];
}

async function fetchDailyTrendsFromDataForSeo(geo: string): Promise<TrendItem[]> {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) {
    logger.warn('DataForSEO credentials missing, Google Trends provider returning empty list', {
      required: ['DATAFORSEO_LOGIN', 'DATAFORSEO_PASSWORD'],
    });
    return [];
  }

  const location_name = normalizeGeoToLocationName(geo);
  const keywords = normalizeSeeds(process.env.DATAFORSEO_TRENDS_SEED_KEYWORDS);
  const date_from = pastUtcDate(7);
  const date_to = todayUtcDate();

  try {
    const response = await axios.post<DataForSeoResponse>(
      `${DATAFORSEO_BASE_URL}/v3/keywords_data/google_trends/explore/live`,
      keywords.map((seed) => ({
        keywords: [seed],
        location_name,
        type: 'web',
        date_from,
        date_to,
        item_types: ['google_trends_queries_list', 'google_trends_topics_list'],
      })),
      {
        auth: { username: login, password },
        timeout: 20_000,
      },
    );

    if ((response.data.status_code ?? 0) >= 30_000) {
      logger.warn('DataForSEO returned non-success status for Google Trends', {
        statusCode: response.data.status_code,
        statusMessage: response.data.status_message,
      });
      return [];
    }

    const hasTaskErrors = (response.data.tasks ?? []).some((task) => (task.status_code ?? 0) >= 30_000);
    if (hasTaskErrors) {
      logger.warn('DataForSEO returned task errors for Google Trends', {
        tasks: (response.data.tasks ?? []).map((task) => ({
          statusCode: task.status_code,
          statusMessage: task.status_message,
        })),
      });
    }

    return parseDataForSeo(response.data, geo);
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    const details = axios.isAxiosError(error)
      ? { status, message: error.message, data: error.response?.data }
      : { message: error instanceof Error ? error.message : 'Unknown error' };

    logger.warn('Failed to fetch DataForSEO Google Trends', details);
    return [];
  }
}

export const DataForSeoGoogleTrendsProvider: GoogleTrendsProvider = {
  fetchDailyTrends: fetchDailyTrendsFromDataForSeo,
};

// Placeholder implementation kept as explicit fallback when needed.
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

export const GoogleTrendsProviderFromEnv: GoogleTrendsProvider = {
  async fetchDailyTrends(geo: string) {
    const provider = process.env.GOOGLE_TRENDS_PROVIDER?.trim().toLowerCase();
    if (provider === 'dummy') return DummyGoogleTrendsProvider.fetchDailyTrends(geo);
    return DataForSeoGoogleTrendsProvider.fetchDailyTrends(geo);
  },
};
