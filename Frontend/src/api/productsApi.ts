import type { Product, ProductCollection } from "@/models/product";
import api from "./api";

export const productsApi = { 
    getProducts: async (): Promise<ProductCollection> => {
        const res = await api.get("/products");
        return res.data;
    },
    getProductById: async (id: string): Promise<Product> => {
        const res = await api.get(`/product/${Number(id)}`);
        return res.data;
    },
    deleteProduct: async (id: string): Promise<Product> => {
        const res = await api.delete(`/products/${Number(id)}`);
        return res.data;
    },
    getWarehouses: async (): Promise<string[]> => {
        const res = await api.get("/products/warehouses");
        return res.data;
    },
    getGenres: async (): Promise<string[]> => {
        const res = await api.get("/products/genres");
        return res.data;
    }
}