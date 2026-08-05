import { useState, useRef } from 'react';
import { OperationsHeader } from './components/OperationsHeader';
import { WorkflowKanbanBoard } from './components/WorkflowKanbanBoard';
import { OperationDetailsModal } from './components/OperationDetailsModal';
import { CreateOperationModal } from './components/CreateOperationModal';

import { KANBAN_COLUMNS, INITIAL_OPERATIONS } from './mocks/operationKanban.mocks';
import type {
    KanbanOperation,
    OperationStatus,
    OperationPriority,
    OperationType
} from './models/operationKanban';
import toast from 'react-hot-toast';

export default function Operations() {
    const [operations, setOperations] = useState<KanbanOperation[]>(INITIAL_OPERATIONS);
    const [filterType, setFilterType] = useState<OperationType | 'ALL'>('ALL');
    const [filterPriority, setFilterPriority] = useState<OperationPriority | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedOperation, setSelectedOperation] = useState<KanbanOperation | null>(null);

    const createModalRef = useRef<HTMLDialogElement>(null);
    const detailsModalRef = useRef<HTMLDialogElement>(null);

    const inProgressCount = operations.filter(op => op.status === 'IN_PROGRESS').length;
    const blockedCount = operations.filter(op => op.status === 'BLOCKED').length;
    const activeFloorCount = operations.filter(op => op.status !== 'COMPLETED').length;
    const isBottleneckActive = inProgressCount >= 5;

    const handleOpenCreateModal = () => {
        createModalRef.current?.showModal();
    };

    const handleCloseCreateModal = () => {
        createModalRef.current?.close();
    };

    const handleSelectOperation = (op: KanbanOperation) => {
        setSelectedOperation(op);
        detailsModalRef.current?.showModal();
    };

    const handleCloseDetailsModal = () => {
        detailsModalRef.current?.close();
        setSelectedOperation(null);
    };

    const handleMoveOperation = (opId: string, newStatus: OperationStatus) => {
        const targetOp = operations.find(o => o.id === opId);
        if (!targetOp) return;
        if (targetOp.status === newStatus) return;

        setOperations(prev => prev.map(op => {
            if (op.id !== opId) return op;
            return {
                ...op,
                status: newStatus,
                blockedReason: newStatus === 'BLOCKED' ? (op.blockedReason || 'Flagged manually by shift foreman') : undefined
            };
        }));

        toast.success(`Moved ${targetOp.operationNumber} to ${newStatus.replace('_', ' ')}`);
    };

    {/** Elevates selected operation to Priority #1 and transitions state to IN_PROGRESS */ }
    const handleFastTrackPriority = (opId: string) => {
        const targetOp = operations.find(o => o.id === opId);
        if (!targetOp) return;

        setOperations(prev => {
            const others = prev.filter(o => o.id !== opId);
            const elevated: KanbanOperation = {
                ...targetOp,
                priority: 'CRITICAL',
                status: targetOp.status === 'QUEUED' ? 'IN_PROGRESS' : targetOp.status
            };
            return [elevated, ...others];
        });

        toast.success(
            `Dispatched Priority Update: ${targetOp.operationNumber} promoted to Priority #1 on all terminals.`,
            { duration: 4000 }
        );
    };

    const handleUpdatePriority = (opId: string, priority: OperationPriority) => {
        setOperations(prev => prev.map(o => o.id === opId ? { ...o, priority } : o));
        if (selectedOperation && selectedOperation.id === opId) {
            setSelectedOperation(prev => prev ? { ...prev, priority } : null);
        }
        toast.success(`Updated priority to ${priority}`);
    };

    const handleUpdateStatus = (opId: string, status: OperationStatus) => {
        setOperations(prev => prev.map(o => o.id === opId ? { ...o, status } : o));
        if (selectedOperation && selectedOperation.id === opId) {
            setSelectedOperation(prev => prev ? { ...prev, status } : null);
        }
        toast.success(`Status updated to ${status}`);
    };

    const handleResolveBlocked = (opId: string) => {
        setOperations(prev => prev.map(o => {
            if (o.id !== opId) return o;
            return {
                ...o,
                status: 'IN_PROGRESS',
                blockedReason: undefined
            };
        }));
        if (selectedOperation && selectedOperation.id === opId) {
            setSelectedOperation(prev => prev ? { ...prev, status: 'IN_PROGRESS', blockedReason: undefined } : null);
        }
        toast.success('Hazard cleared. Task returned to In Progress queue.');
    };

    const handleCreateOperation = (newOp: KanbanOperation) => {
        setOperations(prev => [newOp, ...prev]);
    };

    const filteredOperations = operations.filter(op => {
        const matchesType = filterType === 'ALL' || op.type === filterType;
        const matchesPriority = filterPriority === 'ALL' || op.priority === filterPriority;
        const matchesSearch =
            op.operationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            op.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            op.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (op.assignedOperatorName && op.assignedOperatorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            op.items.some(i => i.sku.toLowerCase().includes(searchQuery.toLowerCase()) || i.productName.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesType && matchesPriority && matchesSearch;
    });

    return (
        <div className="w-full space-y-4 pb-12">
            <OperationsHeader
                filterType={filterType}
                onFilterTypeChange={setFilterType}
                filterPriority={filterPriority}
                onFilterPriorityChange={setFilterPriority}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onOpenCreateModal={handleOpenCreateModal}
                activeFloorCount={activeFloorCount}
                inProgressCount={inProgressCount}
                blockedCount={blockedCount}
                isBottleneckActive={isBottleneckActive}
            />

            <WorkflowKanbanBoard
                columns={KANBAN_COLUMNS}
                operations={filteredOperations}
                onMoveOperation={handleMoveOperation}
                onFastTrackPriority={handleFastTrackPriority}
                onSelectOperation={handleSelectOperation}
            />

            <OperationDetailsModal
                ref={detailsModalRef}
                operation={selectedOperation}
                onClose={handleCloseDetailsModal}
                onUpdatePriority={handleUpdatePriority}
                onUpdateStatus={handleUpdateStatus}
                onResolveBlocked={handleResolveBlocked}
            />

            <CreateOperationModal
                ref={createModalRef}
                onClose={handleCloseCreateModal}
                onCreate={handleCreateOperation}
            />
        </div>
    );
}
