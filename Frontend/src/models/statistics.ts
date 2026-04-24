export interface StatsSummary {
    totalApiRequests: number;
    processedOperations: number;
    timestamp: string;
}

export interface TrendData {
    date: string;
    count: number;
}

export interface DistributionData {
    label: string;
    count: number;
}