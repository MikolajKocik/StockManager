export interface SalesOrderLine {
    id: number;
    salesOrderId: number;
    productId: number;
    productName?: string;
    quantity: number;
    uoM: string;
    unitPrice: number;
    lineTotal: number;
}

export interface SalesOrder {
    id: number;
    customerId: number;
    customerName?: string;
    customerTaxId?: string;
    orderDate: string;
    shipDate?: string;
    deliveredDate?: string;
    cancelDate?: string;
    status: string;
    invoiceId: number;
    returnOrderId?: number;
    salesOrderLines: SalesOrderLine[];
}