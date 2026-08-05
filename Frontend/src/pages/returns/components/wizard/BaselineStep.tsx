import React from 'react';
import { Button, Card, CardHeader, CardBody, Badge } from '@/components/common';
import type { RmaRecord } from '@/models/rma';

export interface BaselineStepProps {
    rma: RmaRecord;
    onClose: () => void;
    onNext: () => void;
}

export const BaselineStep: React.FC<BaselineStepProps> = ({
    rma,
    onClose,
    onNext
}) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Left Column: RMA Intake Record */}
                <div className="lg:col-span-6 space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between w-full">
                                <span className="font-bold text-xs uppercase font-mono text-slate-800">
                                    Return Authorization Intake
                                </span>
                                <Badge variant="brand" className="text-xs font-mono">{rma.id}</Badge>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-3 font-mono text-xs">
                            <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-slate-500">Order Ref:</span>
                                <span className="font-bold text-slate-800">{rma.salesOrderId}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-slate-500">Customer:</span>
                                <span className="font-bold text-slate-800 text-right">{rma.customerName}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-slate-500">Contact:</span>
                                <span className="text-slate-700 text-right">{rma.customerContact}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-slate-500">Claim Reason:</span>
                                <Badge variant="amber" className="text-xs">{rma.customerReason.replace(/_/g, ' ')}</Badge>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-slate-500">Quantity Claimed:</span>
                                <span className="font-bold text-slate-900">{rma.quantity} {rma.unit}</span>
                            </div>
                            <div className="pt-2">
                                <span className="text-xs text-slate-500 block mb-1">Customer Reported Notes:</span>
                                <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-slate-800 font-sans text-xs italic">
                                    "{rma.customerNotes || 'No additional customer remarks recorded.'}"
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column: Original Pristine Baseline */}
                <div className="lg:col-span-6 space-y-4">
                    <Card className="border-emerald-200 bg-emerald-50/20">
                        <CardHeader className="bg-emerald-800/10 border-emerald-200">
                            <div className="flex items-center justify-between w-full">
                                <span className="font-bold text-xs uppercase font-mono text-emerald-950">
                                    Original Pristine State (Baseline Catalog)
                                </span>
                                <Badge variant="emerald" className="text-xs">Grade A Standard</Badge>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-3 font-mono text-xs">
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-600">Product Item:</span>
                                <span className="font-bold text-slate-900">{rma.productName}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-600">Batch Code:</span>
                                <span className="font-bold text-slate-800">{rma.baseline.batchNumber}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-600">Original Shelf:</span>
                                <span className="font-bold text-emerald-800">{rma.baseline.shelfLocation}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-600">Storage Environment:</span>
                                <span className="text-slate-800">{rma.baseline.storageTemperature}</span>
                            </div>
                            {rma.baseline.expiryDate && (
                                <div className="flex justify-between py-1 border-b border-slate-200">
                                    <span className="text-slate-600">Expiry Cutoff:</span>
                                    <span className="font-bold text-slate-800">{rma.baseline.expiryDate}</span>
                                </div>
                            )}
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-600">Warranty Coverage:</span>
                                <span className="text-slate-800">{rma.baseline.warrantyStatus}</span>
                            </div>

                            <div className="pt-2">
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                                    Factory Baseline Specifications
                                </span>
                                <div className="grid grid-cols-2 gap-2 bg-white border border-slate-200 rounded p-2.5 text-xs">
                                    {Object.entries(rma.baseline.specifications || {}).map(([k, v]) => (
                                        <div key={k} className="flex flex-col">
                                            <span className="text-slate-500 text-xs">{k}</span>
                                            <span className="font-semibold text-slate-900">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <Button variant="secondary" size="sm" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    size="md"
                    onClick={onNext}
                >
                    Proceed to Visual Damage Inspection &gt;
                </Button>
            </div>
        </div>
    );
};
