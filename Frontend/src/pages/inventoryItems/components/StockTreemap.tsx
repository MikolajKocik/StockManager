import React, { useState, useMemo } from 'react';
import type { StockTreemapNode } from '../models/stockTreemap';
import { computeTreemapLayout } from '../utils/treemapLayout';
import { formatCurrency, formatNumber } from '@/utils/format';
import { Button } from '@/components/common/core';
import { Badge } from '@/components/common/custom';

interface StockTreemapProps {
    data: StockTreemapNode[];
    onSelectNode: (node: StockTreemapNode) => void;
    selectedNodeId: string | null;
}

interface RotationTheme {
    bg: string;
    border: string;
    headerBg: string;
    tagBg: string;
    badge: 'danger' | 'warning' | 'success' | 'brand';
    label: string;
}

const ROTATION_THEME_MAP: Record<string, RotationTheme> = {
    'DEAD_STOCK': {
        bg: 'bg-red-50/90',
        border: 'border-red-400 hover:border-red-600',
        headerBg: 'bg-red-100 text-red-900 border-red-200',
        tagBg: 'bg-red-600 text-white',
        badge: 'danger',
        label: 'DEAD STOCK (>90d)'
    },
    'SLOW': {
        bg: 'bg-amber-50/80',
        border: 'border-amber-400 hover:border-amber-600',
        headerBg: 'bg-amber-100/90 text-amber-900 border-amber-200',
        tagBg: 'bg-amber-600 text-white',
        badge: 'warning',
        label: 'SLOW (60-90d)'
    },
    'FAST': {
        bg: 'bg-emerald-50/80',
        border: 'border-emerald-400 hover:border-emerald-600',
        headerBg: 'bg-emerald-100/90 text-emerald-900 border-emerald-200',
        tagBg: 'bg-emerald-600 text-white',
        badge: 'success',
        label: 'FAST ROTATION'
    },
    'OPTIMAL': {
        bg: 'bg-[#f0f7f8]/90',
        border: 'border-[#2b6675]/40 hover:border-[#2b6675]',
        headerBg: 'bg-[#2b6675]/15 text-[#2b6675] border-[#2b6675]/30',
        tagBg: 'bg-[#2b6675] text-white',
        badge: 'brand',
        label: 'OPTIMAL (25-60d)'
    }
};

const DEFAULT_THEME: RotationTheme = ROTATION_THEME_MAP['OPTIMAL'];

export const StockTreemap: React.FC<StockTreemapProps> = ({
    data,
    onSelectNode,
    selectedNodeId
}) => {
    // Navigation stack for drilldown
    const [path, setPath] = useState<StockTreemapNode[]>([]);
    const [hoveredNode, setHoveredNode] = useState<StockTreemapNode | null>(null);

    // Current active items to display in treemap
    const currentItems = useMemo(() => {
        if (path.length === 0) return data;
        const currentParent = path[path.length - 1];
        return currentParent.children || [];
    }, [data, path]);

    // Bounding canvas dimensions
    const width = 1000;
    const height = 540;

    const layoutRects = useMemo(() => {
        return computeTreemapLayout(currentItems, width, height, 8);
    }, [currentItems, width, height]);

    const handleDrillDown = (node: StockTreemapNode) => {
        if (node.children && node.children.length > 0) {
            setPath(prev => [...prev, node]);
        }
        onSelectNode(node);
    };

    const handleBreadcrumbClick = (index: number) => {
        if (index === -1) {
            setPath([]);
        } else {
            setPath(prev => prev.slice(0, index + 1));
        }
    };

    return (
        <section className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs space-y-3">
            {/* Breadcrumb Navigation Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200">
                <nav className="flex items-center gap-1.5 text-xs font-mono">
                    <button
                        onClick={() => handleBreadcrumbClick(-1)}
                        className={`font-bold hover:underline transition-colors ${
                            path.length === 0 ? 'text-[#2b6675]' : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        WAREHOUSE STOCK (ALL)
                    </button>
                    {path.map((item, idx) => (
                        <React.Fragment key={item.id}>
                            <span className="text-slate-400">/</span>
                            <button
                                onClick={() => handleBreadcrumbClick(idx)}
                                className={`font-bold hover:underline transition-colors ${
                                    idx === path.length - 1 ? 'text-[#2b6675]' : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                {item.name.toUpperCase()}
                            </button>
                        </React.Fragment>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    {path.length > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBreadcrumbClick(path.length - 2)}
                            className="text-[0.6875rem] py-0.5"
                        >
                            Up One Level
                        </Button>
                    )}
                    <span className="text-xs text-slate-500 font-mono">
                        {currentItems.length} {path.length === 0 ? 'Categories' : path.length === 1 ? 'Subcategories' : 'Products'}
                    </span>
                </div>
            </div>

            {/* Treemap Visualization Container */}
            <div className="relative w-full overflow-hidden bg-slate-100/60 rounded-md border border-slate-200 p-1">
                <div
                    className="relative w-full"
                    style={{ height: '33.75rem' }}
                >
                    {layoutRects.map(({ node, x, y, width: w, height: h }) => {
                        const isSelected = selectedNodeId === node.id;
                        const isHovered = hoveredNode?.id === node.id;
                        const theme = ROTATION_THEME_MAP[node.rotationStatus] || DEFAULT_THEME;
                        const hasChildren = Boolean(node.children && node.children.length > 0);

                        return (
                            <div
                                key={node.id}
                                onClick={() => handleDrillDown(node)}
                                onMouseEnter={() => setHoveredNode(node)}
                                onMouseLeave={() => setHoveredNode(null)}
                                className={`absolute rounded-md border p-2 flex flex-col justify-between cursor-pointer transition-all duration-150 select-none overflow-hidden ${
                                    theme.bg
                                } ${theme.border} ${
                                    isSelected
                                        ? 'ring-2 ring-[#2b6675] shadow-lg z-20 scale-[0.995]'
                                        : isHovered
                                        ? 'shadow-md z-10 scale-[0.998]'
                                        : 'shadow-2xs'
                                }`}
                                style={{
                                    left: `${(x / width) * 100}%`,
                                    top: `${(y / height) * 100}%`,
                                    width: `${(w / width) * 100}%`,
                                    height: `${(h / height) * 100}%`
                                }}
                            >
                                {/* Top Header of Rectangle */}
                                <div className="flex items-start justify-between gap-1 overflow-hidden">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-xs text-slate-900 truncate block">
                                                {node.name}
                                            </span>
                                            {hasChildren && (
                                                <span className="text-[0.625rem] text-slate-500 font-mono shrink-0">
                                                    ({node.children?.length} items)
                                                </span>
                                            )}
                                        </div>
                                        {node.sku && (
                                            <span className="text-[0.625rem] font-mono text-slate-500 block truncate">
                                                SKU: {node.sku} &bull; {node.binLocation || 'Rack A'}
                                            </span>
                                        )}
                                    </div>

                                    <Badge
                                        variant={theme.badge}
                                        className="text-[0.5625rem] px-1 py-0 shrink-0 uppercase"
                                    >
                                        {theme.label}
                                    </Badge>
                                </div>

                                {/* Center: Key Capital Value */}
                                <div className="my-auto py-1">
                                    <div className="font-mono font-black text-sm sm:text-base text-slate-900 tracking-tight">
                                        {formatCurrency(node.value)}
                                    </div>
                                    <div className="text-[0.6875rem] text-slate-600 font-mono">
                                        {formatNumber(node.quantityOnHand)} units on hand
                                    </div>
                                </div>

                                {/* Bottom Metadata & Action hint */}
                                <div className="flex items-center justify-between text-[0.625rem] text-slate-500 border-t border-slate-300/40 pt-1">
                                    <span className="font-mono">
                                        Turnover: <strong className="text-slate-800">{node.turnoverDays}d</strong>
                                    </span>
                                    <span className="font-semibold text-[#2b6675] hover:underline">
                                        {hasChildren ? 'Drill Down \u2192' : 'Inspect SKU \u2192'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Helper / Info footer */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 px-1 pt-1">
                <span>
                    Click on any category box to drill down into subcategories and identify stagnant inventory.
                </span>
                <span className="font-mono text-[0.6875rem]">
                    Box Area = Capital Value (PLN) &bull; Color = Stock Rotation Speed
                </span>
            </div>
        </section>
    );
};
