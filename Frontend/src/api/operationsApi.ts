import type { WarehouseOperation } from "@/models/warehouseOperation"
import api from "./api"

export const operationsApi = {
    getOperations: async (): Promise<WarehouseOperation[]> => {
        const res = await api.get("/warehouse-operations");
        return res.data;
    },
    createOperation: async (data: WarehouseOperation): Promise<WarehouseOperation> => {
        const res = await api.post("/warehouse-operations", data);
        return res.data;
    }
};