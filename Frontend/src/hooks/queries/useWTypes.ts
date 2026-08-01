import { productsApi } from "@/api/internal/productsApi";
import { useQuery } from "@tanstack/react-query";

export function useWTypes(isOpen: boolean) {
    return useQuery<string[]>({
        queryKey: ['warehouses'],
        queryFn: () => productsApi.getWarehouses(),
        enabled: isOpen
    });
}