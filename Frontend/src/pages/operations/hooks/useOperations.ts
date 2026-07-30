import { useQuery } from "@tanstack/react-query";
import { operationsApi } from "@/api/internal/operationsApi";
import { type WarehouseOperation } from "@/models/warehouseOperation";

export const useOperations = () => {
    return useQuery<WarehouseOperation[]>({
        queryKey: ["operations"],
        queryFn: () => operationsApi.getOperations()
    });
};
