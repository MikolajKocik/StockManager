import React from 'react';
import type { DockShipment } from '../models/dockScheduler';
import { Badge } from '@/components/common/custom';

interface DockGanttBlockProps {
    shipment: DockShipment;
    displayStartHour: number;
    timelineStartHour: number;
    totalHours: number;
    hasConflict: boolean;
    isSelected: boolean;
    isBeingDragged: boolean;
    rampIndex: number;
    formatHour: (hour: number) => string;
    onMouseDown: (e: React.MouseEvent, shipment: DockShipment, rampIndex: number) => void;
    onClick: () => void;
}

export const DockGanttBlock: React.FC<DockGanttBlockProps> = ({
    shipment,
    displayStartHour,
    timelineStartHour,
    totalHours,
    hasConflict,
    isSelected,
    isBeingDragged,
    rampIndex,
    formatHour,
    onMouseDown,
    onClick
}) => {
    const leftPercent = ((displayStartHour - timelineStartHour) / totalHours) * 100;
    const widthPercent = (shipment.durationHours / totalHours) * 100;

    const statusDotColors: Record<string, string> = {
        LOADING: 'bg-[#AA9559]',
        DELAYED: 'bg-[#991b1b]',
        COMPLETED: 'bg-slate-400',
        SCHEDULED: 'bg-[#0e5f32]',
        ARRIVED_ON_TIME: 'bg-[#0e5f32]'
    };

    const statusBadgeVariants: Record<string, 'warning' | 'danger' | 'slate' | 'success'> = {
        LOADING: 'warning',
        DELAYED: 'danger',
        COMPLETED: 'slate',
        SCHEDULED: 'success',
        ARRIVED_ON_TIME: 'success'
    };

    return (
        <div
            onMouseDown={(e) => onMouseDown(e, shipment, rampIndex)}
            onClick={onClick}
            className={`absolute top-1.5 bottom-1.5 rounded-md p-2 cursor-grab active:cursor-grabbing transition-all text-xs flex flex-col justify-between overflow-hidden shadow-2xs ${hasConflict
                    ? 'ring-2 ring-red-500 bg-red-50 border border-red-300 text-red-950 z-30'
                    : isSelected
                        ? 'ring-2 ring-[#2b6675] shadow-md z-30 bg-[#e6f0f2] border border-[#2b6675]'
                        : isBeingDragged
                            ? 'opacity-90 ring-2 ring-[#AA9559] shadow-xl z-40 bg-amber-50 border border-[#AA9559]'
                            : shipment.direction === 'INBOUND_PZ'
                                ? 'bg-[#f0f7f8] border border-[#2b6675]/40 text-slate-900 hover:border-[#2b6675]'
                                : 'bg-[#f8fafc] border border-slate-300 text-slate-900 hover:border-slate-500'
                }`}
            style={{
                left: `${Math.max(0, leftPercent)}%`,
                width: `${Math.max(2, widthPercent)}%`
            }}
        >
            {/* Block Top Header */}
            <div className="flex items-center justify-between gap-1 leading-none">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${statusDotColors[shipment.status] || 'bg-[#0e5f32]'}`} />
                    <span className="font-bold text-[0.6875rem] font-mono truncate text-slate-900">
                        {shipment.shipmentNumber}
                    </span>
                </div>
                <span className="font-mono text-[0.5625rem] font-semibold bg-white/90 px-1 py-0.2 rounded-xs shrink-0 border border-slate-200 text-slate-700">
                    {formatHour(displayStartHour)} - {formatHour(displayStartHour + shipment.durationHours)}
                </span>
            </div>

            {/* Block Center: Carrier & Cargo */}
            <div className="min-w-0 py-0.5">
                <div className="text-[0.625rem] font-semibold text-slate-800 truncate leading-tight">
                    {shipment.carrierName} ({shipment.truckPlateNumber})
                </div>
                <div className="text-[0.5625rem] text-slate-600 truncate leading-tight">
                    {shipment.palletCount} pal. • {shipment.cargoDescription}
                </div>
            </div>

            {/* Block Footer Status Tag */}
            <div className="flex items-center justify-between text-[0.5625rem] leading-none pt-0.5 border-t border-slate-200/60">
                <span className="font-medium truncate text-slate-600">
                    {shipment.direction === 'INBOUND_PZ' ? 'PZ Inbound' : 'WZ Outbound'}
                </span>
                <Badge
                    variant={statusBadgeVariants[shipment.status] || 'success'}
                    className="text-[0.5rem] py-0 px-1"
                >
                    {shipment.status}
                </Badge>
            </div>
        </div>
    );
};
