import React from 'react';
import type { Customer } from '@/models/customer';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Button } from '@/components/common';

interface CustomerTableProps {
    customers: Customer[];
    onSort: (field: keyof Customer) => void;
    onViewDetails: (customer: Customer) => void;
    onEdit: (customer: Customer) => void;
    onDelete: (customer: Customer) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
    customers,
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
                        Account Code
                    </TableHeaderCell>
                    <TableHeaderCell isFiltered onClick={() => onSort('name')}>
                        Company Name
                    </TableHeaderCell>
                    <TableHeaderCell isFiltered onClick={() => onSort('address')}>
                        Jurisdiction / City
                    </TableHeaderCell>
                    <TableHeaderCell>
                        Contact Person & Channel
                    </TableHeaderCell>
                    <TableHeaderCell isFiltered onClick={() => onSort('segment')}>
                        Segment
                    </TableHeaderCell>
                    <TableHeaderCell isFiltered onClick={() => onSort('creditLimit')}>
                        Credit & Billing
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
                {customers.length > 0 ? (
                    customers.map((customer) => (
                        <TableRow key={customer.id}>
                            {/* Account Code */}
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-mono font-bold text-xs text-slate-900">
                                        #{customer.id}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        {customer.code || `CUST-00${customer.id}`}
                                    </span>
                                </div>
                            </TableCell>

                            {/* Company Name & Tax ID */}
                            <TableCell>
                                <div className="flex flex-col">
                                    <button
                                        type="button"
                                        onClick={() => onViewDetails(customer)}
                                        className="text-left font-bold text-xs text-slate-900 hover:text-[#2b6675] transition-colors cursor-pointer"
                                    >
                                        {customer.name}
                                    </button>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        Tax ID: {customer.taxId || 'N/A'}
                                    </span>
                                </div>
                            </TableCell>

                            {/* Jurisdiction / City */}
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-xs text-slate-800">
                                        {customer.address?.city || 'N/A'}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                        {customer.address?.country || 'Poland'}
                                    </span>
                                </div>
                            </TableCell>

                            {/* Contact Person & Channel */}
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-xs text-slate-800">
                                        {customer.contactPerson || 'Procurement Contact'}
                                    </span>
                                    <span className="text-[10px] text-slate-500 truncate max-w-48">
                                        {customer.email || customer.phone || 'No direct contact'}
                                    </span>
                                </div>
                            </TableCell>

                            {/* Segment */}
                            <TableCell>
                                <span className="font-semibold font-mono text-[11px] text-slate-700 bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded-xs">
                                    {customer.segment || 'Enterprise'}
                                </span>
                            </TableCell>

                            {/* Credit & Billing */}
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-mono font-semibold text-xs text-slate-900">
                                        Limit: €{(customer.creditLimit || 50000).toLocaleString()}
                                    </span>
                                    <span className="text-[10px] text-slate-600 font-medium font-mono">
                                        Spent: €{(customer.totalSpent || 0).toLocaleString()}
                                    </span>
                                </div>
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                                    customer.status === 'Active' || !customer.status
                                        ? 'text-[#0e5f32]'
                                        : customer.status === 'Pending'
                                            ? 'text-[#8f7d49]'
                                            : 'text-slate-500'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                        customer.status === 'Active' || !customer.status
                                            ? 'bg-[#0e5f32]'
                                            : customer.status === 'Pending'
                                                ? 'bg-[#AA9559]'
                                                : 'bg-slate-400'
                                    }`} />
                                    {customer.status || 'Active'}
                                </span>
                            </TableCell>

                            {/* Actions */}
                            <TableCell className="text-right">
                                <div className="inline-flex items-center gap-1.5">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => onViewDetails(customer)}
                                    >
                                        Details
                                    </Button>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        onClick={() => onEdit(customer)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => onDelete(customer)}
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
                            No customer accounts matched the current filters.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
