import React from 'react';
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
        <div className="w-full space-y-3">
            {/* Top Dark Slate Header Card */}
            <div className="bg-[#384155] rounded-xl p-4 md:p-5 text-white shadow-lg border border-slate-700/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <span className="bg-[#fbbf24] text-slate-950 font-black text-xs px-2.5 py-1 rounded font-mono tracking-wider uppercase shadow-xs">
                            LIVE DISPATCH & KANBAN
                        </span>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                            Warehouse Workflow & Operations Board
                        </h1>
                    </div>
                    <p className="text-xs text-slate-300">
                        Real-time picking & putaway workflow dispatcher. Drag & drop emergency orders to top to broadcast priority commands.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                    <button
                        type="button"
                        onClick={onOpenCreateModal}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-lg font-bold cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                    >
                        <span>+ Dispatch New Operation</span>
                    </button>
                </div>
            </div>

            {/* Bottleneck Warning Banner if Floor is Overloaded */}
            {isBottleneckActive && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-950 animate-pulse-subtle">
                    <div className="flex items-center gap-2">
                        <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded font-mono uppercase">
                            BOTTLENECK WARNING
                        </span>
                        <span className="font-semibold">
                            Floor queue overloaded ({inProgressCount} active picking/putaway tasks). Reorder priority or reassign reach trucks to prevent shipping slot delays.
                        </span>
                    </div>
                    <span className="text-[11px] font-mono text-amber-800 shrink-0">
                        Zone A & C throughput constrained
                    </span>
                </div>
            )}

            {/* Quick KPI Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider block font-mono">
                        Active Floor Tasks
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold text-slate-800 font-mono">{activeFloorCount}</span>
                        <span className="text-xs text-blue-800 font-medium">In Flow</span>
                    </div>
                </div>

                <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider block font-mono">
                        In-Progress Capacity
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className={`text-2xl font-bold font-mono ${isBottleneckActive ? 'text-amber-800' : 'text-slate-800'}`}>
                            {inProgressCount} / 4
                        </span>
                        <span className={`text-xs font-semibold ${isBottleneckActive ? 'text-amber-900' : 'text-emerald-800'}`}>
                            {isBottleneckActive ? '125% (Overload)' : 'Normal'}
                        </span>
                    </div>
                </div>

                <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider block font-mono">
                        Blocked / Hazard Tasks
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className={`text-2xl font-bold font-mono ${blockedCount > 0 ? 'text-rose-800' : 'text-slate-800'}`}>
                            {blockedCount}
                        </span>
                        <span className="text-xs text-rose-900 font-medium">
                            {blockedCount > 0 ? 'Action Required' : 'Clear'}
                        </span>
                    </div>
                </div>

                <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider block font-mono">
                        Avg Cycle Duration
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold text-slate-800 font-mono">16.4</span>
                        <span className="text-xs text-slate-700 font-medium">min / order</span>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
                <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search operation, SKU, order WZ/PZ or aisle..."
                        className="px-3 py-1.5 border border-slate-300 rounded-md text-xs w-72 focus:outline-none focus:ring-1 focus:ring-slate-500 font-medium"
                    />

                    {/* Type Filter */}
                    <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-slate-700 uppercase font-mono mr-1">
                            Type:
                        </span>
                        {(['ALL', 'PICKING', 'PUTAWAY', 'REPLENISHMENT', 'INTERNAL_TRANSFER'] as const).map(t => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => onFilterTypeChange(t)}
                                className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                                    filterType === t
                                        ? 'bg-[#384155] text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                                }`}
                            >
                                {t === 'ALL' ? 'All Operations' : t.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Priority Filter */}
                <div className="flex items-center gap-1.5 self-end md:self-auto">
                    <span className="text-[11px] font-bold text-slate-700 uppercase font-mono">
                        Priority:
                    </span>
                    <select
                        value={filterPriority}
                        onChange={(e) => onFilterPriorityChange(e.target.value as any)}
                        className="px-2.5 py-1 border border-slate-300 rounded-md text-xs bg-white font-medium"
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
