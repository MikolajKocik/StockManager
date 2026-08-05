import React from 'react';
import { Header, KpiCard, Badge, Button, Select, Input } from '@/components/common';
import { formatCurrency, formatPercent } from '@/utils/format';

interface StockHeaderProps {
    totalValue: number;
    deadStockValue: number;
    fastStockValue: number;
    avgTurnoverDays: number;
    selectedWarehouse: string;
    onSelectWarehouse: (wh: string) => void;
    selectedRotation: string;
    onSelectRotation: (rot: string) => void;
    searchQuery: string;
    onSearchChange: (q: string) => void;
    viewMode: 'treemap' | 'table';
    onToggleViewMode: (mode: 'treemap' | 'table') => void;
}

export const WAREHOUSE_OPTIONS = [
    { label: 'All Warehouses', value: 'ALL' },
    { label: 'Main Warehouse (WH-01)', value: 'MainWarehouse' },
    { label: 'Secondary Warehouse (WH-02)', value: 'SecondaryWarehouse' },
] as const;

export const ROTATION_OPTIONS = [
    { label: 'All Turnover Speeds', value: 'ALL' },
    { label: 'Dead Stock / Stagnant (>90d)', value: 'DEAD_STOCK' },
    { label: 'Slow Moving (60-90d)', value: 'SLOW' },
    { label: 'Optimal Turnover (25-60d)', value: 'OPTIMAL' },
    { label: 'Fast Moving (<25d)', value: 'FAST' },
] as const;

export const StockHeader: React.FC<StockHeaderProps> = ({
    totalValue,
    deadStockValue,
    fastStockValue,
    avgTurnoverDays,
    selectedWarehouse,
    onSelectWarehouse,
    selectedRotation,
    onSelectRotation,
    searchQuery,
    onSearchChange,
    viewMode,
    onToggleViewMode
}) => {
    const deadStockRatio = totalValue > 0 ? (deadStockValue / totalValue) * 100 : 0;

    return (
        <header className="space-y-4">
            <Header
                title="Stock Capital & Value Treemap"
                subtitle="Interactive inventory capital visualization, turnover analysis and stagnant stock identification"
                badge={
                    <Badge variant="brand">
                        LIVE ASSETS
                    </Badge>
                }
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant={viewMode === 'treemap' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => onToggleViewMode('treemap')}
                        >
                            Treemap View
                        </Button>
                        <Button
                            variant={viewMode === 'table' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => onToggleViewMode('table')}
                        >
                            Table View
                        </Button>
                    </div>
                }
            />

            {/* Quick KPI Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <KpiCard
                    title="Total Frozen Capital"
                    value={formatCurrency(totalValue)}
                    subtitle="Current warehouse asset valuation"
                    variant="primary"
                />
                <KpiCard
                    title="Dead Stock Capital"
                    value={formatCurrency(deadStockValue)}
                    subtitle={`${formatPercent(deadStockRatio)} of total capital (>90d shelf)`}
                    variant="danger"
                    badge={<Badge variant="danger">Action Required</Badge>}
                />
                <KpiCard
                    title="Fast Turnover Stock"
                    value={formatCurrency(fastStockValue)}
                    subtitle="High velocity goods (<25d shelf)"
                    variant="success"
                />
                <KpiCard
                    title="Avg Inventory Turnover"
                    value={`${avgTurnoverDays} Days`}
                    subtitle="Target: <45 days across facility"
                    variant="default"
                />
            </div>

            {/* Filters Bar */}
            <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-64">
                    <div className="w-56">
                        <Select
                            value={selectedWarehouse}
                            onChange={(e) => onSelectWarehouse(e.target.value)}
                            options={WAREHOUSE_OPTIONS}
                        />
                    </div>
                    <div className="w-64">
                        <Select
                            value={selectedRotation}
                            onChange={(e) => onSelectRotation(e.target.value)}
                            options={ROTATION_OPTIONS}
                        />
                    </div>
                    <div className="w-56">
                        <Input
                            placeholder="Filter by SKU or name..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 font-mono">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-emerald-50 border border-emerald-500" />
                        <span className="text-[0.6875rem]">Fast (&lt;25d)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-[#f0f7f8] border border-[#2b6675]" />
                        <span className="text-[0.6875rem]">Optimal (25-60d)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-amber-50 border border-amber-500" />
                        <span className="text-[0.6875rem]">Slow (60-90d)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-red-50 border border-red-500" />
                        <span className="text-[0.6875rem] font-bold text-red-700">Dead Stock (&gt;90d)</span>
                    </div>
                </div>
            </div>
        </header>
    );
};
