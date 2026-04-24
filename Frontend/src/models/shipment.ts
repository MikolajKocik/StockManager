export interface Shipment {
    id: number;
    salesOrderId: number;
    salesOrderNumber: string | null;
    trackingNumber: string;
    status: string;
    shippedDate: string;
    deliveredDate: string | null;
}

export interface ShipmentCollection {
    data: Shipment[];
}
