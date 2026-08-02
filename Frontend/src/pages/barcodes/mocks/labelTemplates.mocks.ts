import type { LabelTemplate, EmergencyPrintRecord } from "../models/labelTemplate";

export const MOCK_TEMPLATES: LabelTemplate[] = [
    {
        id: 'TPL-GS1-PALLET-100X150',
        name: 'GS1 Standard Logistics Pallet (100x150 mm)',
        description: 'Global standard logistics label for euro-pallets and bulk dispatches with SSCC Code128 and AMR scanner QR matrix.',
        category: 'LOGISTICS_PALLET',
        targetZone: 'ALL_ZONES',
        dimensions: {
            widthMm: 100,
            heightMm: 150,
            dpi: 203
        },
        version: 3,
        createdBy: 'Logistics Director (M. Kocik)',
        updatedAt: '2026-08-01 14:30',
        isDefault: true,
        elements: [
            // Company Header
            {
                id: 'el-logo',
                type: 'IMAGE_LOGO',
                label: 'Company Header',
                x: 6,
                y: 6,
                width: 88,
                height: 10,
                content: 'STOCKMANAGER GLOBAL WMS LOGISTICS',
                fontSize: 13,
                fontWeight: 'bold',
                alignment: 'center'
            },
            {
                id: 'el-line-1',
                type: 'LINE',
                label: 'Top Separator',
                x: 5,
                y: 18,
                width: 90,
                height: 1,
                content: '',
                borderWidth: 1.5
            },
            // Product Name & SKU
            {
                id: 'el-prod-name',
                type: 'DYNAMIC_FIELD',
                label: 'Product Title',
                x: 6,
                y: 22,
                width: 88,
                height: 8,
                content: 'ITEM: {product.name}',
                fontSize: 14,
                fontWeight: 'bold',
                alignment: 'left'
            },
            {
                id: 'el-prod-sku',
                type: 'DYNAMIC_FIELD',
                label: 'Product SKU',
                x: 6,
                y: 31,
                width: 44,
                height: 7,
                content: 'SKU: {product.sku}',
                fontSize: 11,
                fontWeight: 'bold',
                alignment: 'left'
            },
            {
                id: 'el-qty',
                type: 'DYNAMIC_FIELD',
                label: 'Quantity & Unit',
                x: 52,
                y: 31,
                width: 42,
                height: 7,
                content: 'QTY: {quantity} {product.unit}',
                fontSize: 11,
                fontWeight: 'bold',
                alignment: 'right'
            },
            // Batch & Expiration Box
            {
                id: 'el-batch-box',
                type: 'BOX',
                label: 'Traceability Container',
                x: 5,
                y: 40,
                width: 90,
                height: 20,
                content: '',
                borderWidth: 1
            },
            {
                id: 'el-batch-num',
                type: 'DYNAMIC_FIELD',
                label: 'Batch / LOT',
                x: 8,
                y: 43,
                width: 42,
                height: 6,
                content: 'BATCH: {batch.number}',
                fontSize: 11,
                fontWeight: 'normal',
                alignment: 'left'
            },
            {
                id: 'el-exp-date',
                type: 'DYNAMIC_FIELD',
                label: 'Exp. Date',
                x: 52,
                y: 43,
                width: 40,
                height: 6,
                content: 'EXP: {batch.expirationDate}',
                fontSize: 11,
                fontWeight: 'bold',
                alignment: 'right'
            },
            {
                id: 'el-zone',
                type: 'DYNAMIC_FIELD',
                label: 'Zone & Bin Allocation',
                x: 8,
                y: 51,
                width: 84,
                height: 6,
                content: 'DESTINATION: {warehouse.zone} / BIN #{warehouse.binLocation}',
                fontSize: 11,
                fontWeight: 'bold',
                alignment: 'left'
            },
            // QR Code for AMR AGV Scan
            {
                id: 'el-qr',
                type: 'QR_CODE',
                label: 'AGV Quick Scan Matrix',
                x: 70,
                y: 65,
                width: 24,
                height: 24,
                content: '{product.sku}|{batch.number}|{pallet.sscc}',
                symbology: 'QR'
            },
            // Product 1D EAN Barcode
            {
                id: 'el-ean-barcode',
                type: 'BARCODE',
                label: 'EAN-13 Product Barcode',
                x: 6,
                y: 65,
                width: 60,
                height: 24,
                content: '5901234123457',
                symbology: 'EAN13',
                showHumanReadableText: true
            },
            {
                id: 'el-line-2',
                type: 'LINE',
                label: 'Bottom Separator',
                x: 5,
                y: 95,
                width: 90,
                height: 1,
                content: '',
                borderWidth: 1.5
            },
            // SSCC Logistics Pallet Code 128
            {
                id: 'el-sscc-title',
                type: 'TEXT',
                label: 'SSCC Header',
                x: 6,
                y: 99,
                width: 88,
                height: 6,
                content: 'SERIAL SHIPPING CONTAINER CODE (SSCC-18):',
                fontSize: 10,
                fontWeight: 'bold',
                alignment: 'center'
            },
            {
                id: 'el-sscc-barcode',
                type: 'BARCODE',
                label: 'SSCC-18 Code 128',
                x: 8,
                y: 106,
                width: 84,
                height: 36,
                content: '003590123450000018',
                symbology: 'CODE128',
                showHumanReadableText: true
            }
        ]
    },
    {
        id: 'TPL-INBOUND-PZ-100X100',
        name: 'Inbound Reception (PZ) Pallet Label (100x100 mm)',
        description: 'High-visibility inbound reception tag for newly unloaded pallets at unloading docks.',
        category: 'INBOUND_PZ',
        targetZone: 'HIGH_BAY_A',
        dimensions: {
            widthMm: 100,
            heightMm: 100,
            dpi: 203
        },
        version: 2,
        createdBy: 'Dock Supervisor',
        updatedAt: '2026-07-28 11:15',
        elements: [
            {
                id: 'pz-box-header',
                type: 'BOX',
                label: 'PZ Tag Banner',
                x: 4,
                y: 4,
                width: 92,
                height: 14,
                content: '',
                borderWidth: 2
            },
            {
                id: 'pz-title',
                type: 'TEXT',
                label: 'PZ Title',
                x: 6,
                y: 8,
                width: 88,
                height: 8,
                content: '*** WMS INBOUND RECEPTION (PZ) ***',
                fontSize: 12,
                fontWeight: 'bold',
                alignment: 'center'
            },
            {
                id: 'pz-item',
                type: 'DYNAMIC_FIELD',
                label: 'Product Info',
                x: 6,
                y: 22,
                width: 88,
                height: 7,
                content: 'MATERIAL: {product.name}',
                fontSize: 13,
                fontWeight: 'bold',
                alignment: 'left'
            },
            {
                id: 'pz-sku-batch',
                type: 'DYNAMIC_FIELD',
                label: 'SKU & LOT',
                x: 6,
                y: 30,
                width: 88,
                height: 6,
                content: 'SKU: {product.sku} | BATCH: {batch.number}',
                fontSize: 11,
                fontWeight: 'normal',
                alignment: 'left'
            },
            {
                id: 'pz-barcode',
                type: 'BARCODE',
                label: 'Inbound Tracking Code 128',
                x: 10,
                y: 40,
                width: 80,
                height: 35,
                content: 'PZ-2026-08-0194',
                symbology: 'CODE128',
                showHumanReadableText: true
            },
            {
                id: 'pz-bin',
                type: 'DYNAMIC_FIELD',
                label: 'Target Putaway Bin',
                x: 6,
                y: 80,
                width: 88,
                height: 14,
                content: 'PUTAWAY TARGET: BIN #{warehouse.binLocation}',
                fontSize: 14,
                fontWeight: 'bold',
                alignment: 'center'
            }
        ]
    },
    {
        id: 'TPL-BIN-SHELF-100X70',
        name: 'Warehouse Bin & High-Bay Rack Location Tag (100x70 mm)',
        description: 'High-contrast retro-reflective barcode tag for forklift operators scanning rack locations.',
        category: 'SHELF_BIN',
        targetZone: 'ALL_ZONES',
        dimensions: {
            widthMm: 100,
            heightMm: 70,
            dpi: 203
        },
        version: 1,
        createdBy: 'Inventory Manager',
        updatedAt: '2026-07-15 09:40',
        elements: [
            {
                id: 'bin-title',
                type: 'DYNAMIC_FIELD',
                label: 'Bin Index Huge',
                x: 6,
                y: 6,
                width: 88,
                height: 16,
                content: 'RACK: {warehouse.binLocation}',
                fontSize: 22,
                fontWeight: 'bold',
                alignment: 'center'
            },
            {
                id: 'bin-zone',
                type: 'DYNAMIC_FIELD',
                label: 'Zone Name',
                x: 6,
                y: 22,
                width: 88,
                height: 6,
                content: 'STORAGE SECTOR: {warehouse.zone}',
                fontSize: 11,
                fontWeight: 'normal',
                alignment: 'center'
            },
            {
                id: 'bin-barcode',
                type: 'BARCODE',
                label: 'Bin Barcode Code 128',
                x: 8,
                y: 30,
                width: 84,
                height: 34,
                content: 'LOC-A-04-12',
                symbology: 'CODE128',
                showHumanReadableText: true
            }
        ]
    }
];

export const MOCK_SAMPLE_DATA: Record<string, string> = {
    '{product.name}': 'Industrial Hydraulic Valve 24V',
    '{product.sku}': 'VLV-HYDR-24V-01',
    '{product.genre}': 'Hydraulics',
    '{product.unit}': 'pcs',
    '{batch.number}': 'LOT-2026-08-01X',
    '{batch.expirationDate}': '2028-12-31',
    '{warehouse.zone}': 'HALL_A_HIGH_BAY',
    '{warehouse.binLocation}': 'A-02-04',
    '{customer.name}': 'Apex Machinery Sp. z o.o.',
    '{customer.taxId}': 'PL5252525252',
    '{shipment.trackingNumber}': 'TRK-9842104921',
    '{pallet.sscc}': '003590123450000018',
    '{quantity}': '48'
};

export const MOCK_EMERGENCY_REPRINTS: EmergencyPrintRecord[] = [
    {
        id: 'EMG-1094',
        timestamp: '2026-08-02 11:20',
        symbology: 'EAN13',
        payload: '5901234123457',
        referenceLabel: 'Damaged Pallet EAN tag - Hall A, Rack 04',
        printerTarget: 'Zebra ZT410 (Forklift Mobile #3)',
        operator: 'J. Nowak (Forklift Op)',
        status: 'PRINTED'
    },
    {
        id: 'EMG-1093',
        timestamp: '2026-08-02 10:45',
        symbology: 'CODE128',
        payload: '003590123450000018',
        referenceLabel: 'Torn SSCC Shipping Pallet Sticker - Inbound Dock 2',
        printerTarget: 'Zebra GK420d (Inbound Desk)',
        operator: 'A. Kowalski (Shift Lead)',
        status: 'PRINTED'
    },
    {
        id: 'EMG-1092',
        timestamp: '2026-08-02 09:12',
        symbology: 'QR',
        payload: 'VLV-HYDR-24V-01|LOT-2026-08-01X|003590123450000018',
        referenceLabel: 'AGV Scanner Failure Pallet Re-tag',
        printerTarget: 'Zebra ZT410 (Hall B Workshop)',
        operator: 'M. Wisniewski',
        status: 'DISPATCHED'
    }
];
