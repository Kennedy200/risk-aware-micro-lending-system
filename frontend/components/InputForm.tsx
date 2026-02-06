'use client';

import React from "react"
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Shield, Scale, TrendingUp, Zap } from 'lucide-react';

export const InputForm = ({ formData, setFormData, onSubmit, isLoading }: any) => {

  const handleUpdate = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card className="p-6 border border-border glass hover:border-primary/40 transition-all">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ANNUAL INCOME */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <div className="flex items-center gap-2"><Wallet className="w-4 h-4 text-primary" />Annual Income</div>
            <span className="text-muted-foreground">${(formData.income / 1000).toFixed(0)}K</span>
          </div>
          <Input type="number" value={formData.income} onChange={(e) => handleUpdate('income', parseFloat(e.target.value))} className="glass-sm" disabled={isLoading} />
          <Slider value={[formData.income]} onValueChange={(v) => handleUpdate('income', v[0])} min={20000} max={500000} step={5000} disabled={isLoading} />
        </div>

        {/* FICO SCORE */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" />FICO Credit Score</div>
            <span className="text-muted-foreground">{formData.fico}</span>
          </div>
          <Input type="number" value={formData.fico} onChange={(e) => handleUpdate('fico', parseFloat(e.target.value))} className="glass-sm" disabled={isLoading} />
          <Slider value={[formData.fico]} onValueChange={(v) => handleUpdate('fico', v[0])} min={300} max={850} step={5} disabled={isLoading} />
        </div>

        {/* DTI RATIO */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <div className="flex items-center gap-2"><Scale className="w-4 h-4 text-primary" />DTI Ratio (%)</div>
            <span className="text-muted-foreground">{formData.dti}%</span>
          </div>
          <Slider value={[formData.dti]} onValueChange={(v) => handleUpdate('dti', v[0])} min={0} max={100} step={1} disabled={isLoading} />
        </div>

        {/* LOAN AMOUNT */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" />Loan Amount</div>
            <span className="text-muted-foreground">${(formData.loan_amnt / 1000).toFixed(0)}K</span>
          </div>
          <Slider value={[formData.loan_amnt]} onValueChange={(v) => handleUpdate('loan_amnt', v[0])} min={1000} max={50000} step={500} disabled={isLoading} />
        </div>

        {/* RISK AVERSION (THE SPECIAL SLIDER) */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="glass-sm p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-center font-bold">
              <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" />Risk-Aversion Coefficient (λ)</div>
              <span className="bg-primary/30 px-3 py-1 rounded-full text-sm">{formData.risk_lambda.toFixed(1)}</span>
            </div>
            <Slider value={[formData.risk_lambda]} onValueChange={(v) => handleUpdate('risk_lambda', v[0])} min={1.0} max={5.0} step={0.1} disabled={isLoading} />
            <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase">
              <span className="text-success">Aggressive</span>
              <span>Balanced</span>
              <span className="text-destructive">Conservative</span>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full bg-primary py-6 font-bold text-lg shadow-lg">
          {isLoading ? "Analyzing..." : "Analyze & Make Decision"}
        </Button>
      </form>
    </Card>
  );
};