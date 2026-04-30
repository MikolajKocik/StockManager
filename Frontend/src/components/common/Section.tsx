import React from 'react';
import './Section.css';

interface SectionProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'card';
}

export const Section: React.FC<SectionProps> = ({ 
    title, 
    children, 
    className = '',
    variant = 'default' 
}) => {
    return (
        <section className={`common-section section-${variant} ${className}`}>
            {title && <h3 className="section-title">{title}</h3>}
            <div className="section-content">
                {children}
            </div>
        </section>
    );
};
