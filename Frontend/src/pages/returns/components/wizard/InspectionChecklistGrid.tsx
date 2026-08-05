import React from 'react';
import { Badge } from '@/components/common';
import type { InspectionChecklist } from '@/models/rma';

export interface InspectionChecklistGridProps {
    checklist: InspectionChecklist;
    onToggle: (key: keyof InspectionChecklist) => void;
}

const CHECKLIST_ITEMS = [
    { key: 'packagingIntact' as const, label: 'Outer Packaging Intact & Uncrushed' },
    { key: 'tamperSealIntact' as const, label: 'Factory Tamper Seal & Warranty Sticker Intact' },
    { key: 'powerOnBoot' as const, label: 'Power-On Diagnostic / Integrity Test Passed' },
    { key: 'accessoriesIncluded' as const, label: 'All Cables, Manuals & Accessories Present' },
    { key: 'noFluidLeakage' as const, label: 'No Fluid Leakage or Thermal Excursion' },
    { key: 'labelReadable' as const, label: 'Serial & Batch Barcodes 100% Readable' }
] as const;

export const InspectionChecklistGrid: React.FC<InspectionChecklistGridProps> = ({
    checklist,
    onToggle
}) => {
    return (
        <div className="space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block font-mono">
                Inspection Verification Items
            </span>
            <div className="space-y-1.5">
                {CHECKLIST_ITEMS.map(({ key, label }) => {
                    const checked = checklist[key];
                    return (
                        <div
                            key={key}
                            onClick={() => onToggle(key)}
                            className={`p-2.5 rounded border transition-colors flex items-center justify-between cursor-pointer select-none ${
                                checked
                                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                                    : 'bg-rose-50/80 border-rose-300 text-rose-950'
                            }`}
                        >
                            <span className="text-xs font-mono font-medium">
                                {label}
                            </span>
                            <Badge
                                variant={checked ? 'emerald' : 'danger'}
                                className="text-xs"
                            >
                                {checked ? 'PASSED' : 'FAILED'}
                            </Badge>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
