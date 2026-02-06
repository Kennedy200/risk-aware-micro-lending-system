'use client';

import { Card } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export const TheoryCorner = () => {
  return (
    <section className="bg-secondary/30 border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <h2 className="text-2xl font-bold text-foreground">Theory Corner</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Theory Card */}
          <Card className="p-6 border border-border bg-card">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-primary">📊</span>
              Von Neumann-Morgenstern Utility Theory
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              VantageRisk AI employs the Von Neumann-Morgenstern Expected Utility (vNM EU) framework, a foundational 
              economic theory that demonstrates rational decision-makers maximize expected utility under uncertainty.
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs font-mono text-primary mb-2">Expected Utility Formula</p>
                <p className="text-sm text-foreground font-semibold font-mono">
                  EU = [P(Success) × Profit] - [P(Default) × Principal Loss × λ]
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Where:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>P(Success) = probability of on-time repayment</li>
                  <li>Profit = expected interest earnings</li>
                  <li>P(Default) = probability of default</li>
                  <li>Principal Loss = loan amount at risk</li>
                  <li>λ = risk-aversion coefficient (1.0-5.0)</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Lambda Control Card */}
          <Card className="p-6 border border-border bg-card">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-primary">⚖️</span>
              Risk-Aversion Coefficient (λ)
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The λ parameter controls the system's risk tolerance. It acts as a scaling factor on your organization's 
              risk profile, allowing dynamic adjustment of approval thresholds without retraining models.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-medium">λ = 1.0 (Aggressive)</span>
                <span className="text-primary font-semibold">↑ Approvals</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-medium">λ = 3.0 (Balanced)</span>
                <span className="text-primary font-semibold">⚖️ Equilibrium</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-medium">λ = 5.0 (Conservative)</span>
                <span className="text-primary font-semibold">↓ Approvals</span>
              </div>
            </div>
          </Card>

          {/* Decision Framework Card */}
          <Card className="p-6 border border-border bg-card">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-primary">🔄</span>
              How Decisions Are Made
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Input Processing</p>
                  <p className="text-xs text-muted-foreground">Applicant data normalized and validated</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Utility Calculation</p>
                  <p className="text-xs text-muted-foreground">Expected utility computed with vNM framework</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Risk Adjustment</p>
                  <p className="text-xs text-muted-foreground">Utility scaled by λ coefficient</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Decision Output</p>
                  <p className="text-xs text-muted-foreground">APPROVE or REJECT with confidence metrics</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Best Practices Card */}
          <Card className="p-6 border border-border bg-card">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-primary">✨</span>
              Best Practices
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span className="text-muted-foreground">
                  Start with λ = 3.0 for balanced decision-making
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span className="text-muted-foreground">
                  Monitor approval rates when adjusting λ
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span className="text-muted-foreground">
                  Cross-reference with audit logs for compliance
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span className="text-muted-foreground">
                  Update model quarterly with new performance data
                </span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Footer note */}
        <div className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Disclaimer:</span> VantageRisk AI provides recommendations 
            based on utility theory. Final lending decisions should incorporate domain expertise, compliance requirements, 
            and organizational risk policies.
          </p>
        </div>
      </div>
    </section>
  );
};
