import React from 'react';
import { Button, KpiCard, Badge, Input, Header } from '@/components/common';

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
    const actions = (
        <>
            <div className="w-36">
                <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="font-mono text-xs py-1"
                />
            </div>

            <Button
                variant="primary"
                size="md"
                onClick={onOpenCreateModal}
            >
                Schedule Truck Delivery
            </Button>
        </>
    );

    return (
        <div className="w-full space-y-4">
            {/* Top Bar using Common Header Component */}
            <Header
                title="Dock Scheduler & Shipments"
                subtitle="Real-time ramp allocation, carrier waybill tracking and timeline scheduling."
                badge={
                    <Badge variant="brand" className="font-mono text-[10px]">
                        LOGISTICS / FLEET
                    </Badge>
                }
                actions={actions}
            />

            {/* Quick KPI Metric Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <KpiCard
                    title="Today's Shipments"
                    value={totalShipments}
                    subtitle="Assigned waybills"
                />

                <KpiCard
                    title="Occupied Ramps"
                    value={`${activeRampsCount} / 6`}
                    variant="primary"
                    subtitle="Active loading bays"
                />

                <KpiCard
                    title="Delayed Trucks"
                    value={delayedCount}
                    variant={delayedCount > 0 ? 'warning' : 'default'}
                    subtitle={delayedCount > 0 ? 'Exceeded time slot' : 'All on schedule'}
                />

                <KpiCard
                    title="Scheduled Pallets"
                    value={totalPallets}
                    subtitle="Total floor payload"
                />

                <KpiCard
                    title="Dock Conflicts"
                    value={conflictsCount === 0 ? '0 None' : `${conflictsCount} Collision`}
                    variant={conflictsCount > 0 ? 'danger' : 'success'}
                    subtitle={conflictsCount > 0 ? 'Scheduling overlap' : 'Zero ramp collisions'}
                />
            </div>

            {/* View Switcher Tabs */}
            <div className="bg-white border border-slate-300 rounded-lg p-2 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex gap-1.5">
                    <Button
                        variant={viewMode === 'GANTT' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => onViewModeChange('GANTT')}
                    >
                        Interactive Gantt Timeline (Docks)
                    </Button>
                    <Button
                        variant={viewMode === 'TABLE' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => onViewModeChange('TABLE')}
                    >
                        Shipments Registry (List)
                    </Button>
                </div>
            </div>
        </div>
    );
};
