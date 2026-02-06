'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface RiskMetric {
  label: string;
  value: number;
  change: number;
  isRising: boolean;
}

export function LiveRiskFeed() {
  const [metrics, setMetrics] = useState<RiskMetric[]>([
    { label: 'Market Volatility', value: 24.3, change: 2.1, isRising: true },
    { label: 'Default Rate', value: 3.2, change: -0.4, isRising: false },
    { label: 'Approval Rate', value: 68.5, change: 1.2, isRising: true },
    { label: 'Avg. Risk Score', value: 42.1, change: 0.8, isRising: true },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * 2,
          change: metric.change + (Math.random() - 0.5) * 0.5,
          isRising: Math.random() > 0.5,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass border border-border/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Live Risk Feed</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((metric, index) => (
          <div key={index} className="glass-sm p-3 rounded border border-border/30">
            <p className="text-xs text-muted-foreground mb-1 truncate">{metric.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-bold text-foreground numeric">{metric.value.toFixed(1)}</p>
              <div className="flex items-center gap-1">
                {metric.isRising ? (
                  <TrendingUp className="w-3 h-3 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                )}
                <span className={metric.isRising ? 'text-success' : 'text-destructive'} style={{ fontSize: '0.65rem' }}>
                  {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
