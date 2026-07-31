import { productsApi } from "@/api/internal/productsApi";
import { useQuery } from "@tanstack/react-query";

export function useGenres(isOpen: boolean) {
    return useQuery<string[]>({
        queryKey: ['genres'],
        queryFn: () => productsApi.getGenres(),
        enabled: isOpen
    });
}