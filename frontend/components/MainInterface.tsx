'use client';

import { InputForm } from '@/components/InputForm';
import { DecisionHub } from '@/components/DecisionHub';
import { AuditLog } from '@/components/AuditLog';

export const MainInterface = ({ formData, setFormData, onAnalyze, currentDecision, isLoading }: any) => {
  return (
    <section className="bg-background py-8 lg:py-12 space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">1</span>
              Input Engine
            </h3>
            <InputForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={onAnalyze} 
              isLoading={isLoading} 
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">2</span>
              AI Decision Hub
            </h3>
            <DecisionHub decision={currentDecision} isLoading={isLoading} />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">3</span>
          System Audit Trail
        </h3>
        <AuditLog decision={currentDecision} />
      </div>
    </section>
  );
};