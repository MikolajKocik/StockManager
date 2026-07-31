import type { Product, ProductCollection, ProductCreateForm, ProductUpdateForm } from "@/models/product";
import api from "../config/api";
import { USE_MOCKS } from "../config/mock";
import { mockProduct, mockGenres, mockWarehouses } from "@/mocks";

export const productsApi = {
    getProducts: async (signal?: AbortSignal): Promise<ProductCollection> => {
        if (USE_MOCKS) {
            return { data: mockProduct };
        }

        const res = await api.get("/products", {
            signal
        });
        return res.data;
    },
    getProductById: async (id: string, signal?: AbortSignal): Promise<Product> => {
        if (USE_MOCKS) return mockProduct.find(p => p.id === Number(id)) as Product;
        const res = await api.get(`/products/${Number(id)}`, {
            signal
        });
        return res.data;
    },
    createProduct: async (data: ProductCreateForm, signal?: AbortSignal): Promise<Product> => {
        const res = await api.post("/products", data, {
            signal
        });
        return res.data;
    },
    updateProduct: async (id: string, data: ProductUpdateForm, signal?: AbortSignal): Promise<void> => {
        await api.put(`/products/${Number(id)}`, data, {
            signal
        });
    },
    deleteProduct: async (id: string, signal?: AbortSignal): Promise<void> => {
        await api.delete(`/products/${Number(id)}`, {
            signal
        });
    },
    getWarehouses: async (signal?: AbortSignal): Promise<string[]> => {
        if (USE_MOCKS) return mockWarehouses;
        const res = await api.get("/products/warehouses", {
            signal
        });
        return res.data;
    },
    getGenres: async (signal?: AbortSignal): Promise<string[]> => {
        if (USE_MOCKS) return mockGenres;
        const res = await api.get("/products/genres", {
            signal
        });
        return res.data;
    }
}