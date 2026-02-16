import { createNotion } from "./client";
import { ThemeSuggestion, RankedTopic } from "../../domain/types";

function heading(text: string, level: 1 | 2 | 3) {
  const type = level === 1 ? "heading_1" : level === 2 ? "heading_2" : "heading_3";
  return {
    object: "block",
    type,
    [type]: { rich_text: [{ type: "text", text: { content: text } }] },
  };
}

function paragraph(text: string) {
  return {
    object: "block",
    type: "paragraph",
    paragraph: { rich_text: [{ type: "text", text: { content: text } }] },
  };
}

function bulleted(items: string[]) {
  return items.map((t) => ({
    object: "block",
    type: "bulleted_list_item",
    bulleted_list_item: { rich_text: [{ type: "text", text: { content: t } }] },
  }));
}

function divider() {
  return { object: "block", type: "divider", divider: {} };
}

export async function writeNotionWeeklyPage(args: {
  databaseId: string;
  weekLabel: string;
  runDateISO: string;
  rankedTopics: RankedTopic[];
  suggestions: ThemeSuggestion[];
}) {
  const notion = createNotion();

  const topTopics = args.rankedTopics.slice(0, 10).map((t) => `• ${t.title} (score ${t.score})`).join("\n");

  const children: any[] = [
    heading(`Weekly LinkedIn Themes — ${args.weekLabel}`, 1),
    paragraph("Pick 1–2 posts for the week. Each suggestion includes hooks, outline, and a ready draft."),
    divider(),
    heading("Trend signals (top 10)", 2),
    paragraph(topTopics),
    divider(),
    heading("Suggestions (10)", 2),
  ];

  args.suggestions.forEach((s, idx) => {
    children.push(
      heading(`${idx + 1}) ${s.themeTitle}`, 3),
      paragraph(`Pillar: ${s.pillarId} · Format: ${s.format}`),
      paragraph(`Why now: ${s.whyNow}`),
      paragraph("Hooks:"),
      ...bulleted(s.hookOptions.slice(0, 3)),
      paragraph("Outline:"),
      ...bulleted(s.outline),
      paragraph("Draft:"),
      paragraph(s.draft),
      paragraph(`CTA: ${s.ctaQuestion}`),
      paragraph(
        `Sources: ${s.sources.map((x) => `${x.source}: ${x.title}${x.url ? ` (${x.url})` : ""}`).join(" | ")}`
      ),
      divider()
    );
  });

  const page = await notion.pages.create({
    parent: { database_id: args.databaseId },
    properties: {
      Week: { title: [{ type: "text", text: { content: args.weekLabel } }] },
      "Run Date": { date: { start: args.runDateISO } },
      Status: { select: { name: "Generated" } },
    },
    children,
  });

  return page;
}
