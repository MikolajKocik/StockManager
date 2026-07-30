import { type MaintenanceIncident } from "@/models/maintenance";

export const mockMaintenanceIncidents: MaintenanceIncident[] = [
    {
        id: 1,
        title: "Forklift Engine Failure",
        description: "Engine will not start on Forklift #3",
        priority: "High",
        status: "Open",
        photoUrl: null,
        createdAt: "2026-07-29T10:00:00Z",
        resolvedAt: null,
        resolutionNotes: null,
        reportedById: "U1",
        reportedByName: "Alice Smith",
        assignedToId: "U2",
        assignedToName: "Bob Technician",
        assetId: "A101",
        assetName: "Forklift #3",
        binLocationId: null,
        binLocationCode: null
    }
];
