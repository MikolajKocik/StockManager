import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?:
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

    return (
        <span 
            className={`px-1.5 py-0.5 rounded-xs text-[10px] font-bold font-mono uppercase tracking-tight border ${variants[variant] || 'slate'} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
}