export type OperationType = number;

export type OperationStatus = number;

export interface OperationItem {
    productId: number;
    quantity: number;
}

export interface WarehouseOperation {
    id: number;
    type: OperationType;
    status: OperationStatus;
    date: string;
    description: string;
    items: OperationItem[];
}
