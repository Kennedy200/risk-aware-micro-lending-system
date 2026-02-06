import React from "react"
import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper'
import './globals.css'

export const metadata: Metadata = {
    title: 'VantageRisk AI - Enterprise Risk Platform',
    description: 'Production-ready multi-page platform for risk-aware utility-based lending decisions',
    generator: 'VantageRisk Core v1.0',
    icons: {
        icon: '/my-logo.png',
        apple: '/my-logo.png',
    },
}

export const viewport: Viewport = {
    themeColor: '#0f172a',
    colorScheme: 'dark',
    userScalable: true,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="dark">
            <body className="antialiased bg-slate-950 text-slate-50 font-sans">
                <ClientLayoutWrapper>
                    {children}
                </ClientLayoutWrapper>
                <Analytics />
            </body>
        </html>
    )
}
