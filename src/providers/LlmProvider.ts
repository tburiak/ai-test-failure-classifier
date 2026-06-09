export interface LlmProvider {
  analyze(prompt: string): Promise<string>;
}
