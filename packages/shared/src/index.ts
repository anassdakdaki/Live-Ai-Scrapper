export type ExecutionMode = "no-ai" | "ai-assisted" | "ai-autonomous";

export type SelectorStrategy = {
  css?: string;
  xpath?: string;
  regex?: string;
  confidence: number;
  fallback?: SelectorStrategy;
  manualOverride?: boolean;
};

export type SchemaField = {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "array" | "object";
  required?: boolean;
  description?: string;
  validators?: string[];
  locked?: boolean;
  aiSuggested?: boolean;
};

export type ProjectSchema = {
  name: string;
  fields: SchemaField[];
};

export type CrawlRule = {
  depthLimit: number;
  rateLimitPerMinute: number;
  sameDomainOnly: boolean;
  intentKeywords?: string[];
  auth?: {
    cookies?: Record<string, string>;
    loginReplayScriptPath?: string;
  };
};

export type TargetUrl = {
  url: string;
  intentScore?: number;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  targets: TargetUrl[];
  schema: ProjectSchema;
  crawl: CrawlRule;
  executionMode: ExecutionMode;
  createdAt: string;
  updatedAt: string;
};

export type ExtractionResult = {
  url: string;
  data: Record<string, unknown>;
  provenance: {
    selector: SelectorStrategy;
    timestamp: string;
  };
  confidence: number;
  validationErrors?: string[];
};

export type ExportFormat = "csv" | "json" | "jsonl";

export type RunLogEntry = {
  level: "info" | "warn" | "error";
  message: string;
  meta?: Record<string, unknown>;
  timestamp: string;
};

export interface AiClient {
  name: string;
  complete: (input: {
    prompt: string;
    model?: string;
    temperature?: number;
  }) => Promise<string>;
}

export type CrawlJob = {
  project: Project;
  runId: string;
  testLimit?: { maxPages?: number; maxDepth?: number };
};

export type SelectorConfidence = {
  selector: SelectorStrategy;
  confidence: number;
  rationale?: string;
};

export type DriftAlert = {
  field: string;
  previousSelector: SelectorStrategy;
  currentConfidence: number;
  triggeredAt: string;
};
