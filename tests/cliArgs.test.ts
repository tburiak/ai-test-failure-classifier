import { describe, expect, it } from "vitest";
import { parseAnalyzeArgs } from "../src/cliArgs.js";

describe("parseAnalyzeArgs", () => {
  it("parses a log file path without report flags", () => {
    expect(parseAnalyzeArgs(["examples/sample.log"])).toEqual({
      logFilePath: "examples/sample.log"
    });
  });

  it("parses JSON and Markdown report flags", () => {
    expect(
      parseAnalyzeArgs([
        "examples/cypress-locator-failure.log",
        "--json",
        "output/result.json",
        "--markdown",
        "output/report.md"
      ])
    ).toEqual({
      logFilePath: "examples/cypress-locator-failure.log",
      jsonReportPath: "output/result.json",
      markdownReportPath: "output/report.md"
    });
  });

  it("parses npm-stripped report flag values in JSON then Markdown order", () => {
    expect(
      parseAnalyzeArgs([
        "examples/cypress-locator-failure.log",
        "output/result.json",
        "output/report.md"
      ])
    ).toEqual({
      logFilePath: "examples/cypress-locator-failure.log",
      jsonReportPath: "output/result.json",
      markdownReportPath: "output/report.md"
    });
  });

  it("throws a clear error when a flag value is missing", () => {
    expect(() => parseAnalyzeArgs(["examples/sample.log", "--json"])).toThrow(
      "Missing value for --json."
    );
  });
});
