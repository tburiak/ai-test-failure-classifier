import { describe, expect, it } from "vitest";
import { analyzeLogFile } from "../src/index.js";

describe("analyzeLogFile", () => {
  it("returns parsed metadata for a log path", async () => {
    const result = await analyzeLogFile("examples/cypress-locator-failure.log");

    expect(result.framework).toBe("cypress");
    expect(result.testName).toBe("Login form shows required email validation");
    expect(result.sourceFile).toBe("cypress/e2e/login.cy.ts");
    expect(result.errorMessage).toContain("Expected to find element");
    expect(result.stackTrace).toContain("cypress/e2e/login.cy.ts:18:8");
    expect(result.rawLog).toContain("CypressError");
  });
});
