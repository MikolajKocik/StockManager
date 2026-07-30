import type { InventoryItem } from "@/models/inventoryItem";

export const mockInventoryItems: InventoryItem[] = [
    {
        id: 1,
        productId: 1,
        productName: "Milk",
        binLocationId: 1,
        binLocationCode: "BIN-A-1",
        warehouse: "MainWarehouse",
        quantityOnHand: 0,
        quantityReserved: 0,
        quantityAvailable: 0
    },
    {
        id: 2,
        productId: 2,
        productName: "Apple",
        binLocationId: 2,
        binLocationCode: "BIN-A-2",
        warehouse: "MainWarehouse",
        quantityOnHand: 150,
        quantityReserved: 20,
        quantityAvailable: 130
    },
    {
        id: 3,
        productId: 3,
        productName: "Potato",
        binLocationId: 3,
        binLocationCode: "BIN-B-1",
        warehouse: "SecondaryWarehouse",
        quantityOnHand: 500,
        quantityReserved: 50,
        quantityAvailable: 450
    },
    {
        id: 4,
        productId: 4,
        productName: "Chicken Breast",
        binLocationId: 4,
        binLocationCode: "BIN-C-1",
        warehouse: "MainWarehouse",
        quantityOnHand: 0,
        quantityReserved: 0,
        quantityAvailable: 0
    }
];
