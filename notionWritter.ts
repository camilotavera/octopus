import { Client } from "@notionhq/client";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateThemes(trends: string[]) {
	const response = await openai.chat.completions.create({
		model: "gpt-4.1",
		messages: [
			{
				role: "system",
				content: "You are a Staff engineer building LinkedIn content.",
			},
			{
				role: "user",
				content: `Trends:\n${trends.join("\n")}\nGenerate 5 post themes with drafts.`,
			},
		],
	});

	return response.choices[0].message.content;
}

async function createNotionPage(content: string) {
	await notion.pages.create({
		parent: { database_id: process.env.NOTION_DATABASE_ID! },
		properties: {
			Week: {
				title: [{ text: { content: `Week of ${new Date().toDateString()}` } }],
			},
			"Run Date": {
				date: { start: new Date().toISOString() },
			},
			Status: {
				select: { name: "Generated" },
			},
		},
		children: [
			{
				object: "block",
				type: "paragraph",
				paragraph: {
					rich_text: [{ type: "text", text: { content } }],
				},
			},
		],
	});
}
