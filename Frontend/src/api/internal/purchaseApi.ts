import type { PurchaseOrder } from "@/models/purchaseOrder";
import api from "../config/api";
import { USE_MOCKS } from "../config/mock";
import { mockPurchaseOrders } from "@/mocks/purchase.mocks";

export const purchaseApi = {
    getAll: async (): Promise<PurchaseOrder[]> => {
        if (USE_MOCKS) return mockPurchaseOrders;
        const res = await api.get("/purchase-orders");
        return res.data;
    }
};
