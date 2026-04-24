export interface ReturnOrder {
    id: number;
    type: string;
    status: string;
    returnDate: string;
    salesOrderId: number | null;
    purchaseOrderId: number | null;
}