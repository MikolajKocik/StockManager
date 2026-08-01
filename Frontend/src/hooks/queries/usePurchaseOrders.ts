import { useQuery } from "@tanstack/react-query";
import { purchaseApi } from "@/api/internal/purchaseApi";
import { type PurchaseOrder } from "@/models/purchaseOrder";

export const usePurchaseOrders = () => {
    return useQuery<PurchaseOrder[]>({
        queryKey: ["purchase-orders"],
        queryFn: () => purchaseApi.getAll()
    });
};
