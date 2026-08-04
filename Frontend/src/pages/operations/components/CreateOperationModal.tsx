import React, { forwardRef } from 'react';
import type { KanbanOperation, OperationType, OperationPriority } from '../models/operationKanban';
import { Button, FormBody, FormFooter, Modal, Input, Select, Section } from '@/components/common';
import toast from 'react-hot-toast';

export const OPERATION_TYPE_OPTIONS = [
    { value: 'PICKING', label: 'PICKING (Outbound Picking)' },
    { value: 'PUTAWAY', label: 'PUTAWAY (Inbound Staging)' },
    { value: 'REPLENISHMENT', label: 'REPLENISHMENT (Buffer to Pick)' },
    { value: 'INTERNAL_TRANSFER', label: 'INTERNAL TRANSFER (Relocation)' },
] as const;

export const OPERATION_PRIORITY_OPTIONS = [
    { value: 'CRITICAL', label: 'CRITICAL (Emergency Priority #1)' },
    { value: 'HIGH', label: 'HIGH Priority' },
    { value: 'NORMAL', label: 'NORMAL' },
    { value: 'LOW', label: 'LOW' },
] as const;

interface CreateOperationModalProps {
    onClose: () => void;
    onCreate: (op: KanbanOperation) => void;
}

export const CreateOperationModal = forwardRef<HTMLDialogElement, CreateOperationModalProps>(({
    onClose,
    onCreate
}, ref) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as Record<string, string>;

        const type = data.type as OperationType;
        const priority = data.priority as OperationPriority;
        const quantity = Number(data.quantity) || 1;

        const newOp: KanbanOperation = {
            id: `op-${Date.now()}`,
            operationNumber: `OP-${Math.floor(1000 + Math.random() * 9000)}-${type.substring(0, 4)}`,
            type,
            status: 'QUEUED',
            priority,
            orderNumber: data.orderNumber || 'WZ/2026/08/1420',
            zone: data.zone || 'Aisle 04 (Zone High-Bay A)',
            assignedOperatorName: data.operatorName || 'Charles Zielinski',
            assignedEquipment: 'Handheld Mobile Terminal',
            totalItemsCount: 1,
            totalWeightKg: quantity * 25,
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            estimatedMinutes: 20,
            elapsedMinutes: 0,
            items: [
                {
                    id: `item-${Date.now()}`,
                    sku: data.sku || 'HYD-PUMP-400X',
                    productName: data.productName || 'Hydraulic High-Pressure Pump 400 bar',
                    quantity,
                    pickedQuantity: 0,
                    unit: 'pcs',
                    sourceBin: data.sourceBin || 'BIN-A-04-10',
                    targetBin: data.targetBin || 'RAMP-01-STAGE'
                }
            ]
        };

        onCreate(newOp);
        toast.success(`Dispatched ${newOp.operationNumber} to warehouse queue`);
        onClose();
    };

    return (
        <Modal
            ref={ref}
            title="Create & Dispatch Warehouse Task"
            size="lg"
            onClose={onClose}
        >
            <form onSubmit={handleSubmit}>
                <FormBody className="max-h-[75vh] space-y-4">
                    <Section title="Task Parameters">
                        <div className="grid grid-cols-2 gap-3">
                            <Select
                                label="Operation Type"
                                name="type"
                                defaultValue="PICKING"
                                options={OPERATION_TYPE_OPTIONS}
                            />

                            <Select
                                label="Initial Priority"
                                name="priority"
                                defaultValue="HIGH"
                                options={OPERATION_PRIORITY_OPTIONS}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Order / Registry Reference"
                                name="orderNumber"
                                required
                                defaultValue="WZ/2026/08/1420"
                                placeholder="WZ/2026/08/1420"
                                className="font-mono"
                            />

                            <Input
                                label="Warehouse Zone / Aisle"
                                name="zone"
                                required
                                defaultValue="Aisle 04 (Zone High-Bay A)"
                                placeholder="Aisle 04 (Zone High-Bay A)"
                            />
                        </div>

                        <Input
                            label="Assigned Floor Operator"
                            name="operatorName"
                            defaultValue="Charles Zielinski"
                            placeholder="Charles Zielinski"
                        />
                    </Section>

                    <Section variant="subtle" title="Initial SKU Line Specification">
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="SKU Code"
                                name="sku"
                                required
                                defaultValue="HYD-PUMP-400X"
                                placeholder="HYD-PUMP-400X"
                                className="font-mono bg-white"
                            />

                            <Input
                                label="Product Name"
                                name="productName"
                                required
                                defaultValue="Hydraulic High-Pressure Pump 400 bar"
                                placeholder="Hydraulic Pump 400 bar"
                                className="bg-white"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <Input
                                label="Quantity (pcs)"
                                name="quantity"
                                type="number"
                                min="1"
                                required
                                defaultValue="5"
                                className="font-mono bg-white"
                            />

                            <Input
                                label="Source Location"
                                name="sourceBin"
                                required
                                defaultValue="BIN-A-04-10"
                                placeholder="BIN-A-04-10"
                                className="font-mono bg-white"
                            />

                            <Input
                                label="Target Location"
                                name="targetBin"
                                required
                                defaultValue="RAMP-01-STAGE"
                                placeholder="RAMP-01-STAGE"
                                className="font-mono bg-white"
                            />
                        </div>
                    </Section>
                </FormBody>

                <FormFooter>
                    <Button variant="secondary" size="md" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="md" type="submit">
                        Dispatch Operation
                    </Button>
                </FormFooter>
            </form>
        </Modal>
    );
});

CreateOperationModal.displayName = 'CreateOperationModal';
