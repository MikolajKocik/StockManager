export type RotationStatus = 'FAST' | 'OPTIMAL' | 'SLOW' | 'DEAD_STOCK';

export interface StockTreemapNode {
    id: string;
    name: string;
    level: 'category' | 'subcategory' | 'product';
    category: string;
    subcategory?: string;
    sku?: string;
    value: number; // total capital frozen in PLN
    quantityOnHand: number;
    quantityReserved?: number;
    unitPrice: number;
    turnoverDays: number; // days on shelf
    rotationStatus: RotationStatus;
    binLocation?: string;
    warehouse: string;
    marginPercent?: number;
    children?: StockTreemapNode[];
}

export interface TreemapRect {
    node: StockTreemapNode;
    x: number;
    y: number;
    width: number;
    height: number;
}
