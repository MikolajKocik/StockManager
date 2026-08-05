import type { AuditLogEvent } from '@/models/auditLog';

export const MOCK_AUDIT_LOG_EVENTS: AuditLogEvent[] = [
    {
        id: 'EVT-2026-9041',
        eventId: 'evt_9f82a1c0',
        commitHash: '8b4d12f',
        parentCommitHash: '5e7a90b',
        entityType: 'Product',
        entityId: 1,
        entityName: 'Milk 3.2% UHT (1L)',
        entityCode: 'BAT-001 / SKU-MILK-001',
        action: 'LOCATION_TRANSFER',
        actionLabel: 'STORAGE_ZONE_RECLASSIFIED',
        timestamp: '2026-08-05 09:15:33',
        relativeTime: '2 hours ago',
        user: {
            id: 'USR-102',
            name: 'Jan Kowalski',
            role: 'Inventory Supervisor',
            department: 'Warehouse Operations',
            ipAddress: '192.168.1.144',
            clientDevice: 'Zebra TC52 Scanner #2'
        },
        summary: 'Reclassified storage zone from Regular Storage to Refrigerated Section',
        justificationReason: 'HACCP cold chain compliance audit finding #AUD-882: Fresh UHT cartons required refrigerated buffer.',
        approvalRef: 'APR-2026-QA-99',
        previousStateSnapshot: {
            id: 1,
            name: 'Milk',
            type: 'RegularStorage',
            shelfLocation: 'Zone S-01-A4',
            requiredTemperature: '+15°C to +25°C',
            reorderThreshold: 100,
            unitCostGross: 3.80,
            status: 'ACTIVE'
        },
        newStateSnapshot: {
            id: 1,
            name: 'Milk',
            type: 'RefrigeratedSection',
            shelfLocation: 'Zone R-02-B1',
            requiredTemperature: '+2°C to +6°C',
            reorderThreshold: 150,
            unitCostGross: 4.10,
            status: 'ACTIVE'
        },
        diffFields: [
            {
                field: 'type',
                label: 'Storage Section Type',
                oldValue: 'RegularStorage',
                newValue: 'RefrigeratedSection',
                category: 'Storage & Logistics',
                changeType: 'modified'
            },
            {
                field: 'shelfLocation',
                label: 'Primary Shelf Location',
                oldValue: 'Zone S-01-A4',
                newValue: 'Zone R-02-B1',
                category: 'Storage & Logistics',
                changeType: 'modified'
            },
            {
                field: 'requiredTemperature',
                label: 'Temperature Mandate',
                oldValue: '+15°C to +25°C',
                newValue: '+2°C to +6°C',
                category: 'Quality & HACCP',
                changeType: 'modified'
            },
            {
                field: 'reorderThreshold',
                label: 'Reorder Buffer Quantity',
                oldValue: 100,
                newValue: 150,
                category: 'Replenishment',
                changeType: 'modified'
            },
            {
                field: 'unitCostGross',
                label: 'Unit Cost Gross (PLN)',
                oldValue: '3.80 PLN',
                newValue: '4.10 PLN',
                category: 'Pricing',
                changeType: 'modified'
            }
        ],
        rawGitPatch: `--- a/entities/product/1/manifest.json
+++ b/entities/product/1/manifest.json
@@ -4,7 +4,7 @@
   "name": "Milk",
-  "type": "RegularStorage",
+  "type": "RefrigeratedSection",
-  "shelfLocation": "Zone S-01-A4",
+  "shelfLocation": "Zone R-02-B1",
-  "requiredTemperature": "+15°C to +25°C",
+  "requiredTemperature": "+2°C to +6°C",
-  "reorderThreshold": 100,
+  "reorderThreshold": 150,
-  "unitCostGross": 3.80,
+  "unitCostGross": 4.10,
   "status": "ACTIVE"`
    },
    {
        id: 'EVT-2026-9040',
        eventId: 'evt_5e7a90b4',
        commitHash: '5e7a90b',
        parentCommitHash: '1a3c89d',
        entityType: 'Product',
        entityId: 1,
        entityName: 'Milk 3.2% UHT (1L)',
        entityCode: 'BAT-001 / SKU-MILK-001',
        action: 'PRICE_CHANGE',
        actionLabel: 'SUPPLIER_PRICE_INDEXATION',
        timestamp: '2026-08-04 14:22:10',
        relativeTime: '1 day ago',
        user: {
            id: 'USR-108',
            name: 'Anna Nowak',
            role: 'Procurement Specialist',
            department: 'Purchasing & Commercial',
            ipAddress: '192.168.1.52',
            clientDevice: 'Desktop Workstation #12'
        },
        summary: 'Supplier Mlekovita quarterly rate indexation adjusted purchasing unit price',
        justificationReason: 'Supplier contract update #CTR-2026-MLEK Q3 revision.',
        approvalRef: 'CEO-PO-441',
        previousStateSnapshot: {
            id: 1,
            unitCostNet: 3.10,
            unitCostGross: 3.80,
            taxRate: '23%',
            minimumOrderQty: 50
        },
        newStateSnapshot: {
            id: 1,
            unitCostNet: 3.35,
            unitCostGross: 4.12,
            taxRate: '23%',
            minimumOrderQty: 100
        },
        diffFields: [
            {
                field: 'unitCostNet',
                label: 'Unit Cost Net (PLN)',
                oldValue: '3.10 PLN',
                newValue: '3.35 PLN',
                category: 'Pricing',
                changeType: 'modified'
            },
            {
                field: 'unitCostGross',
                label: 'Unit Cost Gross (PLN)',
                oldValue: '3.80 PLN',
                newValue: '4.12 PLN',
                category: 'Pricing',
                changeType: 'modified'
            },
            {
                field: 'minimumOrderQty',
                label: 'Minimum Order Quantity (MOQ)',
                oldValue: 50,
                newValue: 100,
                category: 'Procurement',
                changeType: 'modified'
            }
        ],
        rawGitPatch: `--- a/entities/product/1/pricing.json
+++ b/entities/product/1/pricing.json
@@ -2,5 +2,5 @@
   "currency": "PLN",
-  "unitCostNet": 3.10,
-  "unitCostGross": 3.80,
+  "unitCostNet": 3.35,
+  "unitCostGross": 4.12,
-  "minimumOrderQty": 50,
+  "minimumOrderQty": 100`
    },
    {
        id: 'EVT-2026-9039',
        eventId: 'evt_1a3c89d2',
        commitHash: '1a3c89d',
        parentCommitHash: '0000000',
        entityType: 'Product',
        entityId: 1,
        entityName: 'Milk 3.2% UHT (1L)',
        entityCode: 'BAT-001 / SKU-MILK-001',
        action: 'CREATE',
        actionLabel: 'CATALOG_ENTITY_INITIALIZED',
        timestamp: '2026-07-28 10:00:00',
        relativeTime: '8 days ago',
        user: {
            id: 'USR-101',
            name: 'Robert Taylor',
            role: 'System Administrator',
            department: 'Master Data Governance',
            ipAddress: '192.168.1.10',
            clientDevice: 'HQ Server Master Console'
        },
        summary: 'Initial Master Data Entity Registration for Mlekovita Milk 3.2%',
        justificationReason: 'New product introduction workflow #NPI-882.',
        previousStateSnapshot: {},
        newStateSnapshot: {
            id: 1,
            name: 'Milk',
            slug: 'milk-001',
            genre: 'Dairy',
            unit: 'l',
            batchNumber: 'BAT-001',
            supplierName: 'Mlekovita'
        },
        diffFields: [
            {
                field: 'name',
                label: 'Product Name',
                oldValue: null,
                newValue: 'Milk',
                category: 'General',
                changeType: 'added'
            },
            {
                field: 'batchNumber',
                label: 'Initial Batch Code',
                oldValue: null,
                newValue: 'BAT-001',
                category: 'Logistics',
                changeType: 'added'
            },
            {
                field: 'genre',
                label: 'Category / Genre',
                oldValue: null,
                newValue: 'Dairy',
                category: 'Classification',
                changeType: 'added'
            },
            {
                field: 'supplierName',
                label: 'Primary Supplier',
                oldValue: null,
                newValue: 'Mlekovita',
                category: 'Procurement',
                changeType: 'added'
            }
        ],
        rawGitPatch: `--- /dev/null
+++ b/entities/product/1/manifest.json
@@ -0,0 +7 @@
+{
+  "id": 1,
+  "name": "Milk",
+  "slug": "milk-001",
+  "genre": "Dairy",
+  "unit": "l",
+  "batchNumber": "BAT-001",
+  "supplierName": "Mlekovita"
+}`
    },
    {
        id: 'EVT-2026-9035',
        eventId: 'evt_77c12a88',
        commitHash: '91f2a00',
        parentCommitHash: '44b1c88',
        entityType: 'Product',
        entityId: 5,
        entityName: 'Atlantic Salmon Fillet (Fresh)',
        entityCode: 'BAT-005 / SKU-SALM-005',
        action: 'QUALITY_HOLD',
        actionLabel: 'HACCP_QUARANTINE_APPLIED',
        timestamp: '2026-08-05 08:00:15',
        relativeTime: '3 hours ago',
        user: {
            id: 'USR-105',
            name: 'Marta Nowak',
            role: 'Quality Control Lead',
            department: 'Quality Assurance',
            ipAddress: '192.168.1.189',
            clientDevice: 'Tablet QC-Station #3'
        },
        summary: 'Applied HACCP Quality Quarantine due to temp logging threshold violation',
        justificationReason: 'Cold sensor #SEN-04 recorded +10.2°C during overnight defrost cycle.',
        approvalRef: 'QA-INCIDENT-2026-019',
        previousStateSnapshot: {
            id: 5,
            status: 'AVAILABLE_FOR_PICKING',
            quarantineCode: null,
            lockReason: null
        },
        newStateSnapshot: {
            id: 5,
            status: 'QUALITY_HOLD_QUARANTINE',
            quarantineCode: 'QC-TEMP-EXCURSION',
            lockReason: 'Cold chain monitor logging failure (+10.2°C)'
        },
        diffFields: [
            {
                field: 'status',
                label: 'Inventory Availability Status',
                oldValue: 'AVAILABLE_FOR_PICKING',
                newValue: 'QUALITY_HOLD_QUARANTINE',
                category: 'Quality & Release',
                changeType: 'modified'
            },
            {
                field: 'quarantineCode',
                label: 'Quarantine Classification',
                oldValue: null,
                newValue: 'QC-TEMP-EXCURSION',
                category: 'Quality & Release',
                changeType: 'added'
            },
            {
                field: 'lockReason',
                label: 'Order Locking Reason',
                oldValue: null,
                newValue: 'Cold chain monitor logging failure (+10.2°C)',
                category: 'Quality & Release',
                changeType: 'added'
            }
        ],
        rawGitPatch: `--- a/entities/product/5/quality.json
+++ b/entities/product/5/quality.json
@@ -2,4 +2,5 @@
-  "status": "AVAILABLE_FOR_PICKING",
-  "quarantineCode": null,
-  "lockReason": null
+  "status": "QUALITY_HOLD_QUARANTINE",
+  "quarantineCode": "QC-TEMP-EXCURSION",
+  "lockReason": "Cold chain monitor logging failure (+10.2°C)"`
    },
    {
        id: 'EVT-2026-9030',
        eventId: 'evt_22b9c710',
        commitHash: '3c19b44',
        parentCommitHash: '88a100f',
        entityType: 'Product',
        entityId: 2,
        entityName: 'Apples Gala Export Grade',
        entityCode: 'BAT-002 / SKU-APPL-002',
        action: 'STOCK_ADJUSTMENT',
        actionLabel: 'CYCLE_COUNT_DISCREPANCY',
        timestamp: '2026-08-04 17:40:12',
        relativeTime: '1 day ago',
        user: {
            id: 'USR-102',
            name: 'Jan Kowalski',
            role: 'Inventory Supervisor',
            department: 'Warehouse Operations',
            ipAddress: '192.168.1.144',
            clientDevice: 'Zebra TC52 Scanner #2'
        },
        summary: 'Adjusted physical count after monthly Sector S-02 cycle audit',
        justificationReason: 'Physical bin count showed 135kg vs system 150kg (-15kg bruised write-off).',
        approvalRef: 'WH-INV-COUNT-08',
        previousStateSnapshot: {
            id: 2,
            stockQuantity: 150,
            reservedQuantity: 20,
            availableQuantity: 130
        },
        newStateSnapshot: {
            id: 2,
            stockQuantity: 135,
            reservedQuantity: 20,
            availableQuantity: 115
        },
        diffFields: [
            {
                field: 'stockQuantity',
                label: 'Total Physical Stock',
                oldValue: '150 kg',
                newValue: '135 kg',
                category: 'Inventory Balance',
                changeType: 'modified'
            },
            {
                field: 'availableQuantity',
                label: 'Available For Allocation',
                oldValue: '130 kg',
                newValue: '115 kg',
                category: 'Inventory Balance',
                changeType: 'modified'
            }
        ],
        rawGitPatch: `--- a/entities/product/2/stock.json
+++ b/entities/product/2/stock.json
@@ -2,4 +2,4 @@
-  "stockQuantity": 150,
+  "stockQuantity": 135,
   "reservedQuantity": 20,
-  "availableQuantity": 130
+  "availableQuantity": 115`
    }
];
