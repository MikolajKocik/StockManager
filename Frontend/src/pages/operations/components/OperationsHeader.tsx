import React from 'react';
import { Button, KpiCard, Badge, Input, Select } from '@/components/common';
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
        <header className="bg-white border border-slate-300 rounded-lg shadow-2xs p-4 space-y-4">
            {/* Title & Quick Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant="blue">
                            Kanban Dispatch
                        </Badge>
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
                    Dispatch New Operation
                </Button>
            </div>

            {/* Bottleneck Warning Banner if Floor is Overloaded */}
            {isBottleneckActive && (
                <div className="bg-amber-50/80 border border-amber-300 p-3 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-950">
                    <div className="flex items-center gap-2">
                        <Badge variant="warning">
                            Bottleneck Alert
                        </Badge>
                        <span className="font-medium text-slate-800">
                            Floor capacity high ({inProgressCount} active picking/putaway tasks). Reorder priority to prevent ramp staging delays.
                        </span>
                    </div>
                    <span className="text-[0.6875rem] font-mono text-slate-600 shrink-0">
                        High throughput load
                    </span>
                </div>
            )}

            {/* Technical KPI Grid using KpiCard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KpiCard
                    title="Active Tasks"
                    value={activeFloorCount}
                    subtitle="in queue / flow"
                    variant="default"
                />
                <KpiCard
                    title="Floor Capacity"
                    value={`${inProgressCount} / 4`}
                    subtitle={isBottleneckActive ? 'High Load' : 'Optimal'}
                    variant={isBottleneckActive ? 'warning' : 'default'}
                />
                <KpiCard
                    title="Blocked Hazards"
                    value={blockedCount}
                    subtitle={blockedCount > 0 ? 'Action Required' : 'All Clear'}
                    variant={blockedCount > 0 ? 'danger' : 'default'}
                />
                <KpiCard
                    title="Avg Cycle Time"
                    value="16.4"
                    subtitle="min / order"
                    variant="default"
                />
            </div>

            {/* Filter & Live Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search operation, SKU, order WZ/PZ..."
                            wrapperClassName="w-72"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => onSearchChange('')}
                                className="absolute right-2 top-2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                                &#10005;
                            </button>
                        )}
                    </div>

                    {/* Type Filter Buttons */}
                    <div className="flex items-center gap-1">
                        <span className="text-[0.6875rem] font-bold text-slate-600 uppercase font-mono mr-1">
                            Type:
                        </span>
                        {(['ALL', 'PICKING', 'PUTAWAY', 'REPLENISHMENT', 'INTERNAL_TRANSFER'] as const).map(t => (
                            <Button
                                key={t}
                                variant={filterType === t ? 'primary' : 'secondary'}
                                size="sm"
                                onClick={() => onFilterTypeChange(t)}
                                className="text-[0.6875rem]"
                            >
                                {t === 'ALL' ? 'All' : t.replace('_', ' ')}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Priority Filter */}
                <div className="flex items-center gap-1.5">
                    <Select
                        label=""
                        value={filterPriority}
                        onChange={(e) => onFilterPriorityChange(e.target.value as any)}
                        wrapperClassName="w-40"
                        options={[
                            { value: 'ALL', label: 'All Priorities' },
                            { value: 'CRITICAL', label: 'Critical / Urgent' },
                            { value: 'HIGH', label: 'High Priority' },
                            { value: 'NORMAL', label: 'Normal' },
                            { value: 'LOW', label: 'Low' },
                        ]}
                    />
                </div>
            </div>
        </header>
    );
};
