export type FleetZone = 'HALA_A' | 'HALA_B' | 'WORKSHOP_CHARGING';

export type MachineStatus = 'OPERATIONAL' | 'CHARGING' | 'MAINTENANCE' | 'CRITICAL_FAULT';

export type MachineType = 
    | 'FORKLIFT'
    | 'FORKLIFT_REACH'
    | 'FORKLIFT_MANUAL'
    | 'PLATFORM_FORKLIFT'
    | 'ORDER_PICKER'
    | 'ROBOT_AMR'
    | 'SORTING_ARM'
    | 'SORTING_MACHINE'
    | 'VERTICAL_LIFT';

export interface MachineLogItem {
    id: string;
    timestamp: string;
    type: 'ZONE_CHANGE' | 'STATUS_CHANGE' | 'SERVICE' | 'INCIDENT' | 'CHARGE';
    message: string;
}

export interface MaintenanceMachine {
    id: string;
    name: string;
    code: string;
    type: MachineType;
    serialNumber: string;
    zone: FleetZone;
    status: MachineStatus;
    batteryLevel: number;
    isCharging?: boolean;
    operatingHours: number;
    temperature: number;
    assignedOperator: string | null;
    image: string;
    lastServiceDate: string;
    nextServiceDate: string;
    udtExpiryDate: string;
    logs: MachineLogItem[];
}

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
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Open' | 'InProgress' | 'Resolved' | 'Closed';
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
