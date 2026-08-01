import React from 'react';
import type { MachineStatus, MaintenanceMachine } from '@/models/maintenance';
import { Button } from '@/components/common';

interface MachineInspectorPanelProps {
    machine: MaintenanceMachine | null;
    onUpdateStatus: (machineId: string, status: MachineStatus) => void;
    onOpenReportModal: () => void;
}

export const MachineInspectorPanel: React.FC<MachineInspectorPanelProps> = ({
    machine,
    onUpdateStatus,
    onOpenReportModal
}) => {
    if (!machine) {
        return (
            <div className="bg-white border border-slate-300 rounded-lg p-6 text-center text-slate-500 shadow-sm">
                <p className="text-sm font-semibold">Select a machine from the fleet</p>
                <p className="text-xs text-slate-400 mt-1">
                    Click any machine card in a zone to inspect live telemetry and maintenance history.
                </p>
            </div>
        );
    }

    const zoneLabels = {
        HALA_A: 'Hall A – High Bay',
        HALA_B: 'Hall B – Picking',
        WORKSHOP_CHARGING: 'Workshop & Chargers'
    };

    const statusLabels = {
        OPERATIONAL: { text: 'Operational', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' },
        CHARGING: { text: 'Battery Fast-Charging', color: 'text-blue-700 bg-blue-100 border-blue-300' },
        MAINTENANCE: { text: 'Scheduled Maintenance', color: 'text-amber-700 bg-amber-100 border-amber-300' },
        CRITICAL_FAULT: { text: 'CRITICAL FAULT', color: 'text-rose-700 bg-rose-100 border-rose-300' }
    }[machine.status];

    return (
        <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden sticky top-4">
            {/* Header */}
            <div className="bg-[#384155] text-white p-3.5 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="bg-white/20 text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                            {machine.code}
                        </span>
                        <span className="text-xs font-semibold text-slate-200">
                            ID: {machine.id}
                        </span>
                    </div>
                    <h2 className="text-sm font-bold text-white mt-1 leading-snug">
                        {machine.name}
                    </h2>
                </div>
            </div>

            <div className="p-4 space-y-4 text-slate-800">
                {/* Hero Machine Image Box */}
                <div className="w-full h-44 bg-gradient-to-b from-slate-100 to-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-3 relative overflow-hidden shadow-inner">
                    <img
                        src={machine.image}
                        alt={machine.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-md"
                    />
                    <div className="absolute top-2 right-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${statusLabels.color}`}>
                            {statusLabels.text}
                        </span>
                    </div>
                </div>

                {/* Telemetry Indicators Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                    {/* Battery */}
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-2.5 space-y-1">
                        <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                            <span>Battery (SoC)</span>
                            <span className="font-semibold text-slate-700">{machine.isCharging ? 'Charging' : 'Discharging'}</span>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-lg font-bold font-mono text-slate-900">{machine.batteryLevel}%</span>
                            <span className="text-[10px] font-semibold text-slate-500">24V / 400Ah</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                    machine.batteryLevel > 50 
                                        ? 'bg-emerald-500' 
                                        : machine.batteryLevel > 20 
                                            ? 'bg-amber-500' 
                                            : 'bg-rose-500'
                                }`}
                                style={{ width: `${machine.batteryLevel}%` }}
                            />
                        </div>
                    </div>

                    {/* Operating Hours */}
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-2.5 space-y-1">
                        <span className="text-[11px] text-slate-500 font-medium block">Operating Hours (Mth)</span>
                        <div className="flex items-baseline justify-between">
                            <span className="text-lg font-bold font-mono text-slate-900">{machine.operatingHours}</span>
                            <span className="text-xs text-slate-500">hours</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">CAN Digital Counter</span>
                    </div>

                    {/* Temperature */}
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-2.5 space-y-1">
                        <span className="text-[11px] text-slate-500 font-medium block">Motor Temp</span>
                        <div className="flex items-baseline justify-between">
                            <span className={`text-lg font-bold font-mono ${
                                machine.temperature > 50 ? 'text-rose-600' : 'text-slate-900'
                            }`}>
                                {machine.temperature}°C
                            </span>
                            <span className="text-[10px] font-semibold text-slate-600">
                                {machine.temperature > 50 ? 'High' : 'Normal'}
                            </span>
                        </div>
                    </div>

                    {/* Current Zone */}
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-2.5 space-y-1">
                        <span className="text-[11px] text-slate-500 font-medium block">Assigned Zone</span>
                        <span className="text-xs font-bold text-slate-800 block truncate">
                            {zoneLabels[machine.zone]}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                            Op: {machine.assignedOperator || 'Unassigned'}
                        </span>
                    </div>
                </div>

                {/* Technical / Safety Inspections Info */}
                <div className="bg-slate-50 border border-slate-200 rounded-md p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                        <span>Serial Number:</span>
                        <span className="font-mono font-semibold text-slate-800">{machine.serialNumber}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                        <span>Last Service:</span>
                        <span className="font-semibold text-slate-800">{machine.lastServiceDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                        <span>Next Inspection:</span>
                        <span className="font-semibold text-slate-800">{machine.nextServiceDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 border-t border-slate-200 pt-1">
                        <span>Safety Certification Expiry:</span>
                        <span className="font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded">
                            {machine.udtExpiryDate}
                        </span>
                    </div>
                </div>

                {/* Quick Status Control Buttons */}
                <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Quick Dispatch Actions
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant={machine.status === 'OPERATIONAL' ? 'accent' : 'secondary'}
                            size="sm"
                            onClick={() => onUpdateStatus(machine.id, 'OPERATIONAL')}
                            className="text-xs font-semibold"
                        >
                            Set Operational
                        </Button>
                        <Button
                            variant={machine.status === 'CHARGING' ? 'accent' : 'secondary'}
                            size="sm"
                            onClick={() => onUpdateStatus(machine.id, 'CHARGING')}
                            className="text-xs font-semibold"
                        >
                            Charge
                        </Button>
                        <Button
                            variant={machine.status === 'MAINTENANCE' ? 'accent' : 'secondary'}
                            size="sm"
                            onClick={() => onUpdateStatus(machine.id, 'MAINTENANCE')}
                            className="text-xs font-semibold"
                        >
                            Workshop
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onUpdateStatus(machine.id, 'CRITICAL_FAULT')}
                            className="text-xs font-semibold"
                        >
                            Report Fault
                        </Button>
                    </div>
                </div>

                {/* Event Audit Log */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Machine Event Audit Log
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {machine.logs.map((log) => (
                            <div key={log.id} className="text-[11px] bg-slate-50 border border-slate-200 rounded p-1.5 leading-snug">
                                <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-0.5">
                                    <span>{log.timestamp}</span>
                                    <span className="font-semibold text-slate-600">{log.type}</span>
                                </div>
                                <p className="text-slate-700">{log.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
