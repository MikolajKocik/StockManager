export type AccessLevel = 'NONE' | 'READ' | 'WRITE' | 'ADMIN';

export type WmsModuleKey =
    | 'dashboard'
    | 'products'
    | 'stock'
    | 'operations'
    | 'shipments'
    | 'documents'
    | 'barcodes'
    | 'binMap'
    | 'maintenance'
    | 'manage';

export interface WmsModuleDefinition {
    key: WmsModuleKey;
    title: string;
    description: string;
    category: 'LOGISTICS' | 'MASTER_DATA' | 'EQUIPMENT' | 'ADMINISTRATION';
}

export interface RolePermissionMatrix {
    roleId: string;
    roleName: string;
    roleDescription: string;
    userCount: number;
    color: string;
    permissions: Record<WmsModuleKey, AccessLevel>;
}

export interface StaffOperator {
    id: string;
    employeeCode: string;
    fullName: string;
    email: string;
    roleId: string;
    roleName: string;
    assignedBrigade: string;
    terminalId: string;
    isActive: boolean;
    lastActive: string;
    overridePermissions?: Partial<Record<WmsModuleKey, AccessLevel>>;
}

export interface SystemAuditLog {
    id: string;
    timestamp: string;
    actorName: string;
    action: string;
    targetRoleOrUser: string;
    changeSummary: string;
}
