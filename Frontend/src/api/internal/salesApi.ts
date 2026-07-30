import type { SalesOrder } from "@/models/salesOrder";
import api from "../config/api";
import { USE_MOCKS } from "../config/mock";
import { mockSalesOrders } from "@/mocks/sales.mocks";

export const salesApi = {
    getAll: async (): Promise<SalesOrder[]> => {
        if (USE_MOCKS) return mockSalesOrders;
        const res = await api.get("/sales-orders");
        return res.data;
    }
};
