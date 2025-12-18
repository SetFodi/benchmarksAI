export interface BenchmarkModel {
  name: string;
  provider: 'OpenAI' | 'Anthropic' | 'Google' | 'xAI';
  score: number;
  maxScore?: number;
  unit?: string;
  rank?: number;
}

export interface BenchmarkCategory {
  id: string;
  name: string;
  description: string;
  models: BenchmarkModel[];
}
