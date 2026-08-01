import React, { useState, useMemo } from 'react';
import { Button, Input } from '@/components/common';
import type { Invoice } from '@/models/invoice';

interface InvoiceListProps {
    invoices: Invoice[];
    isLoading: boolean;
    onSelectInvoice: (id: number | string) => void;
    onNewInvoice: () => void;
}

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
        <div className="card border border-slate-300">
            <div className="flex flex-row justify-between items-center px-3 py-2 border-b border-slate-300 bg-slate-200">
                <h2 className="card-header m-0 p-0 text-base font-semibold text-slate-700">
                    Archiwum Faktur Sprzedażowych
                </h2>
                <Button variant="accent" size="sm" onClick={onNewInvoice}>
                    + Wystaw Nową Fakturę
                </Button>
            </div>

            <div className="card-body p-3 bg-white space-y-3">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="w-64">
                        <Input
                            type="text"
                            placeholder="Szukaj po numerze, firmie, NIP..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 font-medium outline-none"
                    >
                        <option value="ALL">Wszystkie statusy</option>
                        <option value="Issued">Wystawione</option>
                        <option value="Paid">Opłacone</option>
                        <option value="Draft">Szkice</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-slate-300 rounded">
                    <table className="w-full text-xs text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[11px] uppercase">
                                <th className="py-2.5 px-3">Nr Faktury</th>
                                <th className="py-2.5 px-3">Nabywca</th>
                                <th className="py-2.5 px-3">Data wystawienia</th>
                                <th className="py-2.5 px-3">Termin płatności</th>
                                <th className="py-2.5 px-3 text-center">Status</th>
                                <th className="py-2.5 px-3 text-right">Wartość Brutto</th>
                                <th className="py-2.5 px-3 text-center">Akcje</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-500">
                                        Wczytywanie faktur...
                                    </td>
                                </tr>
                            ) : filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-500">
                                        Brak faktur spełniających kryteria wyszukiwania.
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-2.5 px-3 font-bold text-slate-900">
                                            {inv.invoiceNumber || `FV/2026/08/${String(inv.id).padStart(3, '0')}`}
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <span className="font-semibold text-slate-800 block">
                                                {inv.buyerName || 'Brak danych'}
                                            </span>
                                            {inv.buyerNip && (
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    NIP: {inv.buyerNip}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2.5 px-3 text-slate-700">
                                            {inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString('pl-PL') : '-'}
                                        </td>
                                        <td className="py-2.5 px-3 text-slate-700">
                                            {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('pl-PL') : '-'}
                                        </td>
                                        <td className="py-2.5 px-3 text-center">
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                    inv.status === 'Paid'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : inv.status === 'Issued'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-amber-100 text-amber-800'
                                                }`}
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
                                                Edytuj w WYSIWYG
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
