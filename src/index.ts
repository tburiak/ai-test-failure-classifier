import { parseLogFile } from "./logParser.js";
import type { ParsedLog } from "./models.js";

export type {
  FailureAnalysisResult,
  FailureClassification,
  ParsedLog,
  TestFramework
} from "./models.js";
export { allowedFailureClassifications } from "./models.js";
export { analyzeParsedLog } from "./analyzer.js";
export { parseLogContent, parseLogFile } from "./logParser.js";
export { buildAnalysisPrompt } from "./promptBuilder.js";
export type { LlmProvider } from "./providers/LlmProvider.js";
export { MockLlmProvider } from "./providers/MockLlmProvider.js";

export async function analyzeLogFile(logFilePath: string): Promise<ParsedLog> {
  return parseLogFile(logFilePath);
}
