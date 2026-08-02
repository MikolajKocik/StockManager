import React from 'react';
import type { KanbanOperation, OperationPriority, OperationStatus } from '../models/operationKanban';

interface OperationDetailsModalProps {
    isOpen: boolean;
    operation: KanbanOperation | null;
    onClose: () => void;
    onUpdatePriority: (opId: string, priority: OperationPriority) => void;
    onUpdateStatus: (opId: string, status: OperationStatus) => void;
    onResolveBlocked: (opId: string) => void;
}

export const OperationDetailsModal: React.FC<OperationDetailsModalProps> = ({
    isOpen,
    operation,
    onClose,
    onUpdatePriority,
    onUpdateStatus,
    onResolveBlocked
}) => {
    if (!isOpen || !operation) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden text-slate-800 animate-scale-in flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="bg-[#384155] p-4 text-white flex items-center justify-between border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <span className="bg-[#fbbf24] text-slate-950 font-black text-xs px-2 py-0.5 rounded font-mono uppercase">
                            {operation.type}
                        </span>
                        <h2 className="text-base font-bold font-mono">
                            {operation.operationNumber}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-300 hover:text-white font-mono text-lg font-bold cursor-pointer px-2 py-0.5 rounded hover:bg-slate-700 transition-colors"
                        dangerouslySetInnerHTML={{ __html: '&#10005;' }}
                    />
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-4 overflow-y-auto text-xs">
                    {/* Blocked Hazard Banner */}
                    {operation.status === 'BLOCKED' && (
                        <div className="bg-rose-50 border border-rose-300 rounded-lg p-3 space-y-2 text-rose-900">
                            <div className="flex items-center justify-between">
                                <span className="font-bold uppercase font-mono text-[11px]">
                                    Hazard / Obstruction Details:
                                </span>
                                <button
                                    type="button"
                                    onClick={() => onResolveBlocked(operation.id)}
                                    className="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-colors shadow-xs"
                                >
                                    Clear Hazard & Resume Task
                                </button>
                            </div>
                            <p className="text-xs font-medium">
                                {operation.blockedReason || 'Aisle obstructed or SKU shortage encountered on terminal.'}
                            </p>
                        </div>
                    )}

                    {/* Metadata Overview Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
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
                            <span className="font-bold text-slate-900">{operation.assignedOperatorName || 'Unassigned'}</span>
                        </div>

                        <div>
                            <span className="text-[10px] text-slate-500 font-mono uppercase block">Elapsed Time</span>
                            <span className="font-mono text-slate-700 font-semibold">{operation.elapsedMinutes}m / {operation.estimatedMinutes}m</span>
                        </div>
                    </div>

                    {/* Status & Priority Controller */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 font-mono uppercase">
                                Workflow Status:
                            </label>
                            <select
                                value={operation.status}
                                onChange={(e) => onUpdateStatus(operation.id, e.target.value as OperationStatus)}
                                className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs font-semibold"
                            >
                                <option value="QUEUED">Queued Backlog</option>
                                <option value="ASSIGNED">Assigned to Terminal</option>
                                <option value="IN_PROGRESS">In Progress (Active Floor)</option>
                                <option value="BLOCKED">Blocked / Hazard</option>
                                <option value="COMPLETED">Completed & Staged</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 font-mono uppercase">
                                Dispatch Priority:
                            </label>
                            <select
                                value={operation.priority}
                                onChange={(e) => onUpdatePriority(operation.id, e.target.value as OperationPriority)}
                                className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs font-semibold font-mono"
                            >
                                <option value="CRITICAL">CRITICAL (Emergency Fast-Track)</option>
                                <option value="HIGH">HIGH Priority</option>
                                <option value="NORMAL">NORMAL</option>
                                <option value="LOW">LOW</option>
                            </select>
                        </div>
                    </div>

                    {/* SKU Item Specification Table */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-slate-800 uppercase font-mono">
                                Operation Line Items ({operation.items.length})
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">
                                Total Weight: {operation.totalWeightKg} kg
                            </span>
                        </div>

                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-mono text-[10px]">
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
                                                <td className="py-2 px-2.5 font-bold text-blue-900">{item.sku}</td>
                                                <td className="py-2 px-2.5 font-sans font-medium text-slate-900">{item.productName}</td>
                                                <td className="py-2 px-2.5 text-[10px] text-slate-600">
                                                    <span className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200">{item.sourceBin}</span>
                                                    <span className="mx-1">&rarr;</span>
                                                    <span className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200 font-bold text-slate-800">{item.targetBin}</span>
                                                </td>
                                                <td className="py-2 px-2.5 text-right font-bold">
                                                    {item.pickedQuantity} / {item.quantity} {item.unit}
                                                </td>
                                                <td className="py-2 px-2.5 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                                        isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
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
                </div>

                {/* Modal Footer */}
                <div className="bg-slate-50 p-3.5 border-t border-slate-200 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
