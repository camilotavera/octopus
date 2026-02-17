import { Client } from '@notionhq/client';

export function createNotion() {
  const auth = process.env.NOTION_API_KEY;
  if (!auth) throw new Error('Missing NOTION_API_KEY');
  return new Client({ auth });
}
