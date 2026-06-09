import { describe, expect, it } from "vitest";
import { parseLogFile } from "../src/logParser.js";
import type { TestFramework } from "../src/models.js";

interface ParserCase {
  filePath: string;
  framework: TestFramework;
  testName: string;
  sourceFile: string;
  errorMessageIncludes: string;
  stackTraceIncludes: string;
}

const parserCases: ParserCase[] = [
  {
    filePath: "examples/cypress-locator-failure.log",
    framework: "cypress",
    testName: "Login form shows required email validation",
    sourceFile: "cypress/e2e/login.cy.ts",
    errorMessageIncludes: "Expected to find element",
    stackTraceIncludes: "cypress/e2e/login.cy.ts:18:8"
  },
  {
    filePath: "examples/playwright-timeout-failure.log",
    framework: "playwright",
    testName: "Search results load after submitting query",
    sourceFile: "tests/search.spec.ts",
    errorMessageIncludes: "timed out after 5000ms",
    stackTraceIncludes: "tests/search.spec.ts:22:42"
  },
  {
    filePath: "examples/selenium-stale-element.log",
    framework: "selenium",
    testName: "CheckoutTest.addsItemToCart",
    sourceFile: "src/test/java/example/CheckoutTest.java",
    errorMessageIncludes: "stale element reference",
    stackTraceIncludes: "CheckoutTest.java:47"
  },
  {
    filePath: "examples/api-assertion-failure.log",
    framework: "api",
    testName: "Creates order through POST /orders",
    sourceFile: "tests/api/orders.spec.ts",
    errorMessageIncludes: "expected response status 201 but received 500",
    stackTraceIncludes: "tests/api/orders.spec.ts:31:12"
  },
  {
    filePath: "examples/environment-issue.log",
    framework: "unknown",
    testName: "Global setup starts test database",
    sourceFile: "tests/setup/globalSetup.ts",
    errorMessageIncludes: "ECONNREFUSED",
    stackTraceIncludes: "node:net"
  }
];

describe("parseLogFile", () => {
  it.each(parserCases)("parses $filePath", async (parserCase) => {
    const result = await parseLogFile(parserCase.filePath);

    expect(result.framework).toBe(parserCase.framework);
    expect(result.testName).toBe(parserCase.testName);
    expect(result.sourceFile).toBe(parserCase.sourceFile);
    expect(result.errorMessage).toContain(parserCase.errorMessageIncludes);
    expect(result.stackTrace).toContain(parserCase.stackTraceIncludes);
    expect(result.rawLog).toContain(parserCase.testName);
  });
});
