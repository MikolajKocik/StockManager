import React from 'react';
import type { InvoiceDocument as InvoiceDocType, InvoiceLineItem, InvoiceParty } from '@/models/invoice';
import { InvoiceHeaderSection } from './InvoiceHeaderSection';
import { InvoicePartiesSection } from './InvoicePartiesSection';
import { InvoiceItemsTable } from './InvoiceItemsTable';
import { InvoiceSummarySection } from './InvoiceSummarySection';

interface InvoiceDocumentProps {
    invoice: InvoiceDocType;
    isLookingUpNip: boolean;
    draggedIndex: number | null;
    onUpdateField: <K extends keyof InvoiceDocType>(field: K, value: InvoiceDocType[K]) => void;
    onUpdateSeller: (field: keyof InvoiceParty, value: string) => void;
    onUpdateBuyer: (field: keyof InvoiceParty, value: string) => void;
    onLookupNip: (nip?: string) => void;
    onUpdateLineItem: (id: string, field: keyof InvoiceLineItem, value: unknown) => void;
    onAddLineItem: () => void;
    onRemoveLineItem: (id: string) => void;
    onCloneLineItem: (id: string) => void;
    onDragStart: (index: number) => void;
    onDragOver: (e: React.DragEvent, index: number) => void;
    onDragEnd: () => void;
}

export const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({
    invoice,
    isLookingUpNip,
    draggedIndex,
    onUpdateField,
    onUpdateSeller,
    onUpdateBuyer,
    onLookupNip,
    onUpdateLineItem,
    onAddLineItem,
    onRemoveLineItem,
    onCloneLineItem,
    onDragStart,
    onDragOver,
    onDragEnd
}) => {
    return (
        <div className="w-full flex justify-center py-2 print:p-0 print:m-0 print:block">
            {/* Realistic A4 Document Paper Container */}
            <div
                id="invoice-print-area"
                className="invoice-a4-sheet w-full max-w-215 bg-white border border-slate-300 rounded-sm shadow-xl p-8 sm:p-10 text-slate-800 relative transition-all print:p-0 print:border-none print:shadow-none print:max-w-full"
                style={{ minHeight: '1050px' }}
            >
                {/* Header */}
                <InvoiceHeaderSection
                    invoice={invoice}
                    onUpdateField={onUpdateField}
                />

                {/* Seller & Buyer with NIP Lookup */}
                <InvoicePartiesSection
                    seller={invoice.seller}
                    buyer={invoice.buyer}
                    language={invoice.language}
                    isLookingUpNip={isLookingUpNip}
                    onUpdateSeller={onUpdateSeller}
                    onUpdateBuyer={onUpdateBuyer}
                    onLookupNip={onLookupNip}
                />

                {/* Line Items Table with Drag and Drop */}
                <InvoiceItemsTable
                    items={invoice.items}
                    currency={invoice.currency}
                    language={invoice.language}
                    draggedIndex={draggedIndex}
                    onUpdateLineItem={onUpdateLineItem}
                    onAddLineItem={onAddLineItem}
                    onRemoveLineItem={onRemoveLineItem}
                    onCloneLineItem={onCloneLineItem}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                />

                {/* Summary & VAT Totals */}
                <InvoiceSummarySection
                    invoice={invoice}
                    onUpdateField={onUpdateField}
                />
            </div>
        </div>
    );
};
