import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?:
    | 'brand'
    | 'blue'
    | 'purple'
    | 'amber'
    | 'emerald'
    | 'orange'
    | 'indigo'
    | 'rose'
    | 'slate'
    | 'success'
    | 'warning'
    | 'info'
    | 'danger'
    | 'neutral';
    className?: string;
    children: React.ReactNode;
}

export function Badge({ variant = 'neutral', className = '', children, ...props }: BadgeProps) {
    const variants: Record<string, string> = {
        brand: 'bg-[#2b6675]/15 text-[#2b6675] border-[#2b6675]/40',
        blue: 'blue',
        purple: 'purple',
        amber: 'amber',
        emerald: 'emerald',
        orange: 'orange',
        indigo: 'indigo',
        rose: 'rose',
        slate: 'slate',
        success: 'emerald',
        warning: 'orange',
        info: 'indigo',
        danger: 'rose',
        neutral: 'slate',
    };

    const isCustomClass = variant === 'brand';

    return (
        <span 
            className={`px-1.5 py-0.5 rounded-xs text-[10px] font-bold font-mono uppercase tracking-tight border ${isCustomClass ? variants[variant] : (variants[variant] || 'slate')} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
}
