import React from 'react';

export interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'card' | 'subtle' | 'form';
    rightAction?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ 
    title, 
    subtitle, 
    children, 
    className = '',
    variant = 'default',
    rightAction,
    ...props
}) => {
    const variantStyles = {
        default: 'space-y-2',
        form: 'space-y-2',
        card: 'bg-white border border-slate-300 rounded-lg p-4 shadow-2xs space-y-3',
        subtle: 'bg-slate-50/80 border border-slate-300 rounded-md p-3 space-y-3',
    };

    return (
        <section className={`${variantStyles[variant]} ${className}`} {...props}>
            {(title || rightAction) && (
                <div className="flex items-center justify-between mb-1.5">
                    <div>
                        {title && (
                            <span className="font-bold text-[0.6875rem] text-slate-600 uppercase tracking-wider block font-mono">
                                {title}
                            </span>
                        )}
                        {subtitle && (
                            <span className="text-[0.6875rem] text-slate-500 block">
                                {subtitle}
                            </span>
                        )}
                    </div>
                    {rightAction && <div>{rightAction}</div>}
                </div>
            )}
            {children}
        </section>
    );
};
