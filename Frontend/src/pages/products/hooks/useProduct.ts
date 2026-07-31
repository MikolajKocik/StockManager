import { productsApi } from '@/api/internal/productsApi';
import type { Product } from '@/models/product';
import { useQuery } from '@tanstack/react-query';

export function useProduct(id: string | null) {
    return useQuery<Product>({
        queryKey: ['product', id],
        queryFn: ({ signal }) => productsApi.getProductById(id!, signal),
        enabled: !!id
    });
}
