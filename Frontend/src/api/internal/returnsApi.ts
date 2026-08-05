import api from '../config/api';
import { USE_MOCKS } from '../config/mock';
import { MOCK_RMA_RECORDS, SAMPLE_DAMAGE_PHOTOS } from '@/mocks/rma.mocks';
import type { 
    RmaRecord, 
    RmaKpiSummary, 
    DispositionAction, 
    DamageSeverity, 
    InspectionChecklist, 
    DamagePhoto 
} from '@/models/rma';

let localRmaStore: RmaRecord[] = [...MOCK_RMA_RECORDS];

export const returnsApi = {
    /**
     * Retrieves all Return Merchandise Authorizations.
     */
    getAll: async (): Promise<RmaRecord[]> => {
        if (USE_MOCKS) {
            return [...localRmaStore];
        }

        try {
            const res = await api.get('/returns');
            return res.data;
        } catch {
            return [...localRmaStore];
        }
    },

    /**
     * Retrieves a single RMA by ID.
     */
    getById: async (id: string): Promise<RmaRecord | null> => {
        if (USE_MOCKS) {
            const found = localRmaStore.find(r => r.id === id);
            return found ? { ...found } : null;
        }

        try {
            const res = await api.get(`/returns/${id}`);
            return res.data;
        } catch {
            const found = localRmaStore.find(r => r.id === id);
            return found ? { ...found } : null;
        }
    },

    /**
     * Evaluates damage and checklist to recommend a disposition action.
     * System displays original state and suggests:
     * - Return to Prime Shelf (Zwróć na półkę pełnowartościową)
     * - Transfer to Service / Repair (Przekaż do serwisu)
     * - Dispose / Scrap (Zutylizuj)
     */
    evaluateSuggestedAction: (
        severity: DamageSeverity,
        checklist: InspectionChecklist,
        productName: string,
        expiryDate?: string
    ): { action: DispositionAction; reason: string; confidence: number } => {
        const isPerishable = productName.toLowerCase().includes('milk') ||
            productName.toLowerCase().includes('salmon') ||
            productName.toLowerCase().includes('meat') ||
            productName.toLowerCase().includes('apple') ||
            productName.toLowerCase().includes('cheese');

        const isExpired = expiryDate ? new Date(expiryDate) < new Date() : false;

        // 1. Critical Biohazard / Perishable Leaks / Expired -> Scrap
        if (severity === 'BIOHAZARD_TOTAL_LOSS' || isExpired) {
            return {
                action: 'DISPOSE_SCRAP',
                reason: isExpired
                    ? 'Expiration cutoff reached. Perishable items past date must be disposed under certified protocol.'
                    : 'Critical biohazard contamination or complete structural destruction detected. Ineligible for rework.',
                confidence: 99
            };
        }

        if (isPerishable && (!checklist.packagingIntact || !checklist.noFluidLeakage || severity === 'SEVERE_DAMAGE')) {
            return {
                action: 'DISPOSE_SCRAP',
                reason: 'Perishable item with ruptured containment seal or fluid leakage. Strict food safety protocols dictate immediate disposal.',
                confidence: 97
            };
        }

        // 2. Untouched pristine / minor carton crease with intact seals -> Return to prime shelf
        if (severity === 'NONE' || (severity === 'MINOR_COSMETIC' && checklist.packagingIntact && checklist.tamperSealIntact)) {
            return {
                action: 'RESTOCK_PRIME',
                reason: 'Product and tamper seal are 100% intact. Visual criteria verified; item meets Grade-A standards for prime shelf re-inventory.',
                confidence: 96
            };
        }

        // 3. Torn outer packaging / repairable device / defective electronics -> Transfer to Service
        if (severity === 'FUNCTIONAL_DEFECT' || severity === 'PACKAGING_TORN' || !checklist.powerOnBoot || !checklist.accessoriesIncluded) {
            return {
                action: 'TRANSFER_TO_SERVICE',
                reason: !checklist.powerOnBoot
                    ? 'Device diagnostic failure on boot. Route to Diagnostic & Electronic Service Bay for motherboard/component repair.'
                    : 'Inner goods functional but packaging or accessory set incomplete. Route to Service/Packaging station for re-boxing.',
                confidence: 92
            };
        }

        if (severity === 'SEVERE_DAMAGE') {
            return {
                action: 'DISPOSE_SCRAP',
                reason: 'Severe structural destruction exceeds allowable repair threshold (>60% replacement cost).',
                confidence: 94
            };
        }

        return {
            action: 'TRANSFER_TO_SERVICE',
            reason: 'Irregularities observed during visual inspection. Transfer to QA supervisor for manual bench testing.',
            confidence: 85
        };
    },

    /**
     * Saves the step-by-step visual classification inspection.
     */
    saveInspection: async (
        rmaId: string,
        payload: {
            damageSeverity: DamageSeverity;
            damagePhotos: DamagePhoto[];
            checklist: InspectionChecklist;
            inspectorNotes: string;
            inspectorName: string;
            suggestedAction: DispositionAction;
            suggestedActionReason: string;
            suggestedActionConfidence: number;
        }
    ): Promise<RmaRecord> => {
        if (USE_MOCKS) {
            const index = localRmaStore.findIndex(r => r.id === rmaId);
            if (index >= 0) {
                localRmaStore[index] = {
                    ...localRmaStore[index],
                    ...payload,
                    status: 'INSPECTED',
                    inspectedAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
                };
                return { ...localRmaStore[index] };
            }
        }

        try {
            const res = await api.post(`/returns/${rmaId}/inspect`, payload);
            return res.data;
        } catch {
            const index = localRmaStore.findIndex(r => r.id === rmaId);
            if (index >= 0) {
                localRmaStore[index] = {
                    ...localRmaStore[index],
                    ...payload,
                    status: 'INSPECTED',
                    inspectedAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
                };
                return { ...localRmaStore[index] };
            }
            throw new Error(`RMA ${rmaId} not found`);
        }
    },

    /**
     * Finalizes the disposition decision and routes inventory.
     */
    finalizeDisposition: async (
        rmaId: string,
        payload: {
            finalAction: DispositionAction;
            finalActionNotes: string;
            destinationBin: string;
            trackingTicketCode: string;
        }
    ): Promise<RmaRecord> => {
        let newStatus: RmaRecord['status'] = 'INSPECTED';
        if (payload.finalAction === 'RESTOCK_PRIME') newStatus = 'RESTOCKED';
        if (payload.finalAction === 'TRANSFER_TO_SERVICE') newStatus = 'SERVICED';
        if (payload.finalAction === 'DISPOSE_SCRAP') newStatus = 'DISPOSED';

        if (USE_MOCKS) {
            const index = localRmaStore.findIndex(r => r.id === rmaId);
            if (index >= 0) {
                localRmaStore[index] = {
                    ...localRmaStore[index],
                    ...payload,
                    status: newStatus
                };
                return { ...localRmaStore[index] };
            }
        }

        try {
            const res = await api.post(`/returns/${rmaId}/finalize`, { ...payload, status: newStatus });
            return res.data;
        } catch {
            const index = localRmaStore.findIndex(r => r.id === rmaId);
            if (index >= 0) {
                localRmaStore[index] = {
                    ...localRmaStore[index],
                    ...payload,
                    status: newStatus
                };
                return { ...localRmaStore[index] };
            }
            throw new Error(`RMA ${rmaId} not found`);
        }
    },

    /**
     * Creates a new incoming RMA entry.
     */
    createRma: async (newRecord: Omit<RmaRecord, 'id' | 'createdAt'>): Promise<RmaRecord> => {
        const id = `RMA-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
        const created: RmaRecord = {
            ...newRecord,
            id,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
        };

        if (USE_MOCKS) {
            localRmaStore.unshift(created);
            return created;
        }

        try {
            const res = await api.post('/returns', created);
            return res.data;
        } catch {
            localRmaStore.unshift(created);
            return created;
        }
    },

    /**
     * Calculates KPI metrics for returns.
     */
    getKpis: async (): Promise<RmaKpiSummary> => {
        const list = await returnsApi.getAll();
        return {
            totalRmas: list.length,
            pendingInspection: list.filter(r => r.status === 'INSPECTION_PENDING' || r.status === 'DRAFT').length,
            restockedPrime: list.filter(r => r.status === 'RESTOCKED' || r.finalAction === 'RESTOCK_PRIME').length,
            routedToService: list.filter(r => r.status === 'SERVICED' || r.finalAction === 'TRANSFER_TO_SERVICE').length,
            disposedScrap: list.filter(r => r.status === 'DISPOSED' || r.finalAction === 'DISPOSE_SCRAP').length,
            avgInspectionMinutes: 14.5
        };
    },

    /**
     * Provides helper sample damage photo categories for the visual assistant.
     */
    getSamplePhotos: (): Record<string, DamagePhoto[]> => {
        return SAMPLE_DAMAGE_PHOTOS;
    }
};
