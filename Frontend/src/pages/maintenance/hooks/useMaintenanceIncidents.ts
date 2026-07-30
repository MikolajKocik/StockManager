import { useQuery } from "@tanstack/react-query";
import { maintenanceApi } from "@/api/internal/maintenanceApi";
import { type MaintenanceIncident } from "@/models/maintenance";

export const useMaintenanceIncidents = () => {
    return useQuery<MaintenanceIncident[]>({
        queryKey: ["maintenance-incidents"],
        queryFn: () => maintenanceApi.getIncidents()
    });
};
