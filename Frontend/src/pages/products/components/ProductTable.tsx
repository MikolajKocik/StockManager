import React from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Badge } from '@/components/common';
import { formatDate, formatNumber, formatValue } from '@/utils/format';
import type { Product } from '@/models/product';

interface ProductTableProps {
    products: Product[];
    getProductStock: (productId: number) => number;
    activeSort: string | null;
    sortAsc: boolean;
    onSort: (key: string) => void;
    onOpenDetails: (id: number) => void;
    onOpenEdit: (id: number) => void;
    onOpenDelete: (id: number) => void;
    isDeleting?: boolean;
}

export const ProductTable: React.FC<ProductTableProps> = ({
    products,
    getProductStock,
    activeSort,
    sortAsc,
    onSort,
    onOpenDetails,
    onOpenEdit,
    onOpenDelete,
    isDeleting
}) => {
    return (
        <div className="bg-white border border-slate-300 rounded-lg shadow-2xs overflow-hidden">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeaderCell
                            isFiltered={activeSort === 'id'}
                            onClick={() => onSort('id')}
                        >
                            ID {activeSort === 'id' && (sortAsc ? '↑' : '↓')}
                        </TableHeaderCell>
                        <TableHeaderCell
                            isFiltered={activeSort === 'name'}
                            onClick={() => onSort('name')}
                        >
                            Product Name {activeSort === 'name' && (sortAsc ? '↑' : '↓')}
                        </TableHeaderCell>
                        <TableHeaderCell
                            isFiltered={activeSort === 'genre'}
                            onClick={() => onSort('genre')}
                        >
                            Category
                        </TableHeaderCell>
                        <TableHeaderCell
                            isFiltered={activeSort === 'unit'}
                            onClick={() => onSort('unit')}
                        >
                            Unit
                        </TableHeaderCell>
                        <TableHeaderCell
                            isFiltered={activeSort === 'stock'}
                            onClick={() => onSort('stock')}
                            className="text-right"
                        >
                            Stock on Hand {activeSort === 'stock' && (sortAsc ? '↑' : '↓')}
                        </TableHeaderCell>
                        <TableHeaderCell
                            isFiltered={activeSort === 'expirationDate'}
                            onClick={() => onSort('expirationDate')}
                        >
                            Exp. Date
                        </TableHeaderCell>
                        <TableHeaderCell>Delivered</TableHeaderCell>
                        <TableHeaderCell>Batch No.</TableHeaderCell>
                        <TableHeaderCell>Supplier</TableHeaderCell>
                        <TableHeaderCell className="text-center">Actions</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} className="text-center py-10 text-slate-400 italic">
                                No products found matching the current criteria.
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.map(p => {
                            const stock = getProductStock(p.id);
                            return (
                                <TableRow key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                    <TableCell className="font-mono font-bold text-slate-700">
                                        #{p.id}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900 leading-tight">
                                                {p.name}
                                            </span>
                                            {p.slug && (
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    {p.slug}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="slate">
                                            {formatValue(p.genre)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell variant="code">
                                        {p.unit}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className={`font-mono font-bold text-xs ${
                                            stock > 0 ? 'text-[#0e5f32]' : 'text-[#991b1b]'
                                        }`}>
                                            {formatNumber(stock)} {p.unit}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-600 font-medium">
                                        {formatDate(p.expirationDate)}
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        {formatDate(p.deliveredAt)}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-slate-600">
                                        {formatValue(p.batchNumber)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-800 text-xs">
                                                {formatValue(p.supplierName)}
                                            </span>
                                            {p.supplierId && (
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    ID: {p.supplierId}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center items-center gap-1.5">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => onOpenDetails(p.id)}
                                            >
                                                Details
                                            </Button>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                onClick={() => onOpenEdit(p.id)}
                                            >
                                                Edit
                                            </Button>
                                            {stock <= 0 && (
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => onOpenDelete(p.id)}
                                                    disabled={isDeleting}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
