import { type Shipment } from "@/models/shipment";

export const mockShipments: Shipment[] = [
    {
        id: 3001,
        salesOrderId: 1001,
        salesOrderNumber: "SO-1001",
        trackingNumber: "TRK-987654321",
        status: "In Transit",
        shippedDate: "2026-07-26",
        deliveredDate: null,
        customerName: "John Doe Enterprises",
        destinationCity: "Warsaw",
        destinationCountry: "Poland",
        originCity: "Berlin",
        originCountry: "Germany"
    }
];
