import React from 'react';
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

    return (
        <div className="mt-4 pt-3 border-t-2 border-slate-700">
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
                                <option value="Transfer">{t.paymentMethods.Transfer}</option>
                                <option value="Card">{t.paymentMethods.Card}</option>
                                <option value="Cash">{t.paymentMethods.Cash}</option>
                                <option value="SplitPayment">{t.paymentMethods.SplitPayment}</option>
                            </select>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">{t.bank}</span>
                            <input
                                type="text"
                                value={invoice.bankName}
                                onChange={(e) => onUpdateField('bankName', e.target.value)}
                                className="font-semibold text-right text-slate-800 bg-transparent border-b border-dashed border-slate-300 hover:border-slate-400 focus:border-slate-800 px-1 py-0.5 outline-none flex-1 max-w-[200px] print:border-none print:p-0"
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">{t.bankAccount}</span>
                            <input
                                type="text"
                                value={invoice.bankAccount}
                                onChange={(e) => onUpdateField('bankAccount', e.target.value)}
                                className="font-mono font-bold text-right text-slate-900 bg-transparent border-b border-dashed border-slate-300 hover:border-slate-400 focus:border-slate-800 px-1 py-0.5 outline-none flex-1 max-w-[220px] text-[11px] print:border-none print:p-0"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            {t.notesTitle}
                        </span>
                        <textarea
                            value={invoice.notes || ''}
                            onChange={(e) => onUpdateField('notes', e.target.value)}
                            placeholder={t.notesPlaceholder}
                            rows={2}
                            className="w-full text-xs text-slate-700 bg-transparent border border-slate-300 hover:border-slate-400 focus:border-slate-800 focus:bg-amber-50/50 p-1.5 rounded outline-none transition-colors print:border-none print:p-0"
                        />
                    </div>
                </div>

                {/* Right: VAT Breakdown Table and Big Total Gross Box */}
                <div className="flex flex-col items-end gap-2.5">
                    {/* VAT Summary Table */}
                    <div className="w-full border border-slate-300 rounded overflow-hidden shadow-sm print:shadow-none print:border-slate-400">
                        <table className="w-full text-xs text-right border-collapse">
                            <thead>
                                <tr className="bg-slate-200 text-slate-700 font-bold border-b border-slate-300 text-[10px] uppercase print:bg-slate-100">
                                    <th className="py-1 px-2 text-center">{t.vatTable.rate}</th>
                                    <th className="py-1 px-2">{t.vatTable.net} ({invoice.currency})</th>
                                    <th className="py-1 px-2">{t.vatTable.vat} ({invoice.currency})</th>
                                    <th className="py-1 px-2">{t.vatTable.gross} ({invoice.currency})</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
                                {invoice.vatSummary.map((vs, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="py-1 px-2 text-center font-sans font-semibold text-slate-600">{vs.rateLabel}</td>
                                        <td className="py-1 px-2 text-slate-800">{vs.netAmount.toFixed(2)}</td>
                                        <td className="py-1 px-2 text-slate-600">{vs.vatAmount.toFixed(2)}</td>
                                        <td className="py-1 px-2 font-bold text-slate-900">{vs.grossAmount.toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300 print:bg-slate-100">
                                    <td className="py-1 px-2 text-center font-sans">{t.vatTable.total}</td>
                                    <td className="py-1 px-2">{invoice.totalNet.toFixed(2)}</td>
                                    <td className="py-1 px-2">{invoice.totalVat.toFixed(2)}</td>
                                    <td className="py-1 px-2 text-slate-900">{invoice.totalGross.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Grand Total Box */}
                    <div className="w-full bg-[#384155] text-white p-2.5 rounded shadow-md flex justify-between items-center print:bg-[#384155]">
                        <div className="flex flex-col">
                            <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
                                {t.grandTotal}
                            </span>
                            <span className="text-[10px] text-slate-400">
                                {t.dueTerm} {invoice.dueDate}
                            </span>
                        </div>
                        <div className="text-lg font-black font-mono tracking-tight text-white">
                            {invoice.totalGross.toFixed(2)} {invoice.currency}
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
                    <span className="text-[10px]">{t.signatures.issuer}</span>
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
                    <span className="text-[10px]">{t.signatures.recipient}</span>
                </div>
            </div>
        </div>
    );
};
