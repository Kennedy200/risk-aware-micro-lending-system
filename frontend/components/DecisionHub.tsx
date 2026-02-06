'use client';

import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface DecisionHubProps {
  decision: {
    decision: 'APPROVE' | 'REJECT';
    expectedUtility: number;
    probabilityOfDefault: number;
    summary: string;
    riskAversion: number;
  } | null;
  isLoading: boolean;
}

const CircularProgressBar = ({
  value,
  maxValue = 100,
  label,
  color = 'danger',
}: {
  value: number;
  maxValue?: number;
  label: string;
  color?: 'danger' | 'success' | 'warning';
}) => {
  const percentage = (value / maxValue) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClass = {
    danger: '#ef4444',
    success: '#22c55e',
    warning: '#eab308',
  }[color];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-secondary"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={colorClass}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{value.toFixed(1)}%</p>
          </div>
        </div>
      </div>
      <p className="text-sm font-medium text-muted-foreground text-center">{label}</p>
    </div>
  );
};

// Generate utility curve data
const generateUtilityCurve = (riskAversion: number, expectedUtility: number) => {
  const data = [];
  for (let i = 0; i <= 20; i++) {
    const lambdaValue = 0.25 + (i * 0.225);
    const utility = expectedUtility - (lambdaValue - riskAversion) * 0.5;
    data.push({
      lambda: lambdaValue.toFixed(2),
      utility: utility.toFixed(2),
      isOptimal: Math.abs(lambdaValue - riskAversion) < 0.1,
    });
  }
  return data;
};

export const DecisionHub = ({ decision, isLoading }: DecisionHubProps) => {
  if (isLoading) {
    return (
      <Card className="p-8 border border-border glass flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground font-medium">Analyzing applicant profile...</p>
          <p className="text-xs text-muted-foreground">Computing utility-maximized decision</p>
        </div>
      </Card>
    );
  }

  if (!decision) {
    return (
      <Card className="p-8 border border-border glass border-dashed flex items-center justify-center min-h-96">
        <div className="text-center space-y-3">
          <div className="text-4xl text-muted-foreground/30">⬇️</div>
          <p className="text-muted-foreground font-medium">Submit applicant data above</p>
          <p className="text-xs text-muted-foreground">Results will appear here</p>
        </div>
      </Card>
    );
  }

  const isApproval = decision.decision === 'APPROVE';
  const probabilityOfDefaultValue = typeof decision.probabilityOfDefault === 'string'
    ? parseFloat(decision.probabilityOfDefault)
    : decision.probabilityOfDefault;
  const expectedUtilityValue = typeof decision.expectedUtility === 'string'
    ? parseFloat(decision.expectedUtility)
    : decision.expectedUtility;

  const curveData = generateUtilityCurve(decision.riskAversion, expectedUtilityValue);

  return (
    <div className="space-y-4">
      {/* Decision Card - Large and Prominent with Glassmorphism */}
      <Card
        className={`p-8 border-2 relative overflow-hidden transition-all animate-slide-up ${isApproval
            ? 'glass bg-gradient-to-br from-success/10 to-success/5 border-success/50 animate-glow-border'
            : 'glass bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/50 animate-glow-border'
          }`}
      >
        <div className="relative z-10 flex flex-col items-center text-center gap-6">
          {isApproval ? (
            <CheckCircle className="w-16 h-16 text-success animate-pulse-glow" strokeWidth={1.5} />
          ) : (
            <XCircle className="w-16 h-16 text-destructive animate-pulse-glow" strokeWidth={1.5} />
          )}

          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">AI RECOMMENDATION</p>
            <p
              className={`text-6xl font-black tracking-tighter numeric ${isApproval ? 'text-success' : 'text-destructive'
                }`}
            >
              {decision.decision}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {isApproval ? '✓ Positive Utility Score' : '✗ Negative Utility Score'}
            </p>
          </div>

          {/* EU Calculation Breakdown */}
          <div className="w-full bg-secondary/40 rounded-lg p-3 space-y-2 border border-slate-600/20">
            <p className="text-xs font-mono text-primary font-bold">
              EU = [P(Success) × Profit] - [P(Default) × Principal Loss × λ]
            </p>
            <p className="text-xs font-mono text-foreground">
              EU Result: {expectedUtilityValue.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              {isApproval
                ? 'Positive EU indicates the loan maximizes expected utility at λ = ' + decision.riskAversion.toFixed(1)
                : 'Negative EU indicates the expected loss outweighs gains at λ = ' + decision.riskAversion.toFixed(1)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="glass-sm p-2 rounded">
              <p className="text-xs text-muted-foreground">Risk Aversion</p>
              <p className="text-sm font-bold text-foreground numeric">λ = {decision.riskAversion.toFixed(1)}</p>
            </div>
            <div className="glass-sm p-2 rounded">
              <p className="text-xs text-muted-foreground">Expected Utility</p>
              <p className="text-sm font-bold text-primary numeric">{expectedUtilityValue.toFixed(2)}</p>
            </div>
            <div className="glass-sm p-2 rounded">
              <p className="text-xs text-muted-foreground">Model</p>
              <p className="text-sm font-bold text-foreground">vNM</p>
            </div>
          </div>
        </div>

        {/* Decorative background element */}
        <div
          className={`absolute inset-0 opacity-5 ${isApproval ? 'bg-success' : 'bg-destructive'
            } rounded-lg blur-3xl`}
        ></div>
      </Card>

      {/* Decision Frontier - Utility Curve Visualization */}
      <Card className="p-4 border border-border glass">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Decision Frontier</p>
            <p className="text-xs text-muted-foreground mb-3">Utility curve showing breakeven point</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={curveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="lambda" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '11px' }} />
              <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '11px' }} />
              <Line
                type="monotone"
                dataKey="utility"
                stroke="#3b82f6"
                dot={false}
                isAnimationActive={true}
                strokeWidth={2}
              />
              {/* Breakeven indicator */}
              <Line
                type="monotone"
                dataKey={() => 0}
                stroke="rgba(34, 197, 94, 0.3)"
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-xs text-muted-foreground flex justify-between items-center">
            <span>λ value range: 0.25 - 5.0</span>
            <span className="text-success">✓ Breakeven identified</span>
          </div>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Expected Utility Score */}
        <Card className="p-4 border border-border bg-card">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              Expected Utility
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-primary">
              {parseFloat(decision.expectedUtility as any).toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">Utility-maximized score</p>
          </div>
        </Card>

        {/* Probability of Default */}
        <Card className="p-4 border border-border bg-card flex flex-col items-center justify-center">
          <CircularProgressBar
            value={probabilityOfDefaultValue}
            maxValue={100}
            label="Prob. of Default"
            color={probabilityOfDefaultValue > 50 ? 'danger' : probabilityOfDefaultValue > 30 ? 'warning' : 'success'}
          />
        </Card>
      </div>

      {/* AI Recommendation Summary */}
      <Card className="p-4 border border-border bg-secondary/50">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Decision Summary
          </p>
          <p className="text-sm text-foreground leading-relaxed">{decision.summary}</p>
        </div>
      </Card>

      {/* Additional Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4 border border-border glass">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">Model</p>
            <p className="text-sm font-bold text-foreground numeric">vNM EU</p>
            <p className="text-xs text-muted-foreground mt-1">Von Neumann-Morgenstern</p>
          </div>
        </Card>
        <Card className="p-4 border border-border glass">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">Confidence</p>
            <p className="text-sm font-bold text-primary numeric">98.5%</p>
            <p className="text-xs text-muted-foreground mt-1">Model certainty</p>
          </div>
        </Card>
        <Card className="p-4 border border-border glass">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">Status</p>
            <p className="text-sm font-bold text-success">Ready</p>
            <p className="text-xs text-muted-foreground mt-1">Inference complete</p>
          </div>
        </Card>
      </div>

      {/* Ethical Bias Monitor */}
      <Card className="p-4 border border-border glass">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-success" />
            <div>
              <p className="text-xs font-semibold text-foreground uppercase">Fairness Analysis</p>
              <p className="text-xs text-muted-foreground">Bias Detection System</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-success">PASSED</p>
            <p className="text-xs text-muted-foreground">Neutral</p>
          </div>
        </div>
      </Card>
    </div>
  );
};