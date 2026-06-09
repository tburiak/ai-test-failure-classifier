import { describe, expect, it } from "vitest";
import { analyzeParsedLog } from "../src/analyzer.js";
import { formatFailureAnalysisSummary } from "../src/cliOutput.js";
import { parseLogFile } from "../src/logParser.js";
import type { FailureAnalysisResult, ParsedLog } from "../src/models.js";
import { MockLlmProvider } from "../src/providers/MockLlmProvider.js";

const parsedLog: ParsedLog = {
  testName: "Example test",
  framework: "cypress",
  sourceFile: "cypress/e2e/example.cy.ts",
  errorMessage: "CypressError: Expected to find element",
  stackTrace: "at Context.eval (cypress/e2e/example.cy.ts:12:3)",
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

describe("formatFailureAnalysisSummary", () => {
  it("includes parsed metadata and analysis fields", () => {
    const output = formatFailureAnalysisSummary(parsedLog, analysis);

    expect(output).toContain("Failure analysis summary");
    expect(output).toContain("Test name: Example test");
    expect(output).toContain("Framework: cypress");
    expect(output).toContain("Source file: cypress/e2e/example.cy.ts");
    expect(output).toContain("Classification: locator_ui_change");
    expect(output).toContain("Confidence: 0.86");
    expect(output).toContain("Manual review required: false");
    expect(output).toContain("Reason: The Cypress failure indicates a missing expected locator in the UI.");
    expect(output).toContain("Recommended action: Verify whether the locator changed.");
  });

  it("renders multiple matched signals clearly", () => {
    const output = formatFailureAnalysisSummary(parsedLog, analysis);

    expect(output).toContain("Matched signals:\n- CypressError\n- Expected to find element");
  });

  it("formats the Cypress mock analysis as locator_ui_change", async () => {
    const cypressLog = await parseLogFile("examples/cypress-locator-failure.log");
    const cypressAnalysis = await analyzeParsedLog(cypressLog, new MockLlmProvider());

    const output = formatFailureAnalysisSummary(cypressLog, cypressAnalysis);

    expect(output).toContain("Classification: locator_ui_change");
    expect(output).toContain("Test name: Login form shows required email validation");
  });
});
