'use client';

import { AlertCircle } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-card/80 to-background border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 text-balance">
                Current Risk Environment
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-lg">
                Real-time applicant assessment powered by utility-maximization theory
              </p>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-3 bg-secondary rounded-lg px-4 py-3 w-fit">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">System Status</p>
                <p className="text-sm font-bold text-foreground">Operational</p>
              </div>
            </div>
          </div>

          {/* Info banner */}
          <div className="mt-6 bg-primary/10 border border-primary/20 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-foreground">
              <p className="font-semibold mb-1">About VantageRisk AI</p>
              <p className="text-muted-foreground">
                VantageRisk AI implements the Von Neumann-Morgenstern (vNM) Expected Utility framework, the gold standard for rational decision-making under uncertainty. The system doesn't merely classify risk; it optimizes institutional utility. By weighing the stochastic probability of default against potential interest yield adjusted by your real-time Risk-Aversion Coefficient (λ) the engine identifies 'Hidden Gem' borrowers while ensuring capital preservation in volatile market conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
