import React from 'react';
import type { StockTreemapNode } from '../models/stockTreemap';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/format';
import { Badge, Button } from '@/components/common';

interface StockDetailsDrawerProps {
    node: StockTreemapNode | null;
    onClose: () => void;
    onAction: (actionType: string, node: StockTreemapNode) => void;
}

const ROTATION_BADGE_VARIANTS: Record<string, 'danger' | 'success' | 'brand'> = {
    DEAD_STOCK: 'danger',
    FAST: 'success',
    SLOW: 'brand',
    OPTIMAL: 'brand'
};

export const StockDetailsDrawer: React.FC<StockDetailsDrawerProps> = ({
    node,
    onClose,
    onAction
}) => {
    if (!node) return null;

    const isDeadStock = node.rotationStatus === 'DEAD_STOCK';

    return (
        <aside className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="space-y-0.5">
                    <span className="text-[0.625rem] font-mono font-bold uppercase tracking-wider text-slate-500">
                        {node.level.toUpperCase()} INSPECTOR
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">
                        {node.name}
                    </h3>
                </div>

                <div className="flex items-center gap-2">
                    <Badge
                        variant={ROTATION_BADGE_VARIANTS[node.rotationStatus] || 'brand'}
                    >
                        {node.rotationStatus}
                    </Badge>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 text-xs px-2 py-0.5"
                    >
                        Close
                    </Button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded p-2">
                    <span className="text-slate-500 text-[0.625rem] uppercase font-mono block">Frozen Capital</span>
                    <span className="font-bold font-mono text-slate-900 text-sm">{formatCurrency(node.value)}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded p-2">
                    <span className="text-slate-500 text-[0.625rem] uppercase font-mono block">Units on Hand</span>
                    <span className="font-bold font-mono text-slate-900 text-sm">{formatNumber(node.quantityOnHand)} pcs</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded p-2">
                    <span className="text-slate-500 text-[0.625rem] uppercase font-mono block">Unit Purchase Price</span>
                    <span className="font-bold font-mono text-slate-900 text-sm">{formatCurrency(node.unitPrice)}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded p-2">
                    <span className="text-slate-500 text-[0.625rem] uppercase font-mono block">Shelf Age (Turnover)</span>
                    <span className={`font-bold font-mono text-sm ${isDeadStock ? 'text-red-700' : 'text-slate-900'}`}>
                        {node.turnoverDays} Days
                    </span>
                </div>
            </div>

            {/* Additional details */}
            <div className="space-y-1.5 text-xs text-slate-700 border-t border-slate-200 pt-3">
                {node.sku && (
                    <div className="flex justify-between font-mono">
                        <span className="text-slate-500">Product SKU:</span>
                        <strong className="text-slate-900">{node.sku}</strong>
                    </div>
                )}
                {node.binLocation && (
                    <div className="flex justify-between font-mono">
                        <span className="text-slate-500">Warehouse Bin:</span>
                        <strong className="text-slate-900">{node.binLocation} ({node.warehouse})</strong>
                    </div>
                )}
                {node.marginPercent !== undefined && (
                    <div className="flex justify-between font-mono">
                        <span className="text-slate-500">Gross Margin:</span>
                        <strong className="text-slate-900">{formatPercent(node.marginPercent)}</strong>
                    </div>
                )}
            </div>

            {/* Warning if Dead Stock */}
            {isDeadStock && (
                <div className="bg-red-50 border border-red-200 rounded-md p-2.5 text-xs text-red-900 space-y-1">
                    <div className="font-bold text-red-800">
                        Stagnant Dead Stock Warning
                    </div>
                    <p className="text-[0.6875rem] leading-relaxed">
                        This item has spent <strong>{node.turnoverDays} days</strong> in storage without sufficient movement, locking <strong>{formatCurrency(node.value)}</strong> in working capital.
                    </p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                {isDeadStock ? (
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onAction('DISCOUNT_CLEARANCE', node)}
                        className="w-full"
                    >
                        Create Clearance / Promo Order (-25%)
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onAction('REORDER', node)}
                        className="w-full"
                    >
                        Schedule Reorder Flow
                    </Button>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAction('TRANSFER_BIN', node)}
                    className="w-full"
                >
                    Relocate to Secondary Bin
                </Button>
            </div>
        </aside>
    );
};
