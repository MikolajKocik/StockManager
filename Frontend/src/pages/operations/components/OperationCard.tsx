import React from 'react';
import type { KanbanOperation } from '../models/operationKanban';

interface OperationCardProps {
    operation: KanbanOperation;
    index: number;
    onSelect: (op: KanbanOperation) => void;
    onFastTrackPriority: (opId: string) => void;
    onDragStart: (e: React.DragEvent, opId: string) => void;
}

export const OperationCard: React.FC<OperationCardProps> = ({
    operation,
    index,
    onSelect,
    onFastTrackPriority,
    onDragStart
}) => {
    const totalLines = operation.items.length;
    const completedLines = operation.items.filter(i => i.pickedQuantity >= i.quantity).length;
    const progressPct = totalLines > 0 ? Math.round((completedLines / totalLines) * 100) : 0;

    const isCritical = operation.priority === 'CRITICAL';
    const isHigh = operation.priority === 'HIGH';

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, operation.id)}
            onClick={() => onSelect(operation)}
            className={`w-full bg-white rounded-lg p-3 border shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none space-y-2 text-xs relative group ${isCritical
                    ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400/40'
                    : isHigh
                        ? 'border-amber-300 bg-amber-50/20'
                        : operation.status === 'BLOCKED'
                            ? 'border-rose-500 bg-rose-50/50'
                            : 'border-slate-300 hover:border-slate-400'
                }`}
        >
            {/* Top Row: Priority Badge & Operation Number */}
            <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${isCritical ? 'bg-rose-600 animate-ping' :
                            isHigh ? 'bg-amber-500' :
                                operation.status === 'COMPLETED' ? 'bg-emerald-500' :
                                    'bg-slate-400'
                        }`} />
                    <span className="font-bold font-mono text-slate-900 truncate">
                        {operation.operationNumber}
                    </span>
                    {index === 0 && operation.status === 'IN_PROGRESS' && (
                        <span className="bg-rose-700 text-white font-mono text-[9px] px-1 py-0.2 rounded font-black tracking-tight shrink-0">
                            #1 PRIORITY
                        </span>
                    )}
                </div>

                {/* Operation Type Tag */}
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 uppercase ${operation.type === 'PICKING' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                        operation.type === 'PUTAWAY' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                            operation.type === 'REPLENISHMENT' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                                'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                    {operation.type}
                </span>
            </div>

            {/* Target Order & Destination Zone */}
            <div className="space-y-0.5 text-[11px]">
                <div className="flex justify-between items-center">
                    <span className="text-slate-500">Order:</span>
                    <span className="font-mono font-bold text-slate-800 truncate max-w-35">
                        {operation.orderNumber}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-medium text-slate-700 truncate max-w-37.5">
                        {operation.zone}
                    </span>
                </div>
            </div>

            {/* Blocked Warning Reason if Halted */}
            {operation.status === 'BLOCKED' && operation.blockedReason && (
                <div className="bg-rose-100 border border-rose-300 rounded p-1.5 text-[10px] text-rose-900 font-medium">
                    <span className="font-bold block">HAZARD / STOP:</span>
                    {operation.blockedReason}
                </div>
            )}

            {/* Operator Assignment Info */}
            <div className="bg-slate-50 p-1.5 rounded border border-slate-200 flex items-center justify-between text-[10px]">
                <div className="truncate min-w-0">
                    <span className="text-slate-500">Operator: </span>
                    <span className="font-bold text-slate-800">
                        {operation.assignedOperatorName || 'Unassigned Queue'}
                    </span>
                </div>
                <span className="font-mono text-slate-500 text-[9px] shrink-0">
                    {operation.elapsedMinutes}m / {operation.estimatedMinutes}m
                </span>
            </div>

            {/* Progress Bar (SKUs Completed) */}
            <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] text-slate-600 font-mono">
                    <span>{completedLines}/{totalLines} SKUs</span>
                    <span>{operation.totalWeightKg} kg</span>
                    <span className="font-bold text-slate-800">{progressPct}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${progressPct === 100 ? 'bg-emerald-600' :
                                isCritical ? 'bg-rose-600' : 'bg-blue-600'
                            }`}
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>

            {/* Action Bar / Fast Priority Elevation */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px]">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(operation);
                    }}
                    className="text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
                >
                    View Items &rarr;
                </button>

                {operation.status !== 'COMPLETED' && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onFastTrackPriority(operation.id);
                        }}
                        title="Promote to Top Priority (Broadcasts UpdateOperationPriorityCommand)"
                        className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[9px] cursor-pointer transition-colors"
                    >
                        Fast-Track #1
                    </button>
                )}
            </div>
        </div>
    );
};
