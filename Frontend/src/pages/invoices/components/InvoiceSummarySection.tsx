import React from 'react';
import { formatCurrency } from '@/utils/format';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/common';
import type { InvoiceDocument, PaymentMethod } from '@/models/invoice';
import { getInvoiceTranslations } from '../utils/invoiceTranslations';

interface InvoiceSummarySectionProps {
    invoice: InvoiceDocument;
    onUpdateField: <K extends keyof InvoiceDocument>(field: K, value: InvoiceDocument[K]) => void;
}

export const InvoiceSummarySection: React.FC<InvoiceSummarySectionProps> = ({
    invoice,
    onUpdateField
}) => {
    const t = getInvoiceTranslations(invoice.language);

    const paymentMethodOptions = [
        { value: 'Transfer', label: t.paymentMethods.Transfer },
        { value: 'Card', label: t.paymentMethods.Card },
        { value: 'Cash', label: t.paymentMethods.Cash },
        { value: 'SplitPayment', label: t.paymentMethods.SplitPayment }
    ];

    return (
        <section className="mt-4 pt-3 border-t-2 border-slate-700" aria-labelledby="invoice-summary-title">
            <h3 id="invoice-summary-title" className="sr-only">Invoice Summary</h3>
            <div className="grid grid-cols-2 gap-4 items-start">
                {/* Left: Payment Details, Bank Account, Notes */}
                <div className="space-y-3 text-xs text-slate-700">
                    <div className="bg-slate-50 border border-slate-300 p-2.5 rounded space-y-1.5 shadow-sm print:bg-transparent print:p-1.5">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">{t.paymentMethod}</span>
                            <select
                                value={invoice.paymentMethod}
                                onChange={(e) => onUpdateField('paymentMethod', e.target.value as PaymentMethod)}
                                className="bg-white border border-slate-300 rounded px-2 py-0.5 font-semibold text-slate-800 text-xs outline-none print:border-none print:p-0"
                            >
                                {paymentMethodOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">{t.bank}</span>
                            <input
                                type="text"
                                value={invoice.bankName}
                                onChange={(e) => onUpdateField('bankName', e.target.value)}
                                className="font-semibold text-right text-slate-800 bg-transparent border-b border-dashed border-slate-300 hover:border-slate-400 focus:border-slate-800 px-1 py-0.5 outline-none flex-1 max-w-[12.5rem] print:border-none print:p-0"
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">{t.bankAccount}</span>
                            <input
                                type="text"
                                value={invoice.bankAccount}
                                onChange={(e) => onUpdateField('bankAccount', e.target.value)}
                                className="font-mono font-bold text-right text-slate-900 bg-transparent border-b border-dashed border-slate-300 hover:border-slate-400 focus:border-slate-800 px-1 py-0.5 outline-none flex-1 max-w-[13.75rem] text-[0.6875rem] print:border-none print:p-0"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <span className="text-[0.6875rem] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            {t.notesTitle}
                        </span>
                        {/* Interactive screen textarea with no ugly resize handle */}
                        <textarea
                            value={invoice.notes || ''}
                            onChange={(e) => onUpdateField('notes', e.target.value)}
                            placeholder={t.notesPlaceholder}
                            rows={2}
                            className="w-full text-xs text-slate-700 bg-transparent border border-slate-300 hover:border-slate-400 focus:border-slate-800 focus:bg-amber-50/50 p-1.5 rounded outline-none resize-y transition-colors print:hidden"
                        />
                        {/* Flawless print text without textarea borders or handle */}
                        {invoice.notes ? (
                            <div className="hidden print:block text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                                {invoice.notes}
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Right: VAT Breakdown Table and Big Total Gross Box */}
                <div className="flex flex-col items-end gap-2.5">
                    {/* VAT Summary Table */}
                    <div className="w-full border border-slate-300 rounded overflow-hidden shadow-sm print:shadow-none print:border-slate-400">
                        <Table className="text-xs text-right">
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell className="py-1 px-2 text-center">{t.vatTable.rate}</TableHeaderCell>
                                    <TableHeaderCell className="py-1 px-2">{t.vatTable.net} ({invoice.currency})</TableHeaderCell>
                                    <TableHeaderCell className="py-1 px-2">{t.vatTable.vat} ({invoice.currency})</TableHeaderCell>
                                    <TableHeaderCell className="py-1 px-2">{t.vatTable.gross} ({invoice.currency})</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="font-mono text-[0.6875rem]">
                                {invoice.vatSummary.map((vs, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="text-center font-sans font-semibold text-slate-600">{vs.rateLabel}</TableCell>
                                        <TableCell className="text-slate-800">{formatCurrency(vs.netAmount, invoice.currency)}</TableCell>
                                        <TableCell className="text-slate-600">{formatCurrency(vs.vatAmount, invoice.currency)}</TableCell>
                                        <TableCell className="font-bold text-slate-900">{formatCurrency(vs.grossAmount, invoice.currency)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300 print:bg-slate-100">
                                    <TableCell className="text-center font-sans">{t.vatTable.total}</TableCell>
                                    <TableCell>{formatCurrency(invoice.totalNet, invoice.currency)}</TableCell>
                                    <TableCell>{formatCurrency(invoice.totalVat, invoice.currency)}</TableCell>
                                    <TableCell className="text-slate-900">{formatCurrency(invoice.totalGross, invoice.currency)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Grand Total Box */}
                    <div className="w-full bg-[#384155] text-white p-2.5 rounded shadow-md flex justify-between items-center print:bg-[#384155]">
                        <div className="flex flex-col">
                            <span className="text-[0.6875rem] uppercase tracking-wider text-slate-300 font-semibold">
                                {t.grandTotal}
                            </span>
                            <span className="text-[0.625rem] text-slate-400">
                                {t.dueTerm} {invoice.dueDate}
                            </span>
                        </div>
                        <div className="text-lg font-black font-mono tracking-tight text-white">
                            {formatCurrency(invoice.totalGross, invoice.currency)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Signature Bottom Section */}
            <div className="grid grid-cols-2 gap-12 mt-10 pt-6 border-t border-dotted border-slate-300 text-center text-xs text-slate-500">
                <div>
                    <div className="border-b border-slate-400 w-48 mx-auto mb-1">
                        <input
                            type="text"
                            value={invoice.issuerName || ''}
                            onChange={(e) => onUpdateField('issuerName', e.target.value)}
                            placeholder={invoice.language === 'ENG' ? 'Issuer name' : 'Imię i nazwisko wystawcy'}
                            className="w-full text-center font-medium text-slate-700 bg-transparent outline-none text-xs"
                        />
                    </div>
                    <span className="text-[0.625rem]">{t.signatures.issuer}</span>
                </div>
                <div>
                    <div className="border-b border-slate-400 w-48 mx-auto mb-1">
                        <input
                            type="text"
                            value={invoice.recipientName || ''}
                            onChange={(e) => onUpdateField('recipientName', e.target.value)}
                            placeholder={invoice.language === 'ENG' ? 'Recipient name' : 'Imię i nazwisko odbiorcy'}
                            className="w-full text-center font-medium text-slate-700 bg-transparent outline-none text-xs"
                        />
                    </div>
                    <span className="text-[0.625rem]">{t.signatures.recipient}</span>
                </div>
            </div>
        </section>
    );
};
