import { productsApi } from '@/api/internal/productsApi';
import type { ProductCollection } from '@/models/product';
import { useQuery } from '@tanstack/react-query';

export function useProducts() {
    return useQuery<ProductCollection>({
        queryKey: ['products'],
        queryFn: ({ signal }) => productsApi.getProducts(signal)
    });
}