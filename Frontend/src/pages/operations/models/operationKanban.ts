export type OperationType = 'PICKING' | 'PUTAWAY' | 'REPLENISHMENT' | 'INTERNAL_TRANSFER';

export type OperationStatus = 'QUEUED' | 'ASSIGNED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';

export type OperationPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export interface OperationItemLine {
    id: string;
    sku: string;
    productName: string;
    quantity: number;
    pickedQuantity: number;
    unit: string;
    sourceBin: string;
    targetBin: string;
}

export interface KanbanOperation {
    id: string;
    operationNumber: string;
    type: OperationType;
    status: OperationStatus;
    priority: OperationPriority;
    orderNumber: string;
    zone: string;
    assignedOperatorName?: string;
    assignedEquipment?: string;
    totalItemsCount: number;
    totalWeightKg: number;
    createdAt: string;
    estimatedMinutes: number;
    elapsedMinutes: number;
    blockedReason?: string;
    items: OperationItemLine[];
}

export interface KanbanColumn {
    id: OperationStatus;
    title: string;
    description: string;
    maxCapacityThreshold: number;
    accentColor: string;
}
