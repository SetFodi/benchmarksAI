export interface BenchmarkModel {
  name: string;
  provider: 'OpenAI' | 'Anthropic' | 'Google' | 'xAI';
  score: number;
  maxScore?: number;
  unit?: string;
  rank?: number;
  secondaryScore?: number; // e.g. Speed (tokens/sec)
  tertiaryScore?: number;  // e.g. Price ($/1M tokens)
  inputPrice?: number;     // $/1M tokens
  outputPrice?: number;    // $/1M tokens
}

export interface BenchmarkCategory {
  id: string;
  name: string;
  description: string;
  models: BenchmarkModel[];
}
