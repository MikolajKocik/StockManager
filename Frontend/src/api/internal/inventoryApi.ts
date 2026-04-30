import type { InventoryItemCollection } from "@/models/inventoryItem";
import api from "../config/api"

interface SearchRequest {
    question: string,
    conversationId: string | null,
    categoryFilter: string | null,
    warehouseFilter: string | null;
}

export const inventoryApi = { 
    getItems: async (): Promise<InventoryItemCollection> => {
        const res = await api.get("/inventory-items");
        return res.data;
    },
    searchAI: async (payload: SearchRequest): Promise<InventoryItemCollection> => {
        const res = await api.post("/inventory-items/ai/search", payload);
        return { data: res.data.items || res.data.Items || [] };
    }
}