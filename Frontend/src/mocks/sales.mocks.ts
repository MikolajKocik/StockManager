import { type SalesOrder } from "@/models/salesOrder";

export const mockSalesOrders: SalesOrder[] = [
    {
        id: 1001,
        customerId: 1,
        customerName: "John Doe Enterprises",
        customerTaxId: "PL1234567890",
        orderDate: "2026-07-25",
        status: "Completed",
        invoiceId: 5001,
        salesOrderLines: [
            {
                id: 1,
                salesOrderId: 1001,
                productId: 101,
                productName: "Industrial Laptop",
                quantity: 5,
                uoM: "pcs",
                unitPrice: 1200.00,
                lineTotal: 6000.00
            }
        ]
    },
    {
        id: 1002,
        customerId: 2,
        customerName: "Jane Smith LLC",
        customerTaxId: "GB987654321",
        orderDate: "2026-07-28",
        status: "Pending",
        invoiceId: 5002,
        salesOrderLines: [
            {
                id: 2,
                salesOrderId: 1002,
                productId: 102,
                productName: "Office Chair",
                quantity: 20,
                uoM: "pcs",
                unitPrice: 150.00,
                lineTotal: 3000.00
            }
        ]
    }
];
