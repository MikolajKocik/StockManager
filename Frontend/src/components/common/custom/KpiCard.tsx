import React from 'react';

export interface KpiCardProps {
    title: string;
    value: React.ReactNode;
    subtitle?: string;
    badge?: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary';
    className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
    title,
    value,
    subtitle,
    badge,
    variant = 'default',
    className = ''
}) => {
    const valueColors: Record<string, string> = {
        default: 'text-slate-900',
        success: 'text-[#0e5f32]',
        warning: 'text-[#8f7d49]',
        danger: 'text-[#991b1b]',
        primary: 'text-[#2b6675]',
    };

    return (
        <div className={`bg-white border border-slate-300 rounded-md p-3 shadow-2xs flex flex-col justify-between ${className}`}>
            <div className="flex items-center justify-between gap-1">
                <span className="text-[0.6875rem] font-bold text-slate-600 uppercase tracking-wider font-mono">
                    {title}
                </span>
                {badge}
            </div>
            <div className="flex items-baseline justify-between mt-2">
                <span className={`text-xl font-bold font-mono ${valueColors[variant] || 'text-slate-900'}`}>
                    {value}
                </span>
                {subtitle && (
                    <span className="text-xs text-slate-500 font-medium">
                        {subtitle}
                    </span>
                )}
            </div>
        </div>
    );
};
