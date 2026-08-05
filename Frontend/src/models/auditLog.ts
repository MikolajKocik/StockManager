export type AuditEventType =
    | 'CREATE'
    | 'UPDATE'
    | 'PRICE_CHANGE'
    | 'LOCATION_TRANSFER'
    | 'STOCK_ADJUSTMENT'
    | 'STATUS_CHANGE'
    | 'QUALITY_HOLD'
    | 'SPEC_UPDATE';

export interface AuditorUser {
    id: string;
    name: string;
    role: string;
    department: string;
    ipAddress: string;
    clientDevice: string;
}

export interface FieldDiff {
    field: string;
    label: string;
    oldValue: string | number | boolean | null | undefined;
    newValue: string | number | boolean | null | undefined;
    category?: string;
    changeType?: 'modified' | 'added' | 'removed';
}

export interface AuditLogEvent {
    id: string;
    eventId: string;
    commitHash: string;
    parentCommitHash?: string;
    entityType: 'Product' | 'InventoryItem' | 'WarehouseOperation' | 'MaintenanceAsset' | 'ReturnOrder' | 'Supplier';
    entityId: number | string;
    entityName: string;
    entityCode: string;
    action: AuditEventType;
    actionLabel: string;
    timestamp: string;
    relativeTime: string;
    user: AuditorUser;
    summary: string;
    justificationReason: string;
    approvalRef?: string;
    previousStateSnapshot: Record<string, any>;
    newStateSnapshot: Record<string, any>;
    diffFields: FieldDiff[];
    rawGitPatch: string;
}

export interface AuditKpiSummary {
    totalEvents: number;
    uniqueEntities: number;
    priceChanges: number;
    locationTransfers: number;
    activeAuditors: number;
}
