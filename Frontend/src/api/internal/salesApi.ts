import type { SalesOrder } from "@/models/salesOrder";
import api from "../config/api";

export const salesApi = {
    getAll: async (): Promise<SalesOrder[]> => {
        const res = await api.get("/sales-orders");
        return res.data;
    }
};
