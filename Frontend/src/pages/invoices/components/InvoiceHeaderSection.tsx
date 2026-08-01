import React from 'react';
import type { InvoiceDocument } from '@/models/invoice';
import { getInvoiceTranslations } from '../utils/invoiceTranslations';

interface InvoiceHeaderSectionProps {
    invoice: InvoiceDocument;
    onUpdateField: <K extends keyof InvoiceDocument>(field: K, value: InvoiceDocument[K]) => void;
}

export const InvoiceHeaderSection: React.FC<InvoiceHeaderSectionProps> = ({
    invoice,
    onUpdateField
}) => {
    const t = getInvoiceTranslations(invoice.language);

    return (
        <div className="flex flex-row justify-between items-start gap-4 pb-4 border-b-2 border-slate-700">
            {/* Left: Document Title and Invoice Number */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black tracking-wide text-slate-800 uppercase font-sans">
                        {t.docTitle[invoice.type] || t.docTitle.Sales}
                    </span>
                    <span
                        className={`text-xs px-2 py-0.5 rounded font-bold uppercase no-print ${invoice.status === 'Paid'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : invoice.status === 'Issued'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                    >
                        {invoice.status}
                    </span>
                </div>

                <div className="flex items-center gap-1 text-base text-slate-700 font-semibold mt-1">
                    <span className="text-slate-500 font-normal">{t.invoiceNumber}</span>
                    <input
                        type="text"
                        value={invoice.invoiceNumber}
                        onChange={(e) => onUpdateField('invoiceNumber', e.target.value)}
                        className="bg-transparent font-bold text-slate-900 border-b border-dashed border-slate-400 focus:border-slate-800 focus:bg-amber-50/50 outline-none px-1 py-0.5 w-52 transition-colors"
                        title="Kliknij, aby edytować numer faktury"
                    />
                </div>
            </div>

            {/* Right: Dates and Place of Issue */}
            <div className="bg-slate-50 border border-slate-300 p-2.5 rounded text-xs text-slate-700 min-w-60 space-y-1.5 shadow-sm print:min-w-0 print:border-none print:shadow-none print:p-0 print:bg-transparent">
                <div className="flex justify-between items-center gap-2">
                    <span className="text-slate-500 font-medium">{t.placeOfIssue}</span>
                    <span className="font-semibold text-slate-800">Warszawa</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                    <span className="text-slate-500 font-medium">{t.issueDate}</span>
                    <input
                        type="date"
                        value={invoice.issueDate}
                        onChange={(e) => onUpdateField('issueDate', e.target.value)}
                        className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-800 font-medium focus:border-slate-700 outline-none print:border-none print:p-0 print:bg-transparent"
                    />
                </div>
                <div className="flex justify-between items-center gap-2">
                    <span className="text-slate-500 font-medium">{t.saleDate}</span>
                    <input
                        type="date"
                        value={invoice.saleDate}
                        onChange={(e) => onUpdateField('saleDate', e.target.value)}
                        className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-800 font-medium focus:border-slate-700 outline-none print:border-none print:p-0 print:bg-transparent"
                    />
                </div>
                <div className="flex justify-between items-center gap-2">
                    <span className="text-slate-500 font-medium">{t.dueDate}</span>
                    <input
                        type="date"
                        value={invoice.dueDate}
                        onChange={(e) => onUpdateField('dueDate', e.target.value)}
                        className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-800 font-medium focus:border-slate-700 outline-none print:border-none print:p-0 print:bg-transparent"
                    />
                </div>
            </div>
        </div>
    );
};
