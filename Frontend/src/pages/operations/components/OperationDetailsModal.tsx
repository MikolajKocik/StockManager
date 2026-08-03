import { forwardRef } from 'react';
import type { KanbanOperation, OperationPriority, OperationStatus } from '../models/operationKanban';
import { Button, FormBody, FormFooter, Modal } from '@/components/common';

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
                            <span className="font-bold uppercase font-mono text-[11px]">
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
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Order Reference</span>
                        <span className="font-bold text-slate-900 font-mono">{operation.orderNumber}</span>
                    </div>

                    <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Zone / Aisle</span>
                        <span className="font-semibold text-slate-800">{operation.zone}</span>
                    </div>

                    <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Assigned Staff</span>
                        <span className="font-bold text-slate-900">{operation.assignedOperatorName || 'Unassigned Queue'}</span>
                    </div>

                    <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Elapsed Time</span>
                        <span className="font-mono text-slate-700 font-semibold">{operation.elapsedMinutes}m / {operation.estimatedMinutes}m</span>
                    </div>
                </div>

                {/* Status & Priority Controller */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-md border border-slate-300">
                    <div>
                        <label className="text-[11px] font-bold text-slate-700 font-mono uppercase block mb-1">
                            Workflow Status:
                        </label>
                        <select
                            value={operation.status}
                            onChange={(e) => onUpdateStatus(operation.id, e.target.value as OperationStatus)}
                            className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-slate-800 cursor-pointer"
                        >
                            <option value="QUEUED">Queued Backlog</option>
                            <option value="ASSIGNED">Assigned to Terminal</option>
                            <option value="IN_PROGRESS">In Progress (Active Floor)</option>
                            <option value="BLOCKED">Blocked / Hazard</option>
                            <option value="COMPLETED">Completed & Staged</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-[11px] font-bold text-slate-700 font-mono uppercase block mb-1">
                            Dispatch Priority:
                        </label>
                        <select
                            value={operation.priority}
                            onChange={(e) => onUpdatePriority(operation.id, e.target.value as OperationPriority)}
                            className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-semibold font-mono text-slate-800 outline-none focus:border-slate-800 cursor-pointer"
                        >
                            <option value="CRITICAL">CRITICAL (Emergency Fast-Track)</option>
                            <option value="HIGH">HIGH Priority</option>
                            <option value="NORMAL">NORMAL</option>
                            <option value="LOW">LOW</option>
                        </select>
                    </div>
                </div>

                {/* SKU Item Specification Table */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-slate-700 uppercase font-mono">
                            Operation Line Items ({operation.items.length})
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                            Total Weight: {operation.totalWeightKg} kg
                        </span>
                    </div>

                    <div className="border border-slate-300 rounded-md overflow-hidden shadow-2xs">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-mono text-[10px]">
                                    <th className="py-2 px-2.5">SKU</th>
                                    <th className="py-2 px-2.5">Product Name</th>
                                    <th className="py-2 px-2.5">Source &rarr; Target</th>
                                    <th className="py-2 px-2.5 text-right">Picked / Target</th>
                                    <th className="py-2 px-2.5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                                {operation.items.map(item => {
                                    const isDone = item.pickedQuantity >= item.quantity;
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50">
                                            <td className="py-2 px-2.5 font-bold text-slate-900">{item.sku}</td>
                                            <td className="py-2 px-2.5 font-sans font-medium text-slate-900">{item.productName}</td>
                                            <td className="py-2 px-2.5 text-[10px] text-slate-600">
                                                <span className="bg-slate-100 px-1 py-0.5 rounded border border-slate-300">{item.sourceBin}</span>
                                                <span className="mx-1">&rarr;</span>
                                                <span className="bg-slate-100 px-1 py-0.5 rounded border border-slate-300 font-bold text-slate-800">{item.targetBin}</span>
                                            </td>
                                            <td className="py-2 px-2.5 text-right font-bold text-slate-900">
                                                {item.pickedQuantity} / {item.quantity} {item.unit}
                                            </td>
                                            <td className="py-2 px-2.5 text-center">
                                                <span className={`px-1.5 py-0.5 rounded-xs text-[9px] font-bold ${
                                                    isDone
                                                        ? 'bg-emerald-50 text-[#0e5f32] border border-emerald-300'
                                                        : 'bg-amber-50 text-[#8f7d49] border border-amber-300'
                                                }`}>
                                                    {isDone ? 'COMPLETED' : 'IN FLOW'}
                                                </span>
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
