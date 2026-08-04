import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`bg-white border border-slate-300 rounded-lg shadow-2xs ${className}`} {...props}>
            {children}
        </div>
    );
};

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`px-4 py-3 border-b border-slate-200 flex items-center justify-between ${className}`} {...props}>
            {children}
        </div>
    );
};

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`p-4 ${className}`} {...props}>
            {children}
        </div>
    );
};

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between ${className}`} {...props}>
            {children}
        </div>
    );
};
