export interface Shipment {
    id: number;
    salesOrderId: number;
    salesOrderNumber: string | null;
    trackingNumber: string;
    status: string;
    shippedDate: string;
    deliveredDate: string | null;
    customerName?: string;
    destinationCity?: string;
    destinationCountry?: string;
    originCity?: string;
    originCountry?: string;
}

export interface ShipmentCollection {
    data: Shipment[];
}
