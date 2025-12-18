'use client';

import { useState, useEffect } from 'react';
import { BenchmarkCategory, BenchmarkModel } from './data';
import { fetchBenchmarks } from '../lib/api';

export default function Home() {
  const [data, setData] = useState<BenchmarkCategory[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
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
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <span className="text-sm font-black italic">A</span>
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tighter uppercase italic text-white">
                  AndMarks
                </h1>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
                  Frontier Intelligence
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sync Protocol 4.5</span>
                </div>
                <div className="mt-1.5 flex flex-col items-end gap-0.5">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">
                    Last Update: Dec 18, 2025
                  </p>
                  <p className="text-[8px] font-bold text-blue-500/50 uppercase tracking-widest leading-none">
                    Verification: High Trust
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 py-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/80">Station Timeline</span>
              <span className="h-px w-4 bg-white/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Dec 18, 2025</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter max-w-3xl leading-none text-white">
              THE EVOLUTION OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 uppercase">INTELLIGENCE</span>.
            </h2>
            <p className="text-base text-zinc-400 max-w-xl font-medium">
              Real-time, verified benchmarks for frontier models as of Dec 18, 2025.
            </p>
          </div>
          
          <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl h-fit shadow-xl backdrop-blur-md">
            <button 
              onClick={() => setViewMode('table')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'table' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              List
            </button>
            <button 
              onClick={() => setViewMode('chart')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'chart' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              Graph
            </button>
          </div>
        </div>

        <div className="mb-8 inline-flex p-1 bg-white/5 border border-white/10 rounded-xl overflow-x-auto max-w-full no-scrollbar backdrop-blur-md">
          {data.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`
                whitespace-nowrap px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300
                ${
                  activeTab === category.id
                    ? 'bg-white text-black shadow-[0_5px_20px_rgba(255,255,255,0.1)] scale-[1.01]'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div key={activeTab + viewMode} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="h-px w-6 bg-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Analysis</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white">{activeCategory.name}</h3>
              <p className="mt-2 text-zinc-400 text-sm max-w-2xl leading-relaxed">
                {activeCategory.description}
              </p>
            </div>
            <div className="flex lg:justify-end gap-10">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Entities</p>
                <p className="text-xl font-black tabular-nums text-white">{activeCategory.models.length}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Sync</p>
                <p className="text-xl font-black tabular-nums text-white tracking-tighter">V4.5</p>
              </div>
            </div>
          </div>

          {viewMode === 'table' ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01]">
                      <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap">Rank</th>
                      <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap">Model Entity</th>
                      <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap">Origin</th>
                      <th className="px-8 py-4 text-right text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap">Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {activeCategory.models.map((model, index) => (
                      <tr key={model.name} className="group hover:bg-white/[0.03] transition-all duration-300">
                        <td className="px-6 py-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black transition-all group-hover:scale-105 ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]' :
                            index === 1 ? 'bg-zinc-200 text-black' :
                            index === 2 ? 'bg-orange-800 text-white' :
                            'bg-white/5 text-zinc-500 group-hover:bg-white/10'
                          }`}>
                            {model.rank || index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="font-bold text-sm tracking-tight group-hover:translate-x-1 transition-transform text-white">
                            {model.name}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <ProviderBadge provider={model.provider} />
                        </td>
                        <td className="px-8 py-3 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-base font-black tabular-nums tracking-tighter text-white">
                              {model.score.toLocaleString()}
                              <span className="ml-1 text-[9px] text-zinc-500 uppercase tracking-widest font-bold">{model.unit || ' Elo'}</span>
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 md:p-12 backdrop-blur-3xl shadow-xl">
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight text-white italic leading-none">Intelligence Matrix</h4>
                    <p className="text-[9px] text-blue-500 font-black uppercase tracking-[0.3em] mt-1.5">Distribution Visualization</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <ProviderLegend color="bg-emerald-500" label="OpenAI" />
                    <ProviderLegend color="bg-amber-500" label="Anthropic" />
                    <ProviderLegend color="bg-blue-500" label="Google" />
                    <ProviderLegend color="bg-zinc-400" label="xAI" />
                  </div>
                </div>
                
                <div className="flex items-end gap-1.5 md:gap-2.5 h-[250px] md:h-[320px] border-b border-white/5 pb-1 px-2">
                  {activeCategory.models.map((model, i) => {
                    const maxVal = Math.max(...activeCategory.models.map(m => m.score));
                    const percentage = (model.score / maxVal) * 100;
                    return (
                      <div key={model.name} className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer">
                        <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 whitespace-nowrap z-20">
                          <div className="bg-white text-black px-2.5 py-1.5 rounded-xl shadow-2xl flex flex-col items-center gap-0.5">
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-50">{model.name}</span>
                            <span className="text-xs font-black">{model.score.toLocaleString()}{model.unit || ' Elo'}</span>
                          </div>
                          <div className="w-1.5 h-1.5 bg-white rotate-45 mx-auto -mt-0.5" />
                        </div>

                        <div 
                          className={`w-full max-w-[45px] rounded-t-lg transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] relative overflow-hidden group-hover:brightness-110
                            ${model.provider === 'OpenAI' ? 'bg-gradient-to-t from-emerald-600/80 to-emerald-400/80' :
                              model.provider === 'Anthropic' ? 'bg-gradient-to-t from-amber-600/80 to-amber-400/80' :
                              model.provider === 'Google' ? 'bg-gradient-to-t from-blue-600/80 to-blue-400/80' :
                              'bg-gradient-to-t from-zinc-500/80 to-zinc-200/80'}`}
                          style={{ 
                            height: `${Math.max(percentage, 4)}%`,
                            transitionDelay: `${i * 30}ms`
                          }}
                        >
                          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="absolute top-[calc(100%+8px)] flex flex-col items-center">
                          <div className={`h-1.5 w-1.5 rounded-full mb-1 ${
                            model.provider === 'OpenAI' ? 'bg-emerald-500' :
                            model.provider === 'Anthropic' ? 'bg-amber-500' :
                            model.provider === 'Google' ? 'bg-blue-500' : 'bg-white'
                          }`} />
                          <span className="text-[8px] font-black text-zinc-600 group-hover:text-zinc-400 transition-colors">#{i+1}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-12 border-t border-white/5 bg-black/40 backdrop-blur-xl py-10">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 bg-white text-black rounded flex items-center justify-center font-black italic text-[10px] shadow-lg">A</div>
              <h4 className="text-xs font-black uppercase tracking-tighter italic">AndMarks</h4>
            </div>
            <p className="text-xs text-zinc-500 max-w-xs leading-relaxed font-medium">
              Tracking the frontier of neural evolution.
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-between py-1">
            <div className="flex gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
              <span className="hover:text-white cursor-pointer transition-colors">Nodes</span>
              <span className="hover:text-white cursor-pointer transition-colors">Protocol</span>
              <span className="hover:text-white cursor-pointer transition-colors">Latency</span>
            </div>
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-6">
              © 2025 AndMarks Engineering.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProviderLegend({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-1.5 w-1.5 rounded-full ${color}`} />
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</span>
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
