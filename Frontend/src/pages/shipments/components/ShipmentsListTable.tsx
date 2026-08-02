import React, { useState } from 'react';
import type { DockRamp, DockShipment, DirectionType } from '../models/dockScheduler';
import { Input, Select, Button } from '@/components/common';

interface ShipmentsListTableProps {
    shipments: DockShipment[];
    ramps: DockRamp[];
    onSelectShipment: (shipment: DockShipment) => void;
}

export const ShipmentsListTable: React.FC<ShipmentsListTableProps> = ({
    shipments,
    ramps,
    onSelectShipment
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDirection, setFilterDirection] = useState<string>('ALL');
    const [filterRamp, setFilterRamp] = useState<string>('ALL');

    const filtered = shipments.filter(s => {
        const matchesSearch = s.shipmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.carrierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.truckPlateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.customerOrSupplier.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDirection = filterDirection === 'ALL' || s.direction === filterDirection;
        const matchesRamp = filterRamp === 'ALL' || s.rampId === filterRamp;

        return matchesSearch && matchesDirection && matchesRamp;
    });

    const formatHour = (hourDecimal: number) => {
        const h = Math.floor(hourDecimal);
        const m = Math.round((hourDecimal - h) * 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    return (
        <div className="w-full bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden text-xs">
            {/* Filter Bar */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="w-full md:w-80">
                    <Input
                        type="text"
                        placeholder="Search by Waybill #, Plate, Carrier..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Select
                        value={filterDirection}
                        onChange={(e) => setFilterDirection(e.target.value)}
                        options={[
                            { label: 'All Directions', value: 'ALL' },
                            { label: 'Inbound (PZ Deliveries)', value: 'INBOUND_PZ' },
                            { label: 'Outbound (WZ Dispatches)', value: 'OUTBOUND_WZ' }
                        ]}
                    />

                    <Select
                        value={filterRamp}
                        onChange={(e) => setFilterRamp(e.target.value)}
                        options={[
                            { label: 'All Ramps', value: 'ALL' },
                            ...ramps.map(r => ({ label: `${r.code} (${r.type})`, value: r.id }))
                        ]}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#384155] text-white text-[11px] uppercase tracking-wider font-semibold border-b border-slate-700">
                            <th className="py-2.5 px-3">Shipment / Truck #</th>
                            <th className="py-2.5 px-3">Direction</th>
                            <th className="py-2.5 px-3">Carrier / Vehicle</th>
                            <th className="py-2.5 px-3">Assigned Dock</th>
                            <th className="py-2.5 px-3">Time Window</th>
                            <th className="py-2.5 px-3">Pallets / Cargo</th>
                            <th className="py-2.5 px-3">Counterparty</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {filtered.map(s => {
                            const ramp = ramps.find(r => r.id === s.rampId);
                            return (
                                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-2 px-3 font-mono font-bold text-slate-900">
                                        {s.shipmentNumber}
                                    </td>
                                    <td className="py-2 px-3">
                                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${s.direction === 'INBOUND_PZ' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                                            }`}>
                                            {s.direction === 'INBOUND_PZ' ? 'INBOUND PZ' : 'OUTBOUND WZ'}
                                        </span>
                                    </td>
                                    <td className="py-2 px-3">
                                        <div className="font-semibold text-slate-800">{s.carrierName}</div>
                                        <div className="text-[10px] text-slate-500 font-mono">{s.truckPlateNumber} • {s.driverName}</div>
                                    </td>
                                    <td className="py-2 px-3 font-mono font-semibold text-slate-800">
                                        {ramp?.code || s.rampId}
                                    </td>
                                    <td className="py-2 px-3 font-mono text-slate-800 font-semibold">
                                        {formatHour(s.startHour)} - {formatHour(s.startHour + s.durationHours)}
                                    </td>
                                    <td className="py-2 px-3">
                                        <span className="font-bold text-slate-900">{s.palletCount} pal.</span>
                                        <span className="text-[10px] text-slate-500 block truncate max-w-45">
                                            {s.cargoDescription}
                                        </span>
                                    </td>
                                    <td className="py-2 px-3 text-slate-700 truncate max-w40">
                                        {s.customerOrSupplier}
                                    </td>
                                    <td className="py-2 px-3">
                                        <span className={`text-[9px] font-bold uppercase font-mono px-1.5 py-0.2 rounded ${s.status === 'LOADING' ? 'bg-cyan-600 text-white animate-pulse' :
                                                s.status === 'DELAYED' ? 'bg-amber-400 text-slate-950 font-black' :
                                                    s.status === 'COMPLETED' ? 'bg-slate-200 text-slate-700' :
                                                        'bg-emerald-600 text-white'
                                            }`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-3 text-right">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => onSelectShipment(s)}
                                            className="text-[11px] py-0.5 px-2"
                                        >
                                            Inspect / Edit
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
