import React, { useState } from 'react';
import type { KanbanOperation, KanbanColumn, OperationStatus } from '../models/operationKanban';
import { Badge } from '@/components/common';
import { OperationCard } from './OperationCard';

interface WorkflowKanbanBoardProps {
    columns: KanbanColumn[];
    operations: KanbanOperation[];
    onMoveOperation: (opId: string, newStatus: OperationStatus, newIndex?: number) => void;
    onFastTrackPriority: (opId: string) => void;
    onSelectOperation: (op: KanbanOperation) => void;
}

const STATUS_DOT_COLOR: Record<string, string> = {
    'IN_PROGRESS': 'bg-[#AA9559]',
    'BLOCKED': 'bg-[#991b1b]',
    'COMPLETED': 'bg-[#0e5f32]',
    'QUEUED': 'bg-slate-400',
    'ASSIGNED': 'bg-slate-400'
};

export const WorkflowKanbanBoard: React.FC<WorkflowKanbanBoardProps> = ({
    columns,
    operations,
    onMoveOperation,
    onFastTrackPriority,
    onSelectOperation
}) => {
    const [draggedOpId, setDraggedOpId] = useState<string | null>(null);
    const [dragOverColumnId, setDragOverColumnId] = useState<OperationStatus | null>(null);

    const handleDragStart = (_e: React.DragEvent, opId: string) => {
        setDraggedOpId(opId);
    };

    const handleDragOver = (e: React.DragEvent, colId: OperationStatus) => {
        e.preventDefault();
        if (dragOverColumnId !== colId) {
            setDragOverColumnId(colId);
        }
    };

    const handleDragLeave = () => {
        setDragOverColumnId(null);
    };

    const handleDrop = (e: React.DragEvent, targetStatus: OperationStatus) => {
        e.preventDefault();
        setDragOverColumnId(null);
        if (draggedOpId) {
            onMoveOperation(draggedOpId, targetStatus);
            setDraggedOpId(null);
        }
    };

    return (
        <div className="w-full overflow-x-auto pb-4 select-none">
            <div className="flex gap-3.5 min-w-[68.75rem] items-start">
                {columns.map((column) => {
                    const colOps = operations.filter(op => op.status === column.id);
                    const isOverloaded = colOps.length > column.maxCapacityThreshold;
                    const isDragOver = dragOverColumnId === column.id;
                    const dotClass = STATUS_DOT_COLOR[column.id] || 'bg-slate-400';

                    return (
                        <div
                            key={column.id}
                            onDragOver={(e) => handleDragOver(e, column.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, column.id)}
                            className={`flex-1 min-w-[13.75rem] bg-slate-100/70 rounded-lg border flex flex-col max-h-[calc(100vh-15.625rem)] shadow-2xs transition-colors ${
                                isDragOver
                                    ? 'bg-slate-200/90 border-[#2b6675] ring-2 ring-[#2b6675]/30'
                                    : isOverloaded && column.id === 'IN_PROGRESS'
                                    ? 'border-amber-300 bg-amber-50/20'
                                    : isOverloaded && column.id === 'BLOCKED'
                                    ? 'border-red-300 bg-red-50/20'
                                    : 'border-slate-300'
                            }`}
                        >
                            {/* Column Header */}
                            <div className="p-3 border-b border-slate-200 bg-white rounded-t-lg space-y-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className={`w-2 h-2 rounded-full ${dotClass}`} />
                                        <h3 className="font-bold text-slate-800 text-xs truncate">
                                            {column.title}
                                        </h3>
                                    </div>
                                    <Badge variant="slate">
                                        {colOps.length}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between text-[0.625rem]">
                                    <span className="text-slate-500 truncate">{column.description}</span>
                                    {isOverloaded && (
                                        <Badge variant="warning">
                                            Overloaded
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Cards Container with Scroll */}
                            <div className="p-2 space-y-2.5 overflow-y-auto flex-1 min-h-[18.75rem]">
                                {colOps.length === 0 ? (
                                    <div className="h-40 border-2 border-dashed border-slate-300 rounded-md flex flex-col items-center justify-center p-3 text-center text-slate-400">
                                        <span className="text-xs font-semibold">No active tasks</span>
                                        <span className="text-[0.625rem] text-slate-400 mt-0.5">
                                            Drag orders here to transition status
                                        </span>
                                    </div>
                                ) : (
                                    colOps.map((op, idx) => (
                                        <OperationCard
                                            key={op.id}
                                            operation={op}
                                            index={idx}
                                            onSelect={onSelectOperation}
                                            onFastTrackPriority={onFastTrackPriority}
                                            onDragStart={handleDragStart}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
