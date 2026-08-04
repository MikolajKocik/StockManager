import React from 'react';
import type { MachineStatus, MaintenanceMachine } from '@/models/maintenance';
import { Badge } from '@/components/common/custom';

interface FleetMachineCardProps {
    machine: MaintenanceMachine;
    isSelected: boolean;
    isDragging: boolean;
    onSelect: () => void;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: () => void;
}

const STATUS_BADGE_MAP: Record<MachineStatus, 'success' | 'brand' | 'warning' | 'danger'> = {
    OPERATIONAL: 'success',
    CHARGING: 'brand',
    MAINTENANCE: 'warning',
    CRITICAL_FAULT: 'danger'
};

export const FleetMachineCard: React.FC<FleetMachineCardProps> = ({
    machine,
    isSelected,
    isDragging,
    onSelect,
    onDragStart,
    onDragEnd
}) => {
    const batteryColor =
        machine.batteryLevel > 50
            ? 'bg-emerald-600'
            : machine.batteryLevel > 20
                ? 'bg-amber-600'
                : 'bg-red-600';

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={onSelect}
            className={`group relative bg-white rounded-md border p-2.5 transition-all duration-150 cursor-grab active:cursor-grabbing select-none shadow-2xs hover:shadow-xs ${
                isSelected
                    ? 'border-[#2b6675] ring-2 ring-[#2b6675]/30 bg-[#f0f7f8]/30'
                    : 'border-slate-300 hover:border-slate-400'
            } ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'}`}
        >
            {/* Top Row: Code Badge, Drag grip & Status */}
            <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[11px] bg-slate-800 text-white px-1.5 py-0.5 rounded-xs shadow-2xs">
                        {machine.code}
                    </span>
                    <Badge variant={STATUS_BADGE_MAP[machine.status] || 'neutral'}>
                        {machine.status}
                    </Badge>
                </div>
                <span className="text-slate-400 group-hover:text-slate-600 text-xs font-mono font-bold leading-none" title="Drag to reassign">
                    ::
                </span>
            </div>

            {/* Middle: Machine Image in centered container */}
            <div className="w-full h-24 bg-slate-50 border border-slate-200 rounded flex items-center justify-center p-1.5 overflow-hidden relative">
                <img
                    src={machine.image}
                    alt={machine.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform"
                />
                {machine.isCharging && (
                    <span className="absolute top-1 right-1 bg-[#2b6675] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-xs shadow-2xs">
                        Charging
                    </span>
                )}
            </div>

            {/* Bottom: Name, Operator & Battery */}
            <div className="mt-2 space-y-1.5">
                <h4 className="text-xs font-semibold text-slate-800 truncate" title={machine.name}>
                    {machine.name}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span className="truncate max-w-[110px]" title={machine.assignedOperator || 'Unassigned'}>
                        Op: {machine.assignedOperator ? machine.assignedOperator.split(' ')[0] : 'None'}
                    </span>
                    <span className="font-bold text-slate-800">
                        {machine.batteryLevel}%
                    </span>
                </div>

                {/* Mini Battery Level Bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${batteryColor}`}
                        style={{ width: `${machine.batteryLevel}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
