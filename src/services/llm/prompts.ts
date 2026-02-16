import { PILLARS } from "../../config/pillars";
import { RankedTopic } from "../../domain/types";

export function buildWeeklyPrompt(args: {
  rankedTopics: RankedTopic[];
  weekLabel: string;
}) {
  const { rankedTopics, weekLabel } = args;

  const pillarsText = PILLARS.map(
    (p) => `- ${p.id}: ${p.name} — ${p.description}`
  ).join("\n");

  const topicsText = rankedTopics.slice(0, 30).map((t, i) => {
    const sources = t.sources
      .slice(0, 4)
      .map((s) => `${s.source}${s.url ? ` (${s.url})` : ""}`)
      .join(", ");
    return `${i + 1}. ${t.title}\n   score=${t.score} pillarMatches=${t.pillarMatches
      .map((m) => `${m.pillarId}:${m.score}`)
      .join(", ")}\n   sources=${sources}`;
  }).join("\n");

  return `
You are Camilo: a Staff-level full-stack engineer (Next.js/TypeScript), strong in SEO/AEO + analytics, building AI agent products.
You write LinkedIn posts for senior engineers, tech leads, and founders.

Week: ${weekLabel}

Pillars:
${pillarsText}

Rules:
- Generate exactly 10 suggestions.
- Each suggestion must map to exactly one pillarId.
- Be pragmatic and specific. No generic motivational fluff.
- Draft should be <= 1300 characters.
- Include a CTA question at the end.
- If a topic is political/medical/legal, avoid it and choose a different topic.
- Output MUST be valid JSON ONLY matching this schema:

{
  "suggestions": [
    {
      "themeTitle": string,
      "pillarId": string,
      "whyNow": string,
      "format": "text"|"carousel"|"short-story"|"checklist"|"mini-thread",
      "hookOptions": string[],
      "outline": string[],
      "draft": string,
      "ctaQuestion": string,
      "sources": [{"title": string, "url"?: string, "source": "hackernews"|"googletrends"|"github"|"rss"}]
    }
  ]
}

Trend candidates:
${topicsText}
`.trim();
}
