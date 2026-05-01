import type { DistributionData, StatsSummary, TrendData } from "@/models/statistics";
import api from "../config/api"

export const statisticsApi = {
    getSummary: async (): Promise<StatsSummary> => {
        const res = await api.get("statistics/summary");
        return res.data;
    },
    getTrend: async (): Promise<TrendData[]> => {
        const res = await api.get("statistics/operations-trend?days=14");
        return res.data;
    },
    getDistribution: async (): Promise<DistributionData[]> => {
        const res = await api.get("statistics/stock-distribution");
        return res.data;
    }
}