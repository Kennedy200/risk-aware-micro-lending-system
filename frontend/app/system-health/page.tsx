'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, TrendingDown } from 'lucide-react';

interface HealthMetric {
  timestamp: number;
  value: number;
}

interface SystemStatus {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: string;
  unit: string;
  history: HealthMetric[];
  description: string;
}

const generateTimeSeries = (baseValue: number, variance: number, points: number): HealthMetric[] => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    timestamp: now - (points - i) * 60000,
    value: baseValue + (Math.random() - 0.5) * variance,
  }));
};

export default function SystemHealthPage() {
  const [health, setHealth] = useState<SystemStatus[]>([
    {
      name: 'API Latency',
      status: 'healthy',
      value: '45',
      unit: 'ms',
      history: generateTimeSeries(45, 20, 30),
      description: 'Average response time for API requests',
    },
    {
      name: 'Model Inference Time',
      status: 'healthy',
      value: '127',
      unit: 'ms',
      history: generateTimeSeries(127, 40, 30),
      description: 'Time to generate decision for single applicant',
    },
    {
      name: 'Database Connection',
      status: 'healthy',
      value: '2',
      unit: 'ms',
      history: generateTimeSeries(2, 1, 30),
      description: 'Query execution time to database',
    },
    {
      name: 'CPU Usage',
      status: 'warning',
      value: '68',
      unit: '%',
      history: generateTimeSeries(68, 15, 30),
      description: 'Current CPU utilization across all servers',
    },
    {
      name: 'Memory Usage',
      status: 'healthy',
      value: '54',
      unit: '%',
      history: generateTimeSeries(54, 10, 30),
      description: 'Allocated memory in use',
    },
    {
      name: 'Error Rate',
      status: 'healthy',
      value: '0.02',
      unit: '%',
      history: generateTimeSeries(0.02, 0.05, 30),
      description: 'Percentage of failed transactions',
    },
  ]);

  const uptime = 99.97;
  const requestsPerSecond = 1245;
  const totalRequests = 15302847;
  const lastIncident = '3 days ago';

  useEffect(() => {
    const interval = setInterval(() => {
      setHealth((prev) =>
        prev.map((metric) => {
          const newValue = metric.history[metric.history.length - 1].value + (Math.random() - 0.5) * 10;
          let newStatus: 'healthy' | 'warning' | 'critical' = 'healthy';

          if (metric.name === 'CPU Usage') {
            if (newValue > 80) newStatus = 'critical';
            else if (newValue > 60) newStatus = 'warning';
          } else if (metric.name === 'Error Rate') {
            if (newValue > 0.5) newStatus = 'critical';
            else if (newValue > 0.1) newStatus = 'warning';
          }

          return {
            ...metric,
            value: Math.max(0, newValue).toFixed(2),
            status: newStatus,
            history: [
              ...metric.history.slice(1),
              {
                timestamp: Date.now(),
                value: newValue,
              },
            ],
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">System Health</h1>
            <p className="text-muted-foreground">Real-time infrastructure and performance monitoring</p>
          </div>

          {/* Overall Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass p-4 border border-border/50">
              <p className="text-xs text-muted-foreground uppercase mb-2">Uptime</p>
              <p className="text-3xl font-bold text-success numeric">{uptime}%</p>
              <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
            </Card>
            <Card className="glass p-4 border border-border/50">
              <p className="text-xs text-muted-foreground uppercase mb-2">Requests/sec</p>
              <p className="text-3xl font-bold text-primary numeric">{requestsPerSecond}</p>
              <p className="text-xs text-muted-foreground mt-2">Current throughput</p>
            </Card>
            <Card className="glass p-4 border border-border/50">
              <p className="text-xs text-muted-foreground uppercase mb-2">Total Requests</p>
              <p className="text-3xl font-bold text-foreground numeric">{(totalRequests / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-muted-foreground mt-2">This month</p>
            </Card>
            <Card className="glass p-4 border border-border/50">
              <p className="text-xs text-muted-foreground uppercase mb-2">Last Incident</p>
              <p className="text-3xl font-bold text-foreground">{lastIncident}</p>
              <p className="text-xs text-muted-foreground mt-2">Resolved incident</p>
            </Card>
          </div>

          {/* System Metrics */}
          <div className="space-y-4">
            {health.map((metric, index) => {
              const statusColor =
                metric.status === 'healthy'
                  ? 'text-success'
                  : metric.status === 'warning'
                    ? 'text-yellow-400'
                    : 'text-destructive';

              return (
                <Card key={index} className="glass p-6 border border-border/50 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {metric.status === 'healthy' ? (
                          <CheckCircle className={`w-4 h-4 ${statusColor}`} />
                        ) : (
                          <AlertCircle className={`w-4 h-4 ${statusColor}`} />
                        )}
                        <h3 className="text-lg font-semibold text-foreground">{metric.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <p className={`text-2xl font-bold numeric ${statusColor}`}>{metric.value}</p>
                        <p className="text-sm text-muted-foreground">{metric.unit}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded mt-1 inline-block ${metric.status === 'healthy'
                            ? 'bg-success/20 text-success'
                            : metric.status === 'warning'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-destructive/20 text-destructive'
                          }`}
                      >
                        {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Chart */}
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={metric.history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="timestamp"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                        stroke="rgba(255,255,255,0.3)"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: '12px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '8px',
                        }}
                        labelFormatter={(time) => new Date(time).toLocaleTimeString()}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={
                          metric.status === 'healthy'
                            ? '#22c55e'
                            : metric.status === 'warning'
                              ? '#eab308'
                              : '#ef4444'
                        }
                        dot={false}
                        isAnimationActive={false}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              );
            })}
          </div>

          {/* Service Dependencies */}
          <Card className="glass p-6 border border-border/50 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Service Dependencies</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'SQLite  Database', status: 'healthy', latency: '2ms' },
                { name: 'Redis Cache', status: 'healthy', latency: '0.8ms' },
                { name: 'Authentication Service', status: 'healthy', latency: '15ms' },
                { name: 'Model Inference Engine', status: 'healthy', latency: '127ms' },
                { name: 'Message Queue', status: 'healthy', latency: '5ms' },
                { name: 'Logging Pipeline', status: 'healthy', latency: '12ms' },
              ].map((service, i) => (
                <div key={i} className="glass-sm p-3 rounded border border-border/30 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.latency}</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                </div>
              ))}
            </div>
          </Card>

          {/* Alerts & Notifications */}
          <Card className="glass p-6 border border-border/50 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Active Alerts</h2>

            <div className="space-y-2">
              <div className="glass-sm p-3 rounded border border-yellow-500/30 bg-yellow-500/5 flex gap-3">
                <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-300">CPU Usage Alert</p>
                  <p className="text-xs text-yellow-200/70">CPU usage exceeded 60% threshold. Consider scaling up.</p>
                </div>
              </div>

              <div className="glass-sm p-3 rounded border border-green-500/30 bg-green-500/5 flex gap-3">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-success">All Systems Nominal</p>
                  <p className="text-xs text-green-200/70">No critical issues detected. Last check: just now.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
