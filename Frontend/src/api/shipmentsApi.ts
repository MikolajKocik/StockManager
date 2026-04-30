import type { ShipmentCollection } from "@/models/shipment";
import type { Shipment } from "@/models/shipment";
import api from "./api"

export const shipmentsApi = {
    getAll: async (): Promise<ShipmentCollection> => {
        const res = await api.get("/shipments");
        return res.data;
    },
    getById: async (id: string): Promise<Shipment> => {
        const res = await api.get(`/shipments/${id}`);
        return res.data;
    },
    getSuccessfulShipments: async (): Promise<ShipmentCollection> => {
        const res = await api.get("/shipments?status=Shipped");
        return res.data;
    }
}