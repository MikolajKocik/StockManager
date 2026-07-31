import { productsApi } from "@/api/internal/productsApi";
import type { ProductUpdateForm } from "@/models/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditProduct(id: string | null) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ data }: { data: ProductUpdateForm }) =>
            productsApi.updateProduct(id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', id] });
        }
    });
}