import React from 'react';
import { Badge } from './Badge';

export interface WizardStep {
    id: number | string;
    title: string;
    description?: string;
    badgeText?: string;
}

export interface WizardStepperProps {
    steps: WizardStep[];
    currentStepIndex: number;
    onStepClick?: (stepIndex: number) => void;
    className?: string;
}

export const WizardStepper: React.FC<WizardStepperProps> = ({
    steps,
    currentStepIndex,
    onStepClick,
    className = ''
}) => {
    return (
        <div className={`w-full bg-white border border-slate-300 rounded-lg p-3 shadow-2xs ${className}`}>
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
                {steps.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    const isUpcoming = idx > currentStepIndex;
                    const isClickable = onStepClick && isCompleted;

                    return (
                        <React.Fragment key={step.id}>
                            <button
                                type="button"
                                disabled={!isClickable}
                                onClick={() => isClickable && onStepClick(idx)}
                                className={`flex-1 text-left p-2.5 rounded-md transition-all flex items-start gap-3 border ${
                                    isCurrent
                                        ? 'bg-[#2b6675]/10 border-[#2b6675] ring-1 ring-[#2b6675]/30'
                                        : isCompleted
                                        ? 'bg-emerald-50/60 border-emerald-300 hover:bg-emerald-50 cursor-pointer'
                                        : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                                }`}
                            >
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 select-none ${
                                        isCurrent
                                            ? 'bg-[#2b6675] text-white'
                                            : isCompleted
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-300 text-slate-700'
                                    }`}
                                >
                                    {isCompleted ? 'OK' : idx + 1}
                                </div>

                                <div className="space-y-0.5 min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span
                                            className={`text-xs font-bold font-mono tracking-tight truncate ${
                                                isCurrent
                                                    ? 'text-[#2b6675]'
                                                    : isCompleted
                                                    ? 'text-emerald-900'
                                                    : 'text-slate-600'
                                            }`}
                                        >
                                            {step.title}
                                        </span>
                                        {step.badgeText && (
                                            <Badge
                                                variant={isCurrent ? 'brand' : isCompleted ? 'emerald' : 'slate'}
                                            >
                                                {step.badgeText}
                                            </Badge>
                                        )}
                                    </div>
                                    {step.description && (
                                        <p className="text-xs text-slate-500 truncate leading-tight">
                                            {step.description}
                                        </p>
                                    )}
                                </div>
                            </button>

                            {idx < steps.length - 1 && (
                                <div
                                    className="hidden md:block w-4 h-0.5 bg-slate-300 shrink-0 self-center"
                                    aria-hidden="true"
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
