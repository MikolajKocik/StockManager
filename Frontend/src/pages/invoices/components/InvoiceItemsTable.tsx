import React from 'react';
import { Button } from '@/components/common/core';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/common';
import { formatCurrency } from '@/utils/format';
import type { InvoiceLanguage, InvoiceLineItem, VatRate } from '@/models/invoice';
import { getInvoiceTranslations } from '../utils/invoiceTranslations';

const INVOICE_UNIT_OPTIONS = [
    { value: 'pcs', label: 'pcs' },
    { value: 'kg', label: 'kg' },
    { value: 'ltr', label: 'ltr' }
];

const INVOICE_VAT_RATE_OPTIONS = [
    { value: 23, label: '23%' },
    { value: 8, label: '8%' },
    { value: 5, label: '5%' },
    { value: 0, label: '0%' }
];

interface InvoiceItemsTableProps {
    items: InvoiceLineItem[];
    currency: string;
    language: InvoiceLanguage;
    draggedIndex: number | null;
    onUpdateLineItem: (id: string, field: keyof InvoiceLineItem, value: unknown) => void;
    onAddLineItem: () => void;
    onRemoveLineItem: (id: string) => void;
    onCloneLineItem: (id: string) => void;
    onDragStart: (index: number) => void;
    onDragOver: (e: React.DragEvent, index: number) => void;
    onDragEnd: () => void;
}

export const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({
    items,
    currency,
    language,
    draggedIndex,
    onUpdateLineItem,
    onAddLineItem,
    onRemoveLineItem,
    onCloneLineItem,
    onDragStart,
    onDragOver,
    onDragEnd
}) => {
    const t = getInvoiceTranslations(language);

    return (
        <section className="my-4" aria-labelledby="invoice-items-title">
            <h3 id="invoice-items-title" className="sr-only">{t.itemsTable.name}</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeaderCell className="py-1 px-1 text-center w-8 no-print">{t.itemsTable.handle}</TableHeaderCell>
                        <TableHeaderCell className="py-1 px-1 text-center w-6">{t.itemsTable.lp}</TableHeaderCell>
                        <TableHeaderCell className="py-1 px-2">{t.itemsTable.name}</TableHeaderCell>
                        <TableHeaderCell className="py-1 px-1 text-center w-12">{t.itemsTable.qty}</TableHeaderCell>
                        <TableHeaderCell className="py-1 px-1 text-center w-14">{t.itemsTable.unit}</TableHeaderCell>
                        <TableHeaderCell className="py-1 px-1.5 text-right w-16">{t.itemsTable.netPrice}</TableHeaderCell>
                        <TableHeaderCell className="py-1 px-1 text-center w-14">{t.itemsTable.vatRate}</TableHeaderCell>
                        <TableHeaderCell className="py-1 px-1.5 text-right w-18">{t.itemsTable.netTotal}</TableHeaderCell>
                        <TableHeaderCell className="py-1 px-1.5 text-right w-16">{t.itemsTable.vatTotal}</TableHeaderCell>
                        <TableHeaderCell className="py-1 px-1.5 text-right w-18">{t.itemsTable.grossTotal}</TableHeaderCell>
                        <TableHeaderCell className="py-1 px-1 text-center w-12 no-print">{t.itemsTable.actions}</TableHeaderCell>
                    </TableRow>
                </TableHead>

                <TableBody className="bg-white font-sans text-xs">
                    {items.map((item, index) => {
                        const isDragged = draggedIndex === index;

                        return (
                            <TableRow
                                key={item.id}
                                draggable
                                onDragStart={() => onDragStart(index)}
                                onDragOver={(e: React.DragEvent) => onDragOver(e, index)}
                                onDragEnd={onDragEnd}
                                className={`transition-colors hover:bg-slate-50 ${isDragged ? 'opacity-40 bg-amber-50' : ''}`}
                            >
                                <TableCell className="py-1 px-1 text-center text-slate-400 cursor-grab active:cursor-grabbing select-none no-print">
                                    <span title="Drag to reorder" className="text-base font-bold">⋮⋮</span>
                                </TableCell>

                                <TableCell className="py-1 px-1 text-center font-semibold text-slate-600">{index + 1}</TableCell>

                                <TableCell className="py-1 px-2 max-w-55 print:max-w-none print:whitespace-normal print:overflow-visible">
                                    <input
                                        type="text"
                                        value={item.name}
                                        title={item.name}
                                        onChange={(e) => onUpdateLineItem(item.id, 'name', e.target.value)}
                                        placeholder="Enter item description..."
                                        className="w-full font-medium text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-800 focus:bg-amber-50/50 px-1 py-0.5 outline-none truncate focus:whitespace-normal print:hidden"
                                    />
                                    <div className="hidden print:block font-medium text-slate-900 leading-tight whitespace-normal break-words">{item.name || '-'}</div>

                                    <input
                                        type="text"
                                        value={item.sku || ''}
                                        title={item.sku || ''}
                                        onChange={(e) => onUpdateLineItem(item.id, 'sku', e.target.value)}
                                        placeholder="SKU Code (optional)..."
                                        className="w-full text-[0.625rem] text-slate-400 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-800 focus:bg-amber-50/50 px-1 py-0.2 outline-none truncate print:hidden"
                                    />
                                    {item.sku && <div className="hidden print:block text-[0.5625rem] text-slate-500 font-mono leading-tight whitespace-normal break-words mt-0.5">SKU: {item.sku}</div>}
                                </TableCell>

                                <TableCell className="py-1 px-1 text-center">
                                    <input type="number" min="1" step="any" value={item.quantity} onChange={(e) => onUpdateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} className="w-full text-center font-semibold text-slate-800 bg-transparent border-b border-dashed border-slate-300 hover:border-slate-400 focus:border-slate-800 focus:bg-amber-50/50 px-0.5 py-0.5 outline-none print:border-none print:p-0" />
                                </TableCell>

                                <TableCell className="py-1 px-1 text-center">
                                    <select value={item.unit} onChange={(e) => onUpdateLineItem(item.id, 'unit', e.target.value)} className="w-full text-center bg-transparent text-slate-700 font-medium text-xs border-b border-transparent hover:border-slate-300 focus:border-slate-800 outline-none print:border-none">
                                        {INVOICE_UNIT_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </TableCell>

                                <TableCell className="py-1 px-1.5 text-right">
                                    <input type="number" min="0" step="0.01" value={item.netPrice} onChange={(e) => onUpdateLineItem(item.id, 'netPrice', parseFloat(e.target.value) || 0)} className="w-full text-right font-mono font-medium text-slate-800 bg-transparent border-b border-dashed border-slate-300 hover:border-slate-400 focus:border-slate-800 focus:bg-amber-50/50 px-0.5 py-0.5 outline-none print:border-none print:p-0" />
                                </TableCell>

                                <TableCell className="py-1 px-1 text-center">
                                    <select value={item.vatRate} onChange={(e) => onUpdateLineItem(item.id, 'vatRate', parseInt(e.target.value, 10) as VatRate)} className="w-full text-center bg-transparent text-slate-700 font-semibold text-xs border-b border-transparent hover:border-slate-300 focus:border-slate-800 outline-none print:border-none">
                                        {INVOICE_VAT_RATE_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </TableCell>

                                <TableCell className="py-1 px-1.5 text-right font-mono text-slate-800 whitespace-nowrap">{formatCurrency(item.netTotal, currency)}</TableCell>

                                <TableCell className="py-1 px-1.5 text-right font-mono text-slate-600 whitespace-nowrap">{formatCurrency(item.vatTotal, currency)}</TableCell>

                                <TableCell className="py-1 px-1.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">{formatCurrency(item.grossTotal, currency)}</TableCell>

                                <TableCell className="py-1 px-1 text-center no-print">
                                    <div className="flex items-center justify-center gap-1">
                                        <Button variant="ghost" size="sm" onClick={() => onCloneLineItem(item.id)} title="Duplicate row" className="px-1 py-0.5 text-xs text-slate-500 hover:text-slate-800">Copy</Button>
                                        <Button variant="danger" size="sm" onClick={() => onRemoveLineItem(item.id)} title="Delete line" className="px-1.5 py-0.5 text-xs">Remove</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <div className="mt-2 no-print flex justify-start">
                <Button variant="secondary" size="sm" onClick={onAddLineItem} className="text-xs font-semibold">{t.itemsTable.addItem.replace('+ ', '')}</Button>
            </div>
        </section>
    );
};

export default InvoiceItemsTable;
