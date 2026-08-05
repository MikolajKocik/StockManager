import React, { forwardRef } from 'react';
import { Button, Input, Select, Modal, FormBody, FormFooter, Section, Badge } from '@/components/common';
import type { DockRamp, DockShipment, ShipmentStatus } from '../models/dockScheduler';
import toast from 'react-hot-toast';

export const SHIPMENT_STATUS_OPTIONS = [
    { label: 'Scheduled', value: 'SCHEDULED' },
    { label: 'Arrived On Time', value: 'ARRIVED_ON_TIME' },
    { label: 'Delayed', value: 'DELAYED' },
    { label: 'Loading In Progress', value: 'LOADING' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' }
] as const;

interface ShipmentDetailsModalProps {
    isOpen?: boolean;
    shipment: DockShipment | null;
    ramps: DockRamp[];
    onClose: () => void;
    onUpdate: (id: string, updates: Partial<DockShipment>) => void;
    onDelete: (id: string) => void;
}

export const ShipmentDetailsModal = forwardRef<HTMLDialogElement, ShipmentDetailsModalProps>(({
    isOpen,
    shipment,
    ramps,
    onClose,
    onUpdate,
    onDelete
}, ref) => {
    if (!shipment) return null;

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as Record<string, string>;

        const updates: Partial<DockShipment> = {
            carrierName: data.carrierName,
            truckPlateNumber: data.truckPlateNumber,
            driverName: data.driverName,
            driverPhone: data.driverPhone,
            rampId: data.rampId,
            status: data.status as ShipmentStatus,
            startHour: Number(data.startHour) || shipment.startHour,
            durationHours: Number(data.durationHours) || shipment.durationHours,
            customerOrSupplier: data.customerOrSupplier,
            palletCount: Number(data.palletCount) || shipment.palletCount,
            cargoDescription: data.cargoDescription,
            notes: data.notes
        };

        onUpdate(shipment.id, updates);
        toast.success(`Shipment ${shipment.shipmentNumber} updated successfully`);
        onClose();
    };

    const handleDelete = () => {
        onDelete(shipment.id);
        toast.success(`Shipment ${shipment.shipmentNumber} cancelled and removed from dock schedule`);
        onClose();
    };

    const formatHour = (hourDecimal: number) => {
        const h = Math.floor(hourDecimal);
        const m = Math.round((hourDecimal - h) * 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const rampOptions = ramps.map(r => ({
        label: `${r.code} - ${r.name}`,
        value: r.id
    }));

    return (
        <Modal
            ref={ref}
            isOpen={isOpen}
            title={`Shipment Details: ${shipment.shipmentNumber}`}
            size="lg"
            onClose={onClose}
        >
            <form key={shipment.id} onSubmit={handleSubmit}>
                <FormBody className="max-h-[75vh] space-y-4">
                    {/* Header badge & direction row */}
                    <div className="flex items-center justify-between bg-slate-50/80 p-3 rounded-md border border-slate-300">
                        <div className="flex items-center gap-2">
                            <span className="text-[0.6875rem] font-mono text-slate-500 uppercase">Direction:</span>
                            <Badge variant={shipment.direction === 'INBOUND_PZ' ? 'success' : 'info'}>
                                {shipment.direction === 'INBOUND_PZ' ? 'PZ INBOUND TRUCK' : 'WZ OUTBOUND TRUCK'}
                            </Badge>
                        </div>
                        <div className="text-xs font-mono text-slate-700">
                            Time Window: <span className="font-bold">{formatHour(shipment.startHour)} - {formatHour(shipment.startHour + shipment.durationHours)}</span>
                        </div>
                    </div>

                    <Section title="Carrier & Driver Information">
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Carrier Company"
                                name="carrierName"
                                defaultValue={shipment.carrierName}
                                required
                            />
                            <Input
                                label="Truck Plate Number"
                                name="truckPlateNumber"
                                defaultValue={shipment.truckPlateNumber}
                                className="font-mono"
                                required
                            />
                            <Input
                                label="Driver Full Name"
                                name="driverName"
                                defaultValue={shipment.driverName}
                                required
                            />
                            <Input
                                label="Driver Contact Phone"
                                name="driverPhone"
                                defaultValue={shipment.driverPhone}
                                className="font-mono"
                                required
                            />
                        </div>
                    </Section>

                    <Section title="Dock Assignment & Status">
                        <div className="grid grid-cols-2 gap-3">
                            <Select
                                label="Assigned Ramp"
                                name="rampId"
                                defaultValue={shipment.rampId}
                                options={rampOptions}
                            />
                            <Select
                                label="Workflow Status"
                                name="status"
                                defaultValue={shipment.status}
                                options={SHIPMENT_STATUS_OPTIONS}
                            />
                            <Input
                                label={`Start Time (${formatHour(shipment.startHour)})`}
                                name="startHour"
                                type="number"
                                step="0.25"
                                min="6"
                                max="21.5"
                                defaultValue={shipment.startHour}
                                className="font-mono"
                                required
                            />
                            <Input
                                label="Duration (Hours)"
                                name="durationHours"
                                type="number"
                                step="0.5"
                                min="0.5"
                                max="6"
                                defaultValue={shipment.durationHours}
                                className="font-mono"
                                required
                            />
                        </div>
                    </Section>

                    <Section variant="subtle" title="Cargo & Party Details">
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Customer / Supplier"
                                name="customerOrSupplier"
                                defaultValue={shipment.customerOrSupplier}
                                className="bg-white"
                                required
                            />
                            <Input
                                label="Pallet Count"
                                name="palletCount"
                                type="number"
                                min="1"
                                defaultValue={shipment.palletCount}
                                className="bg-white font-mono"
                                required
                            />
                        </div>
                        <div className="space-y-3 pt-2">
                            <Input
                                label="Cargo Description"
                                name="cargoDescription"
                                defaultValue={shipment.cargoDescription}
                                className="bg-white"
                                required
                            />
                            <Input
                                label="Logistics Notes"
                                name="notes"
                                defaultValue={shipment.notes || ''}
                                placeholder="e.g. Needs forklift extension or special handling"
                                className="bg-white"
                            />
                        </div>
                    </Section>
                </FormBody>

                <FormFooter className="justify-between">
                    <Button
                        variant="danger"
                        size="md"
                        type="button"
                        onClick={handleDelete}
                    >
                        Delete Shipment
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="md"
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            type="submit"
                        >
                            Save Changes
                        </Button>
                    </div>
                </FormFooter>
            </form>
        </Modal>
    );
});

ShipmentDetailsModal.displayName = 'ShipmentDetailsModal';
