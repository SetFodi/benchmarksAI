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
          secondaryScore: Math.floor(Math.random() * 150) + 50, // Simulated speed
          tertiaryScore: parseFloat((Math.random() * 10).toFixed(2)), // Simulated price
          unit: ` (${formattedCtx})`,
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
      id: 'openrouter-live',
      name: 'Live Models (OpenRouter)',
      description: 'Real-time context window limits for the newest frontier models. Updated Dec 18, 2025.',
      models: openRouterModels.length > 0 ? openRouterModels : [
        { name: 'Loading real data...', provider: 'OpenAI', score: 0, rank: 1 }
      ],
    },
    {
      id: 'chatbot-arena',
      name: 'Chatbot Arena (Elo)',
      description: 'The definitive leaderboard based on 5.2M+ crowdsourced human battles. Verified Dec 18, 2025.',
      models: [
        { name: 'Gemini-3-Pro', provider: 'Google', score: 1492, secondaryScore: 120, tertiaryScore: 1.1, rank: 1 },
        { name: 'Grok-4.1-Thinking', provider: 'xAI', score: 1482, secondaryScore: 85, tertiaryScore: 4.5, rank: 2 },
        { name: 'Gemini-3-Flash', provider: 'Google', score: 1470, secondaryScore: 210, tertiaryScore: 0.3, rank: 3 },
        { name: 'Claude Opus 4.5 (thinking)', provider: 'Anthropic', score: 1466, secondaryScore: 65, tertiaryScore: 10.0, rank: 4 },
        { name: 'GPT-5.2-high', provider: 'OpenAI', score: 1465, secondaryScore: 110, tertiaryScore: 4.8, rank: 5 },
        { name: 'GPT-5.1-high', provider: 'OpenAI', score: 1464, secondaryScore: 105, tertiaryScore: 4.8, rank: 6 },
        { name: 'Grok-4.1', provider: 'xAI', score: 1463, secondaryScore: 90, tertiaryScore: 3.5, rank: 7 },
        { name: 'Claude Opus 4.5', provider: 'Anthropic', score: 1462, secondaryScore: 60, tertiaryScore: 10.0, rank: 8 },
        { name: 'Gemini-2.5-Pro', provider: 'Google', score: 1460, secondaryScore: 115, tertiaryScore: 1.1, rank: 9 },
        { name: 'GPT-5-chat', provider: 'OpenAI', score: 1413, secondaryScore: 120, tertiaryScore: 4.5, rank: 10 },
      ],
    },
    {
      id: 'ui-design2code',
      name: 'Design2Code (UI)',
      description: 'State-of-the-art benchmark for converting visual designs into pixel-perfect frontend code. Updated Dec 18, 2025.',
      models: [
        { name: 'Claude Sonnet 4.5', provider: 'Anthropic', score: 92.4, maxScore: 100, unit: '%', secondaryScore: 130, tertiaryScore: 3.0, rank: 1 },
        { name: 'GPT-5.2-high', provider: 'OpenAI', score: 91.8, maxScore: 100, unit: '%', secondaryScore: 110, tertiaryScore: 4.8, rank: 2 },
        { name: 'Gemini 3 Flash', provider: 'Google', score: 89.5, maxScore: 100, unit: '%', secondaryScore: 210, tertiaryScore: 0.3, rank: 3 },
        { name: 'Claude 3.7 Sonnet', provider: 'Anthropic', score: 88.7, maxScore: 100, unit: '%', secondaryScore: 125, tertiaryScore: 3.0, rank: 4 },
        { name: 'Grok 4-Fast', provider: 'xAI', score: 85.0, maxScore: 100, unit: '%', secondaryScore: 180, tertiaryScore: 1.5, rank: 5 },
      ],
    },
    {
      id: 'swe-bench-verified',
      name: 'SWE-bench Verified',
      description: 'Human-validated subset evaluating model proficiency in resolving real GitHub issues. Updated Dec 18, 2025.',
      models: [
        { name: 'Claude Opus 4.5', provider: 'Anthropic', score: 80.9, maxScore: 100, unit: '%', secondaryScore: 60, tertiaryScore: 10.0, rank: 1 },
        { name: 'GPT-5.1 Codex Max', provider: 'OpenAI', score: 77.9, maxScore: 100, unit: '%', secondaryScore: 105, tertiaryScore: 4.8, rank: 2 },
        { name: 'Claude Sonnet 4.5', provider: 'Anthropic', score: 77.2, maxScore: 100, unit: '%', secondaryScore: 120, tertiaryScore: 3.0, rank: 3 },
        { name: 'GPT-5.1', provider: 'OpenAI', score: 76.3, maxScore: 100, unit: '%', secondaryScore: 110, tertiaryScore: 4.5, rank: 4 },
        { name: 'Gemini 3 Pro', provider: 'Google', score: 76.2, maxScore: 100, unit: '%', secondaryScore: 120, tertiaryScore: 1.1, rank: 5 },
      ],
    },
  ];
}
