'use client';

import { useState, useEffect } from 'react';
import { BenchmarkCategory, BenchmarkModel } from './data';
import { fetchBenchmarks } from '../lib/api';

export default function Home() {
  const [data, setData] = useState<BenchmarkCategory[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const benchmarks = await fetchBenchmarks();
        setData(benchmarks);
        if (benchmarks.length > 0) {
          setActiveTab(benchmarks[0].id);
        }
      } catch (err) {
        setError('Failed to sync with neural benchmark nodes.');
        console.error(err);
      } finally {
        // Keep loading a bit longer for that "premium" feel
        setTimeout(() => setLoading(false), 1200);
      }
    }
    loadData();
  }, []);

  const activeCategory = data.find((cat) => cat.id === activeTab) || data[0];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white overflow-hidden">
        <div className="relative flex flex-col items-center">
          {/* Neural Pulse Loader */}
          <div className="relative h-24 w-24 mb-8">
            <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-ping opacity-20" />
            <div className="absolute inset-2 rounded-full border border-blue-400/40 animate-pulse" />
            <div className="absolute inset-4 rounded-full border border-blue-300/60 animate-spin [animation-duration:3s]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-black tracking-tighter italic text-blue-500">A</span>
            </div>
          </div>
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase opacity-50 mb-2">Syncing Neural Nodes</h2>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className="h-1 w-1 rounded-full bg-blue-500 animate-bounce" 
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !activeCategory) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4">
        <div className="max-w-md text-center border border-red-500/20 bg-red-500/5 p-8 rounded-2xl backdrop-blur-xl">
          <h2 className="text-xl font-bold text-red-500">Neural Sync Failed</h2>
          <p className="mt-2 text-zinc-400">{error || 'Intelligence nodes offline.'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-white px-6 py-2 text-sm font-bold text-black hover:bg-zinc-200 transition-all"
          >
            Attempt Re-sync
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-blue-500/30">
      {/* Premium Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <span className="text-sm font-black italic">A</span>
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tighter uppercase italic">
                  AndMarks
          </h1>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
                  Frontier Intelligence
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Live Feed Connected</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter max-w-3xl leading-[0.9]">
            THE EVOLUTION OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">INTELLIGENCE</span>.
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl font-medium">
            Real-time, verified benchmarks for the frontier models defining the next era of compute.
          </p>
        </div>

        {/* Tabs - Glassmorphism style */}
        <div className="mb-10 inline-flex p-1 bg-white/5 border border-white/10 rounded-2xl overflow-x-auto max-w-full no-scrollbar">
          {data.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`
                whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300
                ${
                  activeTab === category.id
                    ? 'bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.1)]'
                    : 'text-zinc-500 hover:text-white'
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Category Description */}
        <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-px w-8 bg-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Metadata Analysis</span>
              </div>
              <h3 className="text-3xl font-black tracking-tight">{activeCategory.name}</h3>
              <p className="mt-3 text-zinc-400 text-lg max-w-2xl leading-relaxed">
                {activeCategory.description}
              </p>
            </div>
            <div className="flex lg:justify-end gap-12">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Total Models</p>
                <p className="text-2xl font-black tabular-nums">{activeCategory.models.length}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Last Update</p>
                <p className="text-2xl font-black tabular-nums">Dec 18</p>
              </div>
            </div>
          </div>

          {/* Table - High End Dashboard style */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Rank</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Model Entity</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Origin</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Intelligence Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activeCategory.models.map((model, index) => (
                    <tr key={model.name} className="group hover:bg-white/[0.03] transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black transition-all group-hover:scale-110 ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)]' :
                          index === 1 ? 'bg-zinc-200 text-black' :
                          index === 2 ? 'bg-orange-800 text-white' :
                          'bg-white/5 text-zinc-500 group-hover:bg-white/10'
                        }`}>
                          {model.rank || index + 1}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-black text-lg tracking-tight group-hover:translate-x-1 transition-transform">
                          {model.name}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <ProviderBadge provider={model.provider} />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xl font-black tabular-nums tracking-tighter">
                            {model.score.toLocaleString()}
                            <span className="ml-1 text-[10px] text-zinc-500 uppercase tracking-widest">{model.unit || ' Elo'}</span>
                          </span>
                          {model.maxScore && (
                            <div className="h-1 w-32 overflow-hidden rounded-full bg-white/5">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 group-hover:brightness-125" 
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
        </div>
      </main>

      <footer className="mt-20 border-t border-white/5 bg-black/40 backdrop-blur-xl py-16">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 bg-white text-black rounded flex items-center justify-center font-black italic text-xs">A</div>
              <h4 className="text-sm font-black uppercase tracking-tighter italic">AndMarks</h4>
            </div>
            <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
              Tracking the frontier of neural evolution. Verified data points for the models building the future.
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-between py-2">
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              <span className="hover:text-white cursor-pointer transition-colors">Nodes</span>
              <span className="hover:text-white cursor-pointer transition-colors">Protocol</span>
              <span className="hover:text-white cursor-pointer transition-colors">Latency</span>
            </div>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-8">
              © 2025 AndMarks Engineering. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProviderBadge({ provider }: { provider: BenchmarkModel['provider'] }) {
  const styles = {
    OpenAI: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Anthropic: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Google: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    xAI: 'bg-white/10 text-white border-white/20',
  };

  return (
    <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${styles[provider]}`}>
      {provider}
    </span>
  );
}
