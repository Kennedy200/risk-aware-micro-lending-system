'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BarChart3, ShieldCheck,
  Settings, Activity, Menu, X
} from 'lucide-react'; // Removed unused imports like ChevronLeft
import { cn } from '@/lib/utils';
import { useSidebarContext } from '@/context/sidebar-context';

const navItems = [
  {
    label: 'Main Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Inference engine & decision hub'
  },
  {
    label: 'Analytics Center',
    href: '/analytics',
    icon: BarChart3,
    description: 'Model performance & metrics'
  },
  {
    label: 'Audit Logs',
    href: '/audit-logs',
    icon: ShieldCheck,
    description: 'Transparency & compliance'
  },

  {
    label: 'System Health',
    href: '/system-health',
    icon: Activity,
    description: 'DevOps & infrastructure'
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebarContext();

  // FIX: Hide sidebar completely on login page to prevent flicker
  if (pathname === '/login') return null;

  const [isExpanded, setIsExpanded] = useState(true); // Desktop collapse state

  return (
    <>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen glass border-r border-border/50 z-40 transition-all duration-300 flex flex-col bg-slate-950/95 backdrop-blur-xl',
          isExpanded ? 'w-64' : 'w-20',
          // Fix: md:translate-x-0 ensures it shows on laptops
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Sidebar Header - Hidden on Mobile since we have Main Header */}
        <div className="hidden md:flex p-4 border-b border-border/50 items-center gap-4 min-h-[73px]">

          {/* HAMBURGER ICON - TOP LEFT (Controls Collapse) */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo Text (Only visible when expanded) */}
          {isExpanded && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-300">
              <h1 className="text-lg font-black text-white tracking-tighter uppercase">VR AI</h1>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Risk Platform</p>
            </div>
          )}
        </div>

        {/* Navigation Links - Added pt on mobile to clear the Header + Search */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-2 mt-4 pt-[180px] md:pt-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative',
                  isActive
                    ? 'bg-blue-600/10 border border-blue-500/30 text-blue-400'
                    // WHITE HOVER EFFECT
                    : 'text-slate-400 hover:bg-white hover:text-black font-medium border border-transparent',
                  !isExpanded && "justify-center"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110", isActive && "text-blue-400")} />

                {isExpanded && (
                  <div className="min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                    <p className="font-bold text-xs uppercase tracking-tight">{item.label}</p>
                    <p className="text-[10px] opacity-50 truncate">{item.description}</p>
                  </div>
                )}

                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border/50 p-4 space-y-2">
          <div className={cn("flex items-center gap-2", !isExpanded && "justify-center")}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            {isExpanded && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Operational</p>}
          </div>
          {isExpanded && <p className="text-[10px] text-slate-600 font-mono pl-4">build_v2.1.0_vNM</p>}
        </div>
      </aside>

      {/* Dynamic Content Spacer to push page content */}
      <div className={cn('transition-all duration-300 hidden md:block', isExpanded ? 'ml-64' : 'ml-20')} />
    </>
  );
}