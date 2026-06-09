import { parseLogFile } from "./logParser.js";
import type { ParsedLog } from "./models.js";

export type { ParsedLog, TestFramework } from "./models.js";
export { parseLogContent, parseLogFile } from "./logParser.js";

export async function analyzeLogFile(logFilePath: string): Promise<ParsedLog> {
  return parseLogFile(logFilePath);
}
