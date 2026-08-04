import React from 'react';
import { Button, Select, Input } from '@/components/common/core';
import type { BinMapStats } from '@/models/binMap';

interface BinMapToolbarProps {
    selectedSector: string;
    searchTerm: string;
    stats: BinMapStats;
    isFetching: boolean;
    onSectorChange: (sector: string) => void;
    onSearchChange: (search: string) => void;
    onResetFilters: () => void;
    onRefresh: () => void;
}

const SECTOR_OPTIONS = [
    { value: 'ALL', label: 'All Sectors (A-D)' },
    { value: 'A', label: 'Sector A (Electronics)' },
    { value: 'B', label: 'Sector B (Appliances)' },
    { value: 'C', label: 'Sector C (Hardware)' },
    { value: 'D', label: 'Sector D (Packaging)' },
] as const;

export const BinMapToolbar: React.FC<BinMapToolbarProps> = ({
    selectedSector,
    searchTerm,
    stats,
    isFetching,
    onSectorChange,
    onSearchChange,
    onResetFilters,
    onRefresh
}) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg shadow-2xs border border-slate-300">
            {/* Filter and Search controls */}
            <div className="flex flex-wrap items-center gap-2.5">
                <div className="w-52">
                    <Select
                        options={SECTOR_OPTIONS}
                        value={selectedSector}
                        onChange={(e) => onSectorChange(e.target.value)}
                    />
                </div>
                <div className="w-60">
                    <Input
                        type="text"
                        placeholder="Search rack, code, product..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                {(selectedSector !== 'ALL' || searchTerm) && (
                    <Button variant="ghost" size="sm" onClick={onResetFilters}>
                        Clear Filters
                    </Button>
                )}
                <Button
                    variant="primary"
                    size="sm"
                    onClick={onRefresh}
                    isLoading={isFetching}
                >
                    Refresh Layout
                </Button>
            </div>

            {/* Warehouse KPI summary chips */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
                <div className="bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                    <span className="text-slate-500 mr-1">Occupancy:</span>
                    <strong className="text-slate-900">{stats.occupancyPercent}%</strong>
                </div>
                <div className="bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    <span className="text-emerald-700 mr-1">Active Racks:</span>
                    <strong className="text-emerald-800">{stats.activeCount}</strong>
                </div>
                <div className="bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                    <span className="text-rose-700 mr-1">Maintenance:</span>
                    <strong className="text-rose-800">{stats.maintCount}</strong>
                </div>
            </div>
        </div>
    );
};
