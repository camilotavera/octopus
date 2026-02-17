import { PILLARS } from '../config/pillars';
import type { RankedTopic, Topic } from './types';

function keywordScore(text: string, keywords: string[]) {
  const t = text.toLowerCase();
  let score = 0;
  for (const k of keywords) {
    if (t.includes(k.toLowerCase())) score += 1;
  }
  return score;
}

export function rankTopics(topics: Topic[]): RankedTopic[] {
  return topics
    .map((topic) => {
      const title = topic.title.toLowerCase();

      const pillarMatches = PILLARS.map((p) => ({
        pillarId: p.id,
        score: keywordScore(title, p.keywords),
      }))
        .filter((m) => m.score > 0)
        .sort((a, b) => b.score - a.score);

      // signal strength: multiple sources = good
      const multiSourceBoost = Math.min(10, (topic.sources.length - 1) * 5);

      // source score: sum normalized raw scores
      const raw = topic.sources.reduce((acc, s) => acc + (s.rawScore || 0), 0);
      const rawNorm = Math.min(30, Math.log10(raw + 1) * 10);

      const relevance = Math.min(60, pillarMatches[0]?.score ? pillarMatches[0].score * 10 : 0);

      const score = Math.min(100, relevance + rawNorm + multiSourceBoost);

      return { ...topic, pillarMatches, score } satisfies RankedTopic;
    })
    .filter((t) => t.pillarMatches.length > 0) // keep only relevant to your pillars
    .sort((a, b) => b.score - a.score);
}
