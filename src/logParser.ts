import { readFile } from "node:fs/promises";
import type { ParsedLog, TestFramework } from "./models.js";

export function parseLogContent(rawLog: string): ParsedLog {
  const lines = rawLog.replace(/\r\n/g, "\n").split("\n");
  const framework = inferFramework(rawLog);

  return {
    testName: extractTestName(lines),
    framework,
    sourceFile: extractSourceFile(lines),
    errorMessage: extractErrorMessage(lines),
    stackTrace: extractStackTrace(lines),
    rawLog
  };
}

export async function parseLogFile(filePath: string): Promise<ParsedLog> {
  const rawLog = await readFile(filePath, "utf8");
  return parseLogContent(rawLog);
}

function inferFramework(rawLog: string): TestFramework {
  const normalized = rawLog.toLowerCase();

  if (
    normalized.includes("cypresserror") ||
    normalized.includes("cypress") ||
    normalized.includes("cy.")
  ) {
    return "cypress";
  }

  if (
    normalized.includes("@playwright/test") ||
    normalized.includes("playwright") ||
    normalized.includes("locator(")
  ) {
    return "playwright";
  }

  if (
    normalized.includes("staleelementreference") ||
    normalized.includes("org.openqa.selenium") ||
    normalized.includes("selenium webdriver")
  ) {
    return "selenium";
  }

  if (
    normalized.includes("api test") ||
    normalized.includes("response status") ||
    normalized.includes("request:") ||
    /\b(get|post|put|patch|delete)\s+\//i.test(rawLog)
  ) {
    return "api";
  }

  return "unknown";
}

function extractTestName(lines: string[]): string {
  for (const line of lines) {
    const trimmed = line.trim();
    const explicitMatch = trimmed.match(/^Test:\s*(.+)$/i);

    if (explicitMatch) {
      return explicitMatch[1].trim();
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    const cypressMatch = trimmed.match(/^\d+\)\s+(.+)$/);

    if (cypressMatch) {
      return cypressMatch[1].trim();
    }

    const playwrightMatch = trimmed.match(/.+\s›\s(.+)$/);

    if (playwrightMatch) {
      return playwrightMatch[1].trim();
    }
  }

  return "";
}

function extractSourceFile(lines: string[]): string {
  for (const line of lines) {
    const explicitMatch = line.match(/^(?:\s*(?:Spec|Source|File):\s*)(.+)$/i);

    if (explicitMatch) {
      const sourceFile = matchSourceFile(explicitMatch[1]);

      if (sourceFile) {
        return sourceFile;
      }
    }
  }

  for (const line of lines) {
    const sourceFile = matchSourceFile(line);

    if (sourceFile) {
      return sourceFile;
    }
  }

  return "";
}

function extractErrorMessage(lines: string[]): string {
  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || isMetadataLine(trimmed) || isStackLine(trimmed)) {
      continue;
    }

    if (
      /^(?:CypressError|TimeoutError|AssertionError|Error|TypeError|ReferenceError):/i.test(trimmed) ||
      /^org\.openqa\.selenium\.[A-Za-z]+Exception:/i.test(trimmed) ||
      /timed out/i.test(trimmed) ||
      /expected .* received/i.test(trimmed) ||
      /stale element/i.test(trimmed) ||
      /ECONNREFUSED/i.test(trimmed)
    ) {
      return trimmed;
    }
  }

  return "";
}

function extractStackTrace(lines: string[]): string {
  return lines
    .map((line) => line.trim())
    .filter((line) => isStackLine(line))
    .join("\n");
}

function matchSourceFile(value: string): string {
  const match = value.match(/(?:[\w./\\-]+)\.(?:ts|tsx|js|jsx|java|py|cs)(?::\d+(?::\d+)?)?/i);

  if (!match) {
    return "";
  }

  return match[0].replace(/:\d+(?::\d+)?$/, "");
}

function isMetadataLine(line: string): boolean {
  return /^(?:Test|Spec|Source|File|Request|Response status):/i.test(line);
}

function isStackLine(line: string): boolean {
  return /^at\s+/i.test(line) || /^Caused by:/i.test(line);
}
