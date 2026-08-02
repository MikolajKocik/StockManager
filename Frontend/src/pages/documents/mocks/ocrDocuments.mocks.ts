import type { OcrDocument } from '../models/ocrDocument';

export const MOCK_OCR_DOCUMENTS: OcrDocument[] = [
    {
        id: 'DOC-WZ-8841',
        fileName: 'WZ_2026_08_1402_ApexMachinery.pdf',
        fileSize: '482 KB',
        uploadedAt: '2026-08-02 11:42',
        status: 'PENDING_REVIEW',
        overallConfidence: 0.96,
        extractedData: {
            docType: 'WZ',
            docNumber: 'WZ/2026/08/1402',
            issueDate: '2026-08-01',
            deliveryDate: '2026-08-02',
            contractorName: 'Apex Machinery Sp. z o.o.',
            contractorNip: 'PL5252849102',
            contractorAddress: 'ul. Przemyslowa 48, 40-020 Katowice',
            destinationWarehouse: 'Main High-Bay Warehouse (Zone A)',
            totalNet: 14850.00,
            totalGross: 18265.50,
            currency: 'PLN',
            items: [
                {
                    id: 'item-1',
                    sku: 'HYD-PUMP-400X',
                    name: 'Hydraulic High-Pressure Pump 400 bar',
                    quantity: 4,
                    unit: 'pcs',
                    unitPriceNet: 2450.00,
                    vatRate: 23,
                    lotNumber: 'LOT-2026-HYDRO-99'
                },
                {
                    id: 'item-2',
                    sku: 'VALVE-PROP-24V',
                    name: 'Proportional Directional Valve 24V DC',
                    quantity: 10,
                    unit: 'pcs',
                    unitPriceNet: 380.00,
                    vatRate: 23,
                    lotNumber: 'LOT-VALVE-A88'
                },
                {
                    id: 'item-3',
                    sku: 'FLG-STEEL-DN80',
                    name: 'Steel Flange Connection DN80 PN40',
                    quantity: 25,
                    unit: 'pcs',
                    unitPriceNet: 50.00,
                    vatRate: 23,
                    lotNumber: 'LOT-2026-FLG-01'
                }
            ],
            notes: 'Goods delivered via Raben Freight TRK-902-RABEN at Ramp 01'
        },
        rawBoundingBoxes: [
            {
                id: 'box-1',
                text: 'WZ/2026/08/1402',
                confidence: 0.99,
                rect: { topPercent: 8, leftPercent: 55, widthPercent: 35, heightPercent: 4 },
                targetFieldKey: 'docNumber',
                isExtracted: true
            },
            {
                id: 'box-2',
                text: 'Apex Machinery Sp. z o.o.',
                confidence: 0.98,
                rect: { topPercent: 16, leftPercent: 8, widthPercent: 40, heightPercent: 3.5 },
                targetFieldKey: 'contractorName',
                isExtracted: true
            },
            {
                id: 'box-3',
                text: 'PL5252849102',
                confidence: 0.97,
                rect: { topPercent: 20, leftPercent: 14, widthPercent: 22, heightPercent: 3 },
                targetFieldKey: 'contractorNip',
                isExtracted: true
            },
            {
                id: 'box-4',
                text: '2026-08-01',
                confidence: 0.99,
                rect: { topPercent: 8, leftPercent: 20, widthPercent: 20, heightPercent: 3 },
                targetFieldKey: 'issueDate',
                isExtracted: true
            },
            {
                id: 'box-5',
                text: '2026-08-02',
                confidence: 0.95,
                rect: { topPercent: 12, leftPercent: 20, widthPercent: 20, heightPercent: 3 },
                targetFieldKey: 'deliveryDate',
                isExtracted: true
            },
            {
                id: 'box-6',
                text: 'Main High-Bay Warehouse (Zone A)',
                confidence: 0.94,
                rect: { topPercent: 28, leftPercent: 8, widthPercent: 45, heightPercent: 3.5 },
                targetFieldKey: 'destinationWarehouse',
                isExtracted: true
            },
            {
                id: 'box-7',
                text: 'HYD-PUMP-400X',
                confidence: 0.99,
                rect: { topPercent: 42, leftPercent: 8, widthPercent: 20, heightPercent: 3 },
                targetFieldKey: 'item_sku_0',
                isExtracted: true
            },
            {
                id: 'box-8',
                text: 'LOT-2026-HYDRO-99',
                confidence: 0.88,
                rect: { topPercent: 42, leftPercent: 70, widthPercent: 22, heightPercent: 3 },
                targetFieldKey: 'item_lot_0',
                isExtracted: false
            },
            {
                id: 'box-9',
                text: '14 850.00 PLN',
                confidence: 0.99,
                rect: { topPercent: 84, leftPercent: 68, widthPercent: 24, heightPercent: 3.5 },
                targetFieldKey: 'totalNet',
                isExtracted: true
            },
            {
                id: 'box-10',
                text: '18 265.50 PLN',
                confidence: 0.98,
                rect: { topPercent: 88, leftPercent: 68, widthPercent: 24, heightPercent: 3.5 },
                targetFieldKey: 'totalGross',
                isExtracted: true
            },
            {
                id: 'box-11',
                text: 'TRK-902-RABEN (RAMP 01)',
                confidence: 0.82,
                rect: { topPercent: 93, leftPercent: 8, widthPercent: 35, heightPercent: 3 },
                targetFieldKey: 'notes',
                isExtracted: false
            }
        ]
    },
    {
        id: 'DOC-PZ-9022',
        fileName: 'PZ_2026_08_0911_NordicSensorics.pdf',
        fileSize: '320 KB',
        uploadedAt: '2026-08-02 10:15',
        status: 'PROCESSED',
        overallConfidence: 0.98,
        extractedData: {
            docType: 'PZ',
            docNumber: 'PZ/2026/08/0911',
            issueDate: '2026-08-02',
            deliveryDate: '2026-08-02',
            contractorName: 'Nordic Sensorics AB',
            contractorNip: 'SE556012849101',
            contractorAddress: 'Kungsgatan 12, 111 43 Stockholm, Sweden',
            destinationWarehouse: 'Receiving Buffer 1 (Dock 02)',
            totalNet: 9200.00,
            totalGross: 11316.00,
            currency: 'EUR',
            items: [
                {
                    id: 'item-201',
                    sku: 'SENS-OPT-500',
                    name: 'Optical Laser Distance Sensor 0-50m',
                    quantity: 12,
                    unit: 'pcs',
                    unitPriceNet: 450.00,
                    vatRate: 23,
                    lotNumber: 'LOT-NORDIC-2026-11'
                },
                {
                    id: 'item-202',
                    sku: 'CBL-SHIELD-M12',
                    name: 'M12 5-Pin Shielded Sensor Cable 10m',
                    quantity: 40,
                    unit: 'pcs',
                    unitPriceNet: 95.00,
                    vatRate: 23,
                    lotNumber: 'LOT-NORDIC-CBL-4'
                }
            ],
            notes: 'Goods inspection completed by Quality Control station'
        },
        rawBoundingBoxes: [
            {
                id: 'box-p1',
                text: 'PZ/2026/08/0911',
                confidence: 0.99,
                rect: { topPercent: 8, leftPercent: 55, widthPercent: 35, heightPercent: 4 },
                targetFieldKey: 'docNumber',
                isExtracted: true
            },
            {
                id: 'box-p2',
                text: 'Nordic Sensorics AB',
                confidence: 0.98,
                rect: { topPercent: 16, leftPercent: 8, widthPercent: 40, heightPercent: 3.5 },
                targetFieldKey: 'contractorName',
                isExtracted: true
            },
            {
                id: 'box-p3',
                text: 'SE556012849101',
                confidence: 0.96,
                rect: { topPercent: 20, leftPercent: 14, widthPercent: 25, heightPercent: 3 },
                targetFieldKey: 'contractorNip',
                isExtracted: true
            },
            {
                id: 'box-p4',
                text: '2026-08-02',
                confidence: 0.99,
                rect: { topPercent: 8, leftPercent: 20, widthPercent: 20, heightPercent: 3 },
                targetFieldKey: 'issueDate',
                isExtracted: true
            },
            {
                id: 'box-p5',
                text: '9 200.00 EUR',
                confidence: 0.99,
                rect: { topPercent: 84, leftPercent: 68, widthPercent: 24, heightPercent: 3.5 },
                targetFieldKey: 'totalNet',
                isExtracted: true
            }
        ]
    }
];
