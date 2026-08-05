import React from 'react';
import { Button, Select, Card, CardHeader, CardBody, Badge } from '@/components/common';
import type { DispositionAction, DamageSeverity, InspectionChecklist } from '@/models/rma';
import { DispositionPathwayCard } from './DispositionPathwayCard';

export interface DecisionMatrixStepProps {
    suggestedAction: DispositionAction;
    suggestedReason: string;
    confidence: number;
    finalAction: DispositionAction;
    onFinalActionChange: (action: DispositionAction) => void;
    overrideReason: string;
    onOverrideReasonChange: (reason: string) => void;
    isOverridden: boolean;
    damageSeverity: DamageSeverity;
    photosCount: number;
    checklist: InspectionChecklist;
    onPrev: () => void;
    onNext: () => void;
}

const OVERRIDE_REASON_OPTIONS = [
    { value: 'CUSTOMER_GOODWILL_SWAP', label: 'Commercial Goodwill Swap / VIP Account' },
    { value: 'SUPPLIER_RECALL_WARRANTY', label: 'Covered under Supplier Manufacturer Warranty' },
    { value: 'INTERNAL_TRAINING_REUSE', label: 'Salvaged for Internal Technician Training' },
    { value: 'SECONDARY_OUTLET_SALE', label: 'Approved for Secondary Outlet (B-Stock) Sale' },
    { value: 'HAZMAT_PROTOCOL_MANDATE', label: 'Mandatory Local Environmental Disposal Code' }
] as const;

const ACTION_TARGET_MAP: Record<DispositionAction, string> = {
    RESTOCK_PRIME: 'Prime Shelf (Pełnowartościowa)',
    TRANSFER_TO_SERVICE: 'Service Bay (Serwis / Naprawa)',
    DISPOSE_SCRAP: 'Scrap / Disposal (Utylizacja)',
    PENDING: 'Intake Staging Area'
};

const ACTION_TITLE_MAP: Record<DispositionAction, string> = {
    RESTOCK_PRIME: 'RETURN TO PRIME SHELF (RESTOCK)',
    TRANSFER_TO_SERVICE: 'TRANSFER TO SERVICE / REPAIR',
    DISPOSE_SCRAP: 'DISPOSE & SCRAP (CERTIFIED WRITE-OFF)',
    PENDING: 'PENDING DISPOSITION'
};

export const DecisionMatrixStep: React.FC<DecisionMatrixStepProps> = ({
    suggestedAction,
    suggestedReason,
    confidence,
    finalAction,
    onFinalActionChange,
    overrideReason,
    onOverrideReasonChange,
    isOverridden,
    damageSeverity,
    photosCount,
    checklist,
    onPrev,
    onNext
}) => {
    const isRestock = suggestedAction === 'RESTOCK_PRIME';
    const isService = suggestedAction === 'TRANSFER_TO_SERVICE';

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Left Column: Decision Engine */}
                <div className="lg:col-span-7 space-y-4">
                    <Card className={
                        isRestock
                            ? 'border-emerald-300 bg-emerald-50/20'
                            : isService
                            ? 'border-[#AA9559]/50 bg-[#AA9559]/10'
                            : 'border-rose-300 bg-rose-50/20'
                    }>
                        <CardHeader className="bg-white/80">
                            <div className="flex items-center justify-between w-full">
                                <span className="font-bold text-xs uppercase font-mono text-slate-900">
                                    Classification Decision Engine
                                </span>
                                <div className="flex items-center gap-2">
                                    <meter
                                        min="0"
                                        max="100"
                                        value={confidence}
                                        className="w-20 h-3"
                                    />
                                    <Badge
                                        variant={
                                            isRestock ? 'emerald' :
                                            isService ? 'brand' : 'danger'
                                        }
                                    >
                                        {confidence}% Confidence
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className={`p-4 rounded-lg border text-left space-y-2 ${
                                isRestock
                                    ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950'
                                    : isService
                                    ? 'bg-amber-100/70 border-amber-300 text-amber-950'
                                    : 'bg-rose-100/70 border-rose-300 text-rose-950'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                                        System Suggested Action
                                    </span>
                                    <span className="font-mono text-xs font-bold">
                                        Target: {ACTION_TARGET_MAP[suggestedAction]}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold font-mono">
                                    {ACTION_TITLE_MAP[suggestedAction]}
                                </h3>
                                <p className="text-xs font-sans leading-relaxed">
                                    {suggestedReason}
                                </p>
                            </div>

                            <div className="space-y-2 pt-2">
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono block">
                                    Available Disposition Pathways
                                </span>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
                                    <DispositionPathwayCard
                                        actionKey="RESTOCK_PRIME"
                                        title="Return to Prime Shelf"
                                        pathwayLabel="Pathway 1"
                                        description="For pristine items with intact seals. Re-enters regular saleable inventory immediately."
                                        badgeVariant="emerald"
                                        isSelected={finalAction === 'RESTOCK_PRIME'}
                                        onSelect={onFinalActionChange}
                                    />

                                    <DispositionPathwayCard
                                        actionKey="TRANSFER_TO_SERVICE"
                                        title="Transfer to Service"
                                        pathwayLabel="Pathway 2"
                                        description="For repairable electronics, repackaging, or firmware calibration by technicians."
                                        badgeVariant="brand"
                                        isSelected={finalAction === 'TRANSFER_TO_SERVICE'}
                                        onSelect={onFinalActionChange}
                                    />

                                    <DispositionPathwayCard
                                        actionKey="DISPOSE_SCRAP"
                                        title="Dispose / Scrap"
                                        pathwayLabel="Pathway 3"
                                        description="For expired perishables, biohazards, or irreparable structural failures."
                                        badgeVariant="danger"
                                        isSelected={finalAction === 'DISPOSE_SCRAP'}
                                        onSelect={onFinalActionChange}
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column: Manager Override & Reasoning */}
                <div className="lg:col-span-5 space-y-4">
                    <Card>
                        <CardHeader>
                            <span className="font-bold text-xs uppercase font-mono text-slate-800">
                                Inspector / Manager Governance
                            </span>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold text-slate-800">
                                        Override Decision:
                                    </span>
                                    {isOverridden ? (
                                        <Badge variant="amber">Manager Override Active</Badge>
                                    ) : (
                                        <Badge variant="emerald">Aligned with AI Suggestion</Badge>
                                    )}
                                </div>

                                {isOverridden && (
                                    <div className="space-y-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                                        <Select
                                            label="Override Justification Reason"
                                            value={overrideReason}
                                            onChange={(e) => onOverrideReasonChange(e.target.value)}
                                            options={OVERRIDE_REASON_OPTIONS as any}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs font-mono space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Damage Level:</span>
                                    <span className="font-bold text-slate-800">{damageSeverity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Photos Attached:</span>
                                    <span className="font-bold text-slate-800">{photosCount} files</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Failed Checks:</span>
                                    <span className="font-bold text-rose-700">
                                        {Object.values(checklist).filter(v => !v).length} of 6 checks
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <Button variant="secondary" size="sm" onClick={onPrev}>
                    &lt; Back to Damage Gallery
                </Button>
                <Button
                    variant="primary"
                    size="md"
                    onClick={onNext}
                >
                    Proceed to Dispatch & Execution &gt;
                </Button>
            </div>
        </div>
    );
};
