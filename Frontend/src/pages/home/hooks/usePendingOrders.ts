import { useState } from 'react';
import { useSalesOrders } from '@/hooks/queries/useSalesOrders';
import { usePurchaseOrders } from '@/hooks/queries/usePurchaseOrders';
import { genericSort } from '@/utils/sort';

export type PendingOrdersSortKey =
    | 'product'
    | 'unit'
    | 'quantity'
    | 'price'
    | 'sum'
    | 'orderType'
    | 'client'
    | 'NIP'
    | 'date';

export interface PendingOrderItem {
    product?: string;
    unit?: string;
    quantity: number;
    price: number;
    sum: number;
    type: 'WZ' | 'PZ';
    client?: string;
    nip: string;
    date: string;
}

export function usePendingOrders() {
    const { data: salesOrders = [] } = useSalesOrders();
    const { data: purchaseOrders = [] } = usePurchaseOrders();
    const [activeSort, setActiveSort] = useState<PendingOrdersSortKey | null>(null);

    const toggleSort = (key: PendingOrdersSortKey) => {
        setActiveSort(prev => (prev === key ? null : key));
    };

    const pendingItems: PendingOrderItem[] = [
        ...salesOrders.flatMap(order =>
            order.salesOrderLines.map(line => ({
                product: line.productName,
                unit: line.uoM,
                quantity: line.quantity,
                price: line.unitPrice,
                sum: line.lineTotal,
                type: 'WZ' as const,
                client: order.customerName,
                nip: order.customerTaxId || '-',
                date: order.orderDate
            }))
        ),
        ...purchaseOrders.flatMap(order =>
            order.purchaseOrderLines.map(line => ({
                product: line.productName,
                unit: line.uoM,
                quantity: line.quantity,
                price: line.unitPrice,
                sum: line.lineTotal,
                type: 'PZ' as const,
                client: order.supplierName,
                nip: order.supplierTaxId || '-',
                date: order.orderDate
            }))
        )
    ];

    const sortedItems = genericSort(pendingItems, activeSort, {
        product: 'product',
        unit: 'unit',
        quantity: 'quantity',
        price: 'price',
        sum: 'sum',
        orderType: 'type',
        client: 'client',
        NIP: 'nip',
        date: 'date'
    });

    return {
        items: sortedItems,
        activeSort,
        toggleSort
    };
}
