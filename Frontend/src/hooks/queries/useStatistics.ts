import { useQuery } from "@tanstack/react-query";
import { statisticsApi } from "@/api/internal/statisticsApi";
import { type StatsSummary, type TrendData, type DistributionData } from "@/models/statistics";

export const useStatsSummary = () => {
    return useQuery<StatsSummary>({
        queryKey: ["stats-summary"],
        queryFn: () => statisticsApi.getSummary()
    });
};

export const useTrendData = () => {
    return useQuery<TrendData[]>({
        queryKey: ["trend-data"],
        queryFn: () => statisticsApi.getTrend()
    });
};

export const useDistributionData = () => {
    return useQuery<DistributionData[]>({
        queryKey: ["distribution-data"],
        queryFn: () => statisticsApi.getDistribution()
    });
};
