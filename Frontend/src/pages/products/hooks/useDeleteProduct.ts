import { productsApi } from "@/api/internal/productsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => productsApi.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
        }
    });
}