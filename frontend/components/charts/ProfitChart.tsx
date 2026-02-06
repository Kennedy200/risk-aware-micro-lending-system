'use client';

import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

export default function ProfitChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis type="number" dataKey="risk" stroke="rgba(255,255,255,0.3)" style={{ fontSize: '11px' }} name="Risk Factor" />
                <YAxis type="number" dataKey="profit" stroke="rgba(255,255,255,0.3)" style={{ fontSize: '11px' }} name="Exp. Utility" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Profit Cluster" data={data} fill="#22c55e" />
            </ScatterChart>
        </ResponsiveContainer>
    );
}
