import { type StatsSummary, type TrendData, type DistributionData } from "@/models/statistics";

export const mockStatsSummary: StatsSummary = {
    totalApiRequests: 15420,
    processedOperations: 843,
    timestamp: new Date().toISOString()
};

export const mockTrendData: TrendData[] = [
    { date: "2026-07-20", count: 100 },
    { date: "2026-07-21", count: 120 },
    { date: "2026-07-22", count: 90 },
    { date: "2026-07-23", count: 150 },
    { date: "2026-07-24", count: 130 }
];

export const mockDistributionData: DistributionData[] = [
    { label: "Electronics", count: 400 },
    { label: "Furniture", count: 250 },
    { label: "Office Supplies", count: 150 }
];
