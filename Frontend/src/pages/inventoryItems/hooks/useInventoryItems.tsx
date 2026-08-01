import { inventoryApi } from '@/api/internal/inventoryApi';
import type { InventoryItemCollection } from '@/models/inventoryItem';
import { useQuery } from '@tanstack/react-query';

export function useInventoryItems() {
    return useQuery<InventoryItemCollection>({
        queryKey: ['inventory-items'],
        queryFn: inventoryApi.getItems
    });
}
