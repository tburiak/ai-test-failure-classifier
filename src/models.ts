export type TestFramework = "cypress" | "playwright" | "selenium" | "api" | "unknown";

export const allowedFailureClassifications = [
  "product_bug",
  "flaky_test",
  "environment_issue",
  "locator_ui_change",
  "test_data_issue",
  "timeout_performance_issue",
  "assertion_mismatch",
  "unknown_needs_manual_review"
] as const;

export type FailureClassification = (typeof allowedFailureClassifications)[number];

export interface ParsedLog {
  testName: string;
  framework: TestFramework;
  sourceFile: string;
  errorMessage: string;
  stackTrace: string;
  rawLog: string;
}

export interface FailureAnalysisResult {
  classification: FailureClassification;
  confidence: number;
  reason: string;
  matchedSignals: string[];
  recommendedAction: string;
  manualReviewRequired: boolean;
}
