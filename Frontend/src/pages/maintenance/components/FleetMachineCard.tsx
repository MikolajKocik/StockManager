import React from 'react';
import type { MaintenanceMachine } from '@/models/maintenance';

interface FleetMachineCardProps {
    machine: MaintenanceMachine;
    isSelected: boolean;
    isDragging: boolean;
    onSelect: () => void;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: () => void;
}

export const FleetMachineCard: React.FC<FleetMachineCardProps> = ({
    machine,
    isSelected,
    isDragging,
    onSelect,
    onDragStart,
    onDragEnd
}) => {
    // Status visual mapping
    const statusConfig = {
        OPERATIONAL: {
            label: 'Operational',
            bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
            dot: 'bg-emerald-500'
        },
        CHARGING: {
            label: 'Charging',
            bg: 'bg-blue-100 text-blue-800 border-blue-300',
            dot: 'bg-blue-500 animate-pulse'
        },
        MAINTENANCE: {
            label: 'Maintenance',
            bg: 'bg-amber-100 text-amber-800 border-amber-300',
            dot: 'bg-amber-500'
        },
        CRITICAL_FAULT: {
            label: 'Fault',
            bg: 'bg-rose-100 text-rose-800 border-rose-300',
            dot: 'bg-rose-500 animate-ping'
        }
    }[machine.status];

    // Battery bar color
    const batteryColor =
        machine.batteryLevel > 50
            ? 'bg-emerald-500'
            : machine.batteryLevel > 20
                ? 'bg-amber-500'
                : 'bg-rose-500';

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={onSelect}
            className={`group relative bg-white rounded-lg border p-2.5 transition-all duration-150 cursor-grab active:cursor-grabbing select-none shadow-sm hover:shadow-md ${isSelected
                ? 'border-blue-600 ring-2 ring-blue-500/30 bg-blue-50/20'
                : 'border-slate-300 hover:border-slate-400'
                } ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'}`}
        >
            {/* Top Row: Code Badge, Drag grip & Status */}
            <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs bg-slate-800 text-white px-1.5 py-0.5 rounded shadow-sm">
                        {machine.code}
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full border flex items-center gap-1 ${statusConfig.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                        {statusConfig.label}
                    </span>
                </div>
                <span className="text-slate-400 group-hover:text-slate-600 text-xs font-bold leading-none" title="Drag and drop to assign">
                    ⋮⋮
                </span>
            </div>

            {/* Middle: Machine Image in centered container */}
            <div className="w-full h-24 bg-slate-50 border border-slate-100 rounded flex items-center justify-center p-1.5 overflow-hidden relative">
                <img
                    src={machine.image}
                    alt={machine.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
                />
                {machine.isCharging && (
                    <span className="absolute top-1 right-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        Charging
                    </span>
                )}
            </div>

            {/* Bottom: Name, Operator & Battery */}
            <div className="mt-2 space-y-1.5">
                <h4 className="text-xs font-semibold text-slate-800 truncate" title={machine.name}>
                    {machine.name}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-27.5" title={machine.assignedOperator || 'Unassigned'}>
                        Op: {machine.assignedOperator ? machine.assignedOperator.split(' ')[0] : 'None'}
                    </span>
                    <span className="font-mono font-bold text-slate-700">
                        {machine.batteryLevel}% 🔋
                    </span>
                </div>

                {/* Mini Battery Level Bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-300 ${batteryColor}`}
                        style={{ width: `${machine.batteryLevel}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
