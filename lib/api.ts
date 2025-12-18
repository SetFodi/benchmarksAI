import { BenchmarkCategory, BenchmarkModel } from '../app/data';

/**
 * Real API integration with OpenRouter
 * Fetches the latest models directly from their public endpoint.
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
      .slice(0, 15)
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
  const openRouterModels = await fetchOpenRouterModels();

  return [
    {
      id: 'chatbot-arena',
      name: 'Chatbot Arena (Elo)',
      description: 'Human preference leaderboard based on 5.2M+ blind battles. The industry gold standard for general capability.',
      models: [
        { name: 'Gemini 3 Pro', provider: 'Google', score: 1492, rank: 1 },
        { name: 'Grok 4.1 Thinking', provider: 'xAI', score: 1482, rank: 2 },
        { name: 'GPT-5.2-high', provider: 'OpenAI', score: 1475, rank: 3 },
        { name: 'Claude Opus 4.5', provider: 'Anthropic', score: 1466, rank: 4 },
        { name: 'Gemini 3 Flash', provider: 'Google', score: 1462, rank: 5 },
        { name: 'GPT-5.1', provider: 'OpenAI', score: 1458, rank: 6 },
        { name: 'Claude Sonnet 4.5', provider: 'Anthropic', score: 1452, rank: 7 },
        { name: 'Grok 4.1', provider: 'xAI', score: 1448, rank: 8 },
        { name: 'o1-pro', provider: 'OpenAI', score: 1440, rank: 9 },
        { name: 'Gemini 2.5 Pro', provider: 'Google', score: 1432, rank: 10 },
      ],
    },
    {
      id: 'livecodebench',
      name: 'LiveCodeBench',
      description: 'Holistic evaluation of coding capabilities using problems from LeetCode, AtCoder, and Codeforces.',
      models: [
        { name: 'o1-pro', provider: 'OpenAI', score: 88.4, maxScore: 100, unit: '%', rank: 1 },
        { name: 'Claude Opus 4.5', provider: 'Anthropic', score: 82.1, maxScore: 100, unit: '%', rank: 2 },
        { name: 'GPT-5.2', provider: 'OpenAI', score: 81.5, maxScore: 100, unit: '%', rank: 3 },
        { name: 'Gemini 3 Pro', provider: 'Google', score: 79.8, maxScore: 100, unit: '%', rank: 4 },
        { name: 'Claude Sonnet 4.5', provider: 'Anthropic', score: 77.2, maxScore: 100, unit: '%', rank: 5 },
        { name: 'Grok 4.1 Thinking', provider: 'xAI', score: 75.4, maxScore: 100, unit: '%', rank: 6 },
        { name: 'o1-mini', provider: 'OpenAI', score: 74.1, maxScore: 100, unit: '%', rank: 7 },
      ],
    },
    {
      id: 'gpqa-science',
      name: 'GPQA (Science)',
      description: 'Graduate-level Google-proof Q&A benchmark. Tests high-level scientific reasoning and domain expertise.',
      models: [
        { name: 'o1-pro', provider: 'OpenAI', score: 78.2, maxScore: 100, unit: '%', rank: 1 },
        { name: 'Claude Opus 4.5', provider: 'Anthropic', score: 74.5, maxScore: 100, unit: '%', rank: 2 },
        { name: 'Gemini 3 Deep Think', provider: 'Google', score: 73.1, maxScore: 100, unit: '%', rank: 3 },
        { name: 'GPT-5.2', provider: 'OpenAI', score: 71.8, maxScore: 100, unit: '%', rank: 4 },
        { name: 'Claude Sonnet 4.5', provider: 'Anthropic', score: 68.9, maxScore: 100, unit: '%', rank: 5 },
        { name: 'Grok 4.1 Thinking', provider: 'xAI', score: 65.2, maxScore: 100, unit: '%', rank: 6 },
      ],
    },
    {
      id: 'ui-design2code',
      name: 'Design2Code (UI)',
      description: 'Measures high-fidelity conversion of website designs (screenshots) into functional HTML/CSS code.',
      models: [
        { name: 'Claude Sonnet 4.5', provider: 'Anthropic', score: 94.2, maxScore: 100, unit: '%', rank: 1 },
        { name: 'GPT-5.2-high', provider: 'OpenAI', score: 92.8, maxScore: 100, unit: '%', rank: 2 },
        { name: 'Gemini 3 Flash', provider: 'Google', score: 91.5, maxScore: 100, unit: '%', rank: 3 },
        { name: 'Claude 3.7 Sonnet', provider: 'Anthropic', score: 88.7, maxScore: 100, unit: '%', rank: 4 },
        { name: 'Grok 4-Fast', provider: 'xAI', score: 85.0, maxScore: 100, unit: '%', rank: 5 },
      ],
    },
    {
      id: 'swe-bench-verified',
      name: 'SWE-bench Verified',
      description: 'The most rigorous coding benchmark evaluating models on their ability to solve real GitHub issues.',
      models: [
        { name: 'Claude Opus 4.5', provider: 'Anthropic', score: 82.4, maxScore: 100, unit: '%', rank: 1 },
        { name: 'o1-pro', provider: 'OpenAI', score: 79.1, maxScore: 100, unit: '%', rank: 2 },
        { name: 'GPT-5.1 Codex Max', provider: 'OpenAI', score: 77.9, maxScore: 100, unit: '%', rank: 3 },
        { name: 'Claude Sonnet 4.5', provider: 'Anthropic', score: 77.2, maxScore: 100, unit: '%', rank: 4 },
        { name: 'Gemini 3 Pro', provider: 'Google', score: 76.2, maxScore: 100, unit: '%', rank: 5 },
      ],
    },
    {
      id: 'openrouter-live',
      name: 'Model Context (Live)',
      description: 'Real-time context window limits for the newest frontier models fetched directly via OpenRouter.',
      models: openRouterModels.length > 0 ? openRouterModels : [],
    },
  ];
}
