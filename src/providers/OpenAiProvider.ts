import OpenAI from "openai";
import { allowedFailureClassifications } from "../models.js";
import type { LlmProvider } from "./LlmProvider.js";

export const defaultOpenAiModel = "gpt-4o-mini";
export const missingOpenAiApiKeyMessage =
  "OPENAI_API_KEY is required when using --provider openai.";

export interface OpenAiProviderOptions {
  apiKey?: string;
  model?: string;
}

export class OpenAiProvider implements LlmProvider {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(options: OpenAiProviderOptions = {}) {
    const apiKey = normalizeEnvValue(options.apiKey ?? process.env.OPENAI_API_KEY);

    if (!apiKey) {
      throw new Error(missingOpenAiApiKeyMessage);
    }

    this.model = normalizeEnvValue(options.model ?? process.env.OPENAI_MODEL) ?? defaultOpenAiModel;
    this.client = new OpenAI({ apiKey });
  }

  async analyze(prompt: string): Promise<string> {
    const response = await this.client.responses.create({
      model: this.model,
      input: prompt,
      text: {
        format: {
          type: "json_schema",
          name: "failure_analysis_result",
          description: "Structured automated test failure triage result.",
          strict: true,
          schema: failureAnalysisResultSchema
        }
      }
    });

    return response.output_text;
  }
}

const failureAnalysisResultSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "classification",
    "confidence",
    "reason",
    "matchedSignals",
    "recommendedAction",
    "manualReviewRequired"
  ],
  properties: {
    classification: {
      type: "string",
      enum: allowedFailureClassifications
    },
    confidence: {
      type: "number",
      minimum: 0,
      maximum: 1
    },
    reason: {
      type: "string"
    },
    matchedSignals: {
      type: "array",
      items: {
        type: "string"
      }
    },
    recommendedAction: {
      type: "string"
    },
    manualReviewRequired: {
      type: "boolean"
    }
  }
} as const;

function normalizeEnvValue(value: string | undefined): string | undefined {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : undefined;
}
