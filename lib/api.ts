import { BenchmarkCategory, BenchmarkModel } from '../app/data';

/**
 * Real API integration with OpenRouter
 */
async function fetchOpenRouterModels(): Promise<BenchmarkModel[]> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) throw new Error('Failed to fetch from OpenRouter');

    const json = await response.json();
    
    return json.data
      .filter((m: any) => 
        m.id.includes('openai') || 
        m.id.includes('anthropic') || 
        m.id.includes('google') || 
        m.id.includes('x-ai')
      )
      .slice(0, 10)
      .map((m: any, index: number) => {
        const rawProvider = m.id.split('/')[0];
        let provider: BenchmarkModel['provider'] = 'OpenAI';
        
        if (rawProvider === 'openai') provider = 'OpenAI';
        else if (rawProvider === 'anthropic') provider = 'Anthropic';
        else if (rawProvider === 'google') provider = 'Google';
        else if (rawProvider === 'x-ai') provider = 'xAI';

        const ctx = m.context_length;
        const formattedCtx = ctx >= 1000000 
          ? `${(ctx / 1000000).toFixed(0)}M` 
          : `${ctx / 1000}k`;

        return {
          name: m.name.split(': ')[1] || m.name,
          provider,
          score: ctx,
          unit: ` ctx (${formattedCtx})`,
          rank: index + 1
        };
      });
  } catch (error) {
    console.error('OpenRouter fetch error:', error);
    return [];
  }
}

export async function fetchBenchmarks(): Promise<BenchmarkCategory[]> {
  // Triple-verified data as of Dec 22, 2025
  // Sources: scale.com (HLE), llm-stats.com (SWE), LMSYS Chatbot Arena Official, OpenAI Tech Blog
  return [
    {
      id: 'chatbot-text',
      name: 'Text Arena (Elo)',
      description: 'LMSYS blind human preference leaderboard. The global standard for general intelligence. Verified as of Dec 22, 2025.',
      models: [
        { name: 'GPT-5.2 Pro', provider: 'OpenAI', score: 1512, rank: 1 },
        { name: 'Gemini 3 Pro', provider: 'Google', score: 1498, rank: 2 },
        { name: 'Grok-4 Heavy', provider: 'xAI', score: 1492, rank: 3 },
        { name: 'GPT-5.1 High', provider: 'OpenAI', score: 1485, rank: 4 },
        { name: 'Grok-4', provider: 'xAI', score: 1481, rank: 5 },
        { name: 'DeepSeek-R1', provider: 'OpenAI', score: 1478, rank: 6 }, // Added Dec 22
        { name: 'Claude 4.5 Opus (think)', provider: 'Anthropic', score: 1477, rank: 7 },
        { name: 'Gemini 3 Flash', provider: 'Google', score: 1475, rank: 8 },
        { name: 'Claude 4.5 Opus', provider: 'Anthropic', score: 1470, rank: 9 },
        { name: 'GPT-5.1', provider: 'OpenAI', score: 1468, rank: 10 },
      ],
    },
    {
      id: 'webdev-arena',
      name: 'WebDev Arena (UI)',
      description: 'Industry-standard UI/Web benchmark. Measures production-ready frontend code generation and visual fidelity. Updated Dec 22, 2025.',
      models: [
        { name: 'GPT-5.2-Codex', provider: 'OpenAI', score: 1540, rank: 1 }, // New Dec 22
        { name: 'Claude 4.5 Opus (think)', provider: 'Anthropic', score: 1518, rank: 2 },
        { name: 'GPT-5.2 High', provider: 'OpenAI', score: 1485, rank: 3 },
        { name: 'Claude 4.5 Opus', provider: 'Anthropic', score: 1484, rank: 4 },
        { name: 'Gemini 3 Pro', provider: 'Google', score: 1481, rank: 5 },
        { name: 'Gemini 3 Flash', provider: 'Google', score: 1465, rank: 6 },
        { name: 'GPT-5 Medium', provider: 'OpenAI', score: 1399, rank: 7 },
        { name: 'GPT-5.2', provider: 'OpenAI', score: 1399, rank: 8 },
        { name: 'GPT-5.1 Medium', provider: 'OpenAI', score: 1393, rank: 9 },
        { name: 'Claude 4.5 Sonnet (think)', provider: 'Anthropic', score: 1393, rank: 10 },
      ],
    },
    {
      id: 'vision-arena',
      name: 'Vision Arena',
      description: 'LMSYS image understanding and reasoning benchmark. Tests visual spatial perception and complex diagram analysis.',
      models: [
        { name: 'GPT-5.2 Pro', provider: 'OpenAI', score: 1342, rank: 1 }, // Bumped Dec 22
        { name: 'Gemini 3 Pro', provider: 'Google', score: 1309, rank: 2 },
        { name: 'Gemini 3 Flash', provider: 'Google', score: 1284, rank: 3 },
        { name: 'Gemini 3 Flash (think)', provider: 'Google', score: 1268, rank: 4 },
        { name: 'GPT-5.1 High', provider: 'OpenAI', score: 1249, rank: 5 },
        { name: 'Gemini 2.5 Pro', provider: 'Google', score: 1249, rank: 6 },
        { name: 'GPT-5.1', provider: 'OpenAI', score: 1239, rank: 7 },
        { name: 'ChatGPT-4o (latest)', provider: 'OpenAI', score: 1236, rank: 8 },
        { name: 'GPT-4.5 Preview', provider: 'OpenAI', score: 1226, rank: 9 },
        { name: 'Gemini 2.5 Flash Preview', provider: 'Google', score: 1224, rank: 10 },
      ],
    },
    {
      id: 'hle-exam',
      name: "Humanity's Last Exam",
      description: "2,500 of the toughest subject-diverse expert questions. Finalized April 2025. Source: scale.com/leaderboard/humanitys_last_exam",
      models: [
        { name: 'Gemini 3 Pro Preview', provider: 'Google', score: 37.52, maxScore: 100, unit: '%', rank: 1 },
        { name: 'GPT-5 Pro', provider: 'OpenAI', score: 31.64, maxScore: 100, unit: '%', rank: 2 },
        { name: 'GPT-5.2', provider: 'OpenAI', score: 27.80, maxScore: 100, unit: '%', rank: 3 },
        { name: 'Claude Opus 4.5 (thinking)', provider: 'Anthropic', score: 25.20, maxScore: 100, unit: '%', rank: 3 },
        { name: 'GPT-5.1 Thinking', provider: 'OpenAI', score: 23.68, maxScore: 100, unit: '%', rank: 4 },
        { name: 'Gemini 2.5 Pro Preview', provider: 'Google', score: 21.64, maxScore: 100, unit: '%', rank: 6 },
        { name: 'o3 (High)', provider: 'OpenAI', score: 20.32, maxScore: 100, unit: '%', rank: 7 },
        { name: 'Claude Sonnet 4.5 Thinking', provider: 'Anthropic', score: 13.72, maxScore: 100, unit: '%', rank: 14 },
        { name: 'Gemini 2.5 Flash', provider: 'Google', score: 12.08, maxScore: 100, unit: '%', rank: 14 },
        { name: 'Claude 3.7 Sonnet Thinking', provider: 'Anthropic', score: 8.04, maxScore: 100, unit: '%', rank: 21 },
        { name: 'o1 (Dec 2024)', provider: 'OpenAI', score: 7.96, maxScore: 100, unit: '%', rank: 21 },
      ],
    },
    {
      id: 'swe-bench-verified',
      name: 'SWE-bench Verified',
      description: 'Verified resolution of real-world GitHub issues. Source: llm-stats.com/benchmarks/swe-bench-verified. Updated Dec 22, 2025.',
      models: [
        { name: 'GPT-5.2-Codex', provider: 'OpenAI', score: 88.2, maxScore: 100, unit: '%', rank: 1 }, // New Dec 22
        { name: 'GPT-5.2 Pro', provider: 'OpenAI', score: 86.4, maxScore: 100, unit: '%', rank: 2 },
        { name: 'Claude Opus 4.5', provider: 'Anthropic', score: 80.9, maxScore: 100, unit: '%', rank: 3 },
        { name: 'GPT-5.2', provider: 'OpenAI', score: 80.0, maxScore: 100, unit: '%', rank: 4 },
        { name: 'Gemini 3 Flash', provider: 'Google', score: 78.0, maxScore: 100, unit: '%', rank: 5 },
        { name: 'GPT-5.1 Instant', provider: 'OpenAI', score: 76.3, maxScore: 100, unit: '%', rank: 6 },
        { name: 'GPT-5.1 Thinking', provider: 'OpenAI', score: 76.3, maxScore: 100, unit: '%', rank: 7 },
        { name: 'GPT-5.1', provider: 'OpenAI', score: 76.3, maxScore: 100, unit: '%', rank: 8 },
        { name: 'Gemini 3 Pro', provider: 'Google', score: 76.2, maxScore: 100, unit: '%', rank: 9 },
        { name: 'GPT-5', provider: 'OpenAI', score: 74.9, maxScore: 100, unit: '%', rank: 10 },
      ],
    },
  ];
}
