import React from 'react';
import type { StockTreemapNode } from '../models/stockTreemap';
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, Button } from '@/components/common/core';
import { Badge } from '@/components/common/custom';
import { formatCurrency, formatNumber } from '@/utils/format';

interface StockTableViewProps {
    data: StockTreemapNode[];
    onSelectNode: (node: StockTreemapNode) => void;
}

const ROTATION_BADGE_MAP: Record<string, 'danger' | 'warning' | 'success' | 'brand'> = {
    'DEAD_STOCK': 'danger',
    'SLOW': 'warning',
    'FAST': 'success',
    'NORMAL': 'brand'
};

const ROTATION_LABEL_MAP: Record<string, string> = {
    'DEAD_STOCK': 'DEAD STOCK',
    'SLOW': 'SLOW ROTATION',
    'FAST': 'FAST MOVING',
    'NORMAL': 'OPTIMAL'
};

export const StockTableView: React.FC<StockTableViewProps> = ({ data, onSelectNode }) => {
    // Flatten products from categories
    const allProducts: StockTreemapNode[] = [];

    const extractProducts = (nodes: StockTreemapNode[]) => {
        nodes.forEach(node => {
            if (node.level === 'product') {
                allProducts.push(node);
            }
            if (node.children) {
                extractProducts(node.children);
            }
        });
    };

    extractProducts(data);

    return (
        <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-xs">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>SKU / Name</TableHeaderCell>
                        <TableHeaderCell>Category</TableHeaderCell>
                        <TableHeaderCell>Warehouse Bin</TableHeaderCell>
                        <TableHeaderCell>Stock Qty</TableHeaderCell>
                        <TableHeaderCell>Unit Cost</TableHeaderCell>
                        <TableHeaderCell>Total Capital</TableHeaderCell>
                        <TableHeaderCell>Turnover Age</TableHeaderCell>
                        <TableHeaderCell>Rotation Status</TableHeaderCell>
                        <TableHeaderCell>Action</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allProducts.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <div className="space-y-0.5">
                                    <span className="font-bold text-slate-900 block text-xs">{item.name}</span>
                                    <span className="font-mono text-[10px] text-slate-500">{item.sku}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-xs font-mono">{item.category}</TableCell>
                            <TableCell className="text-xs font-mono font-semibold">{item.binLocation || 'BIN-01'}</TableCell>
                            <TableCell className="text-xs font-mono">{formatNumber(item.quantityOnHand)} pcs</TableCell>
                            <TableCell className="text-xs font-mono">{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell className="text-xs font-mono font-bold text-slate-900">{formatCurrency(item.value)}</TableCell>
                            <TableCell className="text-xs font-mono font-bold">
                                <span className={item.rotationStatus === 'DEAD_STOCK' ? 'text-red-700' : 'text-slate-800'}>
                                    {item.turnoverDays} days
                                </span>
                            </TableCell>
                            <TableCell>
                                <Badge variant={ROTATION_BADGE_MAP[item.rotationStatus] || 'brand'}>
                                    {ROTATION_LABEL_MAP[item.rotationStatus] || item.rotationStatus}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onSelectNode(item)}
                                >
                                    Inspect
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
