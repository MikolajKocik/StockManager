import api from "../config/api";
import type { 
    MaintenanceAsset, 
    MaintenanceIncident, 
    ReportIncident, 
    ResolveIncident, 
    AssignIncident 
} from "@/models/maintenance";
import { USE_MOCKS } from "../config/mock";
import { mockMaintenanceIncidents } from "@/mocks/maintenance.mocks";

export const maintenanceApi = {
    getAssets: async (type?: string, status?: string): Promise<MaintenanceAsset[]> => {
        if (USE_MOCKS) return [];
        const res = await api.get("/maintenance/assets", {
            params: { type, status }
        });
        return res.data;
    },
    getAssetById: async (id: string): Promise<MaintenanceAsset> => {
        if (USE_MOCKS) return {} as MaintenanceAsset;
        const res = await api.get(`/maintenance/assets/${id}`);
        return res.data;
    },
    getIncidents: async (status?: string, priority?: string): Promise<MaintenanceIncident[]> => {
        if (USE_MOCKS) return mockMaintenanceIncidents;
        const res = await api.get("/maintenance/incidents", {
            params: { status, priority }
        });
        return res.data;
    },
    getIncidentById: async (id: number): Promise<MaintenanceIncident> => {
        if (USE_MOCKS) return mockMaintenanceIncidents.find(i => i.id === id) as MaintenanceIncident;
        const res = await api.get(`/maintenance/incidents/${id}`);
        return res.data;
    },
    reportIncident: async (payload: ReportIncident): Promise<MaintenanceIncident> => {
        if (USE_MOCKS) return { ...mockMaintenanceIncidents[0], id: 999, ...payload } as unknown as MaintenanceIncident;
        const res = await api.post("/maintenance/incidents", payload);
        return res.data;
    },
    assignIncident: async (id: number, payload: AssignIncident): Promise<MaintenanceIncident> => {
        if (USE_MOCKS) return mockMaintenanceIncidents[0];
        const res = await api.post(`/maintenance/incidents/${id}/assign`, payload);
        return res.data;
    },
    resolveIncident: async (id: number, payload: ResolveIncident): Promise<MaintenanceIncident> => {
        if (USE_MOCKS) return mockMaintenanceIncidents[0];
        const res = await api.post(`/maintenance/incidents/${id}/resolve`, payload);
        return res.data;
    }
};
