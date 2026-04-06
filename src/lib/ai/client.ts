import Anthropic from '@anthropic-ai/sdk';

/**
 * Singleton Anthropic client for Claude API calls.
 * Uses ANTHROPIC_API_KEY from environment (validated in lib/env.ts).
 * Import this instead of creating new Anthropic() instances everywhere.
 */
let _client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic();
  }
  return _client;
}

/** Default model for risk assessments and document generation. */
export const DEFAULT_MODEL = 'claude-sonnet-4-20250514';

/** Max tokens for structured output responses (assessments). */
export const MAX_ASSESSMENT_TOKENS = 4096;

/** Max tokens for document generation (longer outputs). */
export const MAX_DOCUMENT_TOKENS = 8192;
