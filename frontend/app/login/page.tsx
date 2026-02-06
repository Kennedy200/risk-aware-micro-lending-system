'use client';

import React, { useState } from "react"
import { useRouter } from 'next/navigation';
import { Lock, User, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }
    setIsLoading(true);

    setIsLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center overflow-hidden">

      <div className="relative z-10 w-full max-w-md px-6">
        {/* LOGO & TITLE SECTION */}
        <div className="text-center mb-10 space-y-4">
          <div className="flex justify-center">
            {/* YOUR LOGO - BIG & CENTERED */}
            <div className="w-20 h-20 flex items-center justify-center">
              <img
                src="/my-logo.png"
                alt="VantageRisk AI"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">VantageRisk AI</h1>
            <p className="text-slate-400 text-sm mt-2">Credit Risk Management Portal</p>
          </div>
        </div>

        {/* LOGIN CARD - EXACT MATCH TO YOUR SCREENSHOT */}
        <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Officer Identity */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Officer Identity
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <Input
                  name="email"
                  placeholder="Vic123@gmail.com"
                  className="pl-12 bg-slate-800/40 border-slate-700 h-12 rounded-xl focus:border-blue-500 text-white"
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                />
              </div>
            </div>

            {/* Access Key */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Access Key
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 bg-slate-800/40 border-slate-700 h-12 rounded-xl focus:border-blue-500 text-white"
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}

            {/* Button with exact blue gradient/glow */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all text-lg"
            >
              {isLoading ? "Authenticating..." : "Authorize Session"}
            </Button>
          </form>

          {/* Footer Notice */}
          <div className="mt-10 pt-6 border-t border-slate-800">
            <div className="flex gap-3 items-start opacity-50 px-2">
              <ShieldAlert className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                Notice: Login credentials are not stored in the public audit trail. Only loan decision outputs are recorded for regulatory compliance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}