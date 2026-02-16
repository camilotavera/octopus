export type Pillar = {
    id: string;
    name: string;
    description: string;
    keywords: string[];
  };
  
  export const PILLARS: Pillar[] = [
    {
      id: "ai-agents",
      name: "AI Agents & Automation",
      description: "Building practical agents, cronjobs → semi-agent → agentic systems, orchestration, evals.",
      keywords: ["agent", "automation", "orchestration", "workflow", "llm", "evals", "tools", "cron"],
    },
    {
      id: "seo-aeo",
      name: "SEO/AEO Engineering",
      description: "Technical SEO, AEO, structured data, content systems, search visibility.",
      keywords: ["seo", "schema", "structured data", "aeo", "crawl", "indexing", "serp", "search"],
    },
    {
      id: "nextjs-perf",
      name: "Next.js Performance & Architecture",
      description: "App Router, server/client boundaries, RSC, caching, INP/LCP, real-world tradeoffs.",
      keywords: ["next.js", "app router", "rsc", "hydration", "performance", "lcp", "inp", "cache"],
    },
    {
      id: "analytics",
      name: "Analytics & Data",
      description: "GA4/Snowplow, BigQuery, instrumentation, dashboards, debugging data pipelines.",
      keywords: ["ga4", "snowplow", "bigquery", "events", "analytics", "tracking", "rum", "datadog"],
    },
    {
      id: "career-immigration",
      name: "Career & Immigration for Engineers",
      description: "Pragmatic immigration strategy, interviewing, positioning, building leverage.",
      keywords: ["visa", "immigration", "o-1", "h-1b", "canada", "career", "interview", "recruiter"],
    },
  ];
  