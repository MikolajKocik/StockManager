import type { Product, ProductCollection, ProductCreateForm, ProductUpdateForm } from "@/models/product";
import api from "../config/api";

export const productsApi = {
    getProducts: async (): Promise<ProductCollection> => {
        const res = await api.get("/products");
        return res.data;
    },
    getProductById: async (id: string): Promise<Product> => {
        const res = await api.get(`/products/${Number(id)}`);
        return res.data;
    },
    createProduct: async (data: ProductCreateForm): Promise<Product> => {
        const res = await api.post("/products", data);
        return res.data;
    },
    updateProduct: async (id: string, data: ProductUpdateForm): Promise<void> => {
        await api.put(`/products/${Number(id)}`, data);
    },
    deleteProduct: async (id: string): Promise<void> => {
        await api.delete(`/products/${Number(id)}`);
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