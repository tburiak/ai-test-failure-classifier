#!/usr/bin/env node
import { analyzeLogFile } from "./index.js";
import type { ParsedLog } from "./models.js";

function printUsage(): void {
  console.error("Usage: npm run analyze -- <log-file-path>");
}

function printParsedMetadata(parsedLog: ParsedLog): void {
  console.log("Parsed test failure metadata");
  console.log(`Test name: ${parsedLog.testName}`);
  console.log(`Framework: ${parsedLog.framework}`);
  console.log(`Source file: ${parsedLog.sourceFile}`);
  console.log(`Error message: ${parsedLog.errorMessage}`);
  console.log("Stack trace:");
  console.log(parsedLog.stackTrace);
  console.log(`Raw log length: ${parsedLog.rawLog.length} characters`);
}

const [logFilePath] = process.argv.slice(2);

if (!logFilePath) {
  printUsage();
  process.exitCode = 1;
} else {
  try {
    const analysis = await analyzeLogFile(logFilePath);
    printParsedMetadata(analysis);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to analyze log file: ${message}`);
    process.exitCode = 1;
  }
}
