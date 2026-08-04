import React, { forwardRef } from 'react';
import { Button, Input, Select, Modal, FormBody, FormFooter, Section } from '@/components/common';
import type { DockRamp, DockShipment, DirectionType } from '../models/dockScheduler';
import toast from 'react-hot-toast';

export const SHIPMENT_DIRECTION_OPTIONS = [
    { label: 'Inbound (PZ Delivery)', value: 'INBOUND_PZ' },
    { label: 'Outbound (WZ Dispatch)', value: 'OUTBOUND_WZ' },
] as const;

interface ShipmentCreateModalProps {
    isOpen?: boolean;
    ramps: DockRamp[];
    onClose: () => void;
    onCreate: (newShipment: DockShipment) => void;
}

export const ShipmentCreateModal = forwardRef<HTMLDialogElement, ShipmentCreateModalProps>(({
    isOpen,
    ramps,
    onClose,
    onCreate
}, ref) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as Record<string, string>;

        const direction = (data.direction as DirectionType) || 'INBOUND_PZ';
        const carrierName = data.carrierName || 'DHL Freight Express';
        const randId = `SHP-${Math.floor(1000 + Math.random() * 9000)}`;
        const shipNum = `TRK-${Math.floor(100 + Math.random() * 900)}-${carrierName.split(' ')[0].toUpperCase()}`;

        const newShipment: DockShipment = {
            id: randId,
            shipmentNumber: shipNum,
            direction,
            carrierName,
            driverName: data.driverName || 'Adam Nowak',
            driverPhone: data.driverPhone || '+48 600 112 233',
            truckPlateNumber: data.truckPlateNumber || 'WI 4492X',
            rampId: data.rampId || ramps[0]?.id || 'RAMP-01',
            startHour: Number(data.startHour) || 14.0,
            durationHours: Number(data.durationHours) || 2.0,
            status: 'SCHEDULED',
            palletCount: Number(data.palletCount) || 24,
            cargoDescription: data.cargoDescription || 'Hydraulic Valves & Fittings',
            customerOrSupplier: data.customerOrSupplier || 'Apex Machinery Sp. z o.o.',
            originCity: direction === 'INBOUND_PZ' ? 'Warsaw Depot' : 'Warsaw Hub',
            destinationCity: direction === 'INBOUND_PZ' ? 'Warsaw Hub' : 'Berlin Freight Hub'
        };

        onCreate(newShipment);
        toast.success(`Shipment ${shipNum} scheduled on ramp successfully!`);
        onClose();
    };

    const rampOptions = ramps.map(r => ({
        label: `${r.code} - ${r.name}`,
        value: r.id
    }));

    return (
        <Modal
            ref={ref}
            isOpen={isOpen}
            title="Schedule New Truck Delivery / Dispatch"
            size="lg"
            onClose={onClose}
        >
            <form onSubmit={handleSubmit}>
                <FormBody className="max-h-[75vh] space-y-4">
                    <Section title="Shipment Direction & Ramp Assignment">
                        <div className="grid grid-cols-2 gap-3">
                            <Select
                                label="Direction"
                                name="direction"
                                defaultValue="INBOUND_PZ"
                                options={SHIPMENT_DIRECTION_OPTIONS}
                            />

                            <Select
                                label="Assigned Loading Dock"
                                name="rampId"
                                defaultValue={ramps[0]?.id || 'RAMP-01'}
                                options={rampOptions}
                            />
                        </div>
                    </Section>

                    <Section title="Carrier & Vehicle Information">
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Carrier Company"
                                name="carrierName"
                                defaultValue="DHL Freight Express"
                                required
                            />
                            <Input
                                label="Truck Plate Number"
                                name="truckPlateNumber"
                                defaultValue="WI 4492X"
                                className="font-mono"
                                required
                            />
                            <Input
                                label="Driver Full Name"
                                name="driverName"
                                defaultValue="Adam Nowak"
                                required
                            />
                            <Input
                                label="Driver Contact Phone"
                                name="driverPhone"
                                defaultValue="+48 600 112 233"
                                className="font-mono"
                                required
                            />
                        </div>
                    </Section>

                    <Section title="Time Window & Pallet Payload">
                        <div className="grid grid-cols-3 gap-3">
                            <Input
                                label="Start Hour (e.g. 14.5 = 14:30)"
                                name="startHour"
                                type="number"
                                step="0.25"
                                min="6"
                                max="21"
                                defaultValue="14"
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
                                defaultValue="2"
                                className="font-mono"
                                required
                            />
                            <Input
                                label="Pallet Count"
                                name="palletCount"
                                type="number"
                                min="1"
                                max="66"
                                defaultValue="24"
                                className="font-mono"
                                required
                            />
                        </div>
                    </Section>

                    <Section variant="subtle" title="Party & Cargo Details">
                        <div className="space-y-3">
                            <Input
                                label="Customer / Supplier"
                                name="customerOrSupplier"
                                defaultValue="Apex Machinery Sp. z o.o."
                                className="bg-white"
                                required
                            />
                            <Input
                                label="Cargo Description"
                                name="cargoDescription"
                                defaultValue="Hydraulic Valves & Fittings"
                                className="bg-white"
                                required
                            />
                        </div>
                    </Section>
                </FormBody>

                <FormFooter>
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
                        Confirm Schedule
                    </Button>
                </FormFooter>
            </form>
        </Modal>
    );
});

ShipmentCreateModal.displayName = 'ShipmentCreateModal';
