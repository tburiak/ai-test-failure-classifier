import { describe, expect, it } from "vitest";
import { MockLlmProvider } from "../src/providers/MockLlmProvider.js";
import { missingOpenAiApiKeyMessage } from "../src/providers/OpenAiProvider.js";
import {
  createLlmProvider,
  parseLlmProviderName
} from "../src/providers/providerFactory.js";

describe("provider selection", () => {
  it("defaults provider selection to mock", () => {
    expect(parseLlmProviderName(undefined)).toBe("mock");
  });

  it("accepts openai as a provider selection", () => {
    expect(parseLlmProviderName("openai")).toBe("openai");
  });

  it("creates the mock provider without requiring OpenAI configuration", () => {
    expect(createLlmProvider("mock")).toBeInstanceOf(MockLlmProvider);
  });

  it("fails clearly when OpenAI is selected without OPENAI_API_KEY", () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    try {
      expect(() => createLlmProvider("openai")).toThrow(missingOpenAiApiKeyMessage);
    } finally {
      if (originalApiKey === undefined) {
        delete process.env.OPENAI_API_KEY;
      } else {
        process.env.OPENAI_API_KEY = originalApiKey;
      }
    }
  });

  it("fails clearly for an invalid provider value", () => {
    
    expect(() => parseLlmProviderName("local")).toThrow(
      'Invalid provider: local. Expected one of: "mock", "openai".'
    );
  });
});
