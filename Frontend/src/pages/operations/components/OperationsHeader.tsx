import React from 'react';
import { Button } from '@/components/common';
import type { OperationType, OperationPriority } from '../models/operationKanban';

interface OperationsHeaderProps {
    filterType: OperationType | 'ALL';
    onFilterTypeChange: (type: OperationType | 'ALL') => void;
    filterPriority: OperationPriority | 'ALL';
    onFilterPriorityChange: (p: OperationPriority | 'ALL') => void;
    searchQuery: string;
    onSearchChange: (q: string) => void;
    onOpenCreateModal: () => void;
    activeFloorCount: number;
    inProgressCount: number;
    blockedCount: number;
    isBottleneckActive: boolean;
}

export const OperationsHeader: React.FC<OperationsHeaderProps> = ({
    filterType,
    onFilterTypeChange,
    filterPriority,
    onFilterPriorityChange,
    searchQuery,
    onSearchChange,
    onOpenCreateModal,
    activeFloorCount,
    inProgressCount,
    blockedCount,
    isBottleneckActive
}) => {
    return (
        <div className="bg-white border border-slate-300 rounded-lg shadow-2xs p-4 space-y-4">
            {/* Title & Quick Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[11px] text-[#2b6675] bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded-xs uppercase">
                            Kanban Dispatch
                        </span>
                        <h1 className="text-lg font-bold text-slate-800 leading-tight">
                            Warehouse Workflow & Operations Board
                        </h1>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Real-time picking, putaway & replenishment dispatcher. Manage queue priorities and operator floor allocations.
                    </p>
                </div>

                <Button
                    variant="primary"
                    size="md"
                    onClick={onOpenCreateModal}
                    className="shadow-2xs font-semibold whitespace-nowrap"
                >
                    + Dispatch New Operation
                </Button>
            </div>

            {/* Bottleneck Warning Banner if Floor is Overloaded */}
            {isBottleneckActive && (
                <div className="bg-amber-50/80 border border-amber-300 p-3 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-950">
                    <div className="flex items-center gap-2">
                        <span className="bg-[#AA9559] text-white font-bold text-[10px] px-1.5 py-0.5 rounded-xs font-mono uppercase">
                            Bottleneck Alert
                        </span>
                        <span className="font-medium text-slate-800">
                            Floor capacity high ({inProgressCount} active picking/putaway tasks). Reorder priority to prevent ramp staging delays.
                        </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-600 shrink-0">
                        High throughput load
                    </span>
                </div>
            )}

            {/* Technical KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50/70 border border-slate-300 rounded-md p-3 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Active Tasks
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className="text-xl font-bold font-mono text-slate-900">{activeFloorCount}</span>
                        <span className="text-xs text-slate-500 font-medium">in queue / flow</span>
                    </div>
                </div>

                <div className="bg-slate-50/70 border border-slate-300 rounded-md p-3 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Floor Capacity
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className={`text-xl font-bold font-mono ${isBottleneckActive ? 'text-[#8f7d49]' : 'text-slate-900'}`}>
                            {inProgressCount} / 4
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                            {isBottleneckActive ? 'High Load' : 'Optimal'}
                        </span>
                    </div>
                </div>

                <div className="bg-slate-50/70 border border-slate-300 rounded-md p-3 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Blocked Hazards
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className={`text-xl font-bold font-mono ${blockedCount > 0 ? 'text-[#991b1b]' : 'text-slate-900'}`}>
                            {blockedCount}
                        </span>
                        <span className={`text-xs font-medium ${blockedCount > 0 ? 'text-[#991b1b]' : 'text-slate-500'}`}>
                            {blockedCount > 0 ? 'Action Required' : 'All Clear'}
                        </span>
                    </div>
                </div>

                <div className="bg-slate-50/70 border border-slate-300 rounded-md p-3 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Avg Cycle Time
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className="text-xl font-bold font-mono text-slate-900">16.4</span>
                        <span className="text-xs text-slate-500 font-medium">min / order</span>
                    </div>
                </div>
            </div>

            {/* Filter & Live Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search operation, SKU, order WZ/PZ..."
                            className="text-xs bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-slate-800 focus:bg-white px-3 py-1.5 rounded outline-none w-72 transition-colors shadow-inner font-medium text-slate-800 placeholder:text-slate-400"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => onSearchChange('')}
                                className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                                &#10005;
                            </button>
                        )}
                    </div>

                    {/* Type Filter Buttons */}
                    <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-slate-600 uppercase font-mono mr-1">
                            Type:
                        </span>
                        {(['ALL', 'PICKING', 'PUTAWAY', 'REPLENISHMENT', 'INTERNAL_TRANSFER'] as const).map(t => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => onFilterTypeChange(t)}
                                className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                                    filterType === t
                                        ? 'bg-[#2b6675] text-white shadow-2xs'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                                }`}
                            >
                                {t === 'ALL' ? 'All' : t.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Priority Filter */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-600 uppercase font-mono">
                        Priority:
                    </span>
                    <select
                        value={filterPriority}
                        onChange={(e) => onFilterPriorityChange(e.target.value as any)}
                        className="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1 font-semibold text-slate-700 outline-none focus:border-slate-800 cursor-pointer"
                    >
                        <option value="ALL">All Priorities</option>
                        <option value="CRITICAL">Critical / Urgent</option>
                        <option value="HIGH">High Priority</option>
                        <option value="NORMAL">Normal</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
