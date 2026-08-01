import React from 'react';

export const BinMapLegend: React.FC = () => {
    return (
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 px-1 pt-1 border-t border-slate-200">
            <div className="flex flex-wrap items-center gap-4">
                <span className="font-semibold text-slate-700">Heatmap Legend:</span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-sm inline-block" style={{ backgroundColor: '#9BB477' }}></span>
                    &lt; 50% Available
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-sm inline-block" style={{ backgroundColor: '#D4B85E' }}></span>
                    50% - 89% Optimal
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-sm inline-block" style={{ backgroundColor: '#CC6557' }}></span>
                    &ge; 90% Full / Critical
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-sm inline-block" style={{ backgroundColor: '#8E959B' }}></span>
                    Maintenance / Incident
                </span>
            </div>
            <span className="text-slate-400 italic hidden sm:inline">Click on any rack to inspect and dispatch</span>
        </div>
    );
};
