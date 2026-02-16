import { fetchHackerNewsTop } from "../services/trends/sources/hackernews";
import { fetchRss } from "../services/trends/sources/rss";
import { DummyGoogleTrendsProvider } from "../services/trends/sources/googleTrends";
import { dedupe } from "../services/trends/normalize";
import { clusterToTopics } from "../services/trends/cluster";
import { rankTopics } from "../domain/scoring";
import { generateWeeklyThemes } from "../services/llm/generateThemes";
import { writeNotionWeeklyPage } from "../services/notion/writeWeeklyPage";

export async function runWeekly() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) throw new Error("Missing NOTION_DATABASE_ID");

  const now = new Date();
  const weekLabel = now.toISOString().slice(0, 10); // e.g. 2026-02-16

  // Trend collection (MVP)
  const hn = await fetchHackerNewsTop(25);

  // Replace these RSS feeds with your preferred sources
  const aiNews = await fetchRss("https://www.theverge.com/rss/index.xml", "rss", 15);
  const seoNews = await fetchRss("https://searchengineland.com/feed", "rss", 15);

  const googleTrends = await DummyGoogleTrendsProvider.fetchDailyTrends("US");

  const items = dedupe([...hn, ...aiNews, ...seoNews, ...googleTrends]);

  const topics = clusterToTopics(items);
  const ranked = rankTopics(topics);

  // LLM
  const suggestions = await generateWeeklyThemes({
    rankedTopics: ranked,
    weekLabel,
  });

  // Notion
  const page = await writeNotionWeeklyPage({
    databaseId,
    weekLabel,
    runDateISO: now.toISOString(),
    rankedTopics: ranked,
    suggestions,
  });

  return page;
}
