import { describe, expect, it } from "vitest";
import {
  defaultOpenAiModel,
  missingOpenAiApiKeyMessage,
  OpenAiProvider
} from "../src/providers/OpenAiProvider.js";

describe("OpenAiProvider", () => {
  it("requires an API key before making OpenAI available", () => {
    expect(() => new OpenAiProvider({ apiKey: "" })).toThrow(
      missingOpenAiApiKeyMessage
    );
  });

  it("exposes the configured default model", () => {
    expect(defaultOpenAiModel).toBe("gpt-4o-mini");
  });
});
