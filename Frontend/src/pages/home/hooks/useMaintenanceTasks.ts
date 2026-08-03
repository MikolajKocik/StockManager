import { useMaintenanceIncidents } from '@/pages/maintenance/hooks/useMaintenanceIncidents';

export function useMaintenanceTasks() {
    const { data: incidents = [] } = useMaintenanceIncidents();

    const activeIncidents = incidents.filter(
        incident => incident.status !== 'Resolved' && incident.status !== 'Closed'
    );

    return {
        activeIncidents
    };
}
