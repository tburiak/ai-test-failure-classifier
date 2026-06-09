import type { FailureAnalysisResult } from "../models.js";
import type { LlmProvider } from "./LlmProvider.js";

export class MockLlmProvider implements LlmProvider {
  async analyze(prompt: string): Promise<string> {
    return JSON.stringify(buildMockAnalysis(prompt));
  }
}

function buildMockAnalysis(prompt: string): FailureAnalysisResult {
  const normalizedPrompt = prompt.toLowerCase();

  if (
    normalizedPrompt.includes("cypresserror") &&
    normalizedPrompt.includes("expected to find element")
  ) {
    return {
      classification: "locator_ui_change",
      confidence: 0.86,
      reason: "The Cypress failure indicates a missing expected locator in the UI.",
      matchedSignals: ["CypressError", "Expected to find element"],
      recommendedAction: "Verify whether the locator changed or the UI no longer renders the expected element.",
      manualReviewRequired: false
    };
  }

  if (
    normalizedPrompt.includes("timeouterror") &&
    normalizedPrompt.includes("timed out")
  ) {
    return {
      classification: "timeout_performance_issue",
      confidence: 0.82,
      reason: "The failure is a timeout while waiting for an expected UI condition.",
      matchedSignals: ["TimeoutError", "timed out"],
      recommendedAction: "Investigate application response time and whether the wait condition is appropriate.",
      manualReviewRequired: false
    };
  }

  if (normalizedPrompt.includes("stale element reference")) {
    return {
      classification: "flaky_test",
      confidence: 0.78,
      reason: "The Selenium failure indicates a stale element reference, which often points to unstable DOM timing.",
      matchedSignals: ["stale element reference"],
      recommendedAction: "Refresh element lookup after DOM updates and review synchronization around the interaction.",
      manualReviewRequired: false
    };
  }

  if (
    normalizedPrompt.includes("expected response status") &&
    normalizedPrompt.includes("received 500")
  ) {
    return {
      classification: "assertion_mismatch",
      confidence: 0.8,
      reason: "The API test expected one response status but received a different status.",
      matchedSignals: ["expected response status", "received 500"],
      recommendedAction: "Inspect the API response and determine whether the expected status or backend behavior changed.",
      manualReviewRequired: false
    };
  }

  if (normalizedPrompt.includes("econnrefused")) {
    return {
      classification: "environment_issue",
      confidence: 0.88,
      reason: "The failure indicates a refused connection during test setup.",
      matchedSignals: ["ECONNREFUSED"],
      recommendedAction: "Check whether the required service is running and reachable in the CI environment.",
      manualReviewRequired: false
    };
  }

  return {
    classification: "unknown_needs_manual_review",
    confidence: 0.2,
    reason: "The available signals do not match a known deterministic mock pattern.",
    matchedSignals: [],
    recommendedAction: "Review the parsed log and raw failure output manually.",
    manualReviewRequired: true
  };
}
