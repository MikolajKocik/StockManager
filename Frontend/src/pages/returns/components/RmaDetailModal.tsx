import React from 'react';
import { 
    Modal, 
    Button, 
    Badge, 
    Card, 
    CardHeader, 
    CardBody 
} from '@/components/common';
import type { RmaRecord, RmaStatus, DispositionAction } from '@/models/rma';

export interface RmaDetailModalProps {
    rma: RmaRecord | null;
    isOpen: boolean;
    onClose: () => void;
    onStartInspection?: (rma: RmaRecord) => void;
}

const STATUS_BADGE_MAP: Record<RmaStatus, 'emerald' | 'brand' | 'danger' | 'amber'> = {
    RESTOCKED: 'emerald',
    SERVICED: 'brand',
    DISPOSED: 'danger',
    INSPECTION_PENDING: 'amber',
    DRAFT: 'amber',
    INSPECTED: 'brand',
    REJECTED: 'danger'
};

const ACTION_BADGE_MAP: Record<DispositionAction, 'emerald' | 'brand' | 'danger' | 'slate'> = {
    RESTOCK_PRIME: 'emerald',
    TRANSFER_TO_SERVICE: 'brand',
    DISPOSE_SCRAP: 'danger',
    PENDING: 'slate'
};

export const RmaDetailModal: React.FC<RmaDetailModalProps> = ({
    rma,
    isOpen,
    onClose,
    onStartInspection
}) => {
    if (!rma) return null;

    const isPending = rma.status === 'INSPECTION_PENDING' || rma.status === 'DRAFT';
    const statusBadgeVariant = STATUS_BADGE_MAP[rma.status] ?? 'amber';
    const actionBadgeVariant = rma.finalAction ? (ACTION_BADGE_MAP[rma.finalAction] ?? 'slate') : 'slate';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`RMA Audit Record: ${rma.id}`}
            size="xl"
        >
            <div className="p-4 space-y-4 font-mono text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-[#2b6675] font-mono">
                                {rma.productName}
                            </span>
                            <Badge variant="brand" className="text-xs font-mono">{rma.productSku}</Badge>
                        </div>
                        <p className="text-slate-600 text-xs font-sans">
                            Customer: <strong className="text-slate-800">{rma.customerName}</strong> | Order Ref: <strong className="text-slate-800">{rma.salesOrderId}</strong>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant={statusBadgeVariant}
                            className="text-xs font-mono"
                        >
                            {rma.status.replace('_', ' ')}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-emerald-300 bg-emerald-50/20">
                        <CardHeader className="bg-emerald-800/10">
                            <div className="flex items-center justify-between w-full">
                                <span className="font-bold text-xs uppercase font-mono text-emerald-950">
                                    1. Baseline Original State
                                </span>
                                <Badge variant="emerald" className="text-xs">Grade A</Badge>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-2 text-xs">
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Batch Code:</span>
                                <span className="font-bold text-slate-800">{rma.baseline.batchNumber}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Original Shelf:</span>
                                <span className="font-bold text-emerald-800">{rma.baseline.shelfLocation}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Storage Zone:</span>
                                <span className="text-slate-800">{rma.baseline.storageTemperature}</span>
                            </div>
                            {rma.baseline.expiryDate && (
                                <div className="flex justify-between py-1 border-b border-slate-200">
                                    <span className="text-slate-500">Expiry Date:</span>
                                    <span className="text-slate-800">{rma.baseline.expiryDate}</span>
                                </div>
                            )}

                            <div className="pt-2">
                                <span className="text-xs uppercase font-bold text-slate-500 block mb-1">
                                    Specifications:
                                </span>
                                <div className="bg-white border border-slate-200 rounded p-2 text-xs space-y-1">
                                    {Object.entries(rma.baseline.specifications || {}).map(([k, v]) => (
                                        <div key={k} className="flex justify-between">
                                            <span className="text-slate-500">{k}:</span>
                                            <span className="font-semibold text-slate-800">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="border-slate-300">
                        <CardHeader>
                            <div className="flex items-center justify-between w-full">
                                <span className="font-bold text-xs uppercase font-mono text-slate-800">
                                    2. Returned Condition Audit
                                </span>
                                <Badge variant="slate" className="text-xs">{rma.damageSeverity}</Badge>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-2 text-xs">
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Claimed Reason:</span>
                                <span className="font-bold text-slate-800">{rma.customerReason.replace(/_/g, ' ')}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Inspected By:</span>
                                <span className="font-bold text-slate-800">{rma.inspectorName || 'Pending'}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Final Action:</span>
                                <Badge
                                    variant={actionBadgeVariant}
                                    className="text-xs font-mono"
                                >
                                    {rma.finalAction ? rma.finalAction.replace('_', ' ') : 'Pending'}
                                </Badge>
                            </div>
                            {rma.destinationBin && (
                                <div className="flex justify-between py-1 border-b border-slate-200">
                                    <span className="text-slate-500">Destination Bin:</span>
                                    <span className="font-bold text-[#2b6675]">{rma.destinationBin}</span>
                                </div>
                            )}

                            <div className="pt-2">
                                <span className="text-xs uppercase font-bold text-slate-500 block mb-1">
                                    Photo Evidence ({rma.damagePhotos.length}):
                                </span>
                                <div className="grid grid-cols-2 gap-2">
                                    {rma.damagePhotos.map((p) => (
                                        <div key={p.id} className="border border-slate-200 rounded p-1.5 bg-slate-50">
                                            <div className="h-16 bg-slate-100 rounded overflow-hidden mb-1 flex items-center justify-center border border-slate-200">
                                                <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-800 block truncate">
                                                {p.title}
                                            </span>
                                            <span className="text-xs text-slate-500 block">
                                                {p.category}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                    <span className="text-xs font-bold uppercase text-slate-700 block">
                        Disposition Notes & System Verdict
                    </span>
                    <p className="text-xs text-slate-800 font-sans leading-relaxed">
                        {rma.finalActionNotes || rma.suggestedActionReason || 'No disposition details registered yet.'}
                    </p>
                    {rma.trackingTicketCode && (
                        <div className="pt-1 text-xs text-slate-500 flex items-center gap-2">
                            <span>Document Tracking ID:</span>
                            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 border border-slate-300 rounded">
                                {rma.trackingTicketCode}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <Button variant="secondary" onClick={onClose}>
                        Close Window
                    </Button>
                    {isPending && onStartInspection && (
                        <Button
                            variant="primary"
                            onClick={() => {
                                onClose();
                                onStartInspection(rma);
                            }}
                        >
                            Open Visual Classification Assistant
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};
