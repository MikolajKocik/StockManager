import type { ShipmentCollection } from "@/models/shipment";
import api from "./api"

export const shipmentsApi = {
    getSuccessfulShipments: async (): Promise<ShipmentCollection> => {
        const res = await api.get("/shipments?status=Shipped");
        return res.data;
    }
}