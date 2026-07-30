import { useQuery } from "@tanstack/react-query";
import { suppliersApi } from "@/api/internal/suppliersApi";
import { type SupplierCollection } from "@/models/supplier";

export const useSuppliers = () => {
    return useQuery<SupplierCollection>({
        queryKey: ["suppliers"],
        queryFn: () => suppliersApi.getAll()
    });
};
