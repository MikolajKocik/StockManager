import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/common';
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
        <div className="w-full bg-white border border-slate-300 rounded-lg shadow-sm flex flex-col h-full text-xs">
            {/* Header */}
            <div className="p-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
                <div>
                    <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
                        Extracted Data & Verification Form
                    </span>
                    <span className="text-[10px] text-slate-500">
                        {focusedFieldKey ? (
                            <span className="text-blue-700 font-semibold">
                                Active input: <code className="bg-blue-100 px-1 py-0.2 rounded font-mono">{focusedFieldKey}</code> (click any scan snippet to paste)
                            </span>
                        ) : (
                            'Click an input field, then click any snippet on the scan on the left to assign.'
                        )}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                        Accuracy: {Math.round(document.overallConfidence * 100)}%
                    </span>
                </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* Document Metadata Grid */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                        Document Classification & Details
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                            <label className="text-[10px] text-slate-600 block mb-0.5">Type</label>
                            <Select
                                value={extractedData.docType}
                                onChange={(e) => handleFieldChange('docType', e.target.value as DocumentType)}
                                options={[
                                    { label: 'WZ (Goods Dispatched)', value: 'WZ' },
                                    { label: 'PZ (Goods Received)', value: 'PZ' },
                                    { label: 'Invoice (Faktura)', value: 'INVOICE' },
                                    { label: 'CMR Waybill', value: 'CMR' }
                                ]}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-600 block mb-0.5">Document Number</label>
                            <Input
                                type="text"
                                value={extractedData.docNumber}
                                onFocus={() => onFieldFocus('docNumber')}
                                onChange={(e) => handleFieldChange('docNumber', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-600 block mb-0.5">Issue Date</label>
                            <Input
                                type="date"
                                value={extractedData.issueDate}
                                onFocus={() => onFieldFocus('issueDate')}
                                onChange={(e) => handleFieldChange('issueDate', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-600 block mb-0.5">Delivery Date</label>
                            <Input
                                type="date"
                                value={extractedData.deliveryDate}
                                onFocus={() => onFieldFocus('deliveryDate')}
                                onChange={(e) => handleFieldChange('deliveryDate', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Counterparty / Contractor Grid */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                        Contractor / Supplier Information
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                            <label className="text-[10px] text-slate-600 block mb-0.5">Company / Counterparty Name</label>
                            <Input
                                type="text"
                                value={extractedData.contractorName}
                                onFocus={() => onFieldFocus('contractorName')}
                                onChange={(e) => handleFieldChange('contractorName', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-600 block mb-0.5">NIP / Tax ID</label>
                            <Input
                                type="text"
                                value={extractedData.contractorNip}
                                onFocus={() => onFieldFocus('contractorNip')}
                                onChange={(e) => handleFieldChange('contractorNip', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-600 block mb-0.5">Target Destination Warehouse</label>
                        <Input
                            type="text"
                            value={extractedData.destinationWarehouse}
                            onFocus={() => onFieldFocus('destinationWarehouse')}
                            onChange={(e) => handleFieldChange('destinationWarehouse', e.target.value)}
                        />
                    </div>
                </div>

                {/* Line Items Table */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">
                            Document Positions & SKUs ({extractedData.items.length})
                        </span>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleAddLineItem}
                            className="text-[11px] py-0.5 px-2"
                        >
                            + Add Position
                        </Button>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-300 bg-slate-200/80 text-slate-700 text-[10px] font-bold uppercase font-mono">
                                    <th className="py-1.5 px-2">SKU Code</th>
                                    <th className="py-1.5 px-2">Product Description</th>
                                    <th className="py-1.5 px-2 w-20">Qty</th>
                                    <th className="py-1.5 px-2 w-16">Unit</th>
                                    <th className="py-1.5 px-2 w-24">Price Net</th>
                                    <th className="py-1.5 px-2">LOT / Batch #</th>
                                    <th className="py-1.5 px-1 text-center w-8">&#10005;</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {extractedData.items.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-white transition-colors">
                                        <td className="py-1 px-1">
                                            <input
                                                type="text"
                                                value={item.sku}
                                                onFocus={() => onFieldFocus(`item_sku_${idx}`)}
                                                onChange={(e) => handleLineItemChange(idx, 'sku', e.target.value)}
                                                className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-xs font-mono font-bold text-blue-900"
                                            />
                                        </td>
                                        <td className="py-1 px-1">
                                            <input
                                                type="text"
                                                value={item.name}
                                                onFocus={() => onFieldFocus(`item_name_${idx}`)}
                                                onChange={(e) => handleLineItemChange(idx, 'name', e.target.value)}
                                                className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-xs"
                                            />
                                        </td>
                                        <td className="py-1 px-1">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleLineItemChange(idx, 'quantity', Number(e.target.value))}
                                                className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-xs font-mono text-right"
                                            />
                                        </td>
                                        <td className="py-1 px-1">
                                            <input
                                                type="text"
                                                value={item.unit}
                                                onChange={(e) => handleLineItemChange(idx, 'unit', e.target.value)}
                                                className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-xs text-center"
                                            />
                                        </td>
                                        <td className="py-1 px-1">
                                            <input
                                                type="number"
                                                value={item.unitPriceNet}
                                                onChange={(e) => handleLineItemChange(idx, 'unitPriceNet', Number(e.target.value))}
                                                className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-xs font-mono text-right"
                                            />
                                        </td>
                                        <td className="py-1 px-1">
                                            <input
                                                type="text"
                                                value={item.lotNumber || ''}
                                                placeholder="LOT #"
                                                onFocus={() => onFieldFocus(`item_lot_${idx}`)}
                                                onChange={(e) => handleLineItemChange(idx, 'lotNumber', e.target.value)}
                                                className="w-full bg-amber-50/70 border border-amber-300 rounded px-1.5 py-1 text-xs font-mono text-amber-900 font-semibold"
                                            />
                                        </td>
                                        <td className="py-1 px-1 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteLineItem(idx)}
                                                className="text-slate-400 hover:text-rose-600 font-bold p-1 cursor-pointer"
                                                title="Delete Position"
                                            >
                                                &#10005;
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Totals & Notes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-[10px] text-slate-600 block mb-0.5">Notes & Gate Reference</label>
                        <textarea
                            rows={2}
                            value={extractedData.notes || ''}
                            onFocus={() => onFieldFocus('notes')}
                            onChange={(e) => handleFieldChange('notes', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-mono outline-none focus:border-slate-800"
                        />
                    </div>
                    <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 flex flex-col justify-between font-mono">
                        <div className="flex justify-between text-slate-600">
                            <span>Total Net Amount:</span>
                            <span className="font-bold text-slate-900">{extractedData.totalNet.toFixed(2)} {extractedData.currency}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-300 pt-1">
                            <span>Total Gross:</span>
                            <span className="text-blue-900">{extractedData.totalGross.toFixed(2)} {extractedData.currency}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Action Bar */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onReRunOcr}
                    className="text-xs"
                >
                    Re-run OCR Extractor
                </Button>

                <div className="flex gap-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleApprove}
                        disabled={isPosting}
                        className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 border-emerald-700 shadow-sm"
                    >
                        {isPosting ? 'Posting...' : 'Approve & Post to WMS Inventory'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
