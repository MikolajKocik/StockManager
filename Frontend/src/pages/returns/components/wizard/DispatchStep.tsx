import React from 'react';
import { Button, Input, Textarea, Card, CardHeader, CardBody, Badge } from '@/components/common';
import type { RmaRecord, DispositionAction } from '@/models/rma';

export interface DispatchStepProps {
    rma: RmaRecord;
    finalAction: DispositionAction;
    destinationBin: string;
    onDestinationBinChange: (bin: string) => void;
    trackingTicketCode: string;
    onTrackingTicketCodeChange: (code: string) => void;
    finalActionNotes: string;
    onFinalActionNotesChange: (notes: string) => void;
    isSaving: boolean;
    onPrev: () => void;
    onConfirm: () => void;
}

export const DispatchStep: React.FC<DispatchStepProps> = ({
    rma,
    finalAction,
    destinationBin,
    onDestinationBinChange,
    trackingTicketCode,
    onTrackingTicketCodeChange,
    finalActionNotes,
    onFinalActionNotesChange,
    isSaving,
    onPrev,
    onConfirm
}) => {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs uppercase font-mono text-slate-800">
                            Execution Summary & Physical Warehouse Routing
                        </span>
                        <Badge
                            variant={
                                finalAction === 'RESTOCK_PRIME' ? 'emerald' :
                                finalAction === 'TRANSFER_TO_SERVICE' ? 'brand' : 'danger'
                            }
                        >
                            {finalAction.replace('_', ' ')}
                        </Badge>
                    </div>
                </CardHeader>
                <CardBody className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <Input
                                label="Target Destination Bin / Location"
                                value={destinationBin}
                                onChange={(e) => onDestinationBinChange(e.target.value)}
                                helperText="Warehouse bin, service bench, or scrap compactor code"
                            />
                            <Input
                                label="Tracking Ticket / Document Ref"
                                value={trackingTicketCode}
                                onChange={(e) => onTrackingTicketCodeChange(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            <Textarea
                                label="Final Operational Remarks"
                                rows={3}
                                value={finalActionNotes}
                                onChange={(e) => onFinalActionNotesChange(e.target.value)}
                                placeholder="Add handling notes for forklift driver or technician..."
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 text-slate-800 rounded-lg font-mono text-xs space-y-2 border border-slate-200">
                        <div className="text-[#2b6675] font-bold uppercase text-xs mb-1">
                            Final Disposition Execution Plan
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                                <span className="text-slate-500 block text-xs">RMA Identifier:</span>
                                <span className="font-bold text-slate-900">{rma.id}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block text-xs">Item & Quantity:</span>
                                <span className="font-bold text-slate-900">{rma.productName} ({rma.quantity} {rma.unit})</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block text-xs">Destination:</span>
                                <span className="font-bold text-emerald-800">{destinationBin}</span>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <Button variant="secondary" size="sm" onClick={onPrev}>
                    &lt; Back to Classification
                </Button>
                <Button
                    variant="success"
                    size="lg"
                    isLoading={isSaving}
                    onClick={onConfirm}
                >
                    Confirm & Execute Disposition
                </Button>
            </div>
        </div>
    );
};
