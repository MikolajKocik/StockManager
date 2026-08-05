import React from 'react';

const LEGEND_ITEMS = [
    { label: '< 50% Available', dotClass: 'bg-emerald-50 border-emerald-500' },
    { label: '50% - 89% Optimal', dotClass: 'bg-amber-50 border-amber-500' },
    { label: '≥ 90% Full / Critical', dotClass: 'bg-red-50 border-red-500' },
    { label: 'Maintenance / Service', dotClass: 'bg-slate-100 border-slate-500' },
] as const;

export const BinMapLegend: React.FC = () => {
    return (
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 px-1 pt-1 border-t border-slate-200">
            <div className="flex flex-wrap items-center gap-4">
                <span className="font-mono font-bold text-[0.625rem] uppercase text-slate-700">Heatmap Legend:</span>
                {LEGEND_ITEMS.map((item) => (
                    <span key={item.label} className="flex items-center gap-1.5 font-mono text-[0.6875rem]">
                        <span className={`w-3 h-3 rounded-xs border ${item.dotClass}`}></span>
                        {item.label}
                    </span>
                ))}
            </div>
            <span className="text-slate-400 font-mono text-[0.6875rem] hidden sm:inline">
                Click on any rack to inspect and dispatch SKU orders
            </span>
        </div>
    );
};
