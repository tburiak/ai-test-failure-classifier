export interface AnalyzeCliOptions {
  logFilePath: string;
  jsonReportPath?: string;
  markdownReportPath?: string;
}

export function parseAnalyzeArgs(args: string[]): AnalyzeCliOptions {
  const [logFilePath, ...flags] = args;

  if (!logFilePath) {
    throw new Error("Missing log file path.");
  }

  const options: AnalyzeCliOptions = { logFilePath };

  if (flags.length > 0 && flags.every((flag) => !flag.startsWith("--"))) {
    if (flags.length > 2) {
      throw new Error(`Unknown argument: ${flags[2]}`);
    }

    const [jsonReportPath, markdownReportPath] = flags;
    options.jsonReportPath = jsonReportPath;
    options.markdownReportPath = markdownReportPath;

    return options;
  }

  for (let index = 0; index < flags.length; index += 1) {
    const flag = flags[index];
    const value = flags[index + 1];

    if (flag !== "--json" && flag !== "--markdown") {
      throw new Error(`Unknown argument: ${flag}`);
    }

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${flag}.`);
    }

    if (flag === "--json") {
      options.jsonReportPath = value;
    } else {
      options.markdownReportPath = value;
    }

    index += 1;
  }

  return options;
}
