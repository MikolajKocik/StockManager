import type { Supplier, SupplierCollection } from "@/models/supplier";
import api from "../config/api";

export const suppliersApi = {
    getAll: async (): Promise<SupplierCollection> => {
        const res = await api.get("/suppliers");
        return res.data;
    },
    getById: async (id: string): Promise<Supplier> => {
        const res = await api.get(`suppliers/${id}`);
        return res.data;
    }
}