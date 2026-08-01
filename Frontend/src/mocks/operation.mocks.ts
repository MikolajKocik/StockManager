import { type WarehouseOperation } from "@/models/warehouseOperation";

export const mockWarehouseOperations: WarehouseOperation[] = [
    {
        id: 101,
        type: 1,
        status: 2,
        date: "2026-07-28T14:30:00Z",
        description: "Received raw materials from Acme Corp",
        items: [
            {
                productId: 201,
                quantity: 1000
            }
        ]
    }
];
