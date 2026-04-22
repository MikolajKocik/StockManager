export interface InventoryItem {
    id: number;
    productId: number;
    productName: string | null;
    binLocationId: number;
    binLocationCode: string | null;
    warehouse: string;
    quantityOnHand: number;
    quantityReserved: number;
    quantityAvailable: number;
}

export interface InventoryItemCollection {
    data: InventoryItem[];
}
