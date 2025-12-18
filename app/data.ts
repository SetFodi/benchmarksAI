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

export const benchmarkData: BenchmarkCategory[] = [
  {
    id: 'swe-bench-verified',
    name: 'SWE-bench Verified',
    description: 'Evaluates AI models on real-world software issues sourced from GitHub. Higher is better.',
    models: [
      { name: 'Claude Opus 4.5', provider: 'Anthropic', score: 80.9, maxScore: 100, unit: '%', rank: 1 },
      { name: 'Claude Sonnet 4.5', provider: 'Anthropic', score: 77.2, maxScore: 100, unit: '%', rank: 2 },
      { name: 'GPT-5.1 Codex Max', provider: 'OpenAI', score: 77.9, maxScore: 100, unit: '%', rank: 3 },
      { name: 'GPT-5.1', provider: 'OpenAI', score: 76.3, maxScore: 100, unit: '%', rank: 4 },
      { name: 'Gemini 3 Pro', provider: 'Google', score: 76.2, maxScore: 100, unit: '%', rank: 5 },
      { name: 'Grok 4', provider: 'xAI', score: 72.6, maxScore: 100, unit: '%', rank: 6 },
    ],
  },
  {
    id: 'chatbot-arena',
    name: 'Chatbot Arena (Elo)',
    description: 'Crowdsourced battle platform for LLMs. Higher Elo is better.',
    models: [
      { name: 'Gemini-3-Pro', provider: 'Google', score: 1492, rank: 1 },
      { name: 'Grok-4.1-Thinking', provider: 'xAI', score: 1482, rank: 2 },
      { name: 'Gemini-3-Flash', provider: 'Google', score: 1470, rank: 3 },
      { name: 'Claude Opus 4.5', provider: 'Anthropic', score: 1466, rank: 4 },
      { name: 'GPT-5.2-high', provider: 'OpenAI', score: 1465, rank: 5 },
      { name: 'GPT-5.1-high', provider: 'OpenAI', score: 1464, rank: 6 },
    ],
  },
  {
    id: 'aime-2025',
    name: 'AIME 2025',
    description: 'Mathematical proficiency test (American Invitational Mathematics Examination). Higher is better.',
    models: [
      { name: 'GPT-5.1', provider: 'OpenAI', score: 94, maxScore: 100, unit: '%', rank: 1 },
      { name: 'Gemini 3 Pro', provider: 'Google', score: 92.5, maxScore: 100, unit: '%', rank: 2 },
      { name: 'Claude Opus 4.5', provider: 'Anthropic', score: 91.8, maxScore: 100, unit: '%', rank: 3 },
      { name: 'Grok 4', provider: 'xAI', score: 88.4, maxScore: 100, unit: '%', rank: 4 },
    ],
  },
  {
    id: 'livecodebench',
    name: 'LiveCodeBench',
    description: 'Coding competition problems from LeetCode, Codeforces, and AtCoder. Higher is better.',
    models: [
      { name: 'GPT-5.2', provider: 'OpenAI', score: 82.4, maxScore: 100, unit: '%', rank: 1 },
      { name: 'Claude Opus 4.5', provider: 'Anthropic', score: 81.6, maxScore: 100, unit: '%', rank: 2 },
      { name: 'Gemini 3 Pro', provider: 'Google', score: 79.2, maxScore: 100, unit: '%', rank: 3 },
      { name: 'Grok 4', provider: 'xAI', score: 75.8, maxScore: 100, unit: '%', rank: 4 },
    ],
  },
];

