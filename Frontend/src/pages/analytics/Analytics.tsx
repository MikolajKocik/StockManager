import { useState, useEffect } from 'react';
import api from '@/api/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import ChartContainer from '@/components/ChartContainer';
import './Analytics.css';
import type { StatsSummary, TrendData, DistributionData } from '@/models/statistics';
import StatisticsCard from '@/components/StatisticsCard';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Analytics() {
    const [summary, setSummary] = useState<StatsSummary | null>(null);
    const [trend, setTrend] = useState<TrendData[]>([]);
    const [distribution, setDistribution] = useState<DistributionData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [summaryRes, trendRes, distRes] = await Promise.all([
                    api.get('/statistics/summary'),
                    api.get('/statistics/operations-trend?days=14'),
                    api.get('/statistics/stock-distribution')
                ]);

                setSummary(summaryRes.data);
                setTrend(trendRes.data);
                setDistribution(distRes.data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();

        // Polling interval
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    const trendChartData = {
        labels: trend.map(t => new Date(t.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Warehouse Operations',
                data: trend.map(t => t.count),
                fill: true,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const distChartData = {
        labels: distribution.map(d => d.label),
        datasets: [
            {
                data: distribution.map(d => d.count),
                backgroundColor: [
                    '#10b981',
                    '#3b82f6',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6',
                    '#ec4899',
                ],
                borderWidth: 0,
            },
        ],
    };

    if (loading) return <div className="analytics-container">Loading analytics...</div>;

    return (
        <div className="analytics-container animate-fade">
            <header className="analytics-header">
                <h1>Platform Analytics</h1>
                <p className="home-subtitle">Monitor system performance and inventory distribution</p>
            </header>

            <div className="stats-grid">
                <StatisticsCard 
                    label="Total API Traffic"
                    value={summary?.totalApiRequests.toLocaleString()} 
                />
                <StatisticsCard
                    label="Operations Processed"
                    value={summary?.processedOperations.toLocaleString()}
                />
                <StatisticsCard
                    label="Placeholder"
                    value="Placeholder"
                />
            </div>

            <div className="charts-grid">
                <ChartContainer title="Operation Trends (Last 14 Days)">
                    <Line
                        data={trendChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { beginAtZero: true, grid: { color: '#e2e8f0' } },
                                x: { grid: { display: false } }
                            }
                        }}
                    />
                </ChartContainer>

                <ChartContainer title="Stock Distribution by Genre">
                    <Doughnut
                        data={distChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'bottom' }
                            }
                        }}
                    />
                </ChartContainer>
            </div>
        </div>
    );
}