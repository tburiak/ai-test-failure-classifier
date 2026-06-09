import type { FailureAnalysisResult, ParsedLog } from "./models.js";

export function formatFailureAnalysisSummary(
  parsedLog: ParsedLog,
  analysis: FailureAnalysisResult
): string {
  const matchedSignals = analysis.matchedSignals.length > 0
    ? analysis.matchedSignals.map((signal) => `- ${signal}`).join("\n")
    : "- none";

  return [
    "Failure analysis summary",
    `Test name: ${parsedLog.testName}`,
    `Framework: ${parsedLog.framework}`,
    `Source file: ${parsedLog.sourceFile}`,
    `Classification: ${analysis.classification}`,
    `Confidence: ${analysis.confidence}`,
    `Manual review required: ${analysis.manualReviewRequired}`,
    `Reason: ${analysis.reason}`,
    "Matched signals:",
    matchedSignals,
    `Recommended action: ${analysis.recommendedAction}`
  ].join("\n");
}
