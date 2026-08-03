import { useState } from 'react';
import { useDistributionData } from '@/hooks/queries/useStatistics';
import { genericSort } from '@/utils/sort';

export type DistributionSortKey = 'category' | 'count';

export function useDistributionStatistics() {
    const { data: rawStats = [] } = useDistributionData();
    const [activeSort, setActiveSort] = useState<DistributionSortKey | null>(null);

    const toggleSort = (key: DistributionSortKey) => {
        setActiveSort(prev => (prev === key ? null : key));
    };

    const statistics = genericSort(rawStats, activeSort, {
        category: 'label',
        count: 'count'
    });

    return {
        statistics,
        activeSort,
        toggleSort
    };
}
