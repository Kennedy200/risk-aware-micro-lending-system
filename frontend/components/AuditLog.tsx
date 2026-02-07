'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

// ✅ HARDCODED API URL FOR PRODUCTION
const API_BASE_URL = 'https://risk-lending-backend.onrender.com';

interface AuditEntry {
  id: number;
  timestamp: string;
  fico: number;
  utility: number;
  decision: string;
}

export const AuditLog = ({ decision }: { decision: any }) => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  const fetchLogs = async () => {
    try {
      // ✅ FIXED: Using live Render URL
      const response = await fetch(`${API_BASE_URL}/audit-summary`);
      if (!response.ok) throw new Error("API Response Error");
      
      const data = await response.json();
      setEntries(data.logs || []);
      setIsOffline(false);
    } catch (error) {
      console.error("Audit Engine Offline.");
      setEntries([]);
      setIsOffline(true);
    }
  };

  const handleFilter = async (e: any) => {
    const query = e.detail;
    if (!query) {
      fetchLogs();
      return;
    }
    try {
      // ✅ FIXED: Using live Render URL
      const res = await fetch(`${API_BASE_URL}/search?query=${query}`);
      if (!res.ok) throw new Error("Search Error");
      const data = await res.json();
      setEntries(data);
      setIsOffline(false);
    } catch (err) {
      console.error("Search failed");
      setIsOffline(true);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [decision]);

  useEffect(() => {
    window.addEventListener('filterLogs', handleFilter);
    return () => window.removeEventListener('filterLogs', handleFilter);
  }, []);

  return (
    <Card className={`p-4 border transition-colors duration-500 ${isOffline ? 'border-red-500/50 bg-red-950/10' : 'border-border glass bg-slate-900/40'} backdrop-blur-md`}>
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-xs font-semibold uppercase mb-2 tracking-widest ${isOffline ? 'text-red-500' : 'text-primary'}`}>
              System Audit Log (SQLite Instance)
            </p>
            <p className="text-[10px] text-muted-foreground mb-3 italic">
              {isOffline ? "Connection to Python Backend refused." : "Search active. Use global bar above to query by FICO or Verdict."}
            </p>
          </div>
          {isOffline && (
            <button onClick={fetchLogs} className="p-1 hover:bg-white/10 rounded transition-transform active:rotate-180">
               <RefreshCw className="w-3 h-3 text-red-500" />
            </button>
          )}
        </div>

        <ScrollArea className={`h-48 border rounded-lg bg-black/40 p-3 shadow-inner ${isOffline ? 'border-red-500/20' : 'border-primary/20'}`}>
          <div className="space-y-1 font-mono text-[11px]">
            {isOffline ? (
              <div className="text-red-400 flex items-center gap-2 py-2">
                <AlertCircle className="w-3 h-3" /> &gt; AUDIT ENGINE OFFLINE: RUN BACKEND SERVER...
              </div>
            ) : entries.length === 0 ? (
              <div className="text-slate-600 animate-pulse py-2">
                &gt; NO MATCHING RECORDS FOUND IN PERSISTENCE LAYER...
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="text-slate-400 hover:text-white py-1 flex items-center gap-2 border-b border-white/5 last:border-0">
                  <span className="text-blue-500 font-bold">[{entry.timestamp?.split(' ')[1] || '00:00'}]</span>
                  <span className="text-slate-500">TXN-{String(entry.id).padStart(4, '0')}:</span>
                  <span className="text-slate-300 font-bold underline decoration-blue-500/20">FICO {entry.fico}</span>
                  <span className={`font-bold ${entry.utility > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    | EU {entry.utility?.toFixed(2) || '0.00'}
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
          <span className={`flex items-center gap-1 ${isOffline ? 'text-red-500' : 'text-blue-400'}`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${isOffline ? 'bg-red-500' : 'bg-blue-500'}`}></span>
            {isOffline ? "Status: Disconnected" : "Sync: Real-time Database Ledger"}
          </span>
        </div>
      </div>
    </Card>
  );
};