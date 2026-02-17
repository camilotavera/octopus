export type Pillar = {
  id: string;
  name: string;
  description: string;
  keywords: string[];
};

/**
 * Expanded pillar system.
 *
 * Strategy:
 * - Core technical authority
 * - Staff-level systems thinking
 * - AI-native architecture
 * - Career leverage & immigration
 * - Founder/startup realism
 * - Engineering communication
 *
 * These are used in:
 * - Topic ranking (keyword scoring)
 * - LLM context
 * - Notion labeling
 */

export const PILLARS: Pillar[] = [
  // =============================
  // AI & Automation
  // =============================
  {
    id: 'ai-agents',
    name: 'AI Agents & Automation Systems',
    description:
      'Designing and shipping practical AI agents, cron-to-agent architectures, evaluation systems, tool orchestration, and reliability patterns in production.',
    keywords: [
      'agent',
      'automation',
      'workflow',
      'orchestration',
      'llm',
      'evaluation',
      'evals',
      'tooling',
      'agentic',
      'autonomous',
      'ai workflow',
    ],
  },
  {
    id: 'ai-native-architecture',
    name: 'AI-Native Product Architecture',
    description:
      'Building AI-first systems, latency vs intelligence tradeoffs, human-in-the-loop workflows, cost modeling, and inference architecture decisions.',
    keywords: [
      'ai-first',
      'inference',
      'model',
      'prompt',
      'latency',
      'token cost',
      'context window',
      'ai architecture',
      'vector',
      'embedding',
    ],
  },

  // =============================
  // SEO & Visibility
  // =============================
  {
    id: 'seo-aeo',
    name: 'SEO & AEO Engineering',
    description:
      'Technical SEO, schema strategy, crawl efficiency, structured data at scale, and AI search visibility systems.',
    keywords: [
      'seo',
      'aeo',
      'schema',
      'structured data',
      'crawl',
      'indexing',
      'serp',
      'search',
      'programmatic seo',
      'content system',
    ],
  },
  {
    id: 'ai-seo-intersection',
    name: 'AI + SEO + Analytics Intersection',
    description:
      'Where AI systems, structured content, analytics, and search visibility meet. Entity modeling, retrieval, and AI-driven discoverability.',
    keywords: [
      'entity',
      'retrieval',
      'structured content',
      'chunking',
      'llm search',
      'ai search',
      'content architecture',
      'search visibility',
      'knowledge graph',
    ],
  },

  // =============================
  // Web Architecture
  // =============================
  {
    id: 'nextjs-architecture',
    name: 'Next.js & Modern Web Architecture',
    description:
      'Server Components, hydration tradeoffs, caching layers, edge vs server, DTO patterns, performance engineering, and modern web architecture decisions.',
    keywords: [
      'next.js',
      'app router',
      'server components',
      'rsc',
      'hydration',
      'lcp',
      'inp',
      'performance',
      'cache',
      'edge',
      'dto',
    ],
  },

  // =============================
  // Data & Observability
  // =============================
  {
    id: 'analytics-observability',
    name: 'Analytics & Observability Systems',
    description:
      'Event taxonomy design, Snowplow vs GA4 tradeoffs, BigQuery pipelines, RUM monitoring, and debugging data integrity in distributed systems.',
    keywords: [
      'ga4',
      'snowplow',
      'bigquery',
      'events',
      'analytics',
      'tracking',
      'rum',
      'datadog',
      'instrumentation',
      'attribution',
    ],
  },

  // =============================
  // System Design & Scale
  // =============================
  {
    id: 'system-design',
    name: 'System Design for Scale',
    description:
      'Database modeling, read vs write optimization, caching strategies, location hierarchies, API architecture, and scaling to millions of records.',
    keywords: [
      'system design',
      'database',
      'schema',
      'scaling',
      'caching',
      'read optimization',
      'write optimization',
      'architecture',
      'distributed',
    ],
  },

  // =============================
  // Growth & Experimentation
  // =============================
  {
    id: 'growth-engineering',
    name: 'Growth & Experimentation Engineering',
    description:
      'A/B testing at scale, experiment design, instrumentation-first features, growth loops, and metrics interpretation.',
    keywords: [
      'ab test',
      'experiment',
      'hypothesis',
      'growth',
      'conversion',
      'metrics',
      'funnel',
      'feature flag',
      'optimization',
    ],
  },

  // =============================
  // Startup & Founder Reality
  // =============================
  {
    id: 'startup-engineering',
    name: 'Startup Engineering Reality',
    description:
      'Early-stage engineering tradeoffs, equity math, product-market risk, hiring first engineers, and infrastructure from zero.',
    keywords: ['startup', 'equity', 'founder', 'seed', 'early stage', 'mvp', 'product market fit', 'team building'],
  },

  // =============================
  // Career & Immigration
  // =============================
  {
    id: 'career-strategy',
    name: 'Career Strategy for Senior Engineers',
    description:
      'Positioning for Staff roles, technical storytelling, interview strategy, recruiter dynamics, and building leverage.',
    keywords: [
      'staff engineer',
      'senior engineer',
      'career',
      'interview',
      'recruiter',
      'leadership',
      'promotion',
      'positioning',
    ],
  },
  {
    id: 'immigration-strategy',
    name: 'Immigration Strategy for Builders',
    description:
      'O-1, H-1B, Canada pathways, sponsorship tradeoffs, contractor leverage, and pragmatic relocation strategies for engineers.',
    keywords: ['visa', 'immigration', 'o-1', 'h-1b', 'canada', 'sponsorship', 'relocation', 'work permit'],
  },

  // =============================
  // Engineering Communication
  // =============================
  {
    id: 'engineering-communication',
    name: 'Engineering Communication & Influence',
    description:
      'RFC writing, design docs, async communication, storytelling in interviews, and influencing cross-functional teams.',
    keywords: [
      'rfc',
      'design doc',
      'documentation',
      'async',
      'communication',
      'influence',
      'stakeholders',
      'alignment',
    ],
  },
];
