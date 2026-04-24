import React from 'react';
import './ChartContainer.css';

interface ChartContainerProps {
    title: string;
    children: React.ReactNode;
}

export default function ChartContainer({ title, children }: ChartContainerProps) {
    return (
        <div className="chart-container-card">
            <div className="chart-container-header">
                <h2 className="chart-container-title">{title}</h2>
            </div>
            <div className="chart-container-body">
                {children}
            </div>
        </div>
    );
}
