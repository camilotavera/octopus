import { createOpenAI } from "./client";
import { buildWeeklyPrompt } from "./prompts";
import { RankedTopic, ThemeSuggestion } from "../../domain/types";

export async function generateWeeklyThemes(args: {
  rankedTopics: RankedTopic[];
  weekLabel: string;
}): Promise<ThemeSuggestion[]> {
  const openai = createOpenAI();
  const prompt = buildWeeklyPrompt(args);

  const res = await openai.chat.completions.create({
    // Swap model based on your preference/cost:
    model: process.env.OPENAI_MODEL || "gpt-4.1",
    messages: [
      { role: "system", content: "Return JSON only. No markdown." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });

  const text = res.choices[0]?.message?.content?.trim() || "";
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    // basic recovery: try to extract JSON block
    const match = text.match(/\{[\s\S]*\}$/);
    if (!match) throw new Error(`LLM did not return JSON. Raw: ${text.slice(0, 400)}`);
    parsed = JSON.parse(match[0]);
  }

  if (!parsed?.suggestions?.length || parsed.suggestions.length !== 10) {
    throw new Error(`Expected 10 suggestions, got ${parsed?.suggestions?.length ?? 0}`);
  }

  return parsed.suggestions as ThemeSuggestion[];
}