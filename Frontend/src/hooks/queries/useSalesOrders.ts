import { useQuery } from "@tanstack/react-query";
import { salesApi } from "@/api/internal/salesApi";
import { type SalesOrder } from "@/models/salesOrder";

export const useSalesOrders = () => {
    return useQuery<SalesOrder[]>({
        queryKey: ["sales-orders"],
        queryFn: () => salesApi.getAll()
    });
};
