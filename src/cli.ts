#!/usr/bin/env node
import { analyzeLogFile, analyzeParsedLog, createLlmProvider } from "./index.js";
import { parseAnalyzeArgs } from "./cliArgs.js";
import { formatFailureAnalysisSummary } from "./cliOutput.js";
import { buildJsonReport, buildMarkdownReport, writeTextFile } from "./reportGenerator.js";

function printUsage(): void {
  console.error(
    "Usage: npm run analyze -- <log-file-path> [--provider mock|openai] [--json <path>] [--markdown <path>]"
  );
}

const cliArgs = process.argv.slice(2);

if (!cliArgs[0]) {
  printUsage();
  process.exitCode = 1;
} else {
  try {
    const options = parseAnalyzeArgs(cliArgs);
    const logFilePath = options.logFilePath;
    const parsedLog = await analyzeLogFile(logFilePath);
    const analysis = await analyzeParsedLog(parsedLog, createLlmProvider(options.provider));

    console.log(formatFailureAnalysisSummary(parsedLog, analysis));

    if (options.jsonReportPath) {
      await writeTextFile(options.jsonReportPath, buildJsonReport(parsedLog, analysis));
    }

    if (options.markdownReportPath) {
      await writeTextFile(options.markdownReportPath, buildMarkdownReport(parsedLog, analysis));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to analyze log file: ${message}`);
    process.exitCode = 1;
  }
}
