#!/usr/bin/env node
import { analyzeLogFile } from "./index.js";

function printUsage(): void {
  console.error("Usage: npm run analyze -- <log-file-path>");
}

const [logFilePath] = process.argv.slice(2);

if (!logFilePath) {
  printUsage();
  process.exitCode = 1;
} else {
  const analysis = analyzeLogFile(logFilePath);
  console.log(analysis.message);
}
