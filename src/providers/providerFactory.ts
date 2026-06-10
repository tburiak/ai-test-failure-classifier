import type { LlmProvider } from "./LlmProvider.js";
import { MockLlmProvider } from "./MockLlmProvider.js";
import { OpenAiProvider } from "./OpenAiProvider.js";

export const llmProviderNames = ["mock", "openai"] as const;
export type LlmProviderName = (typeof llmProviderNames)[number];

const defaultLlmProviderName: LlmProviderName = "mock";

export function isLlmProviderName(value: string): value is LlmProviderName {
  return (llmProviderNames as readonly string[]).includes(value);
}

export function parseLlmProviderName(value: string | undefined): LlmProviderName {
  const normalizedValue = value?.trim().toLowerCase();
  const expectedProviders = llmProviderNames.map((name) => `"${name}"`).join(", ");

  let providerName: LlmProviderName = defaultLlmProviderName;

  if (normalizedValue) {
    if (!isLlmProviderName(normalizedValue)) {
      throw new Error(`Invalid provider: ${value}. Expected one of: ${expectedProviders}.`);
    }

    providerName = normalizedValue;
  }

  return providerName;
}

export function createLlmProvider(providerName: LlmProviderName): LlmProvider {
  switch (providerName) {
    case "mock":
      return new MockLlmProvider();
    case "openai":
      return new OpenAiProvider();
  }
}
