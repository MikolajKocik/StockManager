import type { RmaRecord, DamagePhoto } from '@/models/rma';

// Pre-defined realistic damage photos for returns
export const SAMPLE_DAMAGE_PHOTOS: Record<string, DamagePhoto[]> = {
    scanner: [
        {
            id: 'DP-001',
            title: 'Shattered Display & Bezel Impact',
            category: 'Display/Electronics',
            description: 'Impact fracture at upper-left corner of the Gorilla Glass touch window. Backlight functional but touch digitizer unresponsive.',
            url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%231e293b"/><text x="50%25" y="45%25" dominant-baseline="middle" text-anchor="middle" fill="%23f87171" font-family="monospace" font-weight="bold" font-size="16">DAMAGED: CRACKED DISPLAY</text><text x="50%25" y="60%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="monospace" font-size="12">Digitizer dead, internal board intact</text><line x1="80" y1="50" x2="320" y2="210" stroke="%23ef4444" stroke-width="3"/><line x1="120" y1="210" x2="280" y2="50" stroke="%23ef4444" stroke-width="2"/></svg>',
            severityTag: 'Moderate',
            timestamp: '2026-08-04 14:15:22'
        },
        {
            id: 'DP-002',
            title: 'Scuffed Battery Housing & Latch',
            category: 'Housing',
            description: 'Deep scratches along the thermoplastic bumper and slightly loose battery locking tab.',
            url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%231e293b"/><text x="50%25" y="45%25" dominant-baseline="middle" text-anchor="middle" fill="%23fbbf24" font-family="monospace" font-weight="bold" font-size="16">HOUSING: SCUFFED BUMPER</text><text x="50%25" y="60%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="monospace" font-size="12">Cosmetic scuffs on battery latch</text><rect x="90" y="80" width="220" height="100" fill="none" stroke="%23f59e0b" stroke-width="2" stroke-dasharray="6,4"/></svg>',
            severityTag: 'Minor',
            timestamp: '2026-08-04 14:16:05'
        }
    ],
    milk: [
        {
            id: 'DP-003',
            title: 'Crushed TetraPak Corner & Leakage',
            category: 'Packaging',
            description: 'Top left carton seam burst during pallet transit; active fluid leakage detected on exterior tray.',
            url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%231e293b"/><text x="50%25" y="45%25" dominant-baseline="middle" text-anchor="middle" fill="%23f87171" font-family="monospace" font-weight="bold" font-size="16">PACKAGING: FLUID LEAKAGE</text><text x="50%25" y="60%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="monospace" font-size="12">Ruptured seam, unsealed contents</text><circle cx="200" cy="130" r="50" fill="%23ef4444" fill-opacity="0.3" stroke="%23ef4444" stroke-width="3"/></svg>',
            severityTag: 'Critical',
            timestamp: '2026-08-05 09:12:00'
        }
    ],
    pristineBox: [
        {
            id: 'DP-004',
            title: 'Unopened Outer Shipper (Minor Box Crease)',
            category: 'Packaging',
            description: 'Factory tamper seal 100% intact. Only minor corner scuff on outer corrugated carton. Internal contents untouched.',
            url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%231e293b"/><text x="50%25" y="45%25" dominant-baseline="middle" text-anchor="middle" fill="%2334d399" font-family="monospace" font-weight="bold" font-size="16">FACTORY SEALED: UNTOUCHED</text><text x="50%25" y="60%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="monospace" font-size="12">Tamper tape unbroken, 100% prime</text><rect x="70" y="60" width="260" height="140" fill="none" stroke="%2310b981" stroke-width="3"/></svg>',
            severityTag: 'Minor',
            timestamp: '2026-08-05 10:30:00'
        }
    ],
    salmon: [
        {
            id: 'DP-005',
            title: 'Broken Thermal Seal & Temp Violation',
            category: 'Fluid/Perishable',
            description: 'Thermal indicator triggered (exceeded +6°C for > 4h). Vacuum seal pierced with condensation inside.',
            url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%231e293b"/><text x="50%25" y="45%25" dominant-baseline="middle" text-anchor="middle" fill="%23f87171" font-family="monospace" font-weight="bold" font-size="16">BIOHAZARD: TEMP EXCEEDED</text><text x="50%25" y="60%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="monospace" font-size="12">Cold chain compromised (+11°C)</text><circle cx="200" cy="130" r="45" fill="none" stroke="%23dc2626" stroke-width="4"/></svg>',
            severityTag: 'Critical',
            timestamp: '2026-08-05 08:44:19'
        }
    ]
};

export const MOCK_RMA_RECORDS: RmaRecord[] = [
    {
        id: 'RMA-2026-0801',
        salesOrderId: 'SO-9842',
        customerName: 'TechLogix Distribution Sp. z o.o.',
        customerContact: 'returns@techlogix.pl (+48 22 890 12 34)',
        productId: 1,
        productName: 'Milk 3.2% UHT (1L)',
        productSku: 'BAT-001 / SKU-MILK-001',
        quantity: 24,
        unit: 'l',
        createdAt: '2026-08-05 08:30:00',
        returnDate: '2026-08-05',
        status: 'INSPECTION_PENDING',
        customerReason: 'DAMAGED_IN_TRANSIT',
        customerNotes: 'Driver dropped case during ramp unloading; 2 cartons crushed with active milk puddle.',
        baseline: {
            productName: 'Milk 3.2% UHT (1L)',
            sku: 'BAT-001 / SKU-MILK-001',
            batchNumber: 'BAT-001',
            originalGrade: 'Grade A - Certified Food Grade',
            shelfLocation: 'Zone R-02 (Refrigerated Section)',
            storageTemperature: '+2°C to +6°C',
            expiryDate: '2026-08-15',
            warrantyStatus: 'Perishable Standard (48h reporting)',
            specifications: {
                FatContent: '3.2%',
                PackagingType: 'Tetra Brik Aseptic 1000ml',
                PalletTier: 'Layer 4 / Pallet #882',
                OriginalSupplier: 'Mlekovita'
            }
        },
        damageSeverity: 'SEVERE_DAMAGE',
        damagePhotos: SAMPLE_DAMAGE_PHOTOS.milk,
        checklist: {
            packagingIntact: false,
            powerOnBoot: true,
            accessoriesIncluded: true,
            tamperSealIntact: false,
            noFluidLeakage: false,
            labelReadable: true
        },
        inspectorNotes: 'Outer box soaked. Food safety hazard prevents restock. Product must be scrapped in bio-waste compactor.',
        suggestedAction: 'DISPOSE_SCRAP',
        suggestedActionReason: 'Perishable dairy product with ruptured packaging and active fluid contamination. Ineligible for restock or repair.',
        suggestedActionConfidence: 98,
        finalAction: 'PENDING'
    },
    {
        id: 'RMA-2026-0802',
        salesOrderId: 'SO-9810',
        customerName: 'Nordic Cold Chain Solutions',
        customerContact: 'logistics@nordic-cold.com (+48 58 777 44 11)',
        productId: 5,
        productName: 'Atlantic Salmon Fillet (Fresh)',
        productSku: 'BAT-005 / SKU-SALM-005',
        quantity: 12,
        unit: 'kg',
        createdAt: '2026-08-05 07:45:00',
        returnDate: '2026-08-05',
        status: 'INSPECTION_PENDING',
        customerReason: 'EXPIRED_PERISHABLE',
        customerNotes: 'Cold chain monitor logging error upon delivery at destination hub.',
        baseline: {
            productName: 'Atlantic Salmon Fillet (Fresh)',
            sku: 'BAT-005 / SKU-SALM-005',
            batchNumber: 'BAT-005',
            originalGrade: 'Sashimi Grade / Fresh Vacuum Pack',
            shelfLocation: 'Zone R-01 (Refrigerated Section)',
            storageTemperature: '0°C to +2°C',
            expiryDate: '2026-08-03',
            warrantyStatus: 'Fresh Perishable Standard',
            specifications: {
                Origin: 'Norway (NordFish)',
                Packaging: 'MAP Vacuum Tray',
                CertifiedHACCP: 'Yes'
            }
        },
        damageSeverity: 'BIOHAZARD_TOTAL_LOSS',
        damagePhotos: SAMPLE_DAMAGE_PHOTOS.salmon,
        checklist: {
            packagingIntact: false,
            powerOnBoot: true,
            accessoriesIncluded: true,
            tamperSealIntact: false,
            noFluidLeakage: false,
            labelReadable: true
        },
        inspectorNotes: 'Exceeded expiration date & temperature cutoff. Immediate write-off required.',
        suggestedAction: 'DISPOSE_SCRAP',
        suggestedActionReason: 'Expired perishable food item (+11°C violation). High microbial risk, scrap immediately with certified disposal ticket.',
        suggestedActionConfidence: 99,
        finalAction: 'PENDING'
    },
    {
        id: 'RMA-2026-0803',
        salesOrderId: 'SO-9799',
        customerName: 'Apex Retail Centers Poland',
        customerContact: 'magazyn@apex-retail.pl (+48 61 222 33 00)',
        productId: 7,
        productName: 'Premium Basmati Rice (5kg)',
        productSku: 'BAT-007 / SKU-RICE-007',
        quantity: 50,
        unit: 'kg',
        createdAt: '2026-08-04 16:10:00',
        returnDate: '2026-08-04',
        status: 'INSPECTED',
        customerReason: 'CUSTOMER_MISTAKE',
        customerNotes: 'Ordered 50kg instead of 25kg. Pallet unopened in original wrap.',
        baseline: {
            productName: 'Premium Basmati Rice (5kg)',
            sku: 'BAT-007 / SKU-RICE-007',
            batchNumber: 'BAT-007',
            originalGrade: 'Grade A Long Grain Dry',
            shelfLocation: 'Zone S-03 (Regular Dry Storage)',
            storageTemperature: '+15°C to +25°C',
            expiryDate: '2028-03-01',
            warrantyStatus: 'Long Shelf Life Non-Perishable',
            specifications: {
                Supplier: 'Golden Grain',
                MoistureCutoff: '< 12%',
                SealIntegrity: 'Heat-sealed polypropylene'
            }
        },
        damageSeverity: 'NONE',
        damagePhotos: SAMPLE_DAMAGE_PHOTOS.pristineBox,
        checklist: {
            packagingIntact: true,
            powerOnBoot: true,
            accessoriesIncluded: true,
            tamperSealIntact: true,
            noFluidLeakage: true,
            labelReadable: true
        },
        inspectorNotes: '100% factory sealed, bags in perfect condition, no pest or moisture intrusion.',
        inspectorName: 'Jan Kowalski (QA Lead)',
        inspectedAt: '2026-08-04 16:45:10',
        suggestedAction: 'RESTOCK_PRIME',
        suggestedActionReason: 'Untouched pristine packaging with intact tamper seal and dry integrity. 100% eligible for prime shelf return.',
        suggestedActionConfidence: 97,
        finalAction: 'RESTOCK_PRIME',
        finalActionNotes: 'Returned to prime shelf location S-03-B2. Inventory quantity adjusted +50kg.',
        destinationBin: 'Shelf S-03-B2',
        trackingTicketCode: 'STK-RESTOCK-8841'
    },
    {
        id: 'RMA-2026-0804',
        salesOrderId: 'SO-9755',
        customerName: 'Bistro Fresh Restaurant Group',
        customerContact: 'purchasing@bistro-fresh.eu (+48 12 400 99 11)',
        productId: 6,
        productName: 'Frozen Artisan Pizza Quattro Formaggi',
        productSku: 'BAT-006 / SKU-PIZZ-006',
        quantity: 30,
        unit: 'pcs',
        createdAt: '2026-08-04 11:20:00',
        returnDate: '2026-08-04',
        status: 'INSPECTION_PENDING',
        customerReason: 'DEFECTIVE_DEVICE',
        customerNotes: 'Outer master carton torn at side handle, but individual inner shrink-wraps look unopened.',
        baseline: {
            productName: 'Frozen Artisan Pizza Quattro Formaggi',
            sku: 'BAT-006 / SKU-PIZZ-006',
            batchNumber: 'BAT-006',
            originalGrade: 'Deep Frozen Food Grade',
            shelfLocation: 'Zone F-01 (Freezer Section)',
            storageTemperature: '-18°C or colder',
            expiryDate: '2027-01-15',
            warrantyStatus: 'Frozen Goods Standard',
            specifications: {
                Supplier: 'FrostFood',
                TemperatureSpec: '-18°C',
                InnerWrap: 'Cryovac Barrier Film'
            }
        },
        damageSeverity: 'PACKAGING_TORN',
        damagePhotos: SAMPLE_DAMAGE_PHOTOS.scanner,
        checklist: {
            packagingIntact: false,
            powerOnBoot: true,
            accessoriesIncluded: true,
            tamperSealIntact: true,
            noFluidLeakage: true,
            labelReadable: true
        },
        inspectorNotes: 'Outer box damaged, but thermal probe reads -19.4°C and inner sealed films intact. Needs repackaging.',
        suggestedAction: 'TRANSFER_TO_SERVICE',
        suggestedActionReason: 'Contents preserved at -19°C but master carton damaged. Transfer to Packing/QA Service Station for inspection & re-boxing.',
        suggestedActionConfidence: 91,
        finalAction: 'PENDING'
    },
    {
        id: 'RMA-2026-0805',
        salesOrderId: 'SO-9688',
        customerName: 'MegaTrans Global Fleet Services',
        customerContact: 'serwis@megatrans.com (+48 22 100 22 99)',
        productId: 2,
        productName: 'Apples Gala Export Grade',
        productSku: 'BAT-002 / SKU-APPL-002',
        quantity: 15,
        unit: 'kg',
        createdAt: '2026-08-03 14:00:00',
        returnDate: '2026-08-03',
        status: 'DISPOSED',
        customerReason: 'COSMETIC_DAMAGE',
        customerNotes: 'Bruised surface on 4 crates after road bump event.',
        baseline: {
            productName: 'Apples Gala Export Grade',
            sku: 'BAT-002 / SKU-APPL-002',
            batchNumber: 'BAT-002',
            originalGrade: 'Class 1 Fresh Fruit',
            shelfLocation: 'Zone S-02 (Regular Storage)',
            storageTemperature: '+4°C to +8°C',
            expiryDate: '2026-08-30',
            warrantyStatus: 'Fresh Produce (24h claim)',
            specifications: {
                Supplier: 'SadPol',
                Caliber: '70-75mm',
                WaxCoat: 'Natural'
            }
        },
        damageSeverity: 'SEVERE_DAMAGE',
        damagePhotos: SAMPLE_DAMAGE_PHOTOS.milk,
        checklist: {
            packagingIntact: false,
            powerOnBoot: true,
            accessoriesIncluded: true,
            tamperSealIntact: false,
            noFluidLeakage: false,
            labelReadable: true
        },
        inspectorNotes: 'Crushed and fermenting fruit. Not salvageable.',
        inspectorName: 'Marta Nowak (Quality Control)',
        inspectedAt: '2026-08-03 15:20:00',
        suggestedAction: 'DISPOSE_SCRAP',
        suggestedActionReason: 'Heavy bruising and onset of rot. Scrap to compost bin.',
        suggestedActionConfidence: 99,
        finalAction: 'DISPOSE_SCRAP',
        finalActionNotes: 'Composted via BioWaste contractor ticket #BW-992.',
        destinationBin: 'Waste Bin BIO-04',
        trackingTicketCode: 'SCRAP-CERT-2026-041'
    }
];
