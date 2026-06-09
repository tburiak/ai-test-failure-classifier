export type TestFramework = "cypress" | "playwright" | "selenium" | "api" | "unknown";

export interface ParsedLog {
  testName: string;
  framework: TestFramework;
  sourceFile: string;
  errorMessage: string;
  stackTrace: string;
  rawLog: string;
}
