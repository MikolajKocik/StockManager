import React from 'react';
import { Button, Select } from '@/components/common';
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

export const INVOICE_TYPE_OPTIONS = [
    { value: 'Sales', label: 'Sales Invoice' },
    { value: 'Proforma', label: 'Proforma Invoice' },
    { value: 'Correction', label: 'Correction Invoice' }
] as const;

export const INVOICE_STATUS_OPTIONS = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Issued', label: 'Issued' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Cancelled', label: 'Cancelled' }
] as const;

export const INVOICE_CURRENCY_OPTIONS = [
    { value: 'PLN', label: 'PLN' },
    { value: 'EUR', label: 'EUR' },
    { value: 'USD', label: 'USD' }
] as const;

export const INVOICE_LANGUAGE_OPTIONS = [
    { value: 'ENG', label: 'English (ENG)' },
    { value: 'PL', label: 'Polish (PL)' }
] as const;

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
                <Button
                    variant={viewMode === 'editor' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => onViewModeChange('editor')}
                    className="text-xs"
                >
                    Visual Editor
                </Button>
                <Button
                    variant={viewMode === 'list' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => onViewModeChange('list')}
                    className="text-xs"
                >
                    Invoice Archive ({invoicesCount})
                </Button>
            </div>

            {/* Quick document properties (visible when in editor mode) */}
            {viewMode === 'editor' && (
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-600 font-medium">Type:</span>
                        <div className="w-36">
                            <Select
                                value={type}
                                onChange={(e) => onTypeChange(e.target.value as InvoiceType)}
                                options={INVOICE_TYPE_OPTIONS}
                                className="text-xs py-1"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-600 font-medium">Status:</span>
                        <div className="w-28">
                            <Select
                                value={status}
                                onChange={(e) => onStatusChange(e.target.value as InvoiceStatus)}
                                options={INVOICE_STATUS_OPTIONS}
                                className="text-xs py-1"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-600 font-medium">Currency:</span>
                        <div className="w-24">
                            <Select
                                value={currency}
                                onChange={(e) => onCurrencyChange(e.target.value as InvoiceCurrency)}
                                options={INVOICE_CURRENCY_OPTIONS}
                                className="text-xs py-1"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-600 font-medium">Language:</span>
                        <div className="w-32">
                            <Select
                                value={language}
                                onChange={(e) => onLanguageChange(e.target.value as InvoiceLanguage)}
                                options={INVOICE_LANGUAGE_OPTIONS}
                                className="text-xs py-1"
                            />
                        </div>
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
                    New Invoice
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
                            variant="primary"
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
