import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/common';
import type { DockRamp, DockShipment, DirectionType } from '../models/dockScheduler';
import toast from 'react-hot-toast';

interface ShipmentCreateModalProps {
    isOpen: boolean;
    ramps: DockRamp[];
    onClose: () => void;
    onCreate: (newShipment: DockShipment) => void;
}

export const ShipmentCreateModal: React.FC<ShipmentCreateModalProps> = ({
    isOpen,
    ramps,
    onClose,
    onCreate
}) => {
    const [direction, setDirection] = useState<DirectionType>('INBOUND_PZ');
    const [carrierName, setCarrierName] = useState('DHL Freight Express');
    const [driverName, setDriverName] = useState('Adam Nowak');
    const [driverPhone, setDriverPhone] = useState('+48 600 112 233');
    const [truckPlateNumber, setTruckPlateNumber] = useState('WI 4492X');
    const [rampId, setRampId] = useState(ramps[0]?.id || 'RAMP-01');
    const [startHour, setStartHour] = useState(14.0);
    const [durationHours, setDurationHours] = useState(2.0);
    const [palletCount, setPalletCount] = useState(24);
    const [cargoDescription, setCargoDescription] = useState('Hydraulic Valves & Fittings');
    const [customerOrSupplier, setCustomerOrSupplier] = useState('Apex Machinery Sp. z o.o.');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const randId = `SHP-${Math.floor(1000 + Math.random() * 9000)}`;
        const shipNum = `TRK-${Math.floor(100 + Math.random() * 900)}-${carrierName.split(' ')[0].toUpperCase()}`;

        const newShipment: DockShipment = {
            id: randId,
            shipmentNumber: shipNum,
            direction,
            carrierName,
            driverName,
            driverPhone,
            truckPlateNumber,
            rampId,
            startHour,
            durationHours,
            status: 'SCHEDULED',
            palletCount,
            cargoDescription,
            customerOrSupplier,
            originCity: direction === 'INBOUND_PZ' ? 'Warsaw Depot' : 'Warsaw Hub',
            destinationCity: direction === 'INBOUND_PZ' ? 'Warsaw Hub' : 'Berlin Freight Hub'
        };

        onCreate(newShipment);
        toast.success(`Shipment ${shipNum} scheduled on ramp successfully!`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white border border-slate-300 rounded-lg shadow-2xl max-w-xl w-full overflow-hidden text-slate-800 animate-scale-in">
                {/* Dark Header */}
                <div className="bg-[#384155] text-white px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded font-mono uppercase">
                            DOCK ALLOCATION
                        </span>
                        <h3 className="font-bold text-sm text-white">
                            Schedule New Truck Delivery / Dispatch
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-300 hover:text-white text-lg leading-none p-1 cursor-pointer"
                        title="Close"
                    >
                        &#10005;
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-4 space-y-3 text-xs max-h-[75vh] overflow-y-auto">
                        {/* Direction selector */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                                Shipment Direction
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setDirection('INBOUND_PZ')}
                                    className={`py-2 px-3 rounded font-bold border cursor-pointer text-xs ${
                                        direction === 'INBOUND_PZ'
                                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                                            : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                                    }`}
                                >
                                    Inbound (PZ Delivery)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDirection('OUTBOUND_WZ')}
                                    className={`py-2 px-3 rounded font-bold border cursor-pointer text-xs ${
                                        direction === 'OUTBOUND_WZ'
                                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                                            : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                                    }`}
                                >
                                    Outbound (WZ Dispatch)
                                </button>
                            </div>
                        </div>

                        {/* Carrier info */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Carrier Company</label>
                                <Input
                                    type="text"
                                    value={carrierName}
                                    onChange={(e) => setCarrierName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Truck Plate Number</label>
                                <Input
                                    type="text"
                                    value={truckPlateNumber}
                                    onChange={(e) => setTruckPlateNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Driver Name</label>
                                <Input
                                    type="text"
                                    value={driverName}
                                    onChange={(e) => setDriverName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Driver Contact</label>
                                <Input
                                    type="text"
                                    value={driverPhone}
                                    onChange={(e) => setDriverPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Ramp & Time Window */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Assigned Loading Dock</label>
                                <Select
                                    value={rampId}
                                    onChange={(e) => setRampId(e.target.value)}
                                    options={ramps.map(r => ({
                                        label: `${r.code} - ${r.name}`,
                                        value: r.id
                                    }))}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Start Hour (e.g. 14.5 = 14:30)</label>
                                <Input
                                    type="number"
                                    step="0.25"
                                    min="6"
                                    max="21"
                                    value={startHour}
                                    onChange={(e) => setStartHour(Number(e.target.value))}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Duration (Hours)</label>
                                <Input
                                    type="number"
                                    step="0.5"
                                    min="0.5"
                                    max="6"
                                    value={durationHours}
                                    onChange={(e) => setDurationHours(Number(e.target.value))}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Pallet Count</label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="66"
                                    value={palletCount}
                                    onChange={(e) => setPalletCount(Number(e.target.value))}
                                    required
                                />
                            </div>
                        </div>

                        {/* Cargo & Counterparty */}
                        <div className="space-y-2">
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Customer / Supplier</label>
                                <Input
                                    type="text"
                                    value={customerOrSupplier}
                                    onChange={(e) => setCustomerOrSupplier(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Cargo Description</label>
                                <Input
                                    type="text"
                                    value={cargoDescription}
                                    onChange={(e) => setCargoDescription(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 p-3 bg-slate-50 border-t border-slate-200">
                        <Button
                            variant="secondary"
                            size="sm"
                            type="button"
                            onClick={onClose}
                            className="text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            type="submit"
                            className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 border-emerald-700"
                        >
                            Confirm Schedule
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
