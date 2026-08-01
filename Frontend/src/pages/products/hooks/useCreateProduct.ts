import { productsApi } from "@/api/internal/productsApi";
import type { ProductCreateForm } from "@/models/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ProductCreateForm) => productsApi.createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
        }
    });
}