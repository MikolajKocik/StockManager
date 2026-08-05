import React from 'react';
import { Badge } from './Badge';

export interface TimelineNodeProps {
    id: string | number;
    title: string;
    timestamp: string;
    subtitle?: string;
    authorName?: string;
    authorRole?: string;
    actionBadgeText?: string;
    actionBadgeVariant?: 'brand' | 'blue' | 'purple' | 'amber' | 'emerald' | 'orange' | 'indigo' | 'rose' | 'slate';
    hash?: string;
    isSelected?: boolean;
    isLast?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
}

export const TimelineNode: React.FC<TimelineNodeProps> = ({
    title,
    timestamp,
    subtitle,
    authorName,
    authorRole,
    actionBadgeText,
    actionBadgeVariant = 'brand',
    hash,
    isSelected = false,
    isLast = false,
    onClick,
    children,
    className = ''
}) => {
    return (
        <div
            onClick={onClick}
            className={`relative flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none font-mono text-xs ${
                isSelected
                    ? 'bg-[#2b6675]/10 border-[#2b6675] shadow-xs ring-1 ring-[#2b6675]/40'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
            } ${className}`}
        >
            {/* Left Track & Indicator Node */}
            <div className="flex flex-col items-center self-stretch shrink-0 pt-0.5">
                <div
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-colors ${
                        isSelected
                            ? 'bg-[#2b6675] border-[#2b6675]'
                            : 'bg-white border-slate-400'
                    }`}
                />
                {!isLast && (
                    <div className="w-0.5 grow bg-slate-200 my-1 min-h-6" aria-hidden="true" />
                )}
            </div>

            {/* Content Body */}
            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                        {actionBadgeText && (
                            <Badge variant={actionBadgeVariant}>
                                {actionBadgeText}
                            </Badge>
                        )}
                        {hash && (
                            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                #{hash}
                            </span>
                        )}
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                        {timestamp}
                    </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 font-mono tracking-tight leading-snug">
                    {title}
                </h4>

                {subtitle && (
                    <p className="text-xs text-slate-600 leading-snug">
                        {subtitle}
                    </p>
                )}

                {(authorName || authorRole) && (
                    <div className="pt-1 text-xs text-slate-500 font-mono flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-slate-700">{authorName}</span>
                        {authorRole && <span className="text-slate-400">({authorRole})</span>}
                    </div>
                )}

                {children && <div className="pt-2">{children}</div>}
            </div>
        </div>
    );
};
