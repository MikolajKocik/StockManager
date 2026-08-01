import type { DistributionData, StatsSummary, TrendData } from "@/models/statistics";
import api from "../config/api"
import { USE_MOCKS } from "../config/mock";
import { mockStatsSummary, mockTrendData, mockDistributionData } from "@/mocks/statistics.mocks";

export const statisticsApi = {
    getSummary: async (): Promise<StatsSummary> => {
        if (USE_MOCKS) return mockStatsSummary;
        const res = await api.get("statistics/summary");
        return res.data;
    },
    getTrend: async (): Promise<TrendData[]> => {
        if (USE_MOCKS) return mockTrendData;
        const res = await api.get("statistics/operations-trend?days=14");
        return res.data;
    },
    getDistribution: async (): Promise<DistributionData[]> => {
        if (USE_MOCKS) return mockDistributionData;
        const res = await api.get("statistics/stock-distribution");
        return res.data;
    }
}