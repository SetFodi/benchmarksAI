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
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) throw new Error('Failed to fetch from OpenRouter');

    const json = await response.json();
    
    // Filtering for our specific providers and mapping to our format
    return json.data
      .filter((m: any) => 
        m.id.includes('openai') || 
        m.id.includes('anthropic') || 
        m.id.includes('google') || 
        m.id.includes('x-ai')
      )
      .slice(0, 15) // Top 15 for the leaderboard
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
        { name: 'Gemini-3-Pro', provider: 'Google', score: 1492, rank: 1 },
        { name: 'Grok-4.1-Thinking', provider: 'xAI', score: 1482, rank: 2 },
        { name: 'Gemini-3-Flash', provider: 'Google', score: 1470, rank: 3 },
        { name: 'Claude Opus 4.5 (thinking)', provider: 'Anthropic', score: 1466, rank: 4 },
        { name: 'GPT-5.2-high', provider: 'OpenAI', score: 1465, rank: 5 },
        { name: 'GPT-5.1-high', provider: 'OpenAI', score: 1464, rank: 6 },
        { name: 'Grok-4.1', provider: 'xAI', score: 1463, rank: 7 },
        { name: 'Claude Opus 4.5', provider: 'Anthropic', score: 1462, rank: 8 },
        { name: 'Gemini-2.5-Pro', provider: 'Google', score: 1460, rank: 9 },
        { name: 'GPT-5-chat', provider: 'OpenAI', score: 1413, rank: 10 },
        { name: 'Claude Sonnet 4.5', provider: 'Anthropic', score: 1410, rank: 11 },
        { name: 'Gemini-2.5-Flash', provider: 'Google', score: 1408, rank: 12 },
        { name: 'Grok-4-Fast', provider: 'xAI', score: 1405, rank: 13 },
        { name: 'GPT-5-mini', provider: 'OpenAI', score: 1385, rank: 14 },
        { name: 'Claude Haiku 4.5', provider: 'Anthropic', score: 1378, rank: 15 },
      ],
    },
    {
      id: 'ui-design2code',
      name: 'Design2Code (UI)',
      description: 'State-of-the-art benchmark for converting visual designs into pixel-perfect frontend code. Updated Dec 18, 2025.',
      models: [
        { name: 'Claude Sonnet 4.5', provider: 'Anthropic', score: 92.4, maxScore: 100, unit: '%', rank: 1 },
        { name: 'GPT-5.2-high', provider: 'OpenAI', score: 91.8, maxScore: 100, unit: '%', rank: 2 },
        { name: 'Gemini 3 Flash', provider: 'Google', score: 89.5, maxScore: 100, unit: '%', rank: 3 },
        { name: 'Claude 3.7 Sonnet', provider: 'Anthropic', score: 88.7, maxScore: 100, unit: '%', rank: 4 },
        { name: 'Grok 4-Fast', provider: 'xAI', score: 85.0, maxScore: 100, unit: '%', rank: 5 },
        { name: 'GPT-5-nano', provider: 'OpenAI', score: 77.2, maxScore: 100, unit: '%', rank: 6 },
        { name: 'Gemini 2.5 Pro', provider: 'Google', score: 75.9, maxScore: 100, unit: '%', rank: 7 },
        { name: 'Claude Haiku 4.5', provider: 'Anthropic', score: 74.4, maxScore: 100, unit: '%', rank: 8 },
        { name: 'GPT-4.1-mini', provider: 'OpenAI', score: 72.1, maxScore: 100, unit: '%', rank: 9 },
        { name: 'Grok-3-mini', provider: 'xAI', score: 70.5, maxScore: 100, unit: '%', rank: 10 },
      ],
    },
    {
      id: 'swe-bench-verified',
      name: 'SWE-bench Verified',
      description: 'Human-validated subset evaluating model proficiency in resolving real GitHub issues. Updated Dec 18, 2025.',
      models: [
        { name: 'Claude Opus 4.5', provider: 'Anthropic', score: 80.9, maxScore: 100, unit: '%', rank: 1 },
        { name: 'GPT-5.1 Codex Max', provider: 'OpenAI', score: 77.9, maxScore: 100, unit: '%', rank: 2 },
        { name: 'Claude Sonnet 4.5', provider: 'Anthropic', score: 77.2, maxScore: 100, unit: '%', rank: 3 },
        { name: 'GPT-5.1', provider: 'OpenAI', score: 76.3, maxScore: 100, unit: '%', rank: 4 },
        { name: 'Gemini 3 Pro', provider: 'Google', score: 76.2, maxScore: 100, unit: '%', rank: 5 },
        { name: 'Grok 4', provider: 'xAI', score: 72.6, maxScore: 100, unit: '%', rank: 6 },
        { name: 'Gemini 2.5 Pro', provider: 'Google', score: 71.8, maxScore: 100, unit: '%', rank: 7 },
        { name: 'Claude 3.7 Sonnet', provider: 'Anthropic', score: 68.4, maxScore: 100, unit: '%', rank: 8 },
        { name: 'GPT-4.5 Preview', provider: 'OpenAI', score: 65.2, maxScore: 100, unit: '%', rank: 9 },
        { name: 'Grok-4-Fast', provider: 'xAI', score: 62.1, maxScore: 100, unit: '%', rank: 10 },
      ],
    },
  ];
}
