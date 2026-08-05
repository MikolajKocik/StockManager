import React, { useState, useMemo } from 'react';
import { Button, Input, Select } from '@/components/common';
import type { Invoice } from '@/models/invoice';

interface InvoiceListProps {
    invoices: Invoice[];
    isLoading: boolean;
    onSelectInvoice: (id: number | string) => void;
    onNewInvoice: () => void;
}

export const INVOICE_LIST_STATUS_OPTIONS = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Issued', value: 'Issued' },
    { label: 'Paid', value: 'Paid' },
    { label: 'Draft', value: 'Draft' }
] as const;

const INVOICE_STATUS_STYLE: Record<string, string> = {
    'Paid': 'bg-emerald-100 text-emerald-800',
    'Issued': 'bg-blue-100 text-blue-800',
    'Draft': 'bg-amber-100 text-amber-800'
};

export const InvoiceList: React.FC<InvoiceListProps> = ({
    invoices,
    isLoading,
    onSelectInvoice,
    onNewInvoice
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            const matchesSearch = !searchTerm.trim() ||
                (inv.invoiceNumber || `FV-${inv.id}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
                (inv.buyerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (inv.buyerNip || '').includes(searchTerm);
            const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [invoices, searchTerm, statusFilter]);

    return (
        <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs space-y-4">
            <div className="flex flex-row justify-between items-center pb-3 border-b border-slate-200">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 leading-tight">
                        Invoice Archive
                    </h2>
                    <p className="text-xs text-slate-500">
                        History of issued sales, correction, and proforma invoices
                    </p>
                </div>
                <Button variant="primary" size="md" onClick={onNewInvoice}>
                    Issue New Invoice
                </Button>
            </div>

            <div className="space-y-3">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="w-64">
                        <Input
                            placeholder="Search by invoice number, tax ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="text-xs"
                        />
                    </div>
                    <div className="w-36">
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={INVOICE_LIST_STATUS_OPTIONS}
                            className="text-xs"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-slate-300 rounded">
                    <table className="w-full text-xs text-left border-collapse">
                        <thead>
                            <tr className="bg-[#2b6675] text-white font-bold border-b border-slate-300 text-[0.6875rem] uppercase">
                                <th className="py-2.5 px-3">Invoice Number</th>
                                <th className="py-2.5 px-3">Customer</th>
                                <th className="py-2.5 px-3">Issue Date</th>
                                <th className="py-2.5 px-3">Due Date</th>
                                <th className="py-2.5 px-3 text-center">Status</th>
                                <th className="py-2.5 px-3 text-right">Gross Amount</th>
                                <th className="py-2.5 px-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                                        Loading invoices...
                                    </td>
                                </tr>
                            ) : filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                                        No invoices match your search criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-2.5 px-3 font-bold text-slate-900 font-mono">
                                            {inv.invoiceNumber || `FV/2026/08/${String(inv.id).padStart(3, '0')}`}
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <span className="font-semibold text-slate-800 block">
                                                {inv.buyerName || 'Unknown Customer'}
                                            </span>
                                            {inv.buyerNip && (
                                                <span className="text-[0.625rem] text-slate-400 font-mono">
                                                    VAT: {inv.buyerNip}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2.5 px-3 text-slate-700 font-mono">
                                            {inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString('en-US') : '-'}
                                        </td>
                                        <td className="py-2.5 px-3 text-slate-700 font-mono">
                                            {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-US') : '-'}
                                        </td>
                                        <td className="py-2.5 px-3 text-center">
                                            <span
                                                className={`text-[0.625rem] font-bold px-2 py-0.5 rounded uppercase ${INVOICE_STATUS_STYLE[inv.status] || 'bg-slate-100 text-slate-800'}`}
                                            >
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                                            {Number(inv.totalAmount || 0).toFixed(2)} PLN
                                        </td>
                                        <td className="py-2.5 px-3 text-center">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => onSelectInvoice(inv.id)}
                                            >
                                                Edit in Visual Editor
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
