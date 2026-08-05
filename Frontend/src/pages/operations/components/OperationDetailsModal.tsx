import { forwardRef } from 'react';
import type { KanbanOperation, OperationPriority, OperationStatus } from '../models/operationKanban';
import { Button, FormBody, FormFooter, Modal, Badge, Select } from '@/components/common';

interface OperationDetailsModalProps {
    operation: KanbanOperation | null;
    onClose: () => void;
    onUpdatePriority: (opId: string, priority: OperationPriority) => void;
    onUpdateStatus: (opId: string, status: OperationStatus) => void;
    onResolveBlocked: (opId: string) => void;
}

export const OperationDetailsModal = forwardRef<HTMLDialogElement, OperationDetailsModalProps>(({
    operation,
    onClose,
    onUpdatePriority,
    onUpdateStatus,
    onResolveBlocked
}, ref) => {
    if (!operation) return null;

    return (
        <Modal
            ref={ref}
            title={`Operation Details: ${operation.operationNumber}`}
            size="lg"
            onClose={onClose}
        >
            <FormBody className="max-h-[75vh] space-y-4">
                {/* Blocked Hazard Banner */}
                {operation.status === 'BLOCKED' && (
                    <div className="bg-red-50/80 border border-red-300 rounded-md p-3 space-y-2 text-red-900">
                        <div className="flex items-center justify-between">
                            <span className="font-bold uppercase font-mono text-[0.6875rem]">
                                Hazard / Obstruction Details:
                            </span>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => onResolveBlocked(operation.id)}
                            >
                                Clear Hazard & Resume Task
                            </Button>
                        </div>
                        <p className="text-xs font-medium">
                            {operation.blockedReason || 'Aisle obstructed or SKU shortage encountered on floor terminal.'}
                        </p>
                    </div>
                )}

                {/* Metadata Overview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3 rounded-md border border-slate-300">
                    <div>
                        <span className="text-[0.625rem] text-slate-500 font-mono uppercase block">Order Reference</span>
                        <span className="font-bold text-slate-900 font-mono">{operation.orderNumber}</span>
                    </div>

                    <div>
                        <span className="text-[0.625rem] text-slate-500 font-mono uppercase block">Zone / Aisle</span>
                        <span className="font-semibold text-slate-800">{operation.zone}</span>
                    </div>

                    <div>
                        <span className="text-[0.625rem] text-slate-500 font-mono uppercase block">Assigned Staff</span>
                        <span className="font-bold text-slate-900">{operation.assignedOperatorName || 'Unassigned Queue'}</span>
                    </div>

                    <div>
                        <span className="text-[0.625rem] text-slate-500 font-mono uppercase block">Elapsed Time</span>
                        <span className="font-mono text-slate-700 font-semibold">{operation.elapsedMinutes}m / {operation.estimatedMinutes}m</span>
                    </div>
                </div>

                {/* Status & Priority Controller */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-md border border-slate-300">
                    <Select
                        label="Workflow Status"
                        value={operation.status}
                        onChange={(e) => onUpdateStatus(operation.id, e.target.value as OperationStatus)}
                        options={[
                            { value: 'QUEUED', label: 'Queued Backlog' },
                            { value: 'ASSIGNED', label: 'Assigned to Terminal' },
                            { value: 'IN_PROGRESS', label: 'In Progress (Active Floor)' },
                            { value: 'BLOCKED', label: 'Blocked / Hazard' },
                            { value: 'COMPLETED', label: 'Completed & Staged' },
                        ]}
                    />

                    <Select
                        label="Dispatch Priority"
                        value={operation.priority}
                        onChange={(e) => onUpdatePriority(operation.id, e.target.value as OperationPriority)}
                        options={[
                            { value: 'CRITICAL', label: 'CRITICAL (Emergency Fast-Track)' },
                            { value: 'HIGH', label: 'HIGH Priority' },
                            { value: 'NORMAL', label: 'NORMAL' },
                            { value: 'LOW', label: 'LOW' },
                        ]}
                    />
                </div>

                {/* SKU Item Specification Table */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-[0.6875rem] text-slate-700 uppercase font-mono">
                            Operation Line Items ({operation.items.length})
                        </span>
                        <span className="text-[0.6875rem] font-mono text-slate-500">
                            Total Weight: {operation.totalWeightKg} kg
                        </span>
                    </div>

                    <div className="border border-slate-300 rounded-md overflow-hidden shadow-2xs">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-mono text-[0.625rem]">
                                    <th className="py-2 px-2.5">SKU</th>
                                    <th className="py-2 px-2.5">Product Name</th>
                                    <th className="py-2 px-2.5">Source &rarr; Target</th>
                                    <th className="py-2 px-2.5 text-right">Picked / Target</th>
                                    <th className="py-2 px-2.5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 font-mono text-[0.6875rem]">
                                {operation.items.map(item => {
                                    const isDone = item.pickedQuantity >= item.quantity;
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50">
                                            <td className="py-2 px-2.5 font-bold text-slate-900">{item.sku}</td>
                                            <td className="py-2 px-2.5 font-sans font-medium text-slate-900">{item.productName}</td>
                                            <td className="py-2 px-2.5 text-[0.625rem] text-slate-600">
                                                <Badge variant="slate" className="mr-1">{item.sourceBin}</Badge>
                                                &rarr;
                                                <Badge variant="slate" className="ml-1 font-bold text-slate-800">{item.targetBin}</Badge>
                                            </td>
                                            <td className="py-2 px-2.5 text-right font-bold text-slate-900">
                                                {item.pickedQuantity} / {item.quantity} {item.unit}
                                            </td>
                                            <td className="py-2 px-2.5 text-center">
                                                <Badge variant={isDone ? 'success' : 'warning'}>
                                                    {isDone ? 'COMPLETED' : 'IN FLOW'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </FormBody>

            <FormFooter>
                <Button variant="secondary" size="md" onClick={onClose}>
                    Close
                </Button>
            </FormFooter>
        </Modal>
    );
});

OperationDetailsModal.displayName = 'OperationDetailsModal';
