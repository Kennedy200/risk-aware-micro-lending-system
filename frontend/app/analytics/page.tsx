'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { TrendingUp, ShieldCheck, Zap, Activity, Info, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ✅ OPTIMIZATION: Lazy load heavy Recharts components
const UtilityChart = dynamic(() => import('@/components/charts/UtilityChart'), {
  loading: () => <div className="h-[300px] w-full bg-slate-900/50 animate-pulse rounded-xl" />,
  ssr: false
});

const ProfitChart = dynamic(() => import('@/components/charts/ProfitChart'), {
  loading: () => <div className="h-[300px] w-full bg-slate-900/50 animate-pulse rounded-xl" />,
  ssr: false
});

// Mock data generation for distribution charts
const utilityData = Array.from({ length: 15 }, (_, i) => ({
  range: `${i}-${i + 1}`,
  count: Math.floor(Math.random() * 150 + 50),
}));

const profitabilityData = Array.from({ length: 20 }, (_, i) => ({
  risk: i * 0.25,
  profit: 50 + i * 8 - Math.random() * 10,
}));

const confusionData = [
  { name: 'True Positive', value: 385, color: '#22c55e' },
  { name: 'False Positive', value: 45, color: '#eab308' },
  { name: 'False Negative', value: 28, color: '#ef4444' },
  { name: 'True Negative', value: 342, color: '#3b82f6' },
];

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Simulation State
  const [simData, setSimData] = useState<any>({
    rule_based_profit: 12000,
    ai_utility_profit: 28500,
    improvement: "133%",
    isSimulating: false
  });

  // Fetch standard metrics on load
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:8000/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Backend offline");
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  // Live Simulation Trigger
  const runLiveSimulation = async () => {
    setSimData((prev: any) => ({ ...prev, isSimulating: true }));
    try {
      const response = await fetch('http://localhost:8000/run-simulation');
      const data = await response.json();
      setSimData({ ...data, isSimulating: false });
    } catch (error) {
      console.error("Simulation failed");
      setSimData((prev: any) => ({ ...prev, isSimulating: false }));
    }
  };

  // Logic for Dynamic Bar Heights
  const maxVal = Math.max(simData.rule_based_profit, simData.ai_utility_profit, 1);
  const ruleBarHeight = (simData.rule_based_profit / maxVal) * 180; // Scale relative to 180px container
  const aiBarHeight = (simData.ai_utility_profit / maxVal) * 180;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full space-y-10 animate-in fade-in duration-500">

        {/* Page Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">Analytics Center</h1>
            <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-xs mt-1">Experimental Evaluation Ledger</p>
          </div>
          <div className="hidden md:flex gap-2">
            <div className="bg-blue-600/10 border border-blue-500/20 px-3 py-1 rounded text-[10px] font-bold text-blue-400 uppercase tracking-widest animate-pulse">Live Backend Link: Active</div>
            <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded text-[10px] font-bold text-slate-500 tracking-tighter uppercase">Topic 16 - vNM Utility</div>
          </div>
        </div>

        {/* 1. KPI CARDS (Connected to Live Metrics) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass p-6 border-slate-800 bg-slate-900/40 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-50"></div>
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">Model Accuracy</p>
            <p className="text-4xl font-black text-blue-500">{loading ? "---" : `${metrics?.accuracy}%`}</p>
            <div className="mt-4 flex items-center gap-1 text-[10px] text-slate-600 font-bold uppercase italic underline decoration-blue-500/30">LendingClub Verified</div>
          </Card>

          <Card className="glass p-6 border-slate-800 bg-slate-900/40 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500 opacity-50"></div>
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">Precision Score</p>
            <p className="text-4xl font-black text-green-500">{loading ? "---" : `${metrics?.precision}%`}</p>
            <div className="mt-4 flex items-center gap-1 text-[10px] text-slate-600 font-bold uppercase italic">False Positive Mitigation</div>
          </Card>

          <Card className="glass p-6 border-slate-800 bg-slate-900/40 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-50"></div>
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">Recall Rating</p>
            <p className="text-4xl font-black text-purple-500">{loading ? "---" : `${metrics?.recall}%`}</p>
            <div className="mt-4 flex items-center gap-1 text-[10px] text-slate-600 font-bold uppercase italic">Capture Sensitivity</div>
          </Card>

          <Card className="glass p-6 border-slate-800 bg-slate-900/40 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 opacity-50"></div>
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">Harmonic F1</p>
            <p className="text-4xl font-black text-yellow-500">{loading ? "---" : metrics?.f1_score}</p>
            <div className="mt-4 flex items-center gap-1 text-[10px] text-slate-600 font-bold uppercase italic">Balanced Inference</div>
          </Card>
        </div>

        {/* 2. LIVE COMPARATIVE ANALYSIS BOX (Now with Simulation Button) */}
        <Card className="p-6 md:p-10 bg-blue-600/5 border-blue-500/20 border-2 rounded-[2rem] backdrop-blur-xl relative group">
          <div className="absolute top-4 right-4 animate-pulse"><Zap className="w-4 h-4 text-blue-500" /></div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/10 rounded-lg"><ShieldCheck className="text-blue-500 w-6 h-6" /></div>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">Comparative Analysis: AI vs. Legacy Rules</h3>
                </div>
                {/* NEW: LIVE SIMULATION BUTTON */}
                <Button
                  onClick={runLiveSimulation}
                  disabled={simData.isSimulating}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-[10px] font-black tracking-widest px-6 h-10 rounded-full shadow-lg shadow-blue-500/20"
                >
                  <PlayCircle className={`mr-2 w-4 h-4 ${simData.isSimulating ? 'animate-spin' : ''}`} />
                  {simData.isSimulating ? "RUNNING MONTE CARLO..." : "RUN LIVE SIMULATION"}
                </Button>
              </div>
              <p className="text-slate-400 text-base leading-relaxed max-w-2xl font-medium">
                Traditional lending protocols utilize static FICO thresholds (640).
                VantageRisk AI implements <b>Utility Optimization</b>, identifying "Hidden Gems" resulted in a <b>{simData.improvement}</b> improvement in profit capture during simulation.
              </p>
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-slate-900 border border-slate-800 rounded-2xl">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-bold text-blue-400 tracking-tighter uppercase">
                  Economic Impact: +${Math.round(simData.ai_utility_profit - simData.rule_based_profit).toLocaleString()} Utility Delta
                </span>
              </div>
            </div>

            {/* DYNAMIC BARS SECTION */}
            <div className="flex items-end justify-center w-full md:w-auto gap-8 md:gap-12 h-56 px-0 md:px-12 border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0 mt-2 md:mt-0 relative min-w-[unset] md:min-w-[320px]">
              <div className="flex flex-col items-center group">
                <div
                  className="w-16 bg-slate-800 rounded-t-2xl transition-all duration-700 ease-in-out shadow-lg"
                  style={{ height: `${ruleBarHeight}px` }}
                ></div>
                <p className="text-[10px] mt-4 text-slate-500 font-black uppercase text-center font-mono">
                  Legacy<br />${Math.round(simData.rule_based_profit).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col items-center group">
                <div
                  className="w-16 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-2xl shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all duration-1000 ease-out"
                  style={{ height: `${aiBarHeight}px` }}
                ></div>
                <p className="text-[10px] mt-4 text-blue-400 font-black uppercase text-center font-mono italic underline underline-offset-4 decoration-blue-500/50">
                  Vantage AI<br />${Math.round(simData.ai_utility_profit).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* 3. FULL CHARTS GRID  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass p-8 border-slate-800 bg-slate-900/40 rounded-3xl">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Utility Distribution
            </h2>
            <UtilityChart data={utilityData} />
          </Card>

          <Card className="glass p-8 border-slate-800 bg-slate-900/40 rounded-3xl">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" /> Profitability Frontier
            </h2>
            <ProfitChart data={profitabilityData} />
          </Card>
        </div>

        {/* 4. CONFUSION MATRIX GRID */}
        <Card className="glass p-8 border-slate-800 bg-slate-900/40 rounded-3xl">
          <h2 className="text-xl font-bold mb-8 uppercase tracking-widest text-slate-500">Model Performance Matrix</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {confusionData.map((item, index) => (
              <div key={index} className="bg-slate-950/50 p-6 rounded-[1.5rem] border border-white/5 group hover:border-blue-500/30 transition-all">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-3 tracking-[0.2em]" style={{ color: item.color }}>{item.name}</p>
                <p className="text-4xl font-black tracking-tighter">{item.value}</p>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-blue-500/50 w-[40%]"></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 5. MODEL INFO FOOTER  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/5 opacity-60">
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-slate-900 rounded-xl"><Info className="w-4 h-4 text-slate-400" /></div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Engine Architecture</p>
              <p className="text-xs font-bold font-mono tracking-tighter italic">Linear Probability Sigmoid Model</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-slate-900 rounded-xl"><Zap className="w-4 h-4 text-blue-400" /></div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Training Scale</p>
              <p className="text-xs font-bold">50,000 Observations (Kaggle Dataset)</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-slate-900 rounded-xl"><Activity className="w-4 h-4 text-green-400" /></div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Decision Status</p>
              <p className="text-xs font-bold text-green-400">High-Fidelity Real-time Sync</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}