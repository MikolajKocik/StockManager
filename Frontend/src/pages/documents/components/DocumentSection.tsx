import './DocumentSection.css'
import type { ReactNode } from 'react';

interface DocumentSectionProps {
    title: string;
    children: ReactNode;
}

export default function DocumentSection({ title, children }: DocumentSectionProps) {
    return (
        <section className="doc-section">
            <h2>{title}</h2>
            <div className="doc-grid">
                {children}
            </div>
        </section>
    )
}