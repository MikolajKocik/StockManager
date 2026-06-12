export interface MaintenanceAsset {
    id: string;
    name: string;
    serialNumber: string;
    type: string;
    status: string;
    lastServiceDate: string | null;
    binLocationId: number | null;
    binLocationCode: string | null;
}

export interface MaintenanceIncident {
    id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    photoUrl: string | null;
    createdAt: string;
    resolvedAt: string | null;
    resolutionNotes: string | null;
    reportedById: string;
    reportedByName: string | null;
    assignedToId: string | null;
    assignedToName: string | null;
    assetId: string | null;
    assetName: string | null;
    binLocationId: number | null;
    binLocationCode: string | null;
}

export interface ReportIncident {
    title: string;
    description: string;
    priority: string;
    photoUrl: string | null;
    assetId: string | null;
    binLocationId: number | null;
}

export interface ResolveIncident {
    resolutionNotes: string;
}

export interface AssignIncident {
    assignedToId: string;
}
