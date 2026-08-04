import type { WmsModuleDefinition, RolePermissionMatrix, StaffOperator, SystemAuditLog } from '../models/rbac';

export const WMS_MODULES: WmsModuleDefinition[] = [
    {
        key: 'dashboard',
        title: 'Dashboard',
        description: 'Warehouse KPIs, telemetry and turnover charts',
        category: 'LOGISTICS'
    },
    {
        key: 'operations',
        title: 'Operations (Kanban)',
        description: 'Picking, Putaway and order task dispatching',
        category: 'LOGISTICS'
    },
    {
        key: 'shipments',
        title: 'Shipments (Gantt)',
        description: 'Loading dock scheduling and carrier slot management',
        category: 'LOGISTICS'
    },
    {
        key: 'stock',
        title: 'Stock & Inventory',
        description: 'High-bay pallet location and stock levels',
        category: 'MASTER_DATA'
    },
    {
        key: 'products',
        title: 'Products Catalog',
        description: 'SKU database, categories and dimensions',
        category: 'MASTER_DATA'
    },
    {
        key: 'documents',
        title: 'Documents (OCR)',
        description: 'WZ/PZ inbound/outbound scan processing',
        category: 'MASTER_DATA'
    },
    {
        key: 'barcodes',
        title: 'BarCodes Studio',
        description: 'Zebra standard label designer and emergency reprint',
        category: 'MASTER_DATA'
    },
    {
        key: 'binMap',
        title: 'Bin Map 3D',
        description: 'Digital twin of warehouse high-bay racks',
        category: 'EQUIPMENT'
    },
    {
        key: 'maintenance',
        title: 'Maintenance',
        description: 'AMRs, AGVs, high-reach forklifts and telemetry',
        category: 'EQUIPMENT'
    },
    {
        key: 'manage',
        title: 'System RBAC',
        description: 'Access matrix, role permissions and terminal locks',
        category: 'ADMINISTRATION'
    }
];

export const INITIAL_ROLE_PERMISSIONS: RolePermissionMatrix[] = [
    {
        roleId: 'ROLE_ADMIN',
        roleName: 'Warehouse Director / Head of Logistics',
        roleDescription: 'Full administrative authority across all facility sectors',
        userCount: 2,
        color: 'bg-rose-100 text-rose-900 border-rose-300',
        permissions: {
            dashboard: 'ADMIN',
            operations: 'ADMIN',
            shipments: 'ADMIN',
            stock: 'ADMIN',
            products: 'ADMIN',
            documents: 'ADMIN',
            barcodes: 'ADMIN',
            binMap: 'ADMIN',
            maintenance: 'ADMIN',
            manage: 'ADMIN'
        }
    },
    {
        roleId: 'ROLE_FOREMAN',
        roleName: 'Shift Foreman',
        roleDescription: 'Supervises warehouse shifts, operational queues, and task dispatching',
        userCount: 6,
        color: 'bg-amber-100 text-amber-900 border-amber-300',
        permissions: {
            dashboard: 'READ',
            operations: 'ADMIN',
            shipments: 'WRITE',
            stock: 'WRITE',
            products: 'WRITE',
            documents: 'WRITE',
            barcodes: 'WRITE',
            binMap: 'READ',
            maintenance: 'WRITE',
            manage: 'NONE'
        }
    },
    {
        roleId: 'ROLE_FORKLIFT',
        roleName: 'High-Reach Forklift Operator',
        roleDescription: 'Executes high-bay putaway, pallet movements and bin transfers',
        userCount: 14,
        color: 'bg-blue-100 text-blue-900 border-blue-300',
        permissions: {
            dashboard: 'NONE',
            operations: 'WRITE',
            shipments: 'READ',
            stock: 'READ',
            products: 'READ',
            documents: 'NONE',
            barcodes: 'READ',
            binMap: 'READ',
            maintenance: 'READ',
            manage: 'NONE'
        }
    },
    {
        roleId: 'ROLE_PICKER',
        roleName: 'Order Picker',
        roleDescription: 'Mobile terminal order picking, barcode verification and packing',
        userCount: 22,
        color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        permissions: {
            dashboard: 'NONE',
            operations: 'WRITE',
            shipments: 'NONE',
            stock: 'READ',
            products: 'READ',
            documents: 'NONE',
            barcodes: 'READ',
            binMap: 'NONE',
            maintenance: 'NONE',
            manage: 'NONE'
        }
    },
    {
        roleId: 'ROLE_DOCK_MASTER',
        roleName: 'Dock Master',
        roleDescription: 'Manages loading gates, carrier trucks, and inbound receipts',
        userCount: 4,
        color: 'bg-purple-100 text-purple-900 border-purple-300',
        permissions: {
            dashboard: 'READ',
            operations: 'READ',
            shipments: 'ADMIN',
            stock: 'READ',
            products: 'READ',
            documents: 'WRITE',
            barcodes: 'READ',
            binMap: 'NONE',
            maintenance: 'NONE',
            manage: 'NONE'
        }
    },
    {
        roleId: 'ROLE_MAINTENANCE_TECH',
        roleName: 'Robotics & Maintenance Engineer',
        roleDescription: 'Fleet maintenance, AMR sensors, charging cycles and telemetry',
        userCount: 3,
        color: 'bg-cyan-100 text-cyan-900 border-cyan-300',
        permissions: {
            dashboard: 'READ',
            operations: 'READ',
            shipments: 'NONE',
            stock: 'NONE',
            products: 'NONE',
            documents: 'NONE',
            barcodes: 'NONE',
            binMap: 'READ',
            maintenance: 'ADMIN',
            manage: 'NONE'
        }
    },
    {
        roleId: 'ROLE_AUDITOR',
        roleName: 'Quality Inspector & Auditor',
        roleDescription: 'Inventory stock count validation, OCR verification and audit logs',
        userCount: 3,
        color: 'bg-slate-200 text-slate-900 border-slate-300',
        permissions: {
            dashboard: 'READ',
            operations: 'READ',
            shipments: 'READ',
            stock: 'READ',
            products: 'READ',
            documents: 'READ',
            barcodes: 'READ',
            binMap: 'READ',
            maintenance: 'READ',
            manage: 'READ'
        }
    }
];

export const INITIAL_STAFF_OPERATORS: StaffOperator[] = [
    {
        id: 'user-01',
        employeeCode: 'EMP-1042',
        fullName: 'Marek Wiśniewski',
        email: 'm.wisniewski@stockmanager.log',
        roleId: 'ROLE_ADMIN',
        roleName: 'Warehouse Director / Head of Logistics',
        assignedBrigade: 'Management HQ',
        terminalId: 'TERM-DESK-01',
        isActive: true,
        lastActive: '2 mins ago'
    },
    {
        id: 'user-02',
        employeeCode: 'EMP-2091',
        fullName: 'Tomasz Lewandowski',
        email: 't.lewandowski@stockmanager.log',
        roleId: 'ROLE_FOREMAN',
        roleName: 'Shift Foreman',
        assignedBrigade: 'Brigade Alpha (Shift 1)',
        terminalId: 'PAD-BRIGADE-A1',
        isActive: true,
        lastActive: 'Just now'
    },
    {
        id: 'user-03',
        employeeCode: 'EMP-3104',
        fullName: 'Krzysztof Kaczmarek',
        email: 'k.kaczmarek@stockmanager.log',
        roleId: 'ROLE_FORKLIFT',
        roleName: 'High-Reach Forklift Operator',
        assignedBrigade: 'Brigade Alpha (Shift 1)',
        terminalId: 'ZEBRA-TC77-04',
        isActive: true,
        lastActive: '5 mins ago'
    },
    {
        id: 'user-04',
        employeeCode: 'EMP-4112',
        fullName: 'Karol Zieliński',
        email: 'k.zielinski@stockmanager.log',
        roleId: 'ROLE_PICKER',
        roleName: 'Order Picker',
        assignedBrigade: 'Brigade Alpha (Shift 1)',
        terminalId: 'ZEBRA-WT63-09',
        isActive: true,
        lastActive: '1 min ago'
    },
    {
        id: 'user-05',
        employeeCode: 'EMP-5089',
        fullName: 'Paweł Kamiński',
        email: 'p.kaminski@stockmanager.log',
        roleId: 'ROLE_DOCK_MASTER',
        roleName: 'Dock Master / Dyspozytor Ramp',
        assignedBrigade: 'Ramp Operations Gate A',
        terminalId: 'TERM-DOCK-02',
        isActive: true,
        lastActive: '12 mins ago'
    },
    {
        id: 'user-06',
        employeeCode: 'EMP-6003',
        fullName: 'Artur Włodarczyk',
        email: 'a.wlodarczyk@stockmanager.log',
        roleId: 'ROLE_MAINTENANCE_TECH',
        roleName: 'Robotics & Maintenance Engineer',
        assignedBrigade: 'Automation & AMR Support',
        terminalId: 'TABLET-ENG-03',
        isActive: true,
        lastActive: '45 mins ago'
    }
];

export const INITIAL_AUDIT_LOGS: SystemAuditLog[] = [
    {
        id: 'audit-101',
        timestamp: 'Today 14:15',
        actorName: 'Marek Wiśniewski (Admin)',
        action: 'UPDATE_RBAC_POLICY',
        targetRoleOrUser: 'ROLE_FOREMAN',
        changeSummary: 'Granted WRITE permission to Barcodes Studio'
    },
    {
        id: 'audit-102',
        timestamp: 'Today 11:30',
        actorName: 'Marek Wiśniewski (Admin)',
        action: 'DEPLOY_PERMISSIONS',
        targetRoleOrUser: 'All Active Terminals (54)',
        changeSummary: 'Synchronized security token cache across Honeywell and Zebra handhelds'
    },
    {
        id: 'audit-103',
        timestamp: 'Yesterday 17:00',
        actorName: 'Tomasz Lewandowski (Foreman)',
        action: 'EMERGENCY_OVERRIDE',
        targetRoleOrUser: 'EMP-4112 (Karol Zieliński)',
        changeSummary: 'Temporary Stock Read-Write access granted for Aisle 04 stock count'
    }
];
