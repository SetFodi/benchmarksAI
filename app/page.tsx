'use client';

import { useState } from 'react';
import { benchmarkData, BenchmarkCategory, BenchmarkModel } from './data';

export default function Home() {
  const [activeTab, setActiveTab] = useState(benchmarkData[0].id);

  const activeCategory = benchmarkData.find((cat) => cat.id === activeTab) || benchmarkData[0];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans">
      <header className="border-b border-zinc-200 bg-white/50 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50 sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                Benchmarks AI
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Verified & Live AI Model Leaderboards</p>
            </div>
            <div className="hidden sm:block">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-300">
                Last updated: Dec 18, 2025
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-8 border-b border-zinc-200 dark:border-zinc-800">
          <nav className="-mb-px flex space-x-8 overflow-x-auto pb-px" aria-label="Tabs">
            {benchmarkData.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`
                  whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                  ${
                    activeTab === category.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div>
            <h2 className="text-xl font-semibold">{activeCategory.name}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {activeCategory.description}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-800/50">
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Model
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Provider
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
                {activeCategory.models.map((model, index) => (
                  <tr key={model.name} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' :
                        index === 1 ? 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300' :
                        index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' :
                        'text-zinc-500'
                      }`}>
                        {model.rank || index + 1}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {model.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <ProviderBadge provider={model.provider} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-bold">
                      <div className="flex flex-col items-end">
                        <span className="text-zinc-900 dark:text-zinc-100">
                          {model.score.toLocaleString()}
                          {model.unit}
                        </span>
                        {model.maxScore && (
                          <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <div 
                              className="h-full bg-blue-500" 
                              style={{ width: `${(model.score / model.maxScore) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 border-t border-zinc-200 dark:border-zinc-800 mt-12">
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          Data sourced from SWE-bench Verified, LMSYS Chatbot Arena, and other public benchmarks.
          <br />
          OpenAI, Anthropic, Google, and xAI are trademarks of their respective owners.
        </p>
      </footer>
    </div>
  );
}

function ProviderBadge({ provider }: { provider: BenchmarkModel['provider'] }) {
  const styles = {
    OpenAI: 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-300',
    Anthropic: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-300',
    Google: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-300',
    xAI: 'bg-zinc-50 text-zinc-700 ring-zinc-600/20 dark:bg-zinc-800 dark:text-zinc-300',
  };

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles[provider]}`}>
      {provider}
    </span>
  );
}
