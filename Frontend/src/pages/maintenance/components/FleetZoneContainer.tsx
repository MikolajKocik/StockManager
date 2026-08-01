import React from 'react';
import type { FleetZone, MaintenanceMachine } from '@/models/maintenance';
import { FleetMachineCard } from './FleetMachineCard';

interface FleetZoneContainerProps {
    machinesByZone: {
        HALA_A: MaintenanceMachine[];
        HALA_B: MaintenanceMachine[];
        WORKSHOP_CHARGING: MaintenanceMachine[];
    };
    selectedMachineId: string;
    draggedMachineId: string | null;
    dragOverZone: FleetZone | null;
    onSelectMachine: (id: string) => void;
    onDragStart: (e: React.DragEvent, id: string) => void;
    onDragOver: (e: React.DragEvent, zone: FleetZone) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent, zone: FleetZone) => void;
    onDragEnd: () => void;
}

interface ZoneConfig {
    id: FleetZone;
    title: string;
    subtitle: string;
    tag: string;
    headerBg: string;
    headerBorder: string;
    badgeBg: string;
    activeBorder: string;
}

const ZONES: ZoneConfig[] = [
    {
        id: 'HALA_A',
        title: 'Hall A – High Bay & Receiving',
        subtitle: 'Counterbalance forklifts, reach trucks, and vertical lift modules',
        tag: 'H-A',
        headerBg: 'bg-slate-100/90',
        headerBorder: 'border-slate-300',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        activeBorder: 'border-emerald-500 bg-emerald-50/30'
    },
    {
        id: 'HALA_B',
        title: 'Hall B – Order Picking & Dispatch',
        subtitle: 'Order pickers, AMR robots, and automated sorting machines',
        tag: 'H-B',
        headerBg: 'bg-slate-100/90',
        headerBorder: 'border-slate-300',
        badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
        activeBorder: 'border-blue-500 bg-blue-50/30'
    },
    {
        id: 'WORKSHOP_CHARGING',
        title: 'Workshop & Fast-Charging Bay',
        subtitle: 'Periodic inspections, rapid battery charging, and safety servicing',
        tag: 'WAR',
        headerBg: 'bg-slate-100/90',
        headerBorder: 'border-slate-300',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
        activeBorder: 'border-amber-500 bg-amber-50/30'
    }
];

export const FleetZoneContainer: React.FC<FleetZoneContainerProps> = ({
    machinesByZone,
    selectedMachineId,
    draggedMachineId,
    dragOverZone,
    onSelectMachine,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd
}) => {
    return (
        <div className="space-y-4">
            {ZONES.map((zone) => {
                const zoneMachines = machinesByZone[zone.id] || [];
                const isDragOver = dragOverZone === zone.id;

                return (
                    <div
                        key={zone.id}
                        onDragOver={(e) => onDragOver(e, zone.id)}
                        onDragLeave={onDragLeave}
                        onDrop={(e) => onDrop(e, zone.id)}
                        className={`bg-white border-2 rounded-lg transition-all duration-200 shadow-sm ${
                            isDragOver 
                                ? `${zone.activeBorder} ring-2 ring-blue-400 border-dashed scale-[1.005]` 
                                : 'border-slate-300'
                        }`}
                    >
                        {/* Zone Header */}
                        <div className={`flex items-center justify-between px-3.5 py-2.5 rounded-t-md border-b ${zone.headerBg} ${zone.headerBorder}`}>
                            <div className="flex items-center gap-2.5">
                                <span className="font-mono text-[11px] font-bold bg-slate-800 text-white px-2 py-0.5 rounded">
                                    {zone.tag}
                                </span>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                        {zone.title}
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${zone.badgeBg}`}>
                                            {zoneMachines.length} {zoneMachines.length === 1 ? 'unit' : 'units'}
                                        </span>
                                    </h3>
                                    <p className="text-[11px] text-slate-500 hidden sm:block">
                                        {zone.subtitle}
                                    </p>
                                </div>
                            </div>

                            {/* Drop target hint when dragging */}
                            {draggedMachineId && (
                                <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded border border-blue-300 animate-pulse">
                                    Drop here to assign
                                </span>
                            )}
                        </div>

                        {/* Zone Grid Cards */}
                        <div className="p-3">
                            {zoneMachines.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {zoneMachines.map((machine) => (
                                        <FleetMachineCard
                                            key={machine.id}
                                            machine={machine}
                                            isSelected={selectedMachineId === machine.id}
                                            isDragging={draggedMachineId === machine.id}
                                            onSelect={() => onSelectMachine(machine.id)}
                                            onDragStart={(e) => onDragStart(e, machine.id)}
                                            onDragEnd={onDragEnd}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                                    <p className="text-xs font-semibold text-slate-600">
                                        No active machines in this work zone
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                        Drag and drop a machine card here to reassign it
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
