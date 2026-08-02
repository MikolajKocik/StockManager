import React, { useState } from 'react';
import type { KanbanOperation, KanbanColumn, OperationStatus } from '../models/operationKanban';
import { OperationCard } from './OperationCard';

interface WorkflowKanbanBoardProps {
    columns: KanbanColumn[];
    operations: KanbanOperation[];
    onMoveOperation: (opId: string, newStatus: OperationStatus, newIndex?: number) => void;
    onFastTrackPriority: (opId: string) => void;
    onSelectOperation: (op: KanbanOperation) => void;
}

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
            <div className="flex gap-3.5 min-w-[1100px] items-start">
                {columns.map((column) => {
                    const colOps = operations.filter(op => op.status === column.id);
                    const isOverloaded = colOps.length > column.maxCapacityThreshold;
                    const isDragOver = dragOverColumnId === column.id;

                    return (
                        <div
                            key={column.id}
                            onDragOver={(e) => handleDragOver(e, column.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, column.id)}
                            className={`flex-1 min-w-[220px] bg-slate-100/90 rounded-xl border flex flex-col max-h-[calc(100vh-250px)] shadow-xs transition-colors ${
                                isDragOver
                                    ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-300'
                                    : isOverloaded && column.id === 'IN_PROGRESS'
                                    ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-400/60'
                                    : isOverloaded && column.id === 'BLOCKED'
                                    ? 'border-rose-400 bg-rose-50/40 ring-1 ring-rose-400/60'
                                    : 'border-slate-300'
                            }`}
                        >
                            {/* Column Header */}
                            <div className="p-3 border-b border-slate-200 bg-white rounded-t-xl space-y-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className={`w-2 h-2 rounded-full ${
                                            column.id === 'IN_PROGRESS' ? 'bg-amber-500' :
                                            column.id === 'BLOCKED' ? 'bg-rose-600' :
                                            column.id === 'COMPLETED' ? 'bg-emerald-500' :
                                            'bg-slate-400'
                                        }`} />
                                        <h3 className="font-bold text-slate-900 text-xs truncate">
                                            {column.title}
                                        </h3>
                                    </div>
                                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                        isOverloaded
                                            ? 'bg-amber-600 text-white animate-pulse'
                                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                                    }`}>
                                        {colOps.length}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-slate-500 truncate">{column.description}</span>
                                    {isOverloaded && (
                                        <span className="text-amber-800 font-bold font-mono text-[9px] uppercase">
                                            Overloaded
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Cards Container with Scroll */}
                            <div className="p-2 space-y-2.5 overflow-y-auto flex-1 min-h-[300px]">
                                {colOps.length === 0 ? (
                                    <div className="h-40 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center p-3 text-center text-slate-600">
                                        <span className="text-xs font-semibold">No active tasks</span>
                                        <span className="text-[10px] text-slate-700 mt-0.5">
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
