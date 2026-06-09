import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { FailureAnalysisResult, ParsedLog } from "./models.js";

const toolMetadata = {
  name: "ai-test-failure-classifier",
  version: "0.1.0"
};

export function buildJsonReport(parsedLog: ParsedLog, analysis: FailureAnalysisResult): string {
  return JSON.stringify(
    {
      tool: toolMetadata,
      generatedAt: new Date().toISOString(),
      parsedLog,
      analysis
    },
    null,
    2
  );
}

export function buildMarkdownReport(parsedLog: ParsedLog, analysis: FailureAnalysisResult): string {
  const matchedSignals = analysis.matchedSignals.length > 0
    ? analysis.matchedSignals.map((signal) => `- ${signal}`).join("\n")
    : "- none";

  return [
    "# LLM-Assisted Test Failure Analysis Report",
    "",
    "## Summary",
    "",
    "| Field | Value |",
    "| --- | --- |",
    `| Test name | ${formatTableValue(parsedLog.testName)} |`,
    `| Framework | ${formatTableValue(parsedLog.framework)} |`,
    `| Source file | ${formatTableValue(parsedLog.sourceFile)} |`,
    `| Classification | ${formatTableValue(analysis.classification)} |`,
    `| Confidence | ${analysis.confidence} |`,
    `| Manual review required | ${analysis.manualReviewRequired} |`,
    "",
    "## Parsed Log Metadata",
    "",
    `- Test name: ${parsedLog.testName}`,
    `- Framework: ${parsedLog.framework}`,
    `- Source file: ${parsedLog.sourceFile}`,
    `- Error message: ${parsedLog.errorMessage}`,
    "",
    "### Stack Trace",
    "",
    "```text",
    parsedLog.stackTrace,
    "```",
    "",
    "## Classification",
    "",
    `- Classification: ${analysis.classification}`,
    `- Confidence: ${analysis.confidence}`,
    `- Manual review required: ${analysis.manualReviewRequired}`,
    "",
    "## Reason",
    "",
    analysis.reason,
    "",
    "## Matched Signals",
    "",
    matchedSignals,
    "",
    "## Recommended Action",
    "",
    analysis.recommendedAction
  ].join("\n");
}

export async function writeTextFile(filePath: string, content: string): Promise<void> {
  const parentDirectory = dirname(filePath);

  if (parentDirectory && parentDirectory !== ".") {
    await mkdir(parentDirectory, { recursive: true });
  }

  await writeFile(filePath, content, "utf8");
}

function formatTableValue(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", "<br>");
}
