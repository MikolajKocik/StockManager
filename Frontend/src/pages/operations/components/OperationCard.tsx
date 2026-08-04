import React from 'react';
import { Button, Badge } from '@/components/common';
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
    const isBlocked = operation.status === 'BLOCKED';

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, operation.id)}
            onClick={() => onSelect(operation)}
            className={`w-full bg-white rounded-md p-3 border shadow-2xs hover:shadow-xs transition-all cursor-grab active:cursor-grabbing select-none space-y-2 text-xs relative group ${
                isBlocked
                    ? 'border-red-400 bg-red-50/20'
                    : isCritical
                    ? 'border-red-300 bg-red-50/10'
                    : isHigh
                    ? 'border-amber-300'
                    : 'border-slate-300 hover:border-slate-400'
            }`}
        >
            {/* Top Row: Operation Number & Type Tag */}
            <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                        isCritical ? 'bg-[#991b1b]' :
                        isHigh ? 'bg-[#AA9559]' :
                        operation.status === 'COMPLETED' ? 'bg-[#0e5f32]' :
                        'bg-slate-400'
                    }`} />
                    <span className="font-bold font-mono text-slate-900 truncate">
                        {operation.operationNumber}
                    </span>
                    {index === 0 && operation.status === 'IN_PROGRESS' && (
                        <Badge variant="slate" className="bg-slate-800 text-white border-slate-700">
                            #1 PRIORITY
                        </Badge>
                    )}
                </div>

                {/* Operation Type Tag using Badge */}
                <Badge variant="slate">
                    {operation.type}
                </Badge>
            </div>

            {/* Target Order & Destination Zone */}
            <div className="space-y-0.5 text-[11px]">
                <div className="flex justify-between items-center">
                    <span className="text-slate-500">Order:</span>
                    <span className="font-mono font-bold text-slate-800 truncate max-w-36">
                        {operation.orderNumber}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-medium text-slate-700 truncate max-w-36">
                        {operation.zone}
                    </span>
                </div>
            </div>

            {/* Blocked Warning Reason if Halted */}
            {isBlocked && operation.blockedReason && (
                <div className="bg-red-50 border border-red-200 rounded p-1.5 text-[10px] text-red-900 font-medium">
                    <span className="font-bold block">HAZARD / STOP:</span>
                    {operation.blockedReason}
                </div>
            )}

            {/* Operator Assignment Info */}
            <div className="bg-slate-50 p-1.5 rounded border border-slate-200 flex items-center justify-between text-[10px]">
                <div className="truncate min-w-0">
                    <span className="text-slate-500">Staff: </span>
                    <span className="font-bold text-slate-800">
                        {operation.assignedOperatorName || 'Unassigned Queue'}
                    </span>
                </div>
                <span className="font-mono text-slate-600 text-[9px] shrink-0 font-medium">
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
                        className={`h-full rounded-full transition-all ${
                            progressPct === 100 ? 'bg-[#0e5f32]' :
                            isCritical ? 'bg-[#991b1b]' : 'bg-[#2b6675]'
                        }`}
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px]">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(operation);
                    }}
                    className="text-[10px] py-0.5 px-2"
                >
                    View Items
                </Button>

                {operation.status !== 'COMPLETED' && (
                    <Button
                        variant="warning"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onFastTrackPriority(operation.id);
                        }}
                        title="Promote to Top Priority"
                        className="text-[9px] px-1.5 py-0.5 font-mono"
                    >
                        Fast-Track #1
                    </Button>
                )}
            </div>
        </div>
    );
};
