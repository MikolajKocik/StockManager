export interface PurchaseOrderLine {
    id: number;
    purchaseOrderId: number;
    productId: number;
    productName?: string;
    quantity: number;
    uoM: string;
    unitPrice: number;
    lineTotal: number;
}

export interface PurchaseOrder {
    id: number;
    supplierId: string;
    supplierName?: string;
    supplierTaxId?: string;
    orderDate: string;
    expectedDate: string | null;
    status: string;
    invoiceId: number | null;
    returnOrderId: number | null;
    purchaseOrderLines: PurchaseOrderLine[];
}