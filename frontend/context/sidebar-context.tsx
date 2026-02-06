'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggleOpen: () => void;
    isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useIsMobile();

    // Close sidebar when switching to desktop view
    useEffect(() => {
        if (!isMobile) {
            setIsOpen(false);
        }
    }, [isMobile]);

    const toggleOpen = () => setIsOpen((prev) => !prev);

    return (
        <SidebarContext.Provider value={{ isOpen, setIsOpen, toggleOpen, isMobile }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebarContext() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebarContext must be used within a SidebarProvider');
    }
    return context;
}
