'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';

interface AuditEntry {
  id: number;
  timestamp: string;
  fico: number;
  utility: number;
  decision: string;
}

export const AuditLog = ({ decision }: { decision: any }) => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);


  // 1. Base Function: Fetch all logs
  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:8000/audit-summary');
      const data = await response.json();
      setEntries(data.logs || []); //data.logs
    } catch (error) {
      console.error("Audit Engine Offline.");
      setEntries([]); // ✅ Set empty array on error
    }
  };

  // 2. Search Function: Fetch filtered logs
  const handleFilter = async (e: any) => {
    const query = e.detail; // Gets the text from the Header
    if (!query) {
      fetchLogs(); // If search is empty, show everything
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/search?query=${query}`);
      const data = await res.json();
      setEntries(data); // Updates UI with specific search results
    } catch (err) {
      console.error("Search failed");
    }
  };

  // Listen for new decisions (Refresh list)
  useEffect(() => {
    fetchLogs();
  }, [decision]);

  // Listen for Search Events from the Header
  useEffect(() => {
    window.addEventListener('filterLogs', handleFilter);
    return () => window.removeEventListener('filterLogs', handleFilter);
  }, []);

  return (
    <Card className="p-4 border border-border glass bg-slate-900/40 backdrop-blur-md">
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-primary uppercase mb-2 tracking-widest">
            System Audit Log (SQLite Instance)
          </p>
          <p className="text-[10px] text-muted-foreground mb-3 italic">
            Search active. Use global bar above to query by FICO or Verdict.
          </p>
        </div>

        <ScrollArea className="h-48 border border-primary/20 rounded-lg bg-black/40 p-3 shadow-inner">
          <div className="space-y-1 font-mono text-[11px]">
            {entries.length === 0 ? (
              <div className="text-slate-600 animate-pulse py-2">
                &gt; NO MATCHING RECORDS FOUND IN PERSISTENCE LAYER...
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="text-slate-400 hover:text-white py-1 flex items-center gap-2 border-b border-white/5 last:border-0">
                  <span className="text-blue-500 font-bold">[{entry.timestamp.split(' ')[1]}]</span>
                  <span className="text-slate-500">TXN-{String(entry.id).padStart(4, '0')}:</span>
                  <span className="text-slate-300 font-bold underline decoration-blue-500/20">FICO {entry.fico}</span>
                  <span className={`font-bold ${entry.utility > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    | EU {entry.utility.toFixed(2)}
                  </span>
                  <span className={`font-black px-1 rounded ${entry.decision === 'APPROVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    | {entry.decision}
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <span>Results: {entries.length}</span>
          <span className="flex items-center gap-1 text-blue-400">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Sync: Real-time Database Ledger
          </span>
        </div>
      </div>
    </Card>
  );
};