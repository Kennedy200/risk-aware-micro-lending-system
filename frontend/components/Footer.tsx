'use client';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/20 text-center py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            VantageRisk AI - Risk-Aware Utility-Based Decision System
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>© 2026 VantageRisk</span>
            <span>•</span>
            <span>Built By Group 16</span>
          </div>
          <p className="text-xs text-muted-foreground/70">
            Banking-grade risk assessment powered by Von Neumann-Morgenstern utility theory
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
