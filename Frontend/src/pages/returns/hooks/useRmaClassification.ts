import { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { 
    RmaRecord, 
    DamagePhoto, 
    DamageSeverity, 
    DispositionAction, 
    InspectionChecklist 
} from '@/models/rma';
import { returnsApi } from '@/api/internal/returnsApi';
import toast from 'react-hot-toast';

const DEFAULT_DESTINATIONS: Record<DispositionAction, string> = {
    RESTOCK_PRIME: 'Shelf Zone A-01 (Prime)',
    TRANSFER_TO_SERVICE: 'Technical Service Station SB-02',
    DISPOSE_SCRAP: 'Certified Scrap / Bio-Waste Bin W-09',
    PENDING: 'Intake Staging Area Q-01'
};

const DEFAULT_TICKET_PREFIX: Record<DispositionAction, string> = {
    RESTOCK_PRIME: 'STK-RESTOCK',
    TRANSFER_TO_SERVICE: 'SRV-TICKET',
    DISPOSE_SCRAP: 'SCRAP-CERT',
    PENDING: 'RMA-PENDING'
};

export function useRmaClassification(
    rma: RmaRecord,
    onSaveSuccess: (updatedRma: RmaRecord) => void
) {
    const queryClient = useQueryClient();
    const [currentStep, setCurrentStep] = useState<number>(0);

    // Step 2: Damage audit state
    const [damageSeverity, setDamageSeverity] = useState<DamageSeverity>(rma.damageSeverity || 'NONE');
    const [photos, setPhotos] = useState<DamagePhoto[]>(rma.damagePhotos || []);
    const [checklist, setChecklist] = useState<InspectionChecklist>(
        rma.checklist || {
            packagingIntact: true,
            powerOnBoot: true,
            accessoriesIncluded: true,
            tamperSealIntact: true,
            noFluidLeakage: true,
            labelReadable: true
        }
    );
    const [inspectorNotes, setInspectorNotes] = useState<string>(rma.inspectorNotes || '');
    const [inspectorName, setInspectorName] = useState<string>(rma.inspectorName || 'Dispatcher / QA Lead');
    const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<DamagePhoto | null>(null);

    // Step 3: Decision engine evaluation
    const evaluation = useMemo(() => {
        return returnsApi.evaluateSuggestedAction(
            damageSeverity,
            checklist,
            rma.productName,
            rma.baseline.expiryDate
        );
    }, [damageSeverity, checklist, rma.productName, rma.baseline.expiryDate]);

    const suggestedAction = evaluation.action;
    const suggestedReason = evaluation.reason;
    const confidence = evaluation.confidence;

    // Overrides
    const [manualAction, setManualAction] = useState<DispositionAction | null>(
        rma.finalAction && rma.finalAction !== 'PENDING' ? rma.finalAction : null
    );
    const [overrideReason, setOverrideReason] = useState<string>('');

    const finalAction: DispositionAction = manualAction ?? suggestedAction;
    const isOverridden = manualAction !== null && manualAction !== suggestedAction;

    // Step 4: Dispatch state
    const [manualBin, setManualBin] = useState<string | null>(rma.destinationBin || null);
    const [manualTicket, setManualTicket] = useState<string | null>(rma.trackingTicketCode || null);
    const [finalActionNotes, setFinalActionNotes] = useState<string>(rma.finalActionNotes || '');

    const destinationBin = manualBin ?? (
        finalAction === 'RESTOCK_PRIME' ? (rma.baseline.shelfLocation || DEFAULT_DESTINATIONS.RESTOCK_PRIME) :
        DEFAULT_DESTINATIONS[finalAction] ?? 'Intake Staging Area Q-01'
    );

    const trackingTicketCode = useMemo(() => {
        if (manualTicket) return manualTicket;
        const prefix = DEFAULT_TICKET_PREFIX[finalAction] ?? 'RMA-TRK';
        return `${prefix}-${rma.id.slice(-4)}`;
    }, [manualTicket, finalAction, rma.id]);

    // TanStack Query Mutation for saving disposition
    const saveDispositionMutation = useMutation({
        mutationFn: async () => {
            await returnsApi.saveInspection(rma.id, {
                damageSeverity,
                damagePhotos: photos,
                checklist,
                inspectorNotes,
                inspectorName,
                suggestedAction,
                suggestedActionReason: suggestedReason,
                suggestedActionConfidence: confidence
            });

            return await returnsApi.finalizeDisposition(rma.id, {
                finalAction,
                finalActionNotes: isOverridden ? `[Manager Override: ${overrideReason}] ${finalActionNotes}` : finalActionNotes,
                destinationBin,
                trackingTicketCode
            });
        },
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ['rma-returns'] });
            queryClient.invalidateQueries({ queryKey: ['rma-returns', 'kpis'] });
            toast.success(`RMA ${rma.id} classified successfully: ${finalAction.replace('_', ' ')}`);
            onSaveSuccess(updated);
        },
        onError: () => {
            toast.error('Failed to finalize RMA disposition. Please retry.');
        }
    });

    const handleAddPresetPhoto = (sampleKey: string) => {
        const samples = returnsApi.getSamplePhotos();
        const available = samples[sampleKey];
        if (available && available.length > 0) {
            const photoToAdd = {
                ...available[0],
                id: `DP-${Date.now().toString().slice(-4)}`,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
            };
            setPhotos(prev => [photoToAdd, ...prev]);
            toast.success(`Attached evidence photo: ${photoToAdd.title}`);
        }
    };

    const handleRemovePhoto = (photoId: string) => {
        setPhotos(prev => prev.filter(p => p.id !== photoId));
        if (selectedPhotoPreview?.id === photoId) {
            setSelectedPhotoPreview(null);
        }
    };

    const toggleChecklist = (key: keyof InspectionChecklist) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleFinalActionSelect = (action: DispositionAction) => {
        setManualAction(action);
    };

    return {
        currentStep,
        setCurrentStep,
        isSaving: saveDispositionMutation.isPending,
        damageSeverity,
        setDamageSeverity,
        photos,
        checklist,
        toggleChecklist,
        inspectorNotes,
        setInspectorNotes,
        inspectorName,
        setInspectorName,
        selectedPhotoPreview,
        setSelectedPhotoPreview,
        suggestedAction,
        suggestedReason,
        confidence,
        finalAction,
        setFinalAction: handleFinalActionSelect,
        overrideReason,
        setOverrideReason,
        isOverridden,
        destinationBin,
        setDestinationBin: (bin: string) => setManualBin(bin),
        trackingTicketCode,
        setTrackingTicketCode: (ticket: string) => setManualTicket(ticket),
        finalActionNotes,
        setFinalActionNotes,
        handleAddPresetPhoto,
        handleRemovePhoto,
        handleFinalizeAndConfirm: () => saveDispositionMutation.mutate()
    };
}
