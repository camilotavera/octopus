import type { Pillar } from "../config/pillars";

export type TrendItem = {
  id: string;
  source: "hackernews" | "googletrends" | "github" | "rss";
  title: string;
  url?: string;
  publishedAt?: string;
  rawScore?: number;        // source-provided score (HN points, GH stars, etc.)
  tags?: string[];
};

export type Topic = {
  id: string;
  title: string;
  url?: string;
  sources: TrendItem[];
  signals: string[];        // short reasons: "HN #3", "Google Trends rising", etc.
};

export type RankedTopic = Topic & {
  pillarMatches: { pillarId: Pillar["id"]; score: number }[];
  score: number;            // 0-100
};

export type ThemeSuggestion = {
  themeTitle: string;
  pillarId: Pillar["id"];
  whyNow: string;
  format: "text" | "carousel" | "short-story" | "checklist" | "mini-thread";
  hookOptions: string[];
  outline: string[];
  draft: string;            // <= 1300 chars target
  ctaQuestion: string;
  sources: { title: string; url?: string; source: TrendItem["source"] }[];
};
