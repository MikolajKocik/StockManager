import { type PurchaseOrder } from "@/models/purchaseOrder";

export const mockPurchaseOrders: PurchaseOrder[] = [
    {
        id: 2001,
        supplierId: "1",
        supplierName: "Acme Corp",
        supplierTaxId: "US12345",
        orderDate: "2026-07-20",
        expectedDate: "2026-08-01",
        status: "In Transit",
        invoiceId: null,
        returnOrderId: null,
        purchaseOrderLines: [
            {
                id: 1,
                purchaseOrderId: 2001,
                productId: 201,
                productName: "Raw Steel",
                quantity: 1000,
                uoM: "kg",
                unitPrice: 2.50,
                lineTotal: 2500.00
            }
        ]
    }
];
