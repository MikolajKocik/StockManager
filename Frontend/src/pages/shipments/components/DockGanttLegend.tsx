import React from 'react';

const LEGEND_ITEMS = [
    { label: 'Inbound (PZ Deliveries)', colorClass: 'bg-[#f0f7f8] border-[#2b6675]/50', textClass: 'text-slate-700 font-semibold' },
    { label: 'Outbound (WZ Dispatches)', colorClass: 'bg-[#f8fafc] border-slate-400', textClass: 'text-slate-700 font-semibold' },
    { label: 'Loading / Action Active', colorClass: 'bg-amber-50 border-[#AA9559]', textClass: 'text-slate-700' },
    { label: 'Collision / Slot Conflict', colorClass: 'bg-red-50 border-red-400', textClass: 'font-bold text-red-700' },
] as const;

export const DockGanttLegend: React.FC = () => {
    return (
        <div className="bg-white border-t border-slate-300 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
            <div className="flex items-center gap-4 flex-wrap">
                <span className="font-bold text-slate-700 text-[10px] font-mono uppercase">Legend:</span>
                {LEGEND_ITEMS.map(item => (
                    <div key={item.label} className="flex items-center gap-1.5">
                        <span className={`w-3.5 h-3.5 rounded-xs border ${item.colorClass}`} />
                        <span className={`text-[11px] ${item.textClass}`}>{item.label}</span>
                    </div>
                ))}
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
                Drag blocks horizontally to reschedule or vertically to reallocate ramps
            </div>
        </div>
    );
};
