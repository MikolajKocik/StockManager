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
}

const ZONES: ZoneConfig[] = [
    {
        id: 'HALA_A',
        title: 'Hall A – High Bay & Receiving',
        subtitle: 'Counterbalance forklifts, reach trucks, and vertical lift modules',
        tag: 'HALA-A'
    },
    {
        id: 'HALA_B',
        title: 'Hall B – Order Picking & Dispatch',
        subtitle: 'Order pickers, AMR robots, and automated sorting machines',
        tag: 'HALA-B'
    },
    {
        id: 'WORKSHOP_CHARGING',
        title: 'Workshop & Fast-Charging Bay',
        subtitle: 'Periodic inspections, rapid battery charging, and safety servicing',
        tag: 'WORKSHOP'
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
                    <section
                        key={zone.id}
                        onDragOver={(e) => onDragOver(e, zone.id)}
                        onDragLeave={onDragLeave}
                        onDrop={(e) => onDrop(e, zone.id)}
                        className={`bg-white border rounded-lg transition-all duration-150 shadow-xs ${
                            isDragOver 
                                ? 'border-[#2b6675] ring-2 ring-[#2b6675]/40 bg-[#f0f7f8]/30 border-dashed' 
                                : 'border-slate-300'
                        }`}
                    >
                        {/* Zone Header */}
                        <header className="flex items-center justify-between px-3.5 py-2.5 rounded-t-lg border-b border-slate-200 bg-slate-50">
                            <div className="flex items-center gap-2.5">
                                <span className="font-mono text-[0.625rem] font-bold bg-[#2b6675] text-white px-2 py-0.5 rounded-xs">
                                    {zone.tag}
                                </span>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                        {zone.title}
                                        <span className="text-[0.625rem] font-mono font-bold px-1.5 py-0.5 rounded-xs border border-slate-300 bg-white text-slate-700">
                                            {zoneMachines.length} {zoneMachines.length === 1 ? 'unit' : 'units'}
                                        </span>
                                    </h3>
                                    <p className="text-[0.6875rem] text-slate-500 hidden sm:block">
                                        {zone.subtitle}
                                    </p>
                                </div>
                            </div>

                            {/* Drop target hint when dragging */}
                            {draggedMachineId && (
                                <span className="text-[0.6875rem] font-mono font-bold text-[#2b6675] bg-[#f0f7f8] px-2 py-0.5 rounded-xs border border-[#2b6675]/40">
                                    Drop here to assign
                                </span>
                            )}
                        </header>

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
                                <div className="py-8 text-center border border-dashed border-slate-300 rounded-md bg-slate-50/50">
                                    <p className="text-xs font-semibold text-slate-600">
                                        No active machines in this work zone
                                    </p>
                                    <p className="text-[0.6875rem] text-slate-400 mt-0.5 font-mono">
                                        Drag and drop a machine card here to reassign it
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                );
            })}
        </div>
    );
};
