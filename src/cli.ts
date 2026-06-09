#!/usr/bin/env node
import { analyzeLogFile, analyzeParsedLog, MockLlmProvider } from "./index.js";
import { formatFailureAnalysisSummary } from "./cliOutput.js";

function printUsage(): void {
  console.error("Usage: npm run analyze -- <log-file-path>");
}

const [logFilePath] = process.argv.slice(2);

if (!logFilePath) {
  printUsage();
  process.exitCode = 1;
} else {
  try {
    const parsedLog = await analyzeLogFile(logFilePath);
    const analysis = await analyzeParsedLog(parsedLog, new MockLlmProvider());

    console.log(formatFailureAnalysisSummary(parsedLog, analysis));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to analyze log file: ${message}`);
    process.exitCode = 1;
  }
}
