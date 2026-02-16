import { TrendItem } from "../../domain/types";

export function normalizeTitle(s: string) {
  return s
    .toLowerCase()
    .replace(/[\[\]\(\)\{\}\.\,\!\?\:;'"“”‘’]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function dedupe(items: TrendItem[]): TrendItem[] {
  const seen = new Map<string, TrendItem>();
  for (const it of items) {
    const key = normalizeTitle(it.title);
    // Keep higher rawScore if duplicates
    const prev = seen.get(key);
    if (!prev) seen.set(key, it);
    else if ((it.rawScore || 0) > (prev.rawScore || 0)) seen.set(key, it);
  }
  return Array.from(seen.values());
}
