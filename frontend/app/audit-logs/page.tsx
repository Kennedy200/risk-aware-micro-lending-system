'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Search, ChevronDown, Database, ShieldCheck, Wallet, Scale, Zap, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AuditLogsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'APPROVE' | 'REJECT'>('ALL');
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchAuditData = async () => {
    try {
      const response = await fetch('http://localhost:8000/audit-summary');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Database connection failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  // Filter logic: Search restricted to FICO and Timestamp (Date)

  const filteredLogs = data?.logs && Array.isArray(data.logs)
    ? data.logs.filter((log: any) => {
      const matchesFilter = activeFilter === 'ALL' || log.decision === activeFilter;
      const s = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === "" ||
        log.fico.toString().includes(s) ||
        log.timestamp.toLowerCase().includes(s);
      return matchesFilter && matchesSearch;
    })
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">Audit Logs</h1>
            <p className="text-slate-500 font-medium text-sm">Decision explainability & parameter history</p>
          </div>
        </div>

        {/* 1. TOP SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass p-6 border-slate-800 bg-slate-900/40">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">Total Transactions</p>
            <p className="text-4xl font-black">{loading ? "..." : data?.total}</p>
          </Card>
          <Card className="glass p-6 border-slate-800 bg-slate-900/40">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">Approval Rate</p>
            <p className="text-4xl font-black text-blue-500">{loading ? "..." : `${data?.approval_rate}%`}</p>
          </Card>
          <Card className="glass p-6 border-slate-800 bg-slate-900/40">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">Avg. Utility Score</p>
            <p className="text-4xl font-black text-green-500">{loading ? "..." : data?.avg_utility}</p>
          </Card>
        </div>

        {/* 2. SEARCH & FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Filter by FICO score or Date (YYYY-MM-DD)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-blue-500/50 transition-all outline-none"
            />
          </div>

          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl shrink-0">
            {(['ALL', 'APPROVE', 'REJECT'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                  activeFilter === filter ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* 3. TRANSACTION LEDGER WITH DROPDOWN PARAMETERS */}
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Historical Records</p>

          {loading ? (
            <div className="py-20 text-center text-slate-500 animate-pulse font-mono text-sm">SYNCING WITH SQLITE LEDGER...</div>
          ) : filteredLogs.length === 0 ? (
            <Card className="p-20 border-dashed border-slate-800 bg-transparent flex flex-col items-center justify-center text-slate-600 text-sm italic">
              No matching records found.
            </Card>
          ) : (
            filteredLogs.map((log: any) => (
              <div key={log.id} className="space-y-2">
                <Card
                  onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                  className={cn(
                    "p-6 border-slate-800 bg-slate-900/30 flex items-center justify-between group hover:border-slate-600 transition-all cursor-pointer",
                    expandedId === log.id && "border-blue-500/50 bg-slate-900/60"
                  )}
                >
                  <div className="flex items-center gap-10 flex-1">
                    <div className="w-44 shrink-0">
                      <span className="text-sm font-black text-white block tracking-tighter">TXN-{String(log.id).padStart(5, '0')}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block uppercase">{log.timestamp}</span>
                    </div>

                    <div className="w-32 hidden md:block">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">FICO</span>
                      <span className="text-base font-black">{log.fico}</span>
                    </div>

                    <div className="w-32 hidden md:block">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Utility</span>
                      <span className={cn("text-base font-black font-mono", log.utility > 0 ? "text-blue-400" : "text-red-500")}>
                        {log.utility > 0 ? `+${log.utility}` : log.utility}
                      </span>
                    </div>

                    <div className="flex-1 flex justify-end items-center gap-6">
                      <div className={cn(
                        "px-4 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border",
                        log.decision === 'APPROVE' ? "bg-green-500/5 text-green-500 border-green-500/20" : "bg-red-500/5 text-red-500 border-red-500/20"
                      )}>
                        {log.decision}
                      </div>
                      <ChevronDown className={cn("w-4 h-4 text-slate-700 group-hover:text-slate-400 transition-transform", expandedId === log.id && "rotate-180")} />
                    </div>
                  </div>
                </Card>

                {/* EXPANDABLE PARAMETERS SECTION */}
                {expandedId === log.id && (
                  <div className="mx-2 p-6 bg-black/40 border border-slate-800 rounded-2xl grid grid-cols-2 lg:grid-cols-4 gap-8 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-2"><Wallet className="w-3 h-3" /> Annual Income</p>
                      <p className="text-sm font-black text-white">${log.income?.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-2"><Scale className="w-3 h-3" /> DTI Ratio</p>
                      <p className="text-sm font-black text-white">{log.dti}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-2"><Database className="w-3 h-3" /> Loan Amount</p>
                      <p className="text-sm font-black text-white">${log.loan_amnt?.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-2"><Zap className="w-3 h-3" /> Risk-Aversion (λ)</p>
                      <p className="text-sm font-black text-blue-400">{log.risk_lambda}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}