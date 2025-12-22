'use client';

import { useState, useEffect } from 'react';
import { BenchmarkCategory, BenchmarkModel } from './data';
import { fetchBenchmarks } from '../lib/api';

export default function Home() {
  const [data, setData] = useState<BenchmarkCategory[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<BenchmarkModel['provider'] | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof BenchmarkModel; direction: 'asc' | 'desc' }>({ key: 'rank', direction: 'asc' });
  const [comparingModels, setComparingModels] = useState<string[]>([]);
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

  const filteredModels = activeCategory?.models
    .filter((model) => {
      const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProvider = selectedProvider === 'All' || model.provider === selectedProvider;
      return matchesSearch && matchesProvider;
    })
    .sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA === undefined || valB === undefined) return 0;
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }) || [];

  const handleSort = (key: keyof BenchmarkModel) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const toggleComparison = (modelName: string) => {
    setComparingModels(prev => 
      prev.includes(modelName) 
        ? prev.filter(m => m !== modelName) 
        : prev.length < 2 ? [...prev, modelName] : [prev[1], modelName]
    );
  };

  const comparisonData = data.flatMap(cat => cat.models).filter(m => comparingModels.includes(m.name));
  // Deduplicate by name if same model appears in multiple categories
  const uniqueComparisonModels = Array.from(new Map(comparisonData.map(m => [m.name, m])).values());

  const providerCounts = activeCategory?.models.reduce((acc, m) => {
    acc[m.provider] = (acc[m.provider] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

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
        <div className="mx-auto max-w-7xl px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <span className="text-base font-black italic">A</span>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter uppercase italic text-white">
                  AndMarks
                </h1>
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest leading-none mt-0.5">
                  Frontier Intelligence
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sync Protocol 4.6</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">
                    Last Update: Dec 22, 2025
                  </p>
                  <p className="text-[9px] font-bold text-blue-500/50 uppercase tracking-widest leading-none">
                    Verification: High Trust
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-8 py-16">
        <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-500/80">Station Timeline</span>
              <span className="h-px w-6 bg-white/10" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Dec 22, 2025</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter max-w-4xl leading-[0.9] text-white">
              THE EVOLUTION OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 uppercase">INTELLIGENCE</span>.
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl font-medium leading-relaxed">
              Real-time, verified benchmarks for frontier models as of Dec 22, 2025.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="relative group w-full sm:w-auto">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="SEARCH ENTITIES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-6 text-[11px] font-black uppercase tracking-widest text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all w-full sm:w-72 backdrop-blur-md"
              />
            </div>
            <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl h-fit shadow-xl backdrop-blur-md">
              <button 
                onClick={() => setViewMode('table')}
                className={`px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${viewMode === 'table' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
              >
                List
              </button>
              <button 
                onClick={() => setViewMode('chart')}
                className={`px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${viewMode === 'chart' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
              >
                Graph
              </button>
            </div>
          </div>
        </div>

        <div className="mb-16 flex items-center p-1 bg-white/5 border border-white/10 rounded-[2rem] overflow-x-auto max-w-full no-scrollbar backdrop-blur-md gap-0.5">
          {data.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`
                relative whitespace-nowrap px-4 py-2.5 rounded-[1.5rem] text-[9px] font-black uppercase tracking-[0.1em] transition-all duration-300
                ${
                  activeTab === category.id
                    ? 'bg-white text-black shadow-[0_5px_20px_rgba(255,255,255,0.1)] scale-[1.02]'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {category.name}
              {category.id === 'ivq-benchmark' && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[6px] font-black px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-bounce [animation-duration:2s]">
                  OUR PICK
                </span>
              )}
            </button>
          ))}
        </div>

        <div key={activeTab + viewMode} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {uniqueComparisonModels.length === 2 && (
            <div className="mb-16 p-10 rounded-[2.5rem] bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl animate-in slide-in-from-top-6 duration-700">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-400">Head-to-Head Comparison</h4>
                </div>
                <button 
                  onClick={() => setComparingModels([])}
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors border-b border-zinc-800 hover:border-white pb-0.5"
                >
                  Clear Selection
                </button>
              </div>
              <div className="grid grid-cols-2 gap-20 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-black italic text-white/5 pointer-events-none uppercase tracking-[1.5em]">VS</div>
                {uniqueComparisonModels.map((model, i) => (
                  <div key={model.name} className={`space-y-6 ${i === 1 ? 'text-right' : ''}`}>
                    <div>
                      <ProviderBadge provider={model.provider} />
                      <h5 className="text-4xl font-black tracking-tighter text-white mt-4">{model.name}</h5>
                    </div>
                    <div className={`flex flex-col ${i === 1 ? 'items-end' : 'items-start'}`}>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Intelligence Index</p>
                      <p className="text-6xl font-black tabular-nums tracking-tighter text-white">
                        {model.score.toLocaleString()}
                        <span className="text-xl ml-2 text-zinc-500">{model.unit || 'Elo'}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-12 items-end">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-3">
                <span className="h-px w-8 bg-blue-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-500">Analysis</span>
              </div>
              <h3 className="text-4xl font-black tracking-tight text-white mb-4">{activeCategory.name}</h3>
              <div className="relative group max-w-3xl">
                <p className="text-zinc-400 text-base leading-relaxed font-medium">
                  {activeCategory.description}
                </p>
                {activeCategory.id === 'ivq-benchmark' && (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 w-fit">
                      <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">AndMarks Proprietary Index</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 w-fit">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Intelligence Density Optimized</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex lg:justify-end gap-12">
              <div className="flex gap-6">
                {Object.entries(providerCounts).map(([provider, count]) => (
                  <div key={provider} className="text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">{provider}</p>
                    <p className="text-xl font-black text-white/80">{count}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-8 border-l border-white/5 pl-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Entities</p>
                  <p className="text-2xl font-black tabular-nums text-white">{activeCategory.models.length}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Sync</p>
                  <p className="text-2xl font-black tabular-nums text-white tracking-tighter">V4.6</p>
                </div>
              </div>
            </div>
          </div>

          {viewMode === 'table' ? (
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01]">
                      <th className="px-6 py-6 w-12 text-center"></th>
                      <th 
                        onClick={() => handleSort('rank')}
                        className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap cursor-pointer hover:text-white transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          Rank
                          <SortIcon active={sortConfig.key === 'rank'} direction={sortConfig.direction} />
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('name')}
                        className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap cursor-pointer hover:text-white transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          Model Entity
                          <SortIcon active={sortConfig.key === 'name'} direction={sortConfig.direction} />
                        </div>
                      </th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap">Origin</th>
                      {activeCategory?.id === 'ivq-benchmark' && (
                        <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap">Price ($/1M)</th>
                      )}
                      <th 
                        onClick={() => handleSort('score')}
                        className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap cursor-pointer hover:text-white transition-colors group"
                      >
                        <div className="flex items-center justify-end gap-2">
                          Delta
                          <SortIcon active={sortConfig.key === 'score'} direction={sortConfig.direction} />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredModels.map((model, index) => (
                      <tr 
                        key={model.name} 
                        onClick={() => toggleComparison(model.name)}
                        className={`group hover:bg-white/[0.04] transition-all duration-300 cursor-pointer ${comparingModels.includes(model.name) ? 'bg-blue-500/10' : ''}`}
                      >
                        <td className="px-6 py-5">
                          <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${comparingModels.includes(model.name) ? 'bg-blue-500 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-white/10 group-hover:border-white/30'}`}>
                            {comparingModels.includes(model.name) && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black transition-all group-hover:scale-110 ${
                            model.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)]' :
                            model.rank === 2 ? 'bg-zinc-200 text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]' :
                            model.rank === 3 ? 'bg-orange-800 text-white shadow-[0_0_15px_rgba(154,52,18,0.3)]' :
                            'bg-white/5 text-zinc-500 group-hover:bg-white/10'
                          }`}>
                            {model.rank || index + 1}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="font-bold text-base tracking-tight group-hover:translate-x-2 transition-transform text-white">
                            {model.name}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <ProviderBadge provider={model.provider} />
                        </td>
                        {activeCategory?.id === 'ivq-benchmark' && (
                          <td className="px-8 py-5 text-right">
                            <div className="flex flex-col items-end">
                              <span className="text-xs font-bold text-zinc-300 tabular-nums">
                                In: ${model.inputPrice?.toFixed(2)}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-bold tabular-nums">
                                Out: ${model.outputPrice?.toFixed(2)}
                              </span>
                            </div>
                          </td>
                        )}
                        <td className="px-10 py-5 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-xl font-black tabular-nums tracking-tighter text-white">
                              {model.score.toLocaleString()}
                              <span className="ml-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{model.unit || ' Elo'}</span>
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredModels.length === 0 && (
                      <tr>
                        <td colSpan={activeCategory?.id === 'ivq-benchmark' ? 6 : 5} className="px-8 py-32 text-center">
                          <p className="text-sm font-black uppercase tracking-[0.4em] text-zinc-600 italic">No matching intelligence nodes found.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-12 md:p-20 backdrop-blur-3xl shadow-2xl">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div>
                    <h4 className="text-3xl font-black uppercase tracking-tight text-white italic leading-none">Intelligence Matrix</h4>
                    <p className="text-[11px] text-blue-500 font-black uppercase tracking-[0.4em] mt-3">Distribution Visualization</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <ProviderLegend 
                      color="bg-emerald-500" 
                      label="OpenAI" 
                      active={selectedProvider === 'OpenAI'} 
                      onClick={() => setSelectedProvider(selectedProvider === 'OpenAI' ? 'All' : 'OpenAI')}
                    />
                    <ProviderLegend 
                      color="bg-amber-500" 
                      label="Anthropic" 
                      active={selectedProvider === 'Anthropic'} 
                      onClick={() => setSelectedProvider(selectedProvider === 'Anthropic' ? 'All' : 'Anthropic')}
                    />
                    <ProviderLegend 
                      color="bg-blue-500" 
                      label="Google" 
                      active={selectedProvider === 'Google'} 
                      onClick={() => setSelectedProvider(selectedProvider === 'Google' ? 'All' : 'Google')}
                    />
                    <ProviderLegend 
                      color="bg-zinc-400" 
                      label="xAI" 
                      active={selectedProvider === 'xAI'} 
                      onClick={() => setSelectedProvider(selectedProvider === 'xAI' ? 'All' : 'xAI')}
                    />
                  </div>
                </div>
                
                <div className="flex items-end gap-3 md:gap-5 h-[350px] md:h-[450px] border-b border-white/5 pb-4 px-4">
                  {filteredModels.map((model, i) => {
                    const maxVal = Math.max(...activeCategory.models.map(m => m.score));
                    const percentage = (model.score / maxVal) * 100;
                    return (
                      <div key={model.name} className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer">
                        <div className="absolute bottom-full mb-5 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 whitespace-nowrap z-20 pointer-events-none">
                          <div className="bg-white text-black px-4 py-3 rounded-2xl shadow-2xl flex flex-col items-center gap-1">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{model.name}</span>
                            <span className="text-lg font-black">{model.score.toLocaleString()}{model.unit || ' Elo'}</span>
                          </div>
                          <div className="w-2 h-2 bg-white rotate-45 mx-auto -mt-1" />
                        </div>

                        <div 
                          className={`w-full max-w-[60px] rounded-t-xl transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] relative overflow-hidden group-hover:brightness-125
                            ${model.provider === 'OpenAI' ? 'bg-gradient-to-t from-emerald-600/80 to-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.2)]' :
                              model.provider === 'Anthropic' ? 'bg-gradient-to-t from-amber-600/80 to-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.2)]' :
                              model.provider === 'Google' ? 'bg-gradient-to-t from-blue-600/80 to-blue-400/80 shadow-[0_0_30px_rgba(59,130,246,0.2)]' :
                              'bg-gradient-to-t from-zinc-500/80 to-zinc-200/80 shadow-[0_0_30px_rgba(255,255,255,0.1)]'}`}
                          style={{ 
                            height: `${Math.max(percentage, 6)}%`,
                            transitionDelay: `${i * 40}ms`
                          }}
                        >
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="absolute top-[calc(100%+12px)] flex flex-col items-center">
                          <div className={`h-2 w-2 rounded-full mb-2 ${
                            model.provider === 'OpenAI' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' :
                            model.provider === 'Anthropic' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' :
                            model.provider === 'Google' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-white'
                          }`} />
                          <span className="text-[10px] font-black text-zinc-600 group-hover:text-zinc-400 transition-colors">#{model.rank}</span>
                        </div>
                      </div>
                    );
                  })}
                  {filteredModels.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-sm font-black uppercase tracking-[0.4em] text-zinc-600 italic">Matrix nodes filtered.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-24 border-t border-white/5 bg-black/40 backdrop-blur-xl py-16">
        <div className="mx-auto max-w-7xl px-8 grid grid-cols-1 md:grid-cols-2 gap-12 text-white">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-white text-black rounded-lg flex items-center justify-center font-black italic text-sm shadow-lg">A</div>
              <h4 className="text-sm font-black uppercase tracking-tighter italic">AndMarks</h4>
            </div>
            <p className="text-sm text-zinc-500 max-w-sm leading-relaxed font-medium">
              Tracking the frontier of neural evolution. Built for the high-trust intelligence era.
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-between py-2">
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
              <span className="hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-white">Nodes</span>
              <span className="hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-white">Protocol</span>
              <span className="hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-white">Latency</span>
            </div>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-10">
              © 2025 AndMarks Engineering.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProviderLegend({ color, label, active, onClick }: { color: string, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all ${active ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
    >
      <div className={`h-1.5 w-1.5 rounded-full ${color}`} />
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</span>
    </button>
  );
}

function SortIcon({ active, direction }: { active: boolean, direction: 'asc' | 'desc' }) {
  if (!active) return <div className="w-2 h-2 opacity-0 group-hover:opacity-20 bg-white rounded-full transition-all" />;
  return (
    <svg className={`w-2 h-2 text-blue-500 transition-transform ${direction === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 15l7-7 7 7" />
    </svg>
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
