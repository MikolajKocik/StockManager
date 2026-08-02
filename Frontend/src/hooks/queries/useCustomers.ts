import { useQuery } from "@tanstack/react-query";
import { customersApi } from "@/api/internal/customersApi";
import { type Customer } from "@/models/customer";

export const useCustomers = () => {
    return useQuery<{ data: Customer[] }>({
        queryKey: ["customers"],
        queryFn: () => customersApi.getAll()
    });
};
