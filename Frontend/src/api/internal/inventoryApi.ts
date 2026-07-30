import type { InventoryItemCollection } from "@/models/inventoryItem";
import api from "../config/api"
import { USE_MOCKS } from "../config/mock";
import { mockInventoryItems } from "@/mocks/inventory.mocks";

interface SearchRequest {
    question: string,
    conversationId: string | null,
    categoryFilter: string | null,
    warehouseFilter: string | null;
}

export const inventoryApi = { 
    getItems: async (): Promise<InventoryItemCollection> => {
        if (USE_MOCKS) {
            return { data: mockInventoryItems };
        }

        const res = await api.get("/inventory-items");
        return res.data;
    },
    searchAI: async (payload: SearchRequest): Promise<InventoryItemCollection> => {
        const res = await api.post("/inventory-items/ai/search", payload);
        return { data: res.data.items || res.data.Items || [] };
    }
}