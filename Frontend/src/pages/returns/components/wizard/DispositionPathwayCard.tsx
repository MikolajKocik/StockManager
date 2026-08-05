import React from 'react';
import { Badge, Button } from '@/components/common';
import type { DispositionAction } from '@/models/rma';

export interface DispositionPathwayCardProps {
    actionKey: DispositionAction;
    title: string;
    pathwayLabel: string;
    description: string;
    badgeVariant: 'emerald' | 'brand' | 'danger';
    isSelected: boolean;
    onSelect: (action: DispositionAction) => void;
}

export const DispositionPathwayCard: React.FC<DispositionPathwayCardProps> = ({
    actionKey,
    title,
    pathwayLabel,
    description,
    badgeVariant,
    isSelected,
    onSelect
}) => {
    const cardStyles = isSelected
        ? badgeVariant === 'emerald'
            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
            : badgeVariant === 'brand'
            ? 'bg-[#2b6675]/10 border-[#2b6675] ring-2 ring-[#2b6675]/20'
            : 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20'
        : 'bg-white border-slate-200 opacity-70';

    return (
        <div className={`p-3 rounded border flex flex-col justify-between ${cardStyles}`}>
            <div>
                <Badge variant={badgeVariant} className="mb-1 text-xs">{pathwayLabel}</Badge>
                <h5 className="font-bold text-slate-900 mt-1">{title}</h5>
                <p className="text-xs text-slate-600 mt-1 font-sans">
                    {description}
                </p>
            </div>
            <Button
                size="sm"
                variant={
                    isSelected
                        ? (badgeVariant === 'emerald' ? 'success' : badgeVariant === 'brand' ? 'primary' : 'danger')
                        : 'outline'
                }
                className="mt-3 w-full text-xs"
                onClick={() => onSelect(actionKey)}
            >
                Select {pathwayLabel}
            </Button>
        </div>
    );
};
