import React from 'react';

export interface HeaderProps {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    badge?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    subtitle,
    badge,
    actions,
    className = '',
    children
}) => {
    return (
        <header className={`bg-white border border-slate-300 rounded-lg p-4 shadow-2xs ${children ? 'space-y-3' : ''} ${className}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        {badge}
                        {typeof title === 'string' ? (
                            <h1 className="font-bold text-lg text-slate-900 leading-none">
                                {title}
                            </h1>
                        ) : (
                            title
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-xs text-slate-500">
                            {subtitle}
                        </p>
                    )}
                </div>
                {actions && (
                    <div className="flex items-center gap-2.5 flex-wrap">
                        {actions}
                    </div>
                )}
            </div>
            {children}
        </header>
    );
};
