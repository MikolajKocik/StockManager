import React, { forwardRef } from 'react';
import { Button, Input, Select, FormBody, FormFooter, Modal } from '@/components/common';
import type { WorkflowNode, NodeConfig } from '../models/reorderNode';

interface NodeConfigModalProps {
    node: WorkflowNode | null;
    onClose: () => void;
    onSave: (nodeId: string, updatedTitle: string, updatedDescription: string, updatedConfig: NodeConfig) => void;
}

export const SUPPLIER_OPTIONS = [
    { label: 'TechSupply Sp. z o.o.', value: 'TechSupply Sp. z o.o.' },
    { label: 'ElectroGlobal Distribution', value: 'ElectroGlobal Distribution' },
    { label: 'Nordic Logistics Parts AB', value: 'Nordic Logistics Parts AB' },
    { label: 'Pol-Pak Opakowania S.A.', value: 'Pol-Pak Opakowania S.A.' }
] as const;

export const NOTIFICATION_OPTIONS = [
    { label: 'Slack (#procurement-urgent)', value: 'SLACK' },
    { label: 'Email (procurement@company.com)', value: 'EMAIL' },
    { label: 'SMS Warehouse Duty Manager', value: 'SMS' }
] as const;

export const NodeConfigModal = forwardRef<HTMLDialogElement, NodeConfigModalProps>(({
    node,
    onClose,
    onSave
}, ref) => {
    if (!node) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as Record<string, string>;

        const updatedTitle = data.title?.trim() || node.title;
        const updatedDescription = data.description?.trim() || node.description;

        const updatedConfig: NodeConfig = {
            thresholdValue: data.thresholdValue ? Number(data.thresholdValue) : node.config.thresholdValue,
            salesDays: data.salesDays ? Number(data.salesDays) : node.config.salesDays,
            supplierName: data.supplierName || node.config.supplierName,
            targetQty: data.targetQty ? Number(data.targetQty) : node.config.targetQty,
            notificationChannel: (data.notificationChannel as 'EMAIL' | 'SLACK' | 'SMS') || node.config.notificationChannel
        };

        onSave(node.id, updatedTitle, updatedDescription, updatedConfig);
        onClose();
    };

    return (
        <Modal
            ref={ref}
            onClose={onClose}
            title={`Configure Block: ${node.title}`}
            size="md"
        >
            <form key={node.id} onSubmit={handleSubmit}>
                <FormBody className="space-y-3">
                    <Input
                        label="Block Name / Title *"
                        name="title"
                        defaultValue={node.title}
                        required
                    />

                    <Input
                        label="Description / Log Text *"
                        name="description"
                        defaultValue={node.description}
                        required
                    />

                    {/* Threshold config */}
                    {(node.subtype === 'STOCK_THRESHOLD' || node.subtype === 'SAFETY_STOCK_BREACH' || node.subtype === 'SUPPLIER_MOQ_CHECK') && (
                        <div className="space-y-1">
                            <Input
                                label="Threshold Quantity (pcs) *"
                                name="thresholdValue"
                                type="number"
                                min={1}
                                defaultValue={node.config.thresholdValue ?? 10}
                                required
                            />
                            <span className="text-[11px] text-slate-500 block">
                                Rule fires when stock level drops below this count.
                            </span>
                        </div>
                    )}

                    {/* Sales days velocity */}
                    {node.subtype === 'SALES_VELOCITY_CHECK' && (
                        <div className="space-y-1">
                            <Input
                                label="Sales Velocity Period (Days) *"
                                name="salesDays"
                                type="number"
                                min={1}
                                max={90}
                                defaultValue={node.config.salesDays ?? 7}
                                required
                            />
                            <span className="text-[11px] text-slate-500 block">
                                Calculates rolling average daily dispatches across this window.
                            </span>
                        </div>
                    )}

                    {/* PO Generator Action */}
                    {node.subtype === 'GENERATE_PO_DRAFT' && (
                        <>
                            <Select
                                label="Target Supplier"
                                name="supplierName"
                                defaultValue={node.config.supplierName ?? 'TechSupply Sp. z o.o.'}
                                options={SUPPLIER_OPTIONS}
                            />

                            <Input
                                label="Default Reorder Quantity (pcs) *"
                                name="targetQty"
                                type="number"
                                min={1}
                                defaultValue={node.config.targetQty ?? 50}
                                required
                            />
                        </>
                    )}

                    {/* Alert channel */}
                    {node.subtype === 'SEND_PROCUREMENT_ALERT' && (
                        <Select
                            label="Notification Channel"
                            name="notificationChannel"
                            defaultValue={node.config.notificationChannel ?? 'SLACK'}
                            options={NOTIFICATION_OPTIONS}
                        />
                    )}
                </FormBody>

                <FormFooter>
                    <Button variant="secondary" size="md" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="md" type="submit">
                        Save Configuration
                    </Button>
                </FormFooter>
            </form>
        </Modal>
    );
});

NodeConfigModal.displayName = 'NodeConfigModal';
