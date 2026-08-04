import React from 'react';
import { formatNumber } from '@/utils/format';
import { KpiCard } from '@/components/common';

interface ProductKpiSummaryProps {
    totalProducts: number;
    totalStockUnits: number;
    outOfStockCount: number;
    genresCount: number;
}

export const ProductKpiSummary: React.FC<ProductKpiSummaryProps> = ({
    totalProducts,
    totalStockUnits,
    outOfStockCount,
    genresCount
}) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard
                title="Total Catalog SKUs"
                value={formatNumber(totalProducts)}
                subtitle="Master items"
                variant="default"
            />
            <KpiCard
                title="Total Units on Hand"
                value={formatNumber(totalStockUnits)}
                subtitle="In warehouse bins"
                variant="success"
            />
            <KpiCard
                title="Stock Warnings"
                value={formatNumber(outOfStockCount)}
                subtitle={outOfStockCount > 0 ? 'Replenishment needed' : 'All available'}
                variant={outOfStockCount > 0 ? 'danger' : 'default'}
            />
            <KpiCard
                title="Active Categories"
                value={formatNumber(genresCount)}
                subtitle="Product genres"
                variant="default"
            />
        </div>
    );
};
