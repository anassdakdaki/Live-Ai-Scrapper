import type { AiClient } from "@scraper-ai/shared";

const noopClient: AiClient = {
  name: "noop",
  async complete({ prompt }) {
    // Deterministic-first: default path does nothing and returns original prompt.
    return `noop:${prompt}`;
  }
};

export function getAiClient(): AiClient {
  if (!process.env.AI_ENDPOINT) return noopClient;
  // TODO: implement OpenAI-compatible client with full explainability + logging
  return noopClient;
}
