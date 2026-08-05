import { useInvoiceEditor } from './hooks/useInvoiceEditor';
import { InvoiceToolbar } from './components/InvoiceToolbar';
import { InvoiceDocument } from './components/InvoiceDocument';
import { InvoiceList } from './components/InvoiceList';
import type { InvoiceCurrency } from '@/models/invoice';

export default function Invoices() {
    const {
        invoice,
        viewMode,
        invoicesList,
        isLoadingList,
        isLookingUpNip,
        isSaving,
        draggedIndex,
        setViewMode,
        updateDocumentField,
        updateSeller,
        updateBuyer,
        lookupNip,
        updateLineItem,
        addLineItem,
        removeLineItem,
        cloneLineItem,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleSave,
        handleLoadInvoice,
        handleNewInvoice,
        handlePrint
    } = useInvoiceEditor();

    return (
        <div className="w-full flex flex-col gap-3">
            {/** Injected global print CSS overrides ensuring standard A4 page fitting */}
            <style>{`
                @page {
                    size: A4 portrait;
                    margin: 0;
                }
                @media print {
                    /* Reset all application layout wrappers */
                    html, body, #root, #root > div, .h-screen, main, .overflow-y-auto, .overflow-hidden {
                        display: block !important;
                        position: static !important;
                        width: 100% !important;
                        height: auto !important;
                        min-height: 0 !important;
                        max-height: none !important;
                        overflow: visible !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        background: white !important;
                        box-shadow: none !important;
                        border: none !important;
                        color: #0f172a !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    /* Hide all non-printable UI elements */
                    header, nav, aside, .sidebar, .no-print, [class*="Navbar"] {
                        display: none !important;
                    }

                    /* A4 Printable Sheet Container */
                    .invoice-a4-sheet {
                        display: block !important;
                        box-shadow: none !important;
                        border: none !important;
                        max-width: 100% !important;
                        width: 100% !important;
                        padding: 12mm 15mm !important;
                        margin: 0 auto !important;
                        min-height: auto !important;
                        background: white !important;
                    }

                    /* Restore grid and flex inside the invoice sheet */
                    .invoice-a4-sheet .grid {
                        display: grid !important;
                    }
                    .invoice-a4-sheet .grid-cols-2 {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }
                    .invoice-a4-sheet .flex {
                        display: flex !important;
                    }
                    .invoice-a4-sheet .flex-row {
                        flex-direction: row !important;
                    }
                    .invoice-a4-sheet .justify-between {
                        justify-content: space-between !important;
                    }

                    input, select, textarea {
                        border: none !important;
                        background: transparent !important;
                        box-shadow: none !important;
                        outline: none !important;
                        padding: 0 !important;
                        appearance: none !important;
                        -webkit-appearance: none !important;
                    }
                    input[type="date"]::-webkit-calendar-picker-indicator,
                    input[type="date"]::-webkit-inner-spin-button {
                        display: none !important;
                        -webkit-appearance: none !important;
                    }
                    select::-ms-expand {
                        display: none;
                    }
                    table {
                        width: 100% !important;
                    }

                    /* Hide ALL non-printable items with ultimate specificity */
                    .no-print, .invoice-a4-sheet .no-print, [class*="no-print"] {
                        display: none !important;
                    }
                }
            `}</style>

            <InvoiceToolbar
                viewMode={viewMode}
                invoicesCount={invoicesList.length}
                status={invoice.status}
                currency={invoice.currency as InvoiceCurrency}
                language={invoice.language || 'PL'}
                type={invoice.type}
                isSaving={isSaving}
                onViewModeChange={setViewMode}
                onNewInvoice={handleNewInvoice}
                onSaveInvoice={handleSave}
                onPrintInvoice={handlePrint}
                onStatusChange={(status) => updateDocumentField('status', status)}
                onCurrencyChange={(currency) => updateDocumentField('currency', currency)}
                onLanguageChange={(lang) => updateDocumentField('language', lang)}
                onTypeChange={(type) => updateDocumentField('type', type)}
            />

            {viewMode === 'editor' ? (
                <InvoiceDocument
                    invoice={invoice}
                    isLookingUpNip={isLookingUpNip}
                    draggedIndex={draggedIndex}
                    onUpdateField={updateDocumentField}
                    onUpdateSeller={updateSeller}
                    onUpdateBuyer={updateBuyer}
                    onLookupNip={lookupNip}
                    onUpdateLineItem={updateLineItem}
                    onAddLineItem={addLineItem}
                    onRemoveLineItem={removeLineItem}
                    onCloneLineItem={cloneLineItem}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                />
            ) : (
                <InvoiceList
                    invoices={invoicesList}
                    isLoading={isLoadingList}
                    onSelectInvoice={handleLoadInvoice}
                    onNewInvoice={handleNewInvoice}
                />
            )}
        </div>
    );
}
