export interface SalesOrder {
    id: number;
    customerId: number;
    customerName?: string;
    orderDate: string;
    shipDate?: string;
    deliveredDate?: string;
    cancelDate?: string;
    status: string;
    invoiceId: number;
    returnOrderId?: number;
}