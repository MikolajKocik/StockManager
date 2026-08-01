import type { BinZoneLayout, BinZoneData } from "@/models/binMap";

export interface BinZone extends BinZoneData {}

export const DEFAULT_BIN_LAYOUTS: BinZoneLayout[] = [
    // Sector A - Electronics & High Value
    { id: 'A-01', code: 'BIN-A-1', sector: 'A', x: 45, y: 110, width: 175, height: 60, maxCapacity: 500, defaultCategory: 'Electronics', temperature: '21°C', supervisor: 'J. Kowalski' },
    { id: 'A-02', code: 'BIN-A-2', sector: 'A', x: 45, y: 190, width: 175, height: 60, maxCapacity: 500, defaultCategory: 'Electronics', temperature: '21°C', supervisor: 'J. Kowalski' },
    { id: 'A-03', code: 'BIN-A-3', sector: 'A', x: 45, y: 270, width: 175, height: 60, maxCapacity: 500, defaultCategory: 'Accessories', temperature: '20°C', supervisor: 'J. Kowalski' },
    { id: 'A-04', code: 'BIN-A-4', sector: 'A', x: 45, y: 350, width: 175, height: 60, maxCapacity: 500, defaultCategory: 'Accessories', temperature: '20°C', supervisor: 'J. Kowalski' },

    // Sector B - Home Appliances & Bulky Goods
    { id: 'B-01', code: 'BIN-B-1', sector: 'B', x: 255, y: 110, width: 175, height: 60, maxCapacity: 200, defaultCategory: 'Home Appliances', temperature: '19°C', supervisor: 'A. Nowak' },
    { id: 'B-02', code: 'BIN-B-2', sector: 'B', x: 255, y: 190, width: 175, height: 60, maxCapacity: 200, defaultCategory: 'Service & Repair', temperature: '-', supervisor: 'M. Wisniewski' },
    { id: 'B-03', code: 'BIN-B-3', sector: 'B', x: 255, y: 270, width: 175, height: 60, maxCapacity: 200, defaultCategory: 'Home Appliances', temperature: '19°C', supervisor: 'A. Nowak' },
    { id: 'B-04', code: 'BIN-B-4', sector: 'B', x: 255, y: 350, width: 175, height: 60, maxCapacity: 200, defaultCategory: 'Spare Parts', temperature: '19°C', supervisor: 'A. Nowak' },

    // Sector C - Hardware & Fasteners
    { id: 'C-01', code: 'BIN-C-1', sector: 'C', x: 465, y: 110, width: 175, height: 60, maxCapacity: 400, defaultCategory: 'Hardware & Tools', temperature: '18°C', supervisor: 'P. Zielinski' },
    { id: 'C-02', code: 'BIN-C-2', sector: 'C', x: 465, y: 190, width: 175, height: 60, maxCapacity: 400, defaultCategory: 'Hardware & Tools', temperature: '18°C', supervisor: 'P. Zielinski' },
    { id: 'C-03', code: 'BIN-C-3', sector: 'C', x: 465, y: 270, width: 175, height: 60, maxCapacity: 400, defaultCategory: 'Fasteners', temperature: '18°C', supervisor: 'P. Zielinski' },
    { id: 'C-04', code: 'BIN-C-4', sector: 'C', x: 465, y: 350, width: 175, height: 60, maxCapacity: 400, defaultCategory: 'Raw Materials', temperature: '18°C', supervisor: 'P. Zielinski' },

    // Sector D - Packaging & Staging
    { id: 'D-01', code: 'BIN-D-1', sector: 'D', x: 675, y: 110, width: 175, height: 60, maxCapacity: 600, defaultCategory: 'Packaging', temperature: '20°C', supervisor: 'E. Dabrowska' },
    { id: 'D-02', code: 'BIN-D-2', sector: 'D', x: 675, y: 190, width: 175, height: 60, maxCapacity: 600, defaultCategory: 'High Turnover', temperature: '20°C', supervisor: 'E. Dabrowska' },
    { id: 'D-03', code: 'BIN-D-3', sector: 'D', x: 675, y: 270, width: 175, height: 60, maxCapacity: 600, defaultCategory: 'Inspection Bay', temperature: '-', supervisor: 'M. Wisniewski' },
    { id: 'D-04', code: 'BIN-D-4', sector: 'D', x: 675, y: 350, width: 175, height: 60, maxCapacity: 600, defaultCategory: 'Outbound Staging', temperature: '20°C', supervisor: 'E. Dabrowska' },
];

export const MOCK_ZONES: BinZoneData[] = [
    { ...DEFAULT_BIN_LAYOUTS[0], fillPercentage: 95, status: 'active', items: 475, category: 'Electronics', inventoryItems: [] },
    { ...DEFAULT_BIN_LAYOUTS[1], fillPercentage: 45, status: 'active', items: 225, category: 'Electronics', inventoryItems: [] },
    { ...DEFAULT_BIN_LAYOUTS[2], fillPercentage: 15, status: 'active', items: 75, category: 'Accessories', inventoryItems: [] },
    { ...DEFAULT_BIN_LAYOUTS[3], fillPercentage: 80, status: 'active', items: 400, category: 'Accessories', inventoryItems: [] },

    { ...DEFAULT_BIN_LAYOUTS[4], fillPercentage: 100, status: 'active', items: 200, category: 'Home Appliances', inventoryItems: [] },
    { ...DEFAULT_BIN_LAYOUTS[5], fillPercentage: 0, status: 'maintenance', items: 0, category: 'Service & Repair', inventoryItems: [], activeIncidentId: 101 },
    { ...DEFAULT_BIN_LAYOUTS[6], fillPercentage: 65, status: 'active', items: 130, category: 'Home Appliances', inventoryItems: [] },
    { ...DEFAULT_BIN_LAYOUTS[7], fillPercentage: 35, status: 'active', items: 70, category: 'Spare Parts', inventoryItems: [] },

    { ...DEFAULT_BIN_LAYOUTS[8], fillPercentage: 88, status: 'active', items: 352, category: 'Hardware & Tools', inventoryItems: [] },
    { ...DEFAULT_BIN_LAYOUTS[9], fillPercentage: 55, status: 'active', items: 220, category: 'Hardware & Tools', inventoryItems: [] },
    { ...DEFAULT_BIN_LAYOUTS[10], fillPercentage: 20, status: 'active', items: 80, category: 'Fasteners', inventoryItems: [] },
    { ...DEFAULT_BIN_LAYOUTS[11], fillPercentage: 92, status: 'active', items: 368, category: 'Raw Materials', inventoryItems: [] },

    { ...DEFAULT_BIN_LAYOUTS[12], fillPercentage: 40, status: 'active', items: 240, category: 'Packaging', inventoryItems: [] },
    { ...DEFAULT_BIN_LAYOUTS[13], fillPercentage: 75, status: 'active', items: 450, category: 'High Turnover', inventoryItems: [] },
    { ...DEFAULT_BIN_LAYOUTS[14], fillPercentage: 0, status: 'maintenance', items: 0, category: 'Inspection Bay', inventoryItems: [], activeIncidentId: 102 },
    { ...DEFAULT_BIN_LAYOUTS[15], fillPercentage: 10, status: 'active', items: 60, category: 'Outbound Staging', inventoryItems: [] },
];