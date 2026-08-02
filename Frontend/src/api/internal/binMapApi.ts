import api from "../config/api";
import { USE_MOCKS } from "../config/mock";
import { inventoryApi } from "./inventoryApi";
import { maintenanceApi } from "./maintenanceApi";
import { DEFAULT_BIN_LAYOUTS, MOCK_ZONES } from "@/mocks/binmap.mocks";
import type { BinZoneLayout, BinZoneData } from "@/models/binMap";
import type { InventoryItem } from "@/models/inventoryItem";
import type { MaintenanceIncident } from "@/models/maintenance";

/**
 * Adapter Service that combines 2D Floor Plan layout with Live Inventory & Maintenance Backend APIs.
 */
export const binMapApi = {
    /**
     * Retrieves warehouse floor plan layouts and dimensions.
     */
    getLayout: async (): Promise<BinZoneLayout[]> => {
        if (USE_MOCKS) {
            return DEFAULT_BIN_LAYOUTS;
        }

        try {
            // If backend exposes an endpoint for floor plan layouts:
            const res = await api.get("/bin-locations/layout");
            return res.data;
        } catch {
            // Gracefully fallback to standard warehouse layout schema
            return DEFAULT_BIN_LAYOUTS;
        }
    },

    /**
     * Retrieves live state of all warehouse bins by aggregating:
     * 1. 2D Layout definition
     * 2. Inventory Items per Bin Location (from /api/v1/inventory-items)
     * 3. Maintenance Incidents affecting Bin Locations (from /api/v1/maintenance-incidents)
     */
    getLiveZones: async (): Promise<BinZoneData[]> => {
        if (USE_MOCKS) {
            return MOCK_ZONES;
        }

        const [layout, inventoryRes, incidents] = await Promise.all([
            binMapApi.getLayout(),
            inventoryApi.getItems(),
            maintenanceApi.getIncidents()
        ]);

        const inventoryItems: InventoryItem[] = inventoryRes.data || [];
        const activeIncidents: MaintenanceIncident[] = (incidents || []).filter(
            inc => inc.status !== 'Resolved' && inc.status !== 'Closed'
        );

        // Group inventory items by Bin Location Code / ID
        const itemsByBinCode = new Map<string, InventoryItem[]>();
        for (const item of inventoryItems) {
            const key = (item.binLocationCode || '').toUpperCase().trim();
            if (!key) continue;
            if (!itemsByBinCode.has(key)) {
                itemsByBinCode.set(key, []);
            }
            itemsByBinCode.get(key)!.push(item);
        }

        // Map maintenance incidents by Bin Location Code or ID
        const incidentsByBinCode = new Set<string>();
        const incidentsByBinId = new Set<number>();
        for (const incident of activeIncidents) {
            if (incident.binLocationCode) incidentsByBinCode.add(incident.binLocationCode.toUpperCase().trim());
            if (incident.binLocationId) incidentsByBinId.add(incident.binLocationId);
        }

        // Construct combined live BinZoneData list
        return layout.map((zoneLayout) => {
            const zoneCode = zoneLayout.code.toUpperCase().trim();
            const zoneId = zoneLayout.id.toUpperCase().trim();

            const zoneItems = itemsByBinCode.get(zoneCode) || itemsByBinCode.get(zoneId) || [];
            const totalQty = zoneItems.reduce((acc, it) => acc + Number(it.quantityOnHand || 0), 0);
            const fillPercentage = Math.min(100, Math.round((totalQty / (zoneLayout.maxCapacity || 500)) * 100));

            const hasActiveIncident = incidentsByBinCode.has(zoneCode) || incidentsByBinCode.has(zoneId);
            const status: 'active' | 'maintenance' = hasActiveIncident ? 'maintenance' : 'active';

            // Derive category from first product name or fallback to default
            const derivedCategory = zoneItems.length > 0 && zoneItems[0].productName
                ? zoneItems[0].productName
                : zoneLayout.defaultCategory;

            return {
                ...zoneLayout,
                fillPercentage,
                status,
                items: totalQty,
                category: derivedCategory,
                inventoryItems: zoneItems,
                activeIncidentId: hasActiveIncident ? 1 : null
            };
        });
    },

    /**
     * Dispatches an inventory dispatch order for the specified bin location.
     */
    dispatchOrder: async (binLocationCode: string, notes?: string): Promise<{ success: boolean; message: string }> => {
        if (USE_MOCKS) {
            return {
                success: true,
                message: `Dispatch order created for Bin ${binLocationCode}`
            };
        }

        const res = await api.post(`/inventory-items/dispatch`, { binLocationCode, notes });
        return res.data;
    },

    /**
     * Toggles maintenance status for a bin location.
     */
    toggleMaintenance: async (binLocationCode: string, newStatus: 'active' | 'maintenance'): Promise<{ success: boolean; status: string }> => {
        if (USE_MOCKS) {
            return {
                success: true,
                status: newStatus
            };
        }

        const res = await api.post(`/bin-locations/${binLocationCode}/maintenance-status`, { status: newStatus });
        return res.data;
    }
};
