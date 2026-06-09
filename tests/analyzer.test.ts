import { describe, expect, it } from "vitest";
import { analyzeParsedLog } from "../src/analyzer.js";
import { parseLogFile } from "../src/logParser.js";
import type { FailureAnalysisResult, ParsedLog } from "../src/models.js";
import { MockLlmProvider } from "../src/providers/MockLlmProvider.js";
import type { LlmProvider } from "../src/providers/LlmProvider.js";

class InvalidJsonProvider implements LlmProvider {
  async analyze(): Promise<string> {
    return "not valid json";
  }
}

class CapturingProvider implements LlmProvider {
  prompt = "";

  async analyze(prompt: string): Promise<string> {
    this.prompt = prompt;

    return JSON.stringify({
      classification: "unknown_needs_manual_review",
      confidence: 0.3,
      reason: "Captured prompt for test verification.",
      matchedSignals: ["captured prompt"],
      recommendedAction: "Review captured prompt.",
      manualReviewRequired: true
    } satisfies FailureAnalysisResult);
  }
}

function expectFailureAnalysisResultShape(result: FailureAnalysisResult): void {
  expect(typeof result.classification).toBe("string");
  expect(typeof result.confidence).toBe("number");
  expect(typeof result.reason).toBe("string");
  expect(Array.isArray(result.matchedSignals)).toBe(true);
  expect(result.matchedSignals.every((signal) => typeof signal === "string")).toBe(true);
  expect(typeof result.recommendedAction).toBe("string");
  expect(typeof result.manualReviewRequired).toBe("boolean");
}

describe("analyzeParsedLog", () => {
  it("returns successful mock analysis for a Cypress locator sample", async () => {
    const parsedLog = await parseLogFile("examples/cypress-locator-failure.log");
    const result = await analyzeParsedLog(parsedLog, new MockLlmProvider());

    expect(result.classification).toBe("locator_ui_change");
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.manualReviewRequired).toBe(false);
    expect(result.matchedSignals).toContain("Expected to find element");
    expectFailureAnalysisResultShape(result);
  });

  it("returns the generic fallback when provider output is invalid JSON", async () => {
    const parsedLog = await parseLogFile("examples/cypress-locator-failure.log");
    const result = await analyzeParsedLog(parsedLog, new InvalidJsonProvider());

    expect(result).toEqual({
      classification: "unknown_needs_manual_review",
      confidence: 0.1,
      reason: "The LLM provider response could not be parsed into a valid analysis result.",
      matchedSignals: [],
      recommendedAction: "Review the failure manually and inspect the provider output.",
      manualReviewRequired: true
    });
  });

  it("passes a prompt built from parsed log fields to the provider", async () => {
    const parsedLog: ParsedLog = {
      testName: "Prompt builder flow test",
      framework: "playwright",
      sourceFile: "tests/prompt-flow.spec.ts",
      errorMessage: "TimeoutError: locator timed out",
      stackTrace: "at tests/prompt-flow.spec.ts:10:5",
      rawLog: "TimeoutError: locator timed out"
    };
    const provider = new CapturingProvider();

    await analyzeParsedLog(parsedLog, provider);

    expect(provider.prompt).toContain("You are an expert SDET");
    expect(provider.prompt).toContain("Return valid JSON only");
    expect(provider.prompt).toContain("testName: Prompt builder flow test");
    expect(provider.prompt).toContain("framework: playwright");
    expect(provider.prompt).toContain("sourceFile: tests/prompt-flow.spec.ts");
    expect(provider.prompt).toContain("TimeoutError: locator timed out");
  });

  it("returns an object with the FailureAnalysisResult runtime shape", async () => {
    const parsedLog = await parseLogFile("examples/environment-issue.log");
    const result = await analyzeParsedLog(parsedLog, new MockLlmProvider());

    expectFailureAnalysisResultShape(result);
  });
});
