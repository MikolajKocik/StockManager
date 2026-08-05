import React from 'react';
import type { MachineStatus, MaintenanceMachine } from '@/models/maintenance';
import { Button } from '@/components/common/core';
import { Badge } from '@/components/common/custom';

interface MachineInspectorPanelProps {
    machine: MaintenanceMachine | null;
    onUpdateStatus: (machineId: string, status: MachineStatus) => void;
    onOpenReportModal: () => void;
}

const ZONE_LABELS: Record<string, string> = {
    HALA_A: 'Hall A – High Bay',
    HALA_B: 'Hall B – Picking',
    WORKSHOP_CHARGING: 'Workshop & Chargers'
};

const STATUS_BADGE_MAP: Record<MachineStatus, 'success' | 'brand' | 'warning' | 'danger'> = {
    OPERATIONAL: 'success',
    CHARGING: 'brand',
    MAINTENANCE: 'warning',
    CRITICAL_FAULT: 'danger'
};

export const MachineInspectorPanel: React.FC<MachineInspectorPanelProps> = ({
    machine,
    onUpdateStatus
}) => {
    if (!machine) {
        return (
            <div className="bg-white border border-slate-300 rounded-lg p-6 text-center text-slate-500 shadow-xs">
                <p className="text-sm font-semibold text-slate-800">Select machinery asset from fleet</p>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                    Click any machine card in a zone to inspect live telemetry and maintenance history.
                </p>
            </div>
        );
    }

    return (
        <aside className="bg-white border border-slate-300 rounded-lg shadow-xs overflow-hidden sticky top-4">
            <header className="bg-[#2b6675] text-white p-3 flex items-center justify-between border-b border-[#204e5a]">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="bg-white/20 text-white font-mono font-bold text-xs px-1.5 py-0.5 rounded-xs">
                            {machine.code}
                        </span>
                        <span className="text-xs text-slate-200 font-mono">
                            ID: {machine.id}
                        </span>
                    </div>
                    <h2 className="text-sm font-bold text-white mt-1 leading-snug">
                        {machine.name}
                    </h2>
                </div>
            </header>

            <div className="p-3.5 space-y-3.5 text-slate-800 text-xs">
                <figure className="w-full h-40 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center p-3 relative overflow-hidden">
                    <img
                        src={machine.image}
                        alt={machine.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                    />
                    <div className="absolute top-2 right-2">
                        <Badge variant={STATUS_BADGE_MAP[machine.status] || 'neutral'}>
                            {machine.status}
                        </Badge>
                    </div>
                </figure>

                <section className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 border border-slate-200 rounded p-2 space-y-1">
                        <div className="flex justify-between items-center text-xs text-slate-500 font-mono uppercase font-bold">
                            <span>Battery (SoC)</span>
                            <span className="text-slate-700">{machine.isCharging ? 'Charging' : 'Discharging'}</span>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-base font-bold font-mono text-slate-900">{machine.batteryLevel}%</span>
                            <span className="text-xs text-slate-500 font-mono">24V / 400Ah</span>
                        </div>
                        <progress
                            value={machine.batteryLevel}
                            max={100}
                            className="w-full h-2 rounded accent-emerald-600"
                        />
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded p-2 space-y-1">
                        <span className="text-xs text-slate-500 font-mono uppercase font-bold block">Operating Hours</span>
                        <div className="flex items-baseline justify-between">
                            <span className="text-base font-bold font-mono text-slate-900">{machine.operatingHours}</span>
                            <span className="text-xs text-slate-500 font-mono">mth</span>
                        </div>
                        <span className="text-xs text-slate-400 block font-mono">CAN Counter</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded p-2 space-y-1">
                        <span className="text-xs text-slate-500 font-mono uppercase font-bold block">Motor Temp</span>
                        <div className="flex items-baseline justify-between">
                            <span className={`text-base font-bold font-mono ${
                                machine.temperature > 50 ? 'text-red-600' : 'text-slate-900'
                            }`}>
                                {machine.temperature}°C
                            </span>
                            <span className="text-xs font-semibold text-slate-600">
                                {machine.temperature > 50 ? 'High' : 'Normal'}
                            </span>
                        </div>
                        <meter
                            min={0}
                            max={100}
                            low={45}
                            high={60}
                            optimum={30}
                            value={machine.temperature}
                            className="w-full h-2 rounded"
                        />
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded p-2 space-y-1">
                        <span className="text-xs text-slate-500 font-mono uppercase font-bold block">Assigned Zone</span>
                        <span className="text-xs font-bold text-slate-800 block truncate">
                            {ZONE_LABELS[machine.zone] || machine.zone}
                        </span>
                        <span className="text-xs text-slate-500 block truncate font-mono">
                            Op: {machine.assignedOperator || 'Unassigned'}
                        </span>
                    </div>
                </section>

                <section className="bg-slate-50 border border-slate-200 rounded p-2.5 space-y-1 text-xs">
                    <div className="flex justify-between items-center text-slate-600 font-mono text-xs">
                        <span>Serial Number:</span>
                        <strong className="text-slate-900">{machine.serialNumber}</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 font-mono text-xs">
                        <span>Last Service:</span>
                        <span className="text-slate-800">{machine.lastServiceDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 font-mono text-xs">
                        <span>Next Inspection:</span>
                        <span className="text-slate-800">{machine.nextServiceDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 border-t border-slate-200 pt-1 font-mono text-xs">
                        <span>Safety Expiry:</span>
                        <span className="font-bold text-amber-800 bg-amber-100 px-1 py-0.2 rounded-xs border border-amber-300">
                            {machine.udtExpiryDate}
                        </span>
                    </div>
                </section>

                <section className="space-y-1.5 pt-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block">
                        Quick Dispatch Actions
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                        <Button
                            variant={machine.status === 'OPERATIONAL' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => onUpdateStatus(machine.id, 'OPERATIONAL')}
                        >
                            Operational
                        </Button>
                        <Button
                            variant={machine.status === 'CHARGING' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => onUpdateStatus(machine.id, 'CHARGING')}
                        >
                            Charge
                        </Button>
                        <Button
                            variant={machine.status === 'MAINTENANCE' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => onUpdateStatus(machine.id, 'MAINTENANCE')}
                        >
                            Workshop
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onUpdateStatus(machine.id, 'CRITICAL_FAULT')}
                        >
                            Report Fault
                        </Button>
                    </div>
                </section>

                <section className="space-y-1.5 pt-2 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block">
                        Machine Event Audit Log
                    </span>
                    <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                        {machine.logs.map((log) => (
                            <div key={log.id} className="text-xs bg-slate-50 border border-slate-200 rounded p-1.5 leading-snug">
                                <div className="flex justify-between text-xs text-slate-400 font-mono mb-0.5">
                                    <span>{log.timestamp}</span>
                                    <span className="font-semibold text-slate-600">{log.type}</span>
                                </div>
                                <p className="text-slate-700">{log.message}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </aside>
    );
};
