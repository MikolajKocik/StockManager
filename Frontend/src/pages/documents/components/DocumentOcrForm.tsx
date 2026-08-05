import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/common/core';
import { formatCurrency } from '@/utils/format';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/common';
import type { OcrDocument, OcrExtractedData, OcrLineItem, DocumentType } from '../models/ocrDocument';
import toast from 'react-hot-toast';

interface DocumentOcrFormProps {
    document: OcrDocument;
    onUpdateDocumentData: (updated: OcrExtractedData) => void;
    onPostToWms: () => void;
    onReRunOcr: () => void;
    focusedFieldKey: string | null;
    onFieldFocus: (fieldKey: string | null) => void;
}

const DOCUMENT_TYPE_OPTIONS = [
    { label: 'WZ (Goods Dispatched)', value: 'WZ' },
    { label: 'PZ (Goods Received)', value: 'PZ' },
    { label: 'Invoice (Faktura)', value: 'INVOICE' },
    { label: 'CMR Waybill', value: 'CMR' }
] as const;

export const DocumentOcrForm: React.FC<DocumentOcrFormProps> = ({
    document,
    onUpdateDocumentData,
    onPostToWms,
    onReRunOcr,
    focusedFieldKey,
    onFieldFocus
}) => {
    const { extractedData } = document;
    const [isPosting, setIsPosting] = useState<boolean>(false);

    const handleFieldChange = (key: keyof OcrExtractedData, value: any) => {
        onUpdateDocumentData({
            ...extractedData,
            [key]: value
        });
    };

    const handleLineItemChange = (index: number, field: keyof OcrLineItem, value: any) => {
        const newItems = [...extractedData.items];
        newItems[index] = {
            ...newItems[index],
            [field]: value
        };

        // Recalculate totals
        const newNet = newItems.reduce((acc, it) => acc + (it.quantity * it.unitPriceNet), 0);
        const newGross = newNet * 1.23;

        onUpdateDocumentData({
            ...extractedData,
            items: newItems,
            totalNet: Math.round(newNet * 100) / 100,
            totalGross: Math.round(newGross * 100) / 100
        });
    };

    const handleAddLineItem = () => {
        const newItem: OcrLineItem = {
            id: `item-${Date.now()}`,
            sku: 'NEW-SKU-001',
            name: 'New Product Item',
            quantity: 1,
            unit: 'pcs',
            unitPriceNet: 100.0,
            vatRate: 23,
            lotNumber: 'LOT-2026-NEW'
        };

        const newItems = [...extractedData.items, newItem];
        const newNet = newItems.reduce((acc, it) => acc + (it.quantity * it.unitPriceNet), 0);
        const newGross = newNet * 1.23;

        onUpdateDocumentData({
            ...extractedData,
            items: newItems,
            totalNet: Math.round(newNet * 100) / 100,
            totalGross: Math.round(newGross * 100) / 100
        });
        toast.success('Line item added to document');
    };

    const handleDeleteLineItem = (index: number) => {
        const newItems = extractedData.items.filter((_, idx) => idx !== index);
        const newNet = newItems.reduce((acc, it) => acc + (it.quantity * it.unitPriceNet), 0);
        const newGross = newNet * 1.23;

        onUpdateDocumentData({
            ...extractedData,
            items: newItems,
            totalNet: Math.round(newNet * 100) / 100,
            totalGross: Math.round(newGross * 100) / 100
        });
        toast.success('Line item removed');
    };

    const handleApprove = () => {
        setIsPosting(true);
        const promise = new Promise((resolve) => setTimeout(resolve, 1000));

        toast.promise(
            promise,
            {
                loading: `Posting ${extractedData.docType} ${extractedData.docNumber} to WMS inventory...`,
                success: <b>Document approved! {extractedData.items.length} items posted to warehouse stock.</b>,
                error: <b>Failed to post document</b>
            },
            { id: 'post-doc' }
        ).then(() => {
            setIsPosting(false);
            onPostToWms();
        });
    };

    return (
        <main className="w-full bg-white border border-slate-300 rounded-lg shadow-xs flex flex-col h-full text-xs" role="main">
            {/* Header */}
            <header className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                    <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block font-mono">
                        Extracted Data & Verification Form
                    </span>
                    <span className="text-[0.625rem] text-slate-500">
                        {focusedFieldKey ? (
                            <span className="text-[#2b6675] font-semibold">
                                Active input: <code className="bg-[#f0f7f8] text-[#2b6675] px-1 py-0.2 rounded font-mono">{focusedFieldKey}</code> (click any scan snippet to paste)
                            </span>
                        ) : (
                            'Click an input field, then click any snippet on the scan on the left to assign.'
                        )}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[0.625rem] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                        Accuracy: {Math.round(document.overallConfidence * 100)}%
                    </span>
                </div>
            </header>

            {/* Scrollable Form Body */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* Document Metadata Grid */}
                <section className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2.5">
                    <span className="text-[0.625rem] font-bold text-slate-500 uppercase block font-mono">
                        Document Classification & Details
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                            <label className="text-[0.625rem] font-semibold text-slate-600 block mb-0.5">Type</label>
                            <Select
                                defaultValue={extractedData.docType}
                                onBlur={(e) => handleFieldChange('docType', (e.target as HTMLSelectElement).value as DocumentType)}
                                options={DOCUMENT_TYPE_OPTIONS}
                            />
                        </div>
                        <div>
                            <label className="text-[0.625rem] font-semibold text-slate-600 block mb-0.5">Document Number</label>
                            <Input
                                type="text"
                                defaultValue={extractedData.docNumber}
                                onFocus={() => onFieldFocus('docNumber')}
                                onBlur={(e) => handleFieldChange('docNumber', (e.target as HTMLInputElement).value)}
                            />
                        </div>
                        <div>
                            <label className="text-[0.625rem] font-semibold text-slate-600 block mb-0.5">Issue Date</label>
                            <Input
                                type="date"
                                defaultValue={extractedData.issueDate}
                                onFocus={() => onFieldFocus('issueDate')}
                                onBlur={(e) => handleFieldChange('issueDate', (e.target as HTMLInputElement).value)}
                            />
                        </div>
                        <div>
                            <label className="text-[0.625rem] font-semibold text-slate-600 block mb-0.5">Delivery Date</label>
                            <Input
                                type="date"
                                defaultValue={extractedData.deliveryDate}
                                onFocus={() => onFieldFocus('deliveryDate')}
                                onBlur={(e) => handleFieldChange('deliveryDate', (e.target as HTMLInputElement).value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Counterparty / Contractor Grid */}
                <section className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2.5">
                    <span className="text-[0.625rem] font-bold text-slate-500 uppercase block font-mono">
                        Contractor / Supplier Information
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                            <label className="text-[0.625rem] font-semibold text-slate-600 block mb-0.5">Company / Counterparty Name</label>
                            <Input
                                type="text"
                                defaultValue={extractedData.contractorName}
                                onFocus={() => onFieldFocus('contractorName')}
                                onBlur={(e) => handleFieldChange('contractorName', (e.target as HTMLInputElement).value)}
                            />
                        </div>
                        <div>
                            <label className="text-[0.625rem] font-semibold text-slate-600 block mb-0.5">NIP / Tax ID</label>
                            <Input
                                type="text"
                                defaultValue={extractedData.contractorNip}
                                onFocus={() => onFieldFocus('contractorNip')}
                                onBlur={(e) => handleFieldChange('contractorNip', (e.target as HTMLInputElement).value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[0.625rem] font-semibold text-slate-600 block mb-0.5">Target Destination Warehouse</label>
                        <Input
                            type="text"
                            defaultValue={extractedData.destinationWarehouse}
                            onFocus={() => onFieldFocus('destinationWarehouse')}
                            onBlur={(e) => handleFieldChange('destinationWarehouse', (e.target as HTMLInputElement).value)}
                        />
                    </div>
                </section>

                {/* Line Items Table */}
                <section className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[0.625rem] font-bold text-slate-500 uppercase block font-mono">
                            Document Positions & SKUs ({extractedData.items.length})
                        </span>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleAddLineItem}
                        >
                            Add Position
                        </Button>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell>SKU Code</TableHeaderCell>
                                    <TableHeaderCell>Product Description</TableHeaderCell>
                                    <TableHeaderCell className="w-20">Qty</TableHeaderCell>
                                    <TableHeaderCell className="w-16">Unit</TableHeaderCell>
                                    <TableHeaderCell className="w-24">Price Net</TableHeaderCell>
                                    <TableHeaderCell>LOT / Batch #</TableHeaderCell>
                                    <TableHeaderCell className="py-1 px-1 text-center w-8">Action</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {extractedData.items.map((item, idx) => (
                                    <TableRow key={item.id} className="hover:bg-white transition-colors">
                                        <TableCell>
                                            <Input
                                                type="text"
                                                defaultValue={item.sku}
                                                onFocus={() => onFieldFocus(`item_sku_${idx}`)}
                                                onBlur={(e) => handleLineItemChange(idx, 'sku', (e.target as HTMLInputElement).value)}
                                                className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-xs font-mono font-bold text-[#2b6675] outline-none focus:border-[#2b6675]"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                defaultValue={item.name}
                                                onFocus={() => onFieldFocus(`item_name_${idx}`)}
                                                onBlur={(e) => handleLineItemChange(idx, 'name', (e.target as HTMLInputElement).value)}
                                                className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-xs outline-none focus:border-[#2b6675]"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                defaultValue={item.quantity}
                                                onBlur={(e) => handleLineItemChange(idx, 'quantity', Number((e.target as HTMLInputElement).value))}
                                                className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-xs font-mono text-right outline-none focus:border-[#2b6675]"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                defaultValue={item.unit}
                                                onBlur={(e) => handleLineItemChange(idx, 'unit', (e.target as HTMLInputElement).value)}
                                                className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-xs text-center outline-none focus:border-[#2b6675]"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                defaultValue={item.unitPriceNet}
                                                onBlur={(e) => handleLineItemChange(idx, 'unitPriceNet', Number((e.target as HTMLInputElement).value))}
                                                className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-xs font-mono text-right outline-none focus:border-[#2b6675]"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                defaultValue={item.lotNumber || ''}
                                                placeholder="LOT #"
                                                onFocus={() => onFieldFocus(`item_lot_${idx}`)}
                                                onBlur={(e) => handleLineItemChange(idx, 'lotNumber', (e.target as HTMLInputElement).value)}
                                                className="w-full bg-amber-50 border border-amber-300 rounded px-1.5 py-1 text-xs font-mono text-amber-900 font-semibold outline-none focus:border-amber-500"
                                            />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteLineItem(idx)} title="Delete Position" className="text-slate-400 hover:text-red-600 font-bold p-1">Del</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </section>

                {/* Totals & Notes Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-[0.625rem] font-semibold text-slate-600 block mb-0.5">Notes & Gate Reference</label>
                        <textarea
                            rows={2}
                            value={extractedData.notes || ''}
                            onFocus={() => onFieldFocus('notes')}
                            onChange={(e) => handleFieldChange('notes', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-mono outline-none focus:border-[#2b6675]"
                        />
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between font-mono">
                        <div className="flex justify-between text-slate-600">
                                <span>Total Net Amount:</span>
                                <span className="font-bold text-slate-900">{formatCurrency(extractedData.totalNet, extractedData.currency)}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-1">
                                <span>Total Gross:</span>
                                <span className="text-[#2b6675]">{formatCurrency(extractedData.totalGross, extractedData.currency)}</span>
                            </div>
                    </div>
                </section>
            </div>

            {/* Footer Action Bar */}
            <footer className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onReRunOcr}
                >
                    Re-run OCR Extractor
                </Button>

                <div className="flex gap-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleApprove}
                        disabled={isPosting}
                        isLoading={isPosting}
                    >
                        {isPosting ? 'Posting...' : 'Approve & Post to WMS Inventory'}
                    </Button>
                </div>
            </footer>
        </main>
    );
};
