import React, { useState } from 'react';
import type { DockRamp, DockShipment } from '../models/dockScheduler';
import { Input, Select, Button, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge } from '@/components/common';

const DIRECTION_FILTER_OPTIONS = [
    { label: 'All Directions', value: 'ALL' },
    { label: 'Inbound (PZ Deliveries)', value: 'INBOUND_PZ' },
    { label: 'Outbound (WZ Dispatches)', value: 'OUTBOUND_WZ' }
] as const;

const STATUS_BADGE_VARIANT: Record<string, 'warning' | 'danger' | 'slate' | 'success' | 'info'> = {
    'LOADING': 'warning',
    'DELAYED': 'danger',
    'COMPLETED': 'slate',
    'SCHEDULED': 'success',
    'CONFIRMED': 'success'
};

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

    const rampFilterOptions = [
        { label: 'All Ramps', value: 'ALL' },
        ...ramps.map(r => ({ label: `${r.code} (${r.type})`, value: r.id }))
    ];

    return (
        <div className="w-full bg-white border border-slate-300 rounded-lg shadow-2xs overflow-hidden text-xs">
            {/* Filter Bar */}
            <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
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
                        options={DIRECTION_FILTER_OPTIONS}
                    />

                    <Select
                        value={filterRamp}
                        onChange={(e) => setFilterRamp(e.target.value)}
                        options={rampFilterOptions}
                    />
                </div>
            </div>

            {/* Standard Enterprise Table */}
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Shipment / Truck #</TableHeaderCell>
                            <TableHeaderCell>Direction</TableHeaderCell>
                            <TableHeaderCell>Carrier / Vehicle</TableHeaderCell>
                            <TableHeaderCell>Assigned Dock</TableHeaderCell>
                            <TableHeaderCell>Time Window</TableHeaderCell>
                            <TableHeaderCell>Pallets / Cargo</TableHeaderCell>
                            <TableHeaderCell>Counterparty</TableHeaderCell>
                            <TableHeaderCell>Status</TableHeaderCell>
                            <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8 text-slate-400 italic">
                                    No dock shipments matching the specified criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map(s => {
                                const ramp = ramps.find(r => r.id === s.rampId);
                                const badgeVariant = STATUS_BADGE_VARIANT[s.status] || 'info';
                                return (
                                    <TableRow key={s.id} className="hover:bg-slate-50/80 transition-colors">
                                        <TableCell className="font-mono font-bold text-slate-900">
                                            {s.shipmentNumber}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={s.direction === 'INBOUND_PZ' ? 'success' : 'info'}>
                                                {s.direction === 'INBOUND_PZ' ? 'INBOUND PZ' : 'OUTBOUND WZ'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-slate-800">{s.carrierName}</div>
                                            <div className="text-[0.625rem] text-slate-500 font-mono">{s.truckPlateNumber} • {s.driverName}</div>
                                        </TableCell>
                                        <TableCell className="font-mono font-semibold text-slate-800">
                                            {ramp?.code || s.rampId}
                                        </TableCell>
                                        <TableCell className="font-mono text-slate-800 font-semibold">
                                            {formatHour(s.startHour)} - {formatHour(s.startHour + s.durationHours)}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-slate-900">{s.palletCount} pal.</span>
                                            <span className="text-[0.625rem] text-slate-500 block truncate max-w-45">
                                                {s.cargoDescription}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-slate-700 truncate max-w-40">
                                            {s.customerOrSupplier}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={badgeVariant}>
                                                {s.status.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => onSelectShipment(s)}
                                            >
                                                Inspect / Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
