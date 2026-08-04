import React from 'react';
import type { NodeType, NodeSubtype } from '../models/reorderNode';

interface NodePaletteProps {
    onAddNode: (type: NodeType, subtype: NodeSubtype) => void;
}

interface PaletteItem {
    type: NodeType;
    subtype: NodeSubtype;
    title: string;
    description: string;
    themeClass: string;
    badgeText: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
    // Triggers
    {
        type: 'TRIGGER',
        subtype: 'STOCK_THRESHOLD',
        title: 'Stock Level < X',
        description: 'Triggers workflow when on-hand stock drops below custom threshold.',
        themeClass: 'border-amber-400 bg-amber-50/70 hover:border-amber-600',
        badgeText: 'TRIGGER'
    },
    {
        type: 'TRIGGER',
        subtype: 'SAFETY_STOCK_BREACH',
        title: 'Safety Stock Breach',
        description: 'Detects breach of critical reserve buffer on assigned warehouse bin.',
        themeClass: 'border-amber-400 bg-amber-50/70 hover:border-amber-600',
        badgeText: 'TRIGGER'
    },
    // Conditions
    {
        type: 'CONDITION',
        subtype: 'SALES_VELOCITY_CHECK',
        title: 'Verify Velocity (N Days)',
        description: 'Calculates average daily consumption over the trailing N days.',
        themeClass: 'border-[#2b6675]/50 bg-[#f0f7f8]/80 hover:border-[#2b6675]',
        badgeText: 'CONDITION'
    },
    {
        type: 'CONDITION',
        subtype: 'SUPPLIER_MOQ_CHECK',
        title: 'Verify Supplier MOQ',
        description: 'Validates order quantity against vendor minimum order requirements.',
        themeClass: 'border-[#2b6675]/50 bg-[#f0f7f8]/80 hover:border-[#2b6675]',
        badgeText: 'CONDITION'
    },
    {
        type: 'CONDITION',
        subtype: 'PROFIT_MARGIN_CHECK',
        title: 'Verify Margin > X%',
        description: 'Ensures target replenishment items meet minimum gross margin %.',
        themeClass: 'border-[#2b6675]/50 bg-[#f0f7f8]/80 hover:border-[#2b6675]',
        badgeText: 'CONDITION'
    },
    // Actions
    {
        type: 'ACTION',
        subtype: 'GENERATE_PO_DRAFT',
        title: 'Generate PO Draft',
        description: 'Creates a purchase order draft ready for buyer confirmation.',
        themeClass: 'border-emerald-400 bg-emerald-50/70 hover:border-emerald-600',
        badgeText: 'ACTION'
    },
    {
        type: 'ACTION',
        subtype: 'SEND_PROCUREMENT_ALERT',
        title: 'Alert Procurement Team',
        description: 'Dispatches instant alert to Slack/Teams/Email channel.',
        themeClass: 'border-emerald-400 bg-emerald-50/70 hover:border-emerald-600',
        badgeText: 'ACTION'
    },
    {
        type: 'ACTION',
        subtype: 'AUTO_APPROVE_PO',
        title: 'Auto-Approve PO (EDI)',
        description: 'Automatically approves and transmits PO via EDI to supplier.',
        themeClass: 'border-emerald-400 bg-emerald-50/70 hover:border-emerald-600',
        badgeText: 'ACTION'
    }
];

export const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
    return (
        <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs space-y-3">
            <div className="border-b border-slate-200 pb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                    BLOCK PALETTE (TOOLBOX)
                </span>
                <p className="text-xs text-slate-600">
                    Click any block to add it to your logic canvas.
                </p>
            </div>

            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                {PALETTE_ITEMS.map((item) => (
                    <div
                        key={item.subtype}
                        onClick={() => onAddNode(item.type, item.subtype)}
                        className={`p-2.5 rounded-md border text-left cursor-pointer transition-all duration-150 shadow-2xs hover:shadow-sm ${item.themeClass}`}
                    >
                        <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-bold text-xs text-slate-900 truncate">
                                {item.title}
                            </span>
                            <span className="text-[9px] font-mono font-bold px-1 py-0.5 rounded-xs bg-white/80 border border-slate-300 text-slate-700">
                                {item.badgeText}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-tight">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
