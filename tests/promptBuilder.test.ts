import { describe, expect, it } from "vitest";
import { allowedFailureClassifications } from "../src/models.js";
import type { ParsedLog } from "../src/models.js";
import { buildAnalysisPrompt } from "../src/promptBuilder.js";

const parsedLog: ParsedLog = {
  testName: "Login form shows required email validation",
  framework: "cypress",
  sourceFile: "cypress/e2e/login.cy.ts",
  errorMessage: "CypressError: Expected to find element: [data-testid=email-error]",
  stackTrace: "at Context.eval (webpack://app/./cypress/e2e/login.cy.ts:18:8)",
  rawLog: "CypressError: Timed out retrying after 4000ms"
};

describe("buildAnalysisPrompt", () => {
  const prompt = buildAnalysisPrompt(parsedLog);

  it("includes all allowed classifications", () => {
    for (const classification of allowedFailureClassifications) {
      expect(prompt).toContain(classification);
    }
  });

  it("includes the parsed log fields", () => {
    expect(prompt).toContain("testName:");
    expect(prompt).toContain(parsedLog.testName);
    expect(prompt).toContain("framework:");
    expect(prompt).toContain(parsedLog.framework);
    expect(prompt).toContain("sourceFile:");
    expect(prompt).toContain(parsedLog.sourceFile);
    expect(prompt).toContain("errorMessage:");
    expect(prompt).toContain(parsedLog.errorMessage);
    expect(prompt).toContain("stackTrace:");
    expect(prompt).toContain(parsedLog.stackTrace);
    expect(prompt).toContain("rawLog:");
    expect(prompt).toContain(parsedLog.rawLog);
  });

  it("requires JSON-only output and forbids Markdown", () => {
    expect(prompt).toContain("Return valid JSON only");
    expect(prompt).toContain("Do not include Markdown");
    expect(prompt).toContain("code fences");
  });

  it("includes manual review guidance for uncertain cases", () => {
    expect(prompt).toContain("If the evidence is missing, conflicting, or uncertain");
    expect(prompt).toContain("unknown_needs_manual_review");
    expect(prompt).toContain("manualReviewRequired to true");
  });

  it("requires confidence between 0 and 1", () => {
    expect(prompt).toContain("confidence must be a number between 0 and 1 inclusive");
  });
});
