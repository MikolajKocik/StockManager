import type { Customer } from "@/models/customer";
import api from "../config/api";
import { USE_MOCKS } from "../config/mock";
import { mockCustomers } from "@/mocks/customer.mocks";

export const customersApi = {
    getAll: async (): Promise<{ data: Customer[] }> => {
        if (USE_MOCKS) return { data: mockCustomers };
        const res = await api.get("/customers");
        return res.data;
    },
    getById: async (id: number): Promise<Customer> => {
        if (USE_MOCKS) return mockCustomers.find(c => c.id === id) as Customer;
        const res = await api.get(`/customers/${id}`);
        return res.data;
    }
};
