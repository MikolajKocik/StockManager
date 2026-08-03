import { useState } from 'react';
import { useInventoryItems } from '@/pages/inventoryItems/hooks/useInventoryItems';
import { genericSort } from '@/utils/sort';

export type LocationBinSortKey = 'name' | 'type' | 'usage';

export function useLocationBins() {
    const { data: itemsResponse = { data: [] } } = useInventoryItems();
    const [activeSort, setActiveSort] = useState<LocationBinSortKey | null>(null);

    const toggleSort = (key: LocationBinSortKey) => {
        setActiveSort(prev => (prev === key ? null : key));
    };

    const items = genericSort(itemsResponse?.data || [], activeSort, {
        name: 'binLocationCode',
        type: 'warehouse',
        usage: 'quantityOnHand'
    });

    return {
        items,
        activeSort,
        toggleSort
    };
}
