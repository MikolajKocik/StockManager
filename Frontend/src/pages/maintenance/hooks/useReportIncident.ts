import { maintenanceApi } from "@/api/internal/maintenanceApi";
import type { ReportIncident } from "@/models/maintenance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useReportIncident = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ReportIncident) => maintenanceApi.reportIncident(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maintenance-incidents"] });
        },
    });
};