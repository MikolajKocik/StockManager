import React from 'react';
import { WizardStepper, type WizardStep } from '@/components/common';
import type { RmaRecord } from '@/models/rma';
import { useRmaClassification } from '../hooks/useRmaClassification';
import { BaselineStep } from './wizard/BaselineStep';
import { DamageGalleryStep } from './wizard/DamageGalleryStep';
import { DecisionMatrixStep } from './wizard/DecisionMatrixStep';
import { DispatchStep } from './wizard/DispatchStep';

export interface VisualClassificationWizardProps {
    rma: RmaRecord;
    onClose: () => void;
    onSaveSuccess: (updatedRma: RmaRecord) => void;
}

const WIZARD_STEPS: WizardStep[] = [
    {
        id: 1,
        title: 'Original Baseline',
        description: 'Pristine product specs & origin',
        badgeText: 'Step 1'
    },
    {
        id: 2,
        title: 'Damage Gallery & Audit',
        description: 'Photo evidence & checklist',
        badgeText: 'Step 2'
    },
    {
        id: 3,
        title: 'AI Classification',
        description: 'Decision engine & recommendation',
        badgeText: 'Step 3'
    },
    {
        id: 4,
        title: 'Dispatch & Confirm',
        description: 'Target location & execution',
        badgeText: 'Step 4'
    }
];

export const VisualClassificationWizard: React.FC<VisualClassificationWizardProps> = ({
    rma,
    onClose,
    onSaveSuccess
}) => {
    const {
        currentStep,
        setCurrentStep,
        isSaving,
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
        setFinalAction,
        overrideReason,
        setOverrideReason,
        isOverridden,
        destinationBin,
        setDestinationBin,
        trackingTicketCode,
        setTrackingTicketCode,
        finalActionNotes,
        setFinalActionNotes,
        handleAddPresetPhoto,
        handleRemovePhoto,
        handleFinalizeAndConfirm
    } = useRmaClassification(rma, onSaveSuccess);

    return (
        <div className="w-full space-y-4 font-mono text-xs">
            <WizardStepper
                steps={WIZARD_STEPS}
                currentStepIndex={currentStep}
                onStepClick={(idx) => setCurrentStep(idx)}
            />

            {currentStep === 0 && (
                <BaselineStep
                    rma={rma}
                    onClose={onClose}
                    onNext={() => setCurrentStep(1)}
                />
            )}

            {currentStep === 1 && (
                <DamageGalleryStep
                    photos={photos}
                    damageSeverity={damageSeverity}
                    onDamageSeverityChange={setDamageSeverity}
                    checklist={checklist}
                    onToggleChecklist={toggleChecklist}
                    inspectorNotes={inspectorNotes}
                    onInspectorNotesChange={setInspectorNotes}
                    inspectorName={inspectorName}
                    onInspectorNameChange={setInspectorName}
                    selectedPhotoPreview={selectedPhotoPreview}
                    onSelectPhotoPreview={setSelectedPhotoPreview}
                    onAddPresetPhoto={handleAddPresetPhoto}
                    onRemovePhoto={handleRemovePhoto}
                    onPrev={() => setCurrentStep(0)}
                    onNext={() => setCurrentStep(2)}
                />
            )}

            {currentStep === 2 && (
                <DecisionMatrixStep
                    suggestedAction={suggestedAction}
                    suggestedReason={suggestedReason}
                    confidence={confidence}
                    finalAction={finalAction}
                    onFinalActionChange={setFinalAction}
                    overrideReason={overrideReason}
                    onOverrideReasonChange={setOverrideReason}
                    isOverridden={isOverridden}
                    damageSeverity={damageSeverity}
                    photosCount={photos.length}
                    checklist={checklist}
                    onPrev={() => setCurrentStep(1)}
                    onNext={() => setCurrentStep(3)}
                />
            )}

            {currentStep === 3 && (
                <DispatchStep
                    rma={rma}
                    finalAction={finalAction}
                    destinationBin={destinationBin}
                    onDestinationBinChange={setDestinationBin}
                    trackingTicketCode={trackingTicketCode}
                    onTrackingTicketCodeChange={setTrackingTicketCode}
                    finalActionNotes={finalActionNotes}
                    onFinalActionNotesChange={setFinalActionNotes}
                    isSaving={isSaving}
                    onPrev={() => setCurrentStep(2)}
                    onConfirm={handleFinalizeAndConfirm}
                />
            )}
        </div>
    );
};
