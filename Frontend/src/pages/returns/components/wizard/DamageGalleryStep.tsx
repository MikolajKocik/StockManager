import React from 'react';
import { Button, Input, Select, Textarea, Card, CardHeader, CardBody } from '@/components/common';
import type { DamagePhoto, DamageSeverity, InspectionChecklist } from '@/models/rma';
import { DamagePhotoCard } from './DamagePhotoCard';
import { InspectionChecklistGrid } from './InspectionChecklistGrid';

export interface DamageGalleryStepProps {
    photos: DamagePhoto[];
    damageSeverity: DamageSeverity;
    onDamageSeverityChange: (severity: DamageSeverity) => void;
    checklist: InspectionChecklist;
    onToggleChecklist: (key: keyof InspectionChecklist) => void;
    inspectorNotes: string;
    onInspectorNotesChange: (notes: string) => void;
    inspectorName: string;
    onInspectorNameChange: (name: string) => void;
    selectedPhotoPreview: DamagePhoto | null;
    onSelectPhotoPreview: (photo: DamagePhoto | null) => void;
    onAddPresetPhoto: (sampleKey: string) => void;
    onRemovePhoto: (photoId: string) => void;
    onPrev: () => void;
    onNext: () => void;
}

const DAMAGE_SEVERITY_OPTIONS = [
    { value: 'NONE', label: 'None - Pristine / Factory Sealed' },
    { value: 'MINOR_COSMETIC', label: 'Minor Cosmetic (Surface Scratch / Box Crease)' },
    { value: 'PACKAGING_TORN', label: 'Packaging Torn (Inner Good Intact)' },
    { value: 'FUNCTIONAL_DEFECT', label: 'Functional Defect (Fails Boot / Diagnostic)' },
    { value: 'SEVERE_DAMAGE', label: 'Severe Physical Destruction' },
    { value: 'BIOHAZARD_TOTAL_LOSS', label: 'Biohazard / Spoiled / Perishable Leak' }
] as const;

export const DamageGalleryStep: React.FC<DamageGalleryStepProps> = ({
    photos,
    damageSeverity,
    onDamageSeverityChange,
    checklist,
    onToggleChecklist,
    inspectorNotes,
    onInspectorNotesChange,
    inspectorName,
    onInspectorNameChange,
    selectedPhotoPreview,
    onSelectPhotoPreview,
    onAddPresetPhoto,
    onRemovePhoto,
    onPrev,
    onNext
}) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Left Column: Photo Evidence */}
                <div className="lg:col-span-7 space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between w-full">
                                <span className="font-bold text-xs uppercase font-mono text-slate-800">
                                    Damage Evidence Photo Gallery ({photos.length})
                                </span>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs text-slate-500 font-mono">Sample:</span>
                                    <Button size="sm" variant="outline" className="text-xs py-0.5 px-1.5" onClick={() => onAddPresetPhoto('scanner')}>
                                        Crack
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-xs py-0.5 px-1.5" onClick={() => onAddPresetPhoto('milk')}>
                                        Leak
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-xs py-0.5 px-1.5" onClick={() => onAddPresetPhoto('pristineBox')}>
                                        Sealed
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            {photos.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg p-6 bg-slate-50">
                                    <p className="text-xs font-mono text-slate-600 font-bold mb-1">
                                        No damage photos registered yet
                                    </p>
                                    <p className="text-xs text-slate-500 mb-3">
                                        Use quick preset buttons above to attach damage photos or review clean package.
                                    </p>
                                    <Button size="sm" variant="primary" onClick={() => onAddPresetPhoto('pristineBox')}>
                                        Attach Factory Sealed Photo
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {photos.map((photo) => (
                                        <DamagePhotoCard
                                            key={photo.id}
                                            photo={photo}
                                            onPreview={onSelectPhotoPreview}
                                            onDelete={onRemovePhoto}
                                        />
                                    ))}
                                </div>
                            )}

                            {selectedPhotoPreview && (
                                <div className="p-3 bg-slate-50 text-slate-800 rounded-lg space-y-2 border border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono font-bold text-[#2b6675]">
                                            Zoom Inspector: {selectedPhotoPreview.title}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => onSelectPhotoPreview(null)}
                                            className="text-slate-500 hover:text-slate-800 text-xs font-mono font-bold cursor-pointer"
                                        >
                                            Close Zoom
                                        </button>
                                    </div>
                                    <div className="w-full max-h-64 overflow-hidden rounded flex items-center justify-center bg-slate-100 border border-slate-200">
                                        <img
                                            src={selectedPhotoPreview.url}
                                            alt={selectedPhotoPreview.title}
                                            className="w-full object-contain"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-600 font-sans">
                                        {selectedPhotoPreview.description}
                                    </p>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column: Physical Checkpoints & Severity Rating */}
                <div className="lg:col-span-5 space-y-4">
                    <Card>
                        <CardHeader>
                            <span className="font-bold text-xs uppercase font-mono text-slate-800">
                                Quality Audit Checkpoints
                            </span>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div>
                                <Select
                                    label="Evaluated Damage Severity"
                                    value={damageSeverity}
                                    onChange={(e) => onDamageSeverityChange(e.target.value as DamageSeverity)}
                                    options={DAMAGE_SEVERITY_OPTIONS as any}
                                />
                            </div>

                            <InspectionChecklistGrid
                                checklist={checklist}
                                onToggle={onToggleChecklist}
                            />

                            <div>
                                <Textarea
                                    label="Inspector Diagnostic Notes"
                                    rows={2}
                                    value={inspectorNotes}
                                    onChange={(e) => onInspectorNotesChange(e.target.value)}
                                    placeholder="Enter observations on damage type, serial verification, packaging condition..."
                                />
                            </div>

                            <div>
                                <Input
                                    label="Audited By (Inspector Name)"
                                    value={inspectorName}
                                    onChange={(e) => onInspectorNameChange(e.target.value)}
                                />
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <Button variant="secondary" size="sm" onClick={onPrev}>
                    &lt; Back to Baseline
                </Button>
                <Button
                    variant="primary"
                    size="md"
                    onClick={onNext}
                >
                    Calculate AI Action Recommendation &gt;
                </Button>
            </div>
        </div>
    );
};
