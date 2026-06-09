import { describe, expect, it } from "vitest";
import { buildJsonReport, buildMarkdownReport } from "../src/reportGenerator.js";
import type { FailureAnalysisResult, ParsedLog } from "../src/models.js";

const parsedLog: ParsedLog = {
  testName: "Login form shows required email validation",
  framework: "cypress",
  sourceFile: "cypress/e2e/login.cy.ts",
  errorMessage: "CypressError: Expected to find element",
  stackTrace: "at Context.eval (cypress/e2e/login.cy.ts:18:8)",
  rawLog: "CypressError: Expected to find element"
};

const analysis: FailureAnalysisResult = {
  classification: "locator_ui_change",
  confidence: 0.86,
  reason: "The Cypress failure indicates a missing expected locator in the UI.",
  matchedSignals: ["CypressError", "Expected to find element"],
  recommendedAction: "Verify whether the locator changed.",
  manualReviewRequired: false
};

describe("buildJsonReport", () => {
  it("builds valid JSON with metadata, parsed log, and analysis", () => {
    const report = JSON.parse(buildJsonReport(parsedLog, analysis));

    expect(report.tool).toEqual({
      name: "ai-test-failure-classifier",
      version: "0.1.0"
    });
    expect(Date.parse(report.generatedAt)).not.toBeNaN();
    expect(report.parsedLog).toEqual(parsedLog);
    expect(report.analysis).toEqual(analysis);
  });
});

describe("buildMarkdownReport", () => {
  it("builds Markdown content with summary, metadata, and analysis details", () => {
    const report = buildMarkdownReport(parsedLog, analysis);

    expect(report).toContain("# Test Failure Analysis Report");
    expect(report).toContain("| Field | Value |");
    expect(report).toContain("| Test name | Login form shows required email validation |");
    expect(report).toContain("| Framework | cypress |");
    expect(report).toContain("| Source file | cypress/e2e/login.cy.ts |");
    expect(report).toContain("| Classification | locator_ui_change |");
    expect(report).toContain("| Confidence | 0.86 |");
    expect(report).toContain("| Manual review required | false |");
    expect(report).toContain("## Parsed Log Metadata");
    expect(report).toContain("- Error message: CypressError: Expected to find element");
    expect(report).toContain("## Reason");
    expect(report).toContain("The Cypress failure indicates a missing expected locator in the UI.");
    expect(report).toContain("## Matched Signals");
    expect(report).toContain("- CypressError\n- Expected to find element");
    expect(report).toContain("## Recommended Action");
    expect(report).toContain("Verify whether the locator changed.");
  });
});
