import type { KanbanOperation, KanbanColumn } from '../models/operationKanban';

export const KANBAN_COLUMNS: KanbanColumn[] = [
    {
        id: 'QUEUED',
        title: 'Queued Backlog',
        description: 'Waiting in dispatch queue',
        maxCapacityThreshold: 8,
        accentColor: 'border-slate-300'
    },
    {
        id: 'ASSIGNED',
        title: 'Assigned to Terminals',
        description: 'Sent to handheld terminal',
        maxCapacityThreshold: 6,
        accentColor: 'border-blue-400'
    },
    {
        id: 'IN_PROGRESS',
        title: 'In Progress (Active Floor)',
        description: 'Currently being picked / put away',
        maxCapacityThreshold: 4, // Intentionally triggers bottleneck when 5+ tasks
        accentColor: 'border-amber-400'
    },
    {
        id: 'BLOCKED',
        title: 'Blocked / Aisle Hazard',
        description: 'Halted due to stock issue or obstruction',
        maxCapacityThreshold: 1,
        accentColor: 'border-rose-500'
    },
    {
        id: 'COMPLETED',
        title: 'Completed & Staged',
        description: 'Ready at shipping buffer or bin rack',
        maxCapacityThreshold: 20,
        accentColor: 'border-emerald-400'
    }
];

export const INITIAL_OPERATIONS: KanbanOperation[] = [
    {
        id: 'op-101',
        operationNumber: 'OP-8821-PICK',
        type: 'PICKING',
        status: 'IN_PROGRESS',
        priority: 'CRITICAL',
        orderNumber: 'WZ/2026/08/1402',
        zone: 'Aisle 04 (Zone High-Bay A)',
        assignedOperatorName: 'Karol Zieliński',
        assignedEquipment: 'Zebra WT6300 + Scanner',
        totalItemsCount: 3,
        totalWeightKg: 420,
        createdAt: '14:20',
        estimatedMinutes: 25,
        elapsedMinutes: 18,
        items: [
            {
                id: 'it-1',
                sku: 'HYD-PUMP-400X',
                productName: 'Hydraulic High-Pressure Pump 400 bar',
                quantity: 4,
                pickedQuantity: 4,
                unit: 'pcs',
                sourceBin: 'BIN-A-04-12',
                targetBin: 'RAMP-01-STAGE'
            },
            {
                id: 'it-2',
                sku: 'VALVE-PROP-24V',
                productName: 'Proportional Directional Valve 24V DC',
                quantity: 10,
                pickedQuantity: 7,
                unit: 'pcs',
                sourceBin: 'BIN-A-04-08',
                targetBin: 'RAMP-01-STAGE'
            },
            {
                id: 'it-3',
                sku: 'FLG-STEEL-DN80',
                productName: 'Steel Flange Connection DN80 PN40',
                quantity: 25,
                pickedQuantity: 0,
                unit: 'pcs',
                sourceBin: 'BIN-A-04-02',
                targetBin: 'RAMP-01-STAGE'
            }
        ]
    },
    {
        id: 'op-102',
        operationNumber: 'OP-8822-PUT',
        type: 'PUTAWAY',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        orderNumber: 'PZ/2026/08/0912',
        zone: 'Aisle 02 (Zone High-Bay B)',
        assignedOperatorName: 'Krzysztof Kaczmarek',
        assignedEquipment: 'Reach Truck Jungheinrich ETV 216i',
        totalItemsCount: 2,
        totalWeightKg: 1100,
        createdAt: '14:10',
        estimatedMinutes: 30,
        elapsedMinutes: 22,
        items: [
            {
                id: 'it-4',
                sku: 'SERVO-DRV-750W',
                productName: 'Industrial Servo Drive 750W 400V',
                quantity: 6,
                pickedQuantity: 6,
                unit: 'pcs',
                sourceBin: 'RAMP-02-INBOUND',
                targetBin: 'BIN-B-02-14'
            },
            {
                id: 'it-5',
                sku: 'SENS-INDUCT-M18',
                productName: 'Inductive Proximity Sensor M18 PNP',
                quantity: 40,
                pickedQuantity: 20,
                unit: 'pcs',
                sourceBin: 'RAMP-02-INBOUND',
                targetBin: 'BIN-B-02-09'
            }
        ]
    },
    {
        id: 'op-103',
        operationNumber: 'OP-8823-PICK',
        type: 'PICKING',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        orderNumber: 'WZ/2026/08/1405',
        zone: 'Aisle 01 (Zone Fast-Pick)',
        assignedOperatorName: 'Paweł Nowak',
        assignedEquipment: 'Order Picker Car Still CX-T',
        totalItemsCount: 4,
        totalWeightKg: 280,
        createdAt: '14:25',
        estimatedMinutes: 20,
        elapsedMinutes: 12,
        items: [
            {
                id: 'it-6',
                sku: 'PLC-CPU-1214C',
                productName: 'Siemens S7-1200 CPU 1214C DC/DC/DC',
                quantity: 2,
                pickedQuantity: 2,
                unit: 'pcs',
                sourceBin: 'BIN-A-01-05',
                targetBin: 'STAGE-PACK-01'
            }
        ]
    },
    {
        id: 'op-104',
        operationNumber: 'OP-8824-REPLENISH',
        type: 'REPLENISHMENT',
        status: 'IN_PROGRESS',
        priority: 'NORMAL',
        orderNumber: 'MM/2026/08/0331',
        zone: 'Buffer Zone C -> Fast-Pick A1',
        assignedOperatorName: 'Michał Lis',
        assignedEquipment: 'Toyota Traigo 48',
        totalItemsCount: 1,
        totalWeightKg: 850,
        createdAt: '14:05',
        estimatedMinutes: 25,
        elapsedMinutes: 24,
        items: [
            {
                id: 'it-7',
                sku: 'CBL-FLEX-4X25',
                productName: 'Flexible Power Cable ÖLFLEX 4G2.5',
                quantity: 8,
                pickedQuantity: 5,
                unit: 'rolls',
                sourceBin: 'BIN-C-08-01',
                targetBin: 'BIN-A-01-02'
            }
        ]
    },
    {
        id: 'op-105',
        operationNumber: 'OP-8825-PICK',
        type: 'PICKING',
        status: 'IN_PROGRESS',
        priority: 'NORMAL',
        orderNumber: 'WZ/2026/08/1409',
        zone: 'Aisle 05 (Zone Heavy-Parts)',
        assignedOperatorName: 'Piotr Wójcik',
        assignedEquipment: 'Zebra TC57 Handheld',
        totalItemsCount: 2,
        totalWeightKg: 340,
        createdAt: '14:30',
        estimatedMinutes: 15,
        elapsedMinutes: 8,
        items: [
            {
                id: 'it-8',
                sku: 'BRG-ROLLER-32210',
                productName: 'Tapered Roller Bearing 32210',
                quantity: 12,
                pickedQuantity: 0,
                unit: 'pcs',
                sourceBin: 'BIN-A-05-18',
                targetBin: 'STAGE-PACK-02'
            }
        ]
    },
    {
        id: 'op-106',
        operationNumber: 'OP-8819-BLOCKED',
        type: 'PUTAWAY',
        status: 'BLOCKED',
        priority: 'CRITICAL',
        orderNumber: 'PZ/2026/08/0908',
        zone: 'Aisle 03 (Zone Hazardous Chem)',
        assignedOperatorName: 'Tomasz Lewandowski',
        assignedEquipment: 'Explosion-Proof Reach Truck',
        totalItemsCount: 1,
        totalWeightKg: 780,
        createdAt: '13:45',
        estimatedMinutes: 30,
        elapsedMinutes: 48,
        blockedReason: 'Aisle 03 blocked by AMR Robot #4 sensor failure. Spill mitigation protocol active.',
        items: [
            {
                id: 'it-9',
                sku: 'CHEM-HYD-OIL-VG46',
                productName: 'Hydraulic Oil Shell Tellus S2 MX 46 (209L Drum)',
                quantity: 4,
                pickedQuantity: 0,
                unit: 'drums',
                sourceBin: 'RAMP-04-HAZMAT',
                targetBin: 'BIN-CHEM-03-01'
            }
        ]
    },
    {
        id: 'op-107',
        operationNumber: 'OP-8828-EXPEDITE',
        type: 'PICKING',
        status: 'ASSIGNED',
        priority: 'CRITICAL',
        orderNumber: 'WZ/2026/08/1410 (Express Courier DHL)',
        zone: 'Aisle 04 (Zone High-Bay A)',
        assignedOperatorName: 'Tomasz Lewandowski',
        assignedEquipment: 'Handheld Terminal Pad #1',
        totalItemsCount: 1,
        totalWeightKg: 65,
        createdAt: '14:35',
        estimatedMinutes: 10,
        elapsedMinutes: 2,
        items: [
            {
                id: 'it-10',
                sku: 'CONT-ABB-AF26',
                productName: 'Contactor 3-Pole ABB AF26-30-00-13',
                quantity: 5,
                pickedQuantity: 0,
                unit: 'pcs',
                sourceBin: 'BIN-A-04-16',
                targetBin: 'RAMP-01-STAGE'
            }
        ]
    },
    {
        id: 'op-108',
        operationNumber: 'OP-8829-PUT',
        type: 'PUTAWAY',
        status: 'QUEUED',
        priority: 'HIGH',
        orderNumber: 'PZ/2026/08/0915',
        zone: 'Ramp 03 Inbound Buffer',
        totalItemsCount: 3,
        totalWeightKg: 1250,
        createdAt: '14:38',
        estimatedMinutes: 25,
        elapsedMinutes: 0,
        items: [
            {
                id: 'it-11',
                sku: 'MOT-3PH-5KW',
                productName: 'Three-Phase Electric Motor 5.5kW IE3',
                quantity: 2,
                pickedQuantity: 0,
                unit: 'pcs',
                sourceBin: 'RAMP-03-INBOUND',
                targetBin: 'BIN-B-04-02'
            }
        ]
    },
    {
        id: 'op-109',
        operationNumber: 'OP-8830-PICK',
        type: 'PICKING',
        status: 'QUEUED',
        priority: 'NORMAL',
        orderNumber: 'WZ/2026/08/1412',
        zone: 'Aisle 02 (Zone High-Bay B)',
        totalItemsCount: 2,
        totalWeightKg: 180,
        createdAt: '14:40',
        estimatedMinutes: 15,
        elapsedMinutes: 0,
        items: [
            {
                id: 'it-12',
                sku: 'RELAY-FINDER-24V',
                productName: 'Miniature Relay 24V DC 2C/O 8A',
                quantity: 50,
                pickedQuantity: 0,
                unit: 'pcs',
                sourceBin: 'BIN-B-02-11',
                targetBin: 'STAGE-PACK-01'
            }
        ]
    },
    {
        id: 'op-110',
        operationNumber: 'OP-8815-PICK',
        type: 'PICKING',
        status: 'COMPLETED',
        priority: 'HIGH',
        orderNumber: 'WZ/2026/08/1398',
        zone: 'Aisle 01 (Zone Fast-Pick)',
        assignedOperatorName: 'Karol Zieliński',
        assignedEquipment: 'Zebra WT6300',
        totalItemsCount: 2,
        totalWeightKg: 95,
        createdAt: '13:30',
        estimatedMinutes: 20,
        elapsedMinutes: 19,
        items: [
            {
                id: 'it-13',
                sku: 'INV-DANFOSS-VLT',
                productName: 'Danfoss Frequency Inverter VLT FC 51 2.2kW',
                quantity: 2,
                pickedQuantity: 2,
                unit: 'pcs',
                sourceBin: 'BIN-A-01-14',
                targetBin: 'RAMP-01-STAGE'
            }
        ]
    }
];
