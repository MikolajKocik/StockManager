export interface Invoice {
    id: number;
    type: string;
    invoiceDate: string;
    dueDate: string | null;
    status: string;
    totalAmount: number;
    purchaseOrderId: number | null;
    salesOrderId: number | null;
}