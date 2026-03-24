export interface IGeminiProvider {
  generateQuizQuestion(): Promise<string>;
}
