import { parseLogFile } from "./logParser.js";
import type { ParsedLog } from "./models.js";

export type {
  FailureAnalysisResult,
  FailureClassification,
  ParsedLog,
  TestFramework
} from "./models.js";
export { allowedFailureClassifications } from "./models.js";
export { parseLogContent, parseLogFile } from "./logParser.js";
export { buildAnalysisPrompt } from "./promptBuilder.js";

export async function analyzeLogFile(logFilePath: string): Promise<ParsedLog> {
  return parseLogFile(logFilePath);
}
