import { fetchHackerNewsTop } from "../services/trends/sources/hackernews";
import { fetchRss } from "../services/trends/sources/rss";
import { DummyGoogleTrendsProvider } from "../services/trends/sources/googleTrends";
import { dedupe } from "../services/trends/normalize";
import { clusterToTopics } from "../services/trends/cluster";
import { rankTopics } from "../domain/scoring";
import { generateWeeklyThemes } from "../services/llm/generateThemes";
import { writeNotionWeeklyPage } from "../services/notion/writeWeeklyPage";
import { createLogger } from "../utils/logger";

const logger = createLogger("runWeekly");

export async function runWeekly() {
  logger.info("Weekly run started");

  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    logger.error("Missing required environment variable", { variable: "NOTION_DATABASE_ID" });
    throw new Error("Missing NOTION_DATABASE_ID");
  }

  const now = new Date();
  const weekLabel = now.toISOString().slice(0, 10); // e.g. 2026-02-16
  logger.info("Initialized weekly run context", { weekLabel });

  // Trend collection (MVP)
  logger.info("Fetching Hacker News trends");
  const hn = await fetchHackerNewsTop(25);
  logger.info("Fetched Hacker News trends", { count: hn.length });

  // Replace these RSS feeds with your preferred sources
  logger.info("Fetching RSS feeds");
  const aiNews = await fetchRss("https://www.theverge.com/rss/index.xml", "rss", 15);
  const seoNews = await fetchRss("https://searchengineland.com/feed", "rss", 15);
  logger.info("Fetched RSS feeds", { aiNews: aiNews.length, seoNews: seoNews.length });

  logger.info("Fetching Google Trends");
  const googleTrends = await DummyGoogleTrendsProvider.fetchDailyTrends("US");
  logger.info("Fetched Google Trends", { count: googleTrends.length });

  const items = dedupe([...hn, ...aiNews, ...seoNews, ...googleTrends]);
  logger.info("Collected and deduplicated trend items", {
    rawCount: hn.length + aiNews.length + seoNews.length + googleTrends.length,
    dedupedCount: items.length,
  });

  const topics = clusterToTopics(items);
  const ranked = rankTopics(topics);
  logger.info("Clustered and ranked topics", {
    topicCount: topics.length,
    rankedCount: ranked.length,
    topTopic: ranked[0]?.title ?? null,
  });

  // LLM
  logger.info("Generating weekly themes with LLM", { rankedTopics: ranked.length });
  const suggestions = await generateWeeklyThemes({
    rankedTopics: ranked,
    weekLabel,
  });
  logger.info("Generated weekly themes", { count: suggestions.length });

  // Notion
  logger.info("Writing weekly page to Notion", { weekLabel });
  const page = await writeNotionWeeklyPage({
    databaseId,
    weekLabel,
    runDateISO: now.toISOString(),
    rankedTopics: ranked,
    suggestions,
  });

  logger.info("Weekly run completed", { weekLabel, pageId: page.id });
  return page;
}
