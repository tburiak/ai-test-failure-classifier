import {
  isLlmProviderName,
  parseLlmProviderName
} from "./providers/providerFactory.js";
import type { LlmProviderName } from "./providers/providerFactory.js";

export interface AnalyzeCliOptions {
  logFilePath: string;
  provider: LlmProviderName;
  jsonReportPath?: string;
  markdownReportPath?: string;
}

export function parseAnalyzeArgs(
  args: string[],
  envProvider = process.env.npm_config_provider
): AnalyzeCliOptions {
  const [logFilePath, ...flags] = args;

  if (!logFilePath) {
    throw new Error("Missing log file path.");
  }

  const envProviderValue = normalizeNpmConfigProviderValue(envProvider);
  const hasNpmBooleanProviderFlag = isNpmBooleanProviderFlag(envProvider);

  const options: AnalyzeCliOptions = {
    logFilePath,
    provider: parseLlmProviderName(envProviderValue)
  };

  const remainingFlags = [...flags];
  const firstValue = remainingFlags[0];

  if (
    firstValue &&
    isLlmProviderName(firstValue.toLowerCase()) &&
    (!envProviderValue || firstValue.toLowerCase() === envProviderValue.toLowerCase())
  ) {
    options.provider = parseLlmProviderName(firstValue);
    remainingFlags.shift();
  } else if (hasNpmBooleanProviderFlag && firstValue && !firstValue.startsWith("--")) {
    throw new Error(`Invalid provider: ${firstValue}. Expected "mock" or "openai".`);
  } else if (hasNpmBooleanProviderFlag && !firstValue) {
    throw new Error("Missing value for --provider.");
  }

  if (remainingFlags.length > 0 && remainingFlags.every((flag) => !flag.startsWith("--"))) {
    const positionalValues = [...remainingFlags];

    if (positionalValues.length > 2) {
      throw new Error(`Unknown argument: ${positionalValues[2]}`);
    }

    const [jsonReportPath, markdownReportPath] = positionalValues;
    options.jsonReportPath = jsonReportPath;
    options.markdownReportPath = markdownReportPath;

    return options;
  }

  for (let index = 0; index < remainingFlags.length; index += 1) {
    const flag = remainingFlags[index];
    const value = remainingFlags[index + 1];

    if (flag !== "--json" && flag !== "--markdown" && flag !== "--provider") {
      throw new Error(`Unknown argument: ${flag}`);
    }

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${flag}.`);
    }

    if (flag === "--json") {
      options.jsonReportPath = value;
    } else if (flag === "--markdown") {
      options.markdownReportPath = value;
    } else {
      options.provider = parseLlmProviderName(value);
    }

    index += 1;
  }

  return options;
}

function normalizeNpmConfigProviderValue(value: string | undefined): string | undefined {
  const normalizedValue = value?.trim().toLowerCase();

  if (!normalizedValue || normalizedValue === "true" || normalizedValue === "false") {
    return undefined;
  }

  return value;
}

function isNpmBooleanProviderFlag(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "true";
}
