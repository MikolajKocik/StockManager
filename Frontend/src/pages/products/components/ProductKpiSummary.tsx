import React from 'react';
import { formatNumber } from '@/utils/format';

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
            {/* Total Catalog SKUs */}
            <div className="bg-white border border-slate-300 rounded-md p-3 shadow-2xs flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Total Catalog SKUs
                </span>
                <div className="flex items-baseline justify-between mt-2">
                    <span className="text-xl font-bold font-mono text-slate-900">
                        {formatNumber(totalProducts)}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                        Master items
                    </span>
                </div>
            </div>

            {/* Total Warehouse Stock */}
            <div className="bg-white border border-slate-300 rounded-md p-3 shadow-2xs flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Total Units on Hand
                </span>
                <div className="flex items-baseline justify-between mt-2">
                    <span className="text-xl font-bold font-mono text-[#0e5f32]">
                        {formatNumber(totalStockUnits)}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                        In warehouse bins
                    </span>
                </div>
            </div>

            {/* Out of Stock SKUs */}
            <div className="bg-white border border-slate-300 rounded-md p-3 shadow-2xs flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Zero Stock Warnings
                </span>
                <div className="flex items-baseline justify-between mt-2">
                    <span className={`text-xl font-bold font-mono ${outOfStockCount > 0 ? 'text-[#991b1b]' : 'text-slate-900'}`}>
                        {formatNumber(outOfStockCount)}
                    </span>
                    <span className={`text-xs font-medium ${outOfStockCount > 0 ? 'text-[#991b1b]' : 'text-slate-500'}`}>
                        {outOfStockCount > 0 ? 'Replenishment needed' : 'All available'}
                    </span>
                </div>
            </div>

            {/* Categories & Storage Types */}
            <div className="bg-white border border-slate-300 rounded-md p-3 shadow-2xs flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Active Categories
                </span>
                <div className="flex items-baseline justify-between mt-2">
                    <span className="text-xl font-bold font-mono text-slate-900">
                        {formatNumber(genresCount)}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                        Product genres
                    </span>
                </div>
            </div>
        </div>
    );
};
