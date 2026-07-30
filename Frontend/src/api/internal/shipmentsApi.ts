import type { ShipmentCollection } from "@/models/shipment";
import type { Shipment } from "@/models/shipment";
import api from "../config/api"
import { USE_MOCKS } from "../config/mock";
import { mockShipments } from "@/mocks/shipment.mocks";

export const shipmentsApi = {
    getAll: async (): Promise<ShipmentCollection> => {
        if (USE_MOCKS) return { data: mockShipments };
        const res = await api.get("/shipments");
        return res.data;
    },
    getById: async (id: string): Promise<Shipment> => {
        if (USE_MOCKS) return mockShipments.find(s => s.id === Number(id)) as Shipment;
        const res = await api.get(`/shipments/${id}`);
        return res.data;
    },
    getSuccessfulShipments: async (): Promise<ShipmentCollection> => {
        if (USE_MOCKS) return {
            data: mockShipments.filter(s => s.status === 'Shipped' || s.status === 'Delivered')
        };
        const res = await api.get("/shipments?status=Shipped");
        return res.data;
    }
}