import type { InventoryItem } from "./inventoryItem";

export interface BinZoneLayout {
    id: string;
    code: string;
    sector: 'A' | 'B' | 'C' | 'D' | string;
    x: number;
    y: number;
    width: number;
    height: number;
    maxCapacity: number;
    defaultCategory: string;
    temperature?: string;
    supervisor?: string;
}

export interface BinZoneData extends BinZoneLayout {
    fillPercentage: number;
    status: 'active' | 'maintenance';
    items: number;
    category: string;
    inventoryItems: InventoryItem[];
    activeIncidentId?: number | null;
}

export interface BinMapStats {
    totalItems: number;
    totalCapacity: number;
    activeCount: number;
    maintCount: number;
    occupancyPercent: number;
}
