import { TrendItem, Topic } from "../../domain/types";
import { normalizeTitle } from "./normalize";

/**
 * MVP clustering: group by normalized title (exact).
 * Later: upgrade to embedding clustering or fuzzy matching.
 */
export function clusterToTopics(items: TrendItem[]): Topic[] {
  const map = new Map<string, Topic>();

  for (const it of items) {
    const key = normalizeTitle(it.title);
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        id: `topic-${key.slice(0, 40)}`,
        title: it.title,
        url: it.url,
        sources: [it],
        signals: [`${it.source}${it.rawScore ? ` score=${it.rawScore}` : ""}`],
      });
    } else {
      existing.sources.push(it);
      existing.signals.push(`${it.source}${it.rawScore ? ` score=${it.rawScore}` : ""}`);
      // Prefer a URL if missing
      if (!existing.url && it.url) existing.url = it.url;
    }
  }

  return Array.from(map.values());
}
