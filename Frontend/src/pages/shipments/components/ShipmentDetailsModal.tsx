import React, { useState, useEffect } from 'react';
import { Button, Input, Select } from '@/components/common';
import type { DockRamp, DockShipment, ShipmentStatus } from '../models/dockScheduler';
import toast from 'react-hot-toast';

interface ShipmentDetailsModalProps {
    isOpen: boolean;
    shipment: DockShipment | null;
    ramps: DockRamp[];
    onClose: () => void;
    onUpdate: (id: string, updates: Partial<DockShipment>) => void;
    onDelete: (id: string) => void;
}

export const ShipmentDetailsModal: React.FC<ShipmentDetailsModalProps> = ({
    isOpen,
    shipment,
    ramps,
    onClose,
    onUpdate,
    onDelete
}) => {
    const [formData, setFormData] = useState<DockShipment | null>(null);

    useEffect(() => {
        if (shipment) {
            setFormData({ ...shipment });
        }
    }, [shipment]);

    if (!isOpen || !formData) return null;

    const handleSave = () => {
        onUpdate(formData.id, formData);
        toast.success(`Shipment ${formData.shipmentNumber} updated successfully`);
        onClose();
    };

    const handleDelete = () => {
        onDelete(formData.id);
        toast.success(`Shipment ${formData.shipmentNumber} cancelled and removed from dock schedule`);
        onClose();
    };

    const formatHour = (hourDecimal: number) => {
        const h = Math.floor(hourDecimal);
        const m = Math.round((hourDecimal - h) * 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white border border-slate-300 rounded-lg shadow-2xl max-w-xl w-full overflow-hidden text-slate-800 animate-scale-in">
                {/* Dark Header */}
                <div className="bg-[#384155] text-white px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded font-mono uppercase ${
                            formData.direction === 'INBOUND_PZ' ? 'bg-emerald-400 text-slate-950' : 'bg-indigo-400 text-slate-950'
                        }`}>
                            {formData.direction === 'INBOUND_PZ' ? 'PZ INBOUND TRUCK' : 'WZ OUTBOUND TRUCK'}
                        </span>
                        <h3 className="font-bold text-sm text-white font-mono">
                            {formData.shipmentNumber}
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

                {/* Body Form */}
                <div className="p-4 space-y-3 text-xs max-h-[75vh] overflow-y-auto">
                    {/* Carrier & Vehicle Grid */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">
                            Carrier & Vehicle Information
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Carrier Company</label>
                                <Input
                                    type="text"
                                    value={formData.carrierName}
                                    onChange={(e) => setFormData({ ...formData, carrierName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Driver Full Name</label>
                                <Input
                                    type="text"
                                    value={formData.driverName}
                                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Driver Contact Phone</label>
                                <Input
                                    type="text"
                                    value={formData.driverPhone}
                                    onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Truck Plate Number</label>
                                <Input
                                    type="text"
                                    value={formData.truckPlateNumber}
                                    onChange={(e) => setFormData({ ...formData, truckPlateNumber: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ramp & Time Window */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">
                            Dock Assignment & Window
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Assigned Ramp</label>
                                <Select
                                    value={formData.rampId}
                                    onChange={(e) => setFormData({ ...formData, rampId: e.target.value })}
                                    options={ramps.map(r => ({
                                        label: `${r.code} - ${r.name}`,
                                        value: r.id
                                    }))}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Status</label>
                                <Select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ShipmentStatus })}
                                    options={[
                                        { label: 'Scheduled', value: 'SCHEDULED' },
                                        { label: 'Arrived On Time', value: 'ARRIVED_ON_TIME' },
                                        { label: 'Delayed', value: 'DELAYED' },
                                        { label: 'Loading In Progress', value: 'LOADING' },
                                        { label: 'Completed', value: 'COMPLETED' },
                                        { label: 'Cancelled', value: 'CANCELLED' }
                                    ]}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">
                                    Start Time Slot ({formatHour(formData.startHour)})
                                </label>
                                <Input
                                    type="number"
                                    step="0.25"
                                    min="6"
                                    max="21.5"
                                    value={formData.startHour}
                                    onChange={(e) => setFormData({ ...formData, startHour: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Duration (Hours)</label>
                                <Input
                                    type="number"
                                    step="0.5"
                                    min="0.5"
                                    max="6"
                                    value={formData.durationHours}
                                    onChange={(e) => setFormData({ ...formData, durationHours: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cargo & Customer details */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">
                            Cargo & Party Details
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Customer / Supplier</label>
                                <Input
                                    type="text"
                                    value={formData.customerOrSupplier}
                                    onChange={(e) => setFormData({ ...formData, customerOrSupplier: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Pallet Count</label>
                                <Input
                                    type="number"
                                    value={formData.palletCount}
                                    onChange={(e) => setFormData({ ...formData, palletCount: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-600 block mb-0.5">Cargo Description</label>
                            <Input
                                type="text"
                                value={formData.cargoDescription}
                                onChange={(e) => setFormData({ ...formData, cargoDescription: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-600 block mb-0.5">Logistics Notes</label>
                            <Input
                                type="text"
                                value={formData.notes || ''}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="e.g. Needs forklift extension or special handling"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-3 bg-slate-50 border-t border-slate-200">
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={handleDelete}
                        className="text-xs"
                    >
                        Delete Shipment
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onClose}
                            className="text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleSave}
                            className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 border-blue-700"
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
