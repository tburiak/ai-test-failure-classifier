import { buildAnalysisPrompt } from "./promptBuilder.js";
import { allowedFailureClassifications } from "./models.js";
import type { FailureAnalysisResult, FailureClassification, ParsedLog } from "./models.js";
import type { LlmProvider } from "./providers/LlmProvider.js";

const fallbackAnalysisResult: FailureAnalysisResult = {
  classification: "unknown_needs_manual_review",
  confidence: 0.1,
  reason: "The LLM provider response could not be parsed into a valid analysis result.",
  matchedSignals: [],
  recommendedAction: "Review the failure manually and inspect the provider output.",
  manualReviewRequired: true
};

export async function analyzeParsedLog(
  parsedLog: ParsedLog,
  provider: LlmProvider
): Promise<FailureAnalysisResult> {
  const prompt = buildAnalysisPrompt(parsedLog);
  const rawResponse = await provider.analyze(prompt);

  try {
    const parsedResponse: unknown = JSON.parse(rawResponse);

    if (isFailureAnalysisResult(parsedResponse)) {
      return parsedResponse;
    }
  } catch {
    return fallbackAnalysisResult;
  }

  return fallbackAnalysisResult;
}

function isFailureAnalysisResult(value: unknown): value is FailureAnalysisResult {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isFailureClassification(value.classification) &&
    isConfidence(value.confidence) &&
    typeof value.reason === "string" &&
    Array.isArray(value.matchedSignals) &&
    value.matchedSignals.every((signal) => typeof signal === "string") &&
    typeof value.recommendedAction === "string" &&
    typeof value.manualReviewRequired === "boolean"
  );
}

function isFailureClassification(value: unknown): value is FailureClassification {
  return (
    typeof value === "string" &&
    (allowedFailureClassifications as readonly string[]).includes(value)
  );
}

function isConfidence(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
