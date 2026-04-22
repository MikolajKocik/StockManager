export interface PurchaseOrder {
    id: number;
    supplierId: string;
    supplierName?: string;
    orderDate: string;
    expectedDate: string | null;
    status: string;
    invoiceId: number | null;
    returnOrderId: number | null;
}