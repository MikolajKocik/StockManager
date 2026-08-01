import React from 'react';
import { Button, Select, Input } from '@/components/common';
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
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#D9D9D9] p-2.5 shadow-md border border-slate-300">
            {/* Filter and Search controls */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="w-44">
                    <Select
                        options={[
                            { value: 'ALL', label: 'All Sectors (A-D)' },
                            { value: 'A', label: 'Sector A (Electronics)' },
                            { value: 'B', label: 'Sector B (Appliances)' },
                            { value: 'C', label: 'Sector C (Hardware)' },
                            { value: 'D', label: 'Sector D (Packaging)' },
                        ]}
                        value={selectedSector}
                        onChange={(e) => onSectorChange(e.target.value)}
                    />
                </div>
                <div className="w-52">
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
                    variant="accent"
                    size="sm"
                    onClick={onRefresh}
                    disabled={isFetching}
                >
                    {isFetching ? 'Refreshing...' : 'Refresh'}
                </Button>
            </div>

            {/* Warehouse KPI summary chips */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-700">
                <div className="bg-slate-200 px-2.5 py-1 rounded border border-slate-300">
                    <span className="text-slate-500 mr-1">Warehouse Occupancy:</span>
                    <strong className="text-slate-800">{stats.occupancyPercent}%</strong>
                </div>
                <div className="bg-slate-200 px-2.5 py-1 rounded border border-slate-300">
                    <span className="text-slate-500 mr-1">Active Racks:</span>
                    <strong className="text-emerald-700">{stats.activeCount}</strong>
                </div>
                <div className="bg-slate-200 px-2.5 py-1 rounded border border-slate-300">
                    <span className="text-slate-500 mr-1">Under Service:</span>
                    <strong className="text-rose-700">{stats.maintCount}</strong>
                </div>
            </div>
        </div>
    );
};
