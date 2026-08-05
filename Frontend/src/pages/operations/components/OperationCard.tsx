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

const CARD_STYLE_MAP: Record<string, string> = {
    BLOCKED: 'border-red-400 bg-red-50/20',
    CRITICAL: 'border-red-300 bg-red-50/10',
    HIGH: 'border-amber-300',
    NORMAL: 'border-slate-300 hover:border-slate-400',
    LOW: 'border-slate-300 hover:border-slate-400'
};

const STATUS_DOT_MAP: Record<string, string> = {
    CRITICAL: 'bg-[#991b1b]',
    HIGH: 'bg-[#AA9559]',
    COMPLETED: 'bg-[#0e5f32]'
};

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
    const isBlocked = operation.status === 'BLOCKED';

    const cardStyle = isBlocked
        ? CARD_STYLE_MAP.BLOCKED
        : CARD_STYLE_MAP[operation.priority] || CARD_STYLE_MAP.NORMAL;

    const dotStyle = STATUS_DOT_MAP[operation.priority]
        || (operation.status === 'COMPLETED' ? STATUS_DOT_MAP.COMPLETED : 'bg-slate-400');

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, operation.id)}
            onClick={() => onSelect(operation)}
            className={`w-full bg-white rounded-md p-3 border shadow-2xs hover:shadow-xs transition-all cursor-grab active:cursor-grabbing select-none space-y-2 text-xs relative group ${cardStyle}`}
        >
            <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${dotStyle}`} />
                    <span className="font-bold font-mono text-slate-900 truncate">
                        {operation.operationNumber}
                    </span>
                    {index === 0 && operation.status === 'IN_PROGRESS' && (
                        <Badge variant="slate" className="bg-slate-800 text-white border-slate-700">
                            #1 PRIORITY
                        </Badge>
                    )}
                </div>

                <Badge variant="slate">
                    {operation.type}
                </Badge>
            </div>

            <div className="space-y-0.5 text-xs">
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

            {isBlocked && operation.blockedReason && (
                <div className="bg-red-50 border border-red-200 rounded p-1.5 text-xs text-red-900 font-medium">
                    <span className="font-bold block">HAZARD / STOP:</span>
                    {operation.blockedReason}
                </div>
            )}

            <div className="bg-slate-50 p-1.5 rounded border border-slate-200 flex items-center justify-between text-xs">
                <div className="truncate min-w-0">
                    <span className="text-slate-500">Staff: </span>
                    <span className="font-bold text-slate-800">
                        {operation.assignedOperatorName || 'Unassigned Queue'}
                    </span>
                </div>
                <span className="font-mono text-slate-600 text-xs shrink-0 font-medium">
                    {operation.elapsedMinutes}m / {operation.estimatedMinutes}m
                </span>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between items-center text-xs text-slate-600 font-mono">
                    <span>{completedLines}/{totalLines} SKUs</span>
                    <span>{operation.totalWeightKg} kg</span>
                    <span className="font-bold text-slate-800">{progressPct}%</span>
                </div>
                <progress
                    value={progressPct}
                    max={100}
                    className="w-full h-1.5 rounded accent-[#2b6675]"
                />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-xs">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(operation);
                    }}
                    className="text-xs py-0.5 px-2"
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
                        className="text-xs px-1.5 py-0.5 font-mono"
                    >
                        Fast-Track #1
                    </Button>
                )}
            </div>
        </div>
    );
};
