'use client';

import { useState } from 'react';
import { Search, Bell, Settings, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebarContext } from '@/context/sidebar-context';

const Header = () => {
  const { toggleOpen } = useSidebarContext();
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);


  // NEW: Search State
  const [searchTerm, setSearchTerm] = useState("");

  // NEW: Search Trigger Function
  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Dispatches a global event that AuditLog.tsx is listening for
      window.dispatchEvent(new CustomEvent('filterLogs', { detail: searchTerm }));
    }
  };

  return (
    <header className="border-b border-slate-700/30 bg-background/40 backdrop-blur-xl sticky top-0 z-[60]">
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-4 md:gap-6">

          <div className="flex items-center gap-4 shrink-0">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleOpen}
              className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-secondary/50 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo Section - Hamburger Removed */}
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.href = '/dashboard'}>
              <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105">
                <img src="/my-logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-foreground leading-none tracking-tight">VantageRisk</span>
                <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mt-1">Decision AI</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC SEARCH BAR */}
          <div className="hidden lg:flex flex-1 max-w-2xl">
            <div className={`flex items-center gap-3 px-4 py-2.5 w-full rounded-lg transition-all ${searchFocused ? 'bg-secondary/80 border border-primary/50 ring-2 ring-primary/20' : 'glass border border-slate-600/30 hover:border-slate-500/50'}`}>
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search FICO or Decision (Press Enter)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch} // Triggers the search
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none"
              />
              <span className="text-xs text-muted-foreground">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full glass border border-slate-600/30">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">v1.0.4-Logistic Regression</span>
            </div>

            <div className="relative">
              <button onClick={() => setNotificationOpen(!notificationOpen)} className="p-2 hover:bg-secondary/50 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full border-2 border-slate-950"></span>
              </button>
            </div>

            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1 hover:bg-secondary/50 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">OV</div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute top-12 right-0 w-56 glass border border-slate-600/30 rounded-lg shadow-2xl p-2 space-y-1">
                  <div className="px-3 py-2">
                    <p className="text-xs font-bold text-foreground">Officer Vic</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Bank Manager</p>
                  </div>
                  <div className="h-px bg-slate-800 my-1 mx-2" />
                  <button className="w-full text-left px-3 py-2 text-xs text-red-400 font-bold hover:bg-red-500/10 rounded" onClick={() => window.location.href = '/'}>Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* MOBILE ONLY SEARCH BAR - APPEARS UNDERNEATH */}
      <div className="mt-4 md:hidden w-full">
        <div className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg glass border border-slate-600/30">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search FICO or Decision..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none"
          />
        </div>
      </div>


    </header>
  );
};

export default Header;