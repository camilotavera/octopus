# LinkedIn Theme Agent

An automated weekly system that generates 10 high-quality LinkedIn post themes + full drafts based on real-world trends and publishes them to Notion for selection.

Built for:

- Senior engineers
- Builders
- AI/SEO practitioners
- Founders

This is not a content spam tool.
It’s a trend-aware, pillar-aligned content engine.

# 🎯 What It Does

## Every Monday (8am America/Bogota):

### Fetches trend signals:

- Hacker News
- RSS feeds (AI / SEO / Tech)
- Google Trends (provider-based, pluggable)
- Deduplicates + clusters topics

### Ranks by:

- Pillar relevance
- Signal strength
- Source velocity

### Uses LLM to generate:

- Exactly 10 suggestions
- Hook options
- Outline
- Full draft (≤1300 chars)
- CTA

### Creates a structured Notion page:

- Top trend signals
- 10 formatted suggestions
- Ready for review & selection

# 🚀 Quick Start

1. Install `pnpm install`
2. Create a Notion Integration
    - Go to: https://www.notion.so/my-integrations
    - Create integration
    - Copy API key
    - Share your database with the integration
    - Required properties:
        - Property	Type
        - Week	Title
        - Run Date	Date
        - Status	Select (Generated / Picked / Posted)
3. Environment Variables
    Create .env:
    ```
        OPENAI_API_KEY=sk-...
        OPENAI_MODEL=gpt-4.1
        NOTION_API_KEY=secret_...
        NOTION_DATABASE_ID=xxxxxx
    ```
    You can copy from: `.env.example`
4. Run Locally:
    - pnpm run build
    - pnpm run weekly
    
    If successful:
    - A new Notion page will be created
    - 10 structured suggestions will appear
    - Logs will show ranked topics + LLM output validation

# Automated Weekly Run (GitHub Actions)
Workflow runs:

Every Monday `8am America/Bogota`

Set repository secrets:
 - OPENAI_API_KEY
 - OPENAI_MODEL
 - NOTION_API_KEY
 - NOTION_DATABASE_ID

Workflow file:
`.github/workflows/weekly.yml`

Manual trigger also supported.

# 🧠 Content Strategy (Configurable)

Defined in: `src/config/pillars.ts`

Default pillars:

- AI Agents & Automation
- SEO/AEO Engineering
- Next.js Performance
- Analytics & Data
- Career & Immigration Strategy

Each pillar has:

- Description
- Keyword set
- Used in ranking + LLM context
- You can modify this to adjust positioning.



# 🧮 Ranking Logic

## Each topic receives a score based on:

- Keyword match against pillars
- Multi-source appearance boost
- Source signal strength (HN score, etc.)
- Log-scaled normalization

## Filtered to:

- Topics relevant to at least one pillar
- Future improvements:
- Embedding similarity
- Velocity tracking week-over-week
- Historical avoidance (no repeat themes)

# 🤖 LLM Generation Rules

## The system enforces:

- Exactly 10 suggestions
- Strict JSON schema
- Retry once if JSON invalid
- Max 1300 characters per draft
- No political/medical/legal topics

Output schema:

```
{
  "suggestions": [
    {
      "themeTitle": "string",
      "pillarId": "string",
      "whyNow": "string",
      "format": "text|carousel|short-story|checklist|mini-thread",
      "hookOptions": ["string"],
      "outline": ["string"],
      "draft": "string",
      "ctaQuestion": "string",
      "sources": [
        {
          "title": "string",
          "url": "string",
          "source": "hackernews|googletrends|github|rss"
        }
      ]
    }
  ]
}

```

# 🔒 Safety & Design Constraints

- No LinkedIn scraping
- No auto-posting
- Human-in-the-loop selection
- LLM output validated before Notion write
- Fails loudly if JSON invalid


# 🧪 Future Roadmap

## Phase 2
- Store selected posts
- Track performance metrics
- Learn from engagement
- Avoid repeating themes

## Phase 3

- Mid-week spike detection
- Variant generation (hot take vs calm expert)
- Pillar rotation balancing
- Embedding clustering

## Phase 4

- LinkedIn API integration (optional)
- Content calendar auto-scheduling
- “Breaking Trend Alert” Slack bot


# 🛠 Dev Commands
- `pnpm run weekly`
- `pnpm run build`
- `pnpm run check`


# 🧱 Engineering Principles

- Deterministic over clever
- Modular services
- Replaceable providers
- Schema-validated LLM outputs
- Clear logs
- Fail fast
- This is meant to scale into a Creator OS, not remain a script.

# 📌 Philosophy

- Keywords are proxies for intent.
- This system focuses on:
- Real trend signals

- Pillar alignment
- Audience specificity
- High-signal drafts

- It’s designed to help you think less about “what to post” and more about:
- What leverage to build.