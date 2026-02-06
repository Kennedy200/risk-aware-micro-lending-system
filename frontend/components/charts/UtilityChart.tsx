'use client';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

export default function UtilityChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="range" stroke="rgba(255,255,255,0.3)" style={{ fontSize: '11px', fontWeight: 'bold' }} />
                <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: '11px', fontWeight: 'bold' }} />
                <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} />
            </BarChart>
        </ResponsiveContainer>
    );
}
