import api from "../config/api";
import type { 
    MaintenanceAsset, 
    MaintenanceIncident, 
    ReportIncident, 
    ResolveIncident, 
    AssignIncident 
} from "@/models/maintenance";

export const maintenanceApi = {
    getAssets: async (type?: string, status?: string): Promise<MaintenanceAsset[]> => {
        const res = await api.get("/maintenance/assets", {
            params: { type, status }
        });
        return res.data;
    },
    getAssetById: async (id: string): Promise<MaintenanceAsset> => {
        const res = await api.get(`/maintenance/assets/${id}`);
        return res.data;
    },
    getIncidents: async (status?: string, priority?: string): Promise<MaintenanceIncident[]> => {
        const res = await api.get("/maintenance/incidents", {
            params: { status, priority }
        });
        return res.data;
    },
    getIncidentById: async (id: number): Promise<MaintenanceIncident> => {
        const res = await api.get(`/maintenance/incidents/${id}`);
        return res.data;
    },
    reportIncident: async (payload: ReportIncident): Promise<MaintenanceIncident> => {
        const res = await api.post("/maintenance/incidents", payload);
        return res.data;
    },
    assignIncident: async (id: number, payload: AssignIncident): Promise<MaintenanceIncident> => {
        const res = await api.post(`/maintenance/incidents/${id}/assign`, payload);
        return res.data;
    },
    resolveIncident: async (id: number, payload: ResolveIncident): Promise<MaintenanceIncident> => {
        const res = await api.post(`/maintenance/incidents/${id}/resolve`, payload);
        return res.data;
    }
};
