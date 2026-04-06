import React from 'react';
import { TrendingUp } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import styles from '../styles/Analytics.module.scss';

const PerformanceChart = ({ chartData }) => (
    <section className={styles.mainChart}>
        <div className={styles.chartHeader}>
            <div className={styles.titleArea}>
                <h3>Tương quan Bài thi & Độ phủ sóng</h3>
                <p>Theo dõi số lượng thiết kế nộp vào và lượt tương tác (Like/Share)</p>
            </div>
            <TrendingUp size={18} className={styles.trendIcon} />
        </div>

        <div className={styles.chartContent}>
            <ResponsiveContainer width="100%" height={300} minWidth={0}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                    
                    <Area yAxisId="left" type="monotone" name="Bài dự thi (Posts)" dataKey="submissions" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPosts)" />
                    <Area yAxisId="right" type="monotone" name="Tương tác (Likes & Shares)" dataKey="engagements" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorEngagement)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </section>
);

export default PerformanceChart;