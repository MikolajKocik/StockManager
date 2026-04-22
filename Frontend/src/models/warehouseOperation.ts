export type OperationType = "PZ" | "WZ" | "RW" | "MM";

export type OperationStatus = "Pending" | "Completed" | "Cancelled";

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
