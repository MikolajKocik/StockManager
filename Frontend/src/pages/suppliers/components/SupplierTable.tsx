import React from 'react';
import type { Supplier } from '@/models/supplier';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Button } from '@/components/common';

interface SupplierTableProps {
    suppliers: Supplier[];
    onSort: (field: keyof Supplier) => void;
    onViewDetails: (supplier: Supplier) => void;
    onEdit: (supplier: Supplier) => void;
    onDelete: (supplier: Supplier) => void;
}

export const SupplierTable: React.FC<SupplierTableProps> = ({
    suppliers,
    onSort,
    onViewDetails,
    onEdit,
    onDelete
}) => {
    return (
        <Table className="shadow-2xs">
            <TableHead>
                <TableRow>
                    <TableHeaderCell isFiltered onClick={() => onSort('id')}>
                        Vendor Code
                    </TableHeaderCell>
                    <TableHeaderCell isFiltered onClick={() => onSort('name')}>
                        Company Name
                    </TableHeaderCell>
                    <TableHeaderCell isFiltered onClick={() => onSort('address')}>
                        Origin Location
                    </TableHeaderCell>
                    <TableHeaderCell>
                        Contact Person & Channel
                    </TableHeaderCell>
                    <TableHeaderCell isFiltered onClick={() => onSort('leadTimeDays')}>
                        Terms & SLA
                    </TableHeaderCell>
                    <TableHeaderCell isFiltered onClick={() => onSort('rating')}>
                        Score & SKUs
                    </TableHeaderCell>
                    <TableHeaderCell isFiltered onClick={() => onSort('status')}>
                        Status
                    </TableHeaderCell>
                    <TableHeaderCell className="text-right">
                        Actions
                    </TableHeaderCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {suppliers.length > 0 ? (
                    suppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                            {/* Vendor Code */}
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-mono font-bold text-xs text-slate-900">
                                        #{supplier.id}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        {supplier.slug}
                                    </span>
                                </div>
                            </TableCell>

                            {/* Company Name & Tax ID */}
                            <TableCell>
                                <div className="flex flex-col">
                                    <button
                                        type="button"
                                        onClick={() => onViewDetails(supplier)}
                                        className="text-left font-bold text-xs text-slate-900 hover:text-[#2b6675] transition-colors cursor-pointer"
                                    >
                                        {supplier.name}
                                    </button>
                                    {supplier.taxId && (
                                        <span className="text-[10px] text-slate-500 font-mono">
                                            Tax: {supplier.taxId}
                                        </span>
                                    )}
                                </div>
                            </TableCell>

                            {/* Origin Location */}
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-xs text-slate-800">
                                        {supplier.address?.city || 'N/A'}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                        {supplier.address?.country || 'USA'}
                                    </span>
                                </div>
                            </TableCell>

                            {/* Contact Person & Channel */}
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-xs text-slate-800">
                                        {supplier.contactPerson || 'Procurement Office'}
                                    </span>
                                    <span className="text-[10px] text-slate-500 truncate max-w-48">
                                        {supplier.email || supplier.phone || 'No direct contact'}
                                    </span>
                                </div>
                            </TableCell>

                            {/* Terms & SLA */}
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-xs text-slate-800">
                                        {supplier.paymentTerms || 'Net 30'}
                                    </span>
                                    <span className="text-[10px] text-slate-600 font-medium">
                                        {supplier.leadTimeDays ? `${supplier.leadTimeDays}d lead time` : '5d lead time'}
                                    </span>
                                </div>
                            </TableCell>

                            {/* Score & SKUs */}
                            <TableCell>
                                <div className="flex items-center gap-1.5 font-mono">
                                    <span className="font-bold text-xs text-slate-900">
                                        ★ {supplier.rating || 4.8}
                                    </span>
                                    <span className="text-[11px] text-slate-500 font-sans font-medium">
                                        ({supplier.activeItemsCount || 0} SKUs)
                                    </span>
                                </div>
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                                    supplier.status === 'Active'
                                        ? 'text-[#0e5f32]'
                                        : supplier.status === 'Under Review'
                                            ? 'text-[#8f7d49]'
                                            : 'text-slate-500'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                        supplier.status === 'Active'
                                            ? 'bg-[#0e5f32]'
                                            : supplier.status === 'Under Review'
                                                ? 'bg-[#AA9559]'
                                                : 'bg-slate-400'
                                    }`} />
                                    {supplier.status || 'Active'}
                                </span>
                            </TableCell>

                            {/* Actions */}
                            <TableCell className="text-right">
                                <div className="inline-flex items-center gap-1.5">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => onViewDetails(supplier)}
                                    >
                                        Details
                                    </Button>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        onClick={() => onEdit(supplier)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => onDelete(supplier)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-slate-500 font-medium">
                            No suppliers matched the current filters.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
