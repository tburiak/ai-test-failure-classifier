import { describe, expect, it } from "vitest";
import { parseAnalyzeArgs } from "../src/cliArgs.js";

describe("parseAnalyzeArgs", () => {
  it("parses a log file path without report flags", () => {
    expect(parseAnalyzeArgs(["examples/sample.log"])).toEqual({
      logFilePath: "examples/sample.log",
      provider: "mock"
    });
  });

  it("parses an OpenAI provider flag", () => {
    expect(
      parseAnalyzeArgs([
        "examples/cypress-locator-failure.log",
        "--provider",
        "openai"
      ])
    ).toEqual({
      logFilePath: "examples/cypress-locator-failure.log",
      provider: "openai"
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
      provider: "mock",
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
      provider: "mock",
      jsonReportPath: "output/result.json",
      markdownReportPath: "output/report.md"
    });
  });

  it("parses an npm-config provider value", () => {
    expect(parseAnalyzeArgs(["examples/sample.log"], "openai")).toEqual({
      logFilePath: "examples/sample.log",
      provider: "openai"
    });
  });

  it("parses npm-stripped provider flag values", () => {
    expect(
      parseAnalyzeArgs(["examples/sample.log", "openai"], "true")
    ).toEqual({
      logFilePath: "examples/sample.log",
      provider: "openai"
    });
  });

  it("parses npm-stripped provider values before preserved report flags", () => {
    expect(
      parseAnalyzeArgs([
        "examples/cypress-locator-failure.log",
        "openai",
        "--json",
        "output/result.json",
        "--markdown",
        "output/report.md"
      ], "true")
    ).toEqual({
      logFilePath: "examples/cypress-locator-failure.log",
      provider: "openai",
      jsonReportPath: "output/result.json",
      markdownReportPath: "output/report.md"
    });
  });

  it("throws a clear error for an invalid provider value", () => {
    expect(() =>
      parseAnalyzeArgs(["examples/sample.log", "--provider", "local"])
    ).toThrow('Invalid provider: local. Expected one of: "mock", "openai".');
  });

  it("throws a clear error for an npm-stripped invalid provider value", () => {
    expect(() =>
      parseAnalyzeArgs(["examples/sample.log", "local"], "true")
    ).toThrow('Invalid provider: local. Expected "mock" or "openai".');
  });

  it("throws a clear error when a flag value is missing", () => {
    expect(() => parseAnalyzeArgs(["examples/sample.log", "--json"])).toThrow(
      "Missing value for --json."
    );
  });

  it("throws a clear error when the provider flag value is missing", () => {
    expect(() => parseAnalyzeArgs(["examples/sample.log", "--provider"])).toThrow(
      "Missing value for --provider."
    );
  });
});
