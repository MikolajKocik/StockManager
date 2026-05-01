import { useQuery } from '@tanstack/react-query';
import { statisticsApi } from '@/api/internal/statisticsApi';
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
import ChartContainer from './components/ChartContainer';
import './Analytics.css';
import type { StatsSummary, TrendData, DistributionData } from '@/models/statistics';
import StatisticsCard from './components/StatisticsCard';

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
    const { data: summary, isLoading: isSummaryLoading } = useQuery<StatsSummary>({
        queryKey: ['stats-summary'],
        queryFn: statisticsApi.getSummary,
        refetchInterval: 10000
    });

    const { data: trend = [], isLoading: isTrendLoading } = useQuery<TrendData[]>({
        queryKey: ['stats-trend'],
        queryFn: statisticsApi.getTrend,
        refetchInterval: 10000
    });

    const { data: distribution = [], isLoading: isDistributionLoading } = useQuery<DistributionData[]>({
        queryKey: ['stats-distribution'],
        queryFn: statisticsApi.getDistribution,
        refetchInterval: 10000
    });

    const isLoading = isSummaryLoading || isTrendLoading || isDistributionLoading;

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

    if (isLoading) return <div className="analytics-container">Loading analytics...</div>;

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