export type RmaStatus =
    | 'DRAFT'
    | 'INSPECTION_PENDING'
    | 'INSPECTED'
    | 'RESTOCKED'
    | 'SERVICED'
    | 'DISPOSED'
    | 'REJECTED';

export type DispositionAction =
    | 'RESTOCK_PRIME'
    | 'TRANSFER_TO_SERVICE'
    | 'DISPOSE_SCRAP'
    | 'PENDING';

export type DamageSeverity =
    | 'NONE'
    | 'MINOR_COSMETIC'
    | 'PACKAGING_TORN'
    | 'FUNCTIONAL_DEFECT'
    | 'SEVERE_DAMAGE'
    | 'BIOHAZARD_TOTAL_LOSS';

export type CustomerReturnReason =
    | 'DAMAGED_IN_TRANSIT'
    | 'DEFECTIVE_DEVICE'
    | 'WRONG_ITEM_SENT'
    | 'EXPIRED_PERISHABLE'
    | 'CUSTOMER_MISTAKE'
    | 'COSMETIC_DAMAGE';

export interface DamagePhoto {
    id: string;
    title: string;
    category: 'Packaging' | 'Housing' | 'Display/Electronics' | 'Fluid/Perishable' | 'Seal/Label' | 'General';
    description: string;
    url: string;
    severityTag: 'Minor' | 'Moderate' | 'Critical';
    timestamp: string;
}

export interface PristineBaseline {
    productName: string;
    sku: string;
    batchNumber: string;
    originalGrade: string;
    shelfLocation: string;
    storageTemperature: string;
    expiryDate?: string;
    warrantyStatus: string;
    specifications: Record<string, string>;
    baselinePhotoUrl?: string;
}

export interface InspectionChecklist {
    packagingIntact: boolean;
    powerOnBoot: boolean;
    accessoriesIncluded: boolean;
    tamperSealIntact: boolean;
    noFluidLeakage: boolean;
    labelReadable: boolean;
}

export interface RmaRecord {
    id: string;
    salesOrderId: string;
    customerName: string;
    customerContact: string;
    productId: number;
    productName: string;
    productSku: string;
    quantity: number;
    unit: string;
    createdAt: string;
    returnDate: string;
    status: RmaStatus;
    customerReason: CustomerReturnReason;
    customerNotes: string;
    baseline: PristineBaseline;
    damageSeverity: DamageSeverity;
    damagePhotos: DamagePhoto[];
    checklist: InspectionChecklist;
    inspectorNotes: string;
    inspectorName?: string;
    inspectedAt?: string;
    suggestedAction: DispositionAction;
    suggestedActionReason: string;
    suggestedActionConfidence: number;
    finalAction: DispositionAction;
    finalActionNotes?: string;
    destinationBin?: string;
    trackingTicketCode?: string;
}

export interface RmaKpiSummary {
    totalRmas: number;
    pendingInspection: number;
    restockedPrime: number;
    routedToService: number;
    disposedScrap: number;
    avgInspectionMinutes: number;
}
