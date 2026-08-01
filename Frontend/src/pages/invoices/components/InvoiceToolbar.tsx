import React from 'react';
import { Button } from '@/components/common';
import type { InvoiceCurrency, InvoiceLanguage, InvoiceStatus, InvoiceType } from '@/models/invoice';

interface InvoiceToolbarProps {
    viewMode: 'editor' | 'list';
    invoicesCount: number;
    status: InvoiceStatus;
    currency: InvoiceCurrency;
    language: InvoiceLanguage;
    type: InvoiceType;
    isSaving: boolean;
    onViewModeChange: (mode: 'editor' | 'list') => void;
    onNewInvoice: () => void;
    onSaveInvoice: () => void;
    onPrintInvoice: () => void;
    onStatusChange: (status: InvoiceStatus) => void;
    onCurrencyChange: (currency: InvoiceCurrency) => void;
    onLanguageChange: (language: InvoiceLanguage) => void;
    onTypeChange: (type: InvoiceType) => void;
}

export const InvoiceToolbar: React.FC<InvoiceToolbarProps> = ({
    viewMode,
    invoicesCount,
    status,
    currency,
    language,
    type,
    isSaving,
    onViewModeChange,
    onNewInvoice,
    onSaveInvoice,
    onPrintInvoice,
    onStatusChange,
    onCurrencyChange,
    onLanguageChange,
    onTypeChange
}) => {
    return (
        <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-[#D9D9D9] p-2.5 shadow-md border border-slate-300">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-200 p-1 rounded border border-slate-300">
                <button
                    type="button"
                    onClick={() => onViewModeChange('editor')}
                    className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${viewMode === 'editor'
                        ? 'bg-[#37393B] text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-300'
                        }`}
                >
                    Visual Editor
                </button>
                <button
                    type="button"
                    onClick={() => onViewModeChange('list')}
                    className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${viewMode === 'list'
                        ? 'bg-[#37393B] text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-300'
                        }`}
                >
                    Invoice Archive ({invoicesCount})
                </button>
            </div>

            {/* Quick document properties (visible when in editor mode) */}
            {viewMode === 'editor' && (
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-600 font-medium">Type:</span>
                        <select
                            value={type}
                            onChange={(e) => onTypeChange(e.target.value as InvoiceType)}
                            className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 text-xs font-semibold outline-none"
                        >
                            <option value="Sales">Sales Invoice</option>
                            <option value="Proforma">Proforma Invoice</option>
                            <option value="Correction">Correction Invoice</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-600 font-medium">Status:</span>
                        <select
                            value={status}
                            onChange={(e) => onStatusChange(e.target.value as InvoiceStatus)}
                            className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 text-xs font-semibold outline-none"
                        >
                            <option value="Draft">Draft</option>
                            <option value="Issued">Issued</option>
                            <option value="Paid">Paid</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-600 font-medium">Currency:</span>
                        <select
                            value={currency}
                            onChange={(e) => onCurrencyChange(e.target.value as InvoiceCurrency)}
                            className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 text-xs font-semibold outline-none"
                        >
                            <option value="PLN">PLN</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-600 font-medium">Language:</span>
                        <select
                            value={language}
                            onChange={(e) => onLanguageChange(e.target.value as InvoiceLanguage)}
                            className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 text-xs font-semibold outline-none"
                        >
                            <option value="PL">🇵🇱 PL (Polski)</option>
                            <option value="ENG">🇬🇧 ENG (English)</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-white text-slate-700 hover:bg-slate-100"
                    onClick={onNewInvoice}
                >
                    + New Invoice
                </Button>

                {viewMode === 'editor' && (
                    <>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="bg-slate-700 text-white hover:bg-slate-800"
                            onClick={onPrintInvoice}
                        >
                            Print / PDF
                        </Button>
                        <Button
                            variant="accent"
                            size="sm"
                            onClick={onSaveInvoice}
                            isLoading={isSaving}
                        >
                            Save Document
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};
