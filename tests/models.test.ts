import { describe, expect, it } from "vitest";
import { allowedFailureClassifications } from "../src/models.js";
import type { FailureAnalysisResult } from "../src/models.js";

describe("failure analysis model definitions", () => {
  it("defines the exact allowed failure classifications", () => {
    expect(allowedFailureClassifications).toEqual([
      "product_bug",
      "flaky_test",
      "environment_issue",
      "locator_ui_change",
      "test_data_issue",
      "timeout_performance_issue",
      "assertion_mismatch",
      "unknown_needs_manual_review"
    ]);
  });

  it("does not include duplicate classifications", () => {
    const uniqueClassifications = new Set(allowedFailureClassifications);

    expect(uniqueClassifications.size).toBe(allowedFailureClassifications.length);
  });

  it("supports the structured analysis result shape", () => {
    const result: FailureAnalysisResult = {
      classification: "unknown_needs_manual_review",
      confidence: 0.2,
      reason: "Evidence is insufficient for a specific classification.",
      matchedSignals: [],
      recommendedAction: "Review the failure manually.",
      manualReviewRequired: true
    };

    expect(result.manualReviewRequired).toBe(true);
  });
});
