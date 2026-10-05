import Anthropic from "@anthropic-ai/sdk";

export function getAnthropicClient() {
  const apiKey = process.env.HUMI_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("HUMI_ANTHROPIC_API_KEY is not configured");
  }
  return new Anthropic({ apiKey });
}

export const CLAUDE_MODEL = "claude-sonnet-5";
