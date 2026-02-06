'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/context/sidebar-context';

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    if (isLoginPage) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
                {children}
            </div>
        );
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-slate-950 text-slate-50 font-sans">
                {/* Global Sidebar Component */}
                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 min-h-screen flex flex-col relative overflow-hidden">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
