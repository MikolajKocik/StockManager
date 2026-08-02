import React from 'react';
import { Button } from '@/components/common';

export type ShipmentsViewMode = 'GANTT' | 'TABLE';

interface ShipmentsHeaderProps {
    viewMode: ShipmentsViewMode;
    onViewModeChange: (mode: ShipmentsViewMode) => void;
    onOpenCreateModal: () => void;
    totalShipments: number;
    activeRampsCount: number;
    delayedCount: number;
    totalPallets: number;
    conflictsCount: number;
    selectedDate: string;
    onDateChange: (date: string) => void;
}

export const ShipmentsHeader: React.FC<ShipmentsHeaderProps> = ({
    viewMode,
    onViewModeChange,
    onOpenCreateModal,
    totalShipments,
    activeRampsCount,
    delayedCount,
    totalPallets,
    conflictsCount,
    selectedDate,
    onDateChange
}) => {
    return (
        <div className="w-full space-y-4 mb-4">
            {/* Top Bar with Dark Header */}
            <div className="w-full bg-[#384155] text-white p-4 rounded-lg shadow-md border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h1 className="bg-amber-400 text-slate-900 font-black text-2xl px-2 py-0.5 rounded tracking-wide font-mono uppercase">
                            DOCK SCHEDULER & SHIPMENTS
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="bg-slate-800 border border-slate-600 text-white rounded px-2.5 py-1.5 text-xs font-mono outline-none focus:border-amber-400"
                    />

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onOpenCreateModal}
                        className="text-xs font-semibold shadow-sm bg-emerald-600 hover:bg-emerald-700 border-emerald-700"
                    >
                        + Schedule Truck Delivery
                    </Button>
                </div>
            </div>

            {/* Quick KPI Metric Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Today's Shipments
                    </span>
                    <span className="text-xl font-bold font-mono text-slate-900">
                        {totalShipments}
                    </span>
                </div>

                <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Occupied Ramps
                    </span>
                    <span className="text-xl font-bold font-mono text-blue-600">
                        {activeRampsCount} / 6
                    </span>
                </div>

                <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Delayed Trucks
                    </span>
                    <span className={`text-xl font-bold font-mono ${delayedCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                        {delayedCount}
                    </span>
                </div>

                <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Scheduled Pallets
                    </span>
                    <span className="text-xl font-bold font-mono text-slate-900">
                        {totalPallets}
                    </span>
                </div>

                <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Dock Conflicts
                    </span>
                    <span className={`text-xl font-bold font-mono ${conflictsCount > 0 ? 'text-rose-600 animate-pulse' : 'text-emerald-600'}`}>
                        {conflictsCount === 0 ? '0 None' : `${conflictsCount} Collision`}
                    </span>
                </div>
            </div>

            {/* View Switcher Tabs */}
            <div className="bg-white border border-slate-300 rounded-lg p-2 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex gap-1.5">
                    <button
                        onClick={() => onViewModeChange('GANTT')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                            viewMode === 'GANTT'
                                ? 'bg-slate-800 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        Interactive Gantt Timeline (Docks)
                    </button>
                    <button
                        onClick={() => onViewModeChange('TABLE')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                            viewMode === 'TABLE'
                                ? 'bg-slate-800 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        Shipments Registry (List)
                    </button>
                </div>
            </div>
        </div>
    );
};
