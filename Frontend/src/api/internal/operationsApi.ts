import type { WarehouseOperation } from "@/models/warehouseOperation"
import api from "../config/api"
import { USE_MOCKS } from "../config/mock";
import { mockWarehouseOperations } from "@/mocks/operation.mocks";

export const operationsApi = {
    getOperations: async (): Promise<WarehouseOperation[]> => {
        if (USE_MOCKS) return mockWarehouseOperations;
        const res = await api.get("/warehouse-operations");
        return res.data;
    },
    createOperation: async (data: WarehouseOperation): Promise<WarehouseOperation> => {
        if (USE_MOCKS) return { ...data, id: 999 };
        const res = await api.post("/warehouse-operations", data);
        return res.data;
    }
};