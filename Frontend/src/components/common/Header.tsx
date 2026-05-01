import React from 'react';
import './Header.css';

interface HeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    className?: string;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    subtitle,
    actions,
    className = ''
}) => {
    return (
        <header className={`page-header ${className}`}>
            <div className="header-content">
                <h1>{title}</h1>
                {subtitle && <p className="header-subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="header-actions">{actions}</div>}
        </header>
    );
};