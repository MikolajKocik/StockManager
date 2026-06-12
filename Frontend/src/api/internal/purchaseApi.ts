import type { PurchaseOrder } from "@/models/purchaseOrder";
import api from "../config/api";

export const purchaseApi = {
    getAll: async (): Promise<PurchaseOrder[]> => {
        const res = await api.get("/purchase-orders");
        return res.data;
    }
};
