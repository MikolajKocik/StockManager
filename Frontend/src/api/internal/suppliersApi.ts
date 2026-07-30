import type { Supplier, SupplierCollection } from "@/models/supplier";
import api from "../config/api";
import { USE_MOCKS } from "../config/mock";
import { mockSuppliers } from "@/mocks/supplier.mocks";

export const suppliersApi = {
    getAll: async (): Promise<SupplierCollection> => {
        if (USE_MOCKS) return { data: mockSuppliers };
        const res = await api.get("/suppliers");
        return res.data;
    },
    getById: async (id: string): Promise<Supplier> => {
        if (USE_MOCKS) return mockSuppliers.find(s => s.id === id) as Supplier;
        const res = await api.get(`suppliers/${id}`);
        return res.data;
    }
}