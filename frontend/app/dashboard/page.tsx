'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';


const MainInterface = dynamic(() => import('@/components/MainInterface').then(mod => ({ default: mod.MainInterface })), {
  loading: () => <div className="animate-pulse h-96 bg-slate-900 rounded-xl" />,
  ssr: false, // These don't need server-side rendering
});

const TheoryCorner = dynamic(() => import('@/components/TheoryCorner').then(mod => ({ default: mod.TheoryCorner })), {
  loading: () => <div className="animate-pulse h-48 bg-slate-900 rounded-xl" />,
  ssr: false,
});

export default function Dashboard() {
  const [formData, setFormData] = useState({
    income: 75000,
    fico: 710,
    dti: 35,
    loan_amnt: 15000,
    risk_lambda: 2.5
  });

  const [riskDecision, setRiskDecision] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  //call back
  const handleAnalyze = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      setRiskDecision({
        decision: data.decision,
        expectedUtility: data.utility_score,
        probabilityOfDefault: parseFloat(data.risk_percentage),
        summary: data.decision === 'APPROVE' ? "Positive Utility" : "Negative Utility",
        riskAversion: formData.risk_lambda,
      });
    } catch (error) {
      console.error('Backend error:', error);
      alert("Backend Offline! Run: uvicorn main:app --reload");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <MainInterface
          formData={formData}
          setFormData={setFormData}
          onAnalyze={handleAnalyze}
          currentDecision={riskDecision}
          isLoading={loading}
        />
        <TheoryCorner />
      </main>
      <Footer />
    </div>
  );
}