import { allowedFailureClassifications } from "./models.js";
import type { ParsedLog } from "./models.js";

export function buildAnalysisPrompt(parsedLog: ParsedLog): string {
  const allowedCategories = allowedFailureClassifications.map((category) => `- ${category}`).join("\n");

  return [
    "You are an expert SDET analyzing an automated test failure for CI/CD triage.",
    "",
    "Classify the failure into exactly one allowed category.",
    "Allowed categories:",
    allowedCategories,
    "",
    "Return valid JSON only. Do not include Markdown, code fences, comments, or explanatory prose outside the JSON object.",
    "Do not invent missing information. Use only the parsed log fields and raw log evidence provided below.",
    "If the evidence is missing, conflicting, or uncertain, use classification unknown_needs_manual_review and set manualReviewRequired to true.",
    "confidence must be a number between 0 and 1 inclusive.",
    "",
    "Return exactly one JSON object with this shape:",
    "{",
    '  "classification": "one allowed category",',
    '  "confidence": 0,',
    '  "reason": "brief evidence-based explanation",',
    '  "matchedSignals": ["specific evidence from the log"],',
    '  "recommendedAction": "next engineering action",',
    '  "manualReviewRequired": true',
    "}",
    "",
    "Parsed log fields:",
    `testName: ${parsedLog.testName}`,
    `framework: ${parsedLog.framework}`,
    `sourceFile: ${parsedLog.sourceFile}`,
    `errorMessage: ${parsedLog.errorMessage}`,
    "stackTrace:",
    parsedLog.stackTrace,
    "rawLog:",
    parsedLog.rawLog
  ].join("\n");
}
