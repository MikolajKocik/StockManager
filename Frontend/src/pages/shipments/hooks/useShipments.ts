import { useQuery } from "@tanstack/react-query";
import { shipmentsApi } from "@/api/internal/shipmentsApi";
import { type ShipmentCollection } from "@/models/shipment";

export const useShipments = () => {
    return useQuery<ShipmentCollection>({
        queryKey: ["shipments"],
        queryFn: () => shipmentsApi.getAll()
    });
};
