import React, { useState } from 'react';
import type { OcrDocument, OcrBoundingBox } from '../models/ocrDocument';

interface DocumentPdfViewerProps {
    document: OcrDocument;
    onSnippetClick: (snippet: OcrBoundingBox) => void;
    focusedFieldKey: string | null;
}

export const DocumentPdfViewer: React.FC<DocumentPdfViewerProps> = ({
    document,
    onSnippetClick,
    focusedFieldKey
}) => {
    const [zoom, setZoom] = useState<number>(1.0);
    const [showOcrHighlights, setShowOcrHighlights] = useState<boolean>(true);

    const { extractedData, rawBoundingBoxes } = document;

    const unassignedBoxes = rawBoundingBoxes.filter(b => !b.isExtracted);

    const getBoxForField = (fieldKey: string): OcrBoundingBox | undefined => {
        return rawBoundingBoxes.find(b => b.targetFieldKey === fieldKey);
    };

    {/* Helper to render an interactive in-place OCR field snippet on the document scan */}
    const renderOcrSnippet = (
        fieldKey: string,
        textValue: string | number,
        fallbackText?: string,
        customClass: string = ''
    ) => {
        const matchingBox = getBoxForField(fieldKey) || {
            id: `box-${fieldKey}`,
            text: String(textValue || fallbackText || ''),
            confidence: 0.98,
            rect: { topPercent: 0, leftPercent: 0, widthPercent: 0, heightPercent: 0 },
            targetFieldKey: fieldKey,
            isExtracted: true
        };

        const isTargeted = focusedFieldKey === fieldKey;
        const confidencePct = Math.round(matchingBox.confidence * 100);

        if (!showOcrHighlights) {
            return <span className={customClass}>{textValue || fallbackText}</span>;
        }

        return (
            <span
                onClick={(e) => {
                    e.stopPropagation();
                    onSnippetClick(matchingBox);
                }}
                className={`relative inline-flex items-center gap-1 px-1.5 py-0.5 rounded transition-all cursor-pointer group ${
                    isTargeted
                        ? 'ring-2 ring-amber-500 bg-amber-100 text-amber-950 font-bold shadow-xs'
                        : matchingBox.isExtracted
                        ? 'bg-blue-50/80 hover:bg-blue-100/90 text-slate-900 border border-blue-200/80 hover:border-blue-400'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-dashed border-amber-400'
                } ${customClass}`}
                title={`Click to sync "${matchingBox.text}" with form (${confidencePct}% confidence)`}
            >
                <span>{textValue || fallbackText || '—'}</span>

                {/* Subtle accuracy pill on hover */}
                <span className="hidden group-hover:inline-block absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-md z-40 whitespace-nowrap pointer-events-none">
                    {confidencePct}% OCR • Click to map
                </span>
            </span>
        );
    };

    return (
        <div className="w-full bg-slate-100 border border-slate-300 rounded-lg p-3 flex flex-col h-full shadow-xs text-xs">
            {/* Top Viewer Control Bar */}
            <div className="bg-white border border-slate-300 rounded-md px-3 py-2 mb-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-xs">
                        Scanned Document Preview
                    </span>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        {document.fileName}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Zoom Buttons */}
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setZoom(z => Math.max(0.8, z - 0.1))}
                            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-bold cursor-pointer"
                        >
                            -
                        </button>
                        <span className="font-mono text-[11px] text-slate-800 w-12 text-center">
                            {Math.round(zoom * 100)}%
                        </span>
                        <button
                            type="button"
                            onClick={() => setZoom(z => Math.min(1.3, z + 0.1))}
                            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-bold cursor-pointer"
                        >
                            +
                        </button>
                    </div>

                    {/* Toggle OCR visual field badges */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium select-none">
                        <input
                            type="checkbox"
                            checked={showOcrHighlights}
                            onChange={(e) => setShowOcrHighlights(e.target.checked)}
                            className="w-3.5 h-3.5 accent-slate-800"
                        />
                        <span>OCR Snippets Overlay</span>
                    </label>
                </div>
            </div>

            {/* Document Render Sheet Canvas */}
            <div className="flex-1 overflow-auto flex justify-center p-2 bg-slate-200/50 rounded border border-slate-200">
                <div
                    className="bg-white shadow-md border border-slate-300 select-none transition-transform origin-top text-slate-900 font-sans rounded-xs"
                    style={{
                        width: `${560 * zoom}px`,
                        minHeight: `${760 * zoom}px`,
                        padding: `${24 * zoom}px`
                    }}
                >
                    {/* Document Header Bar */}
                    <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-4">
                        <div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
                                DOCUMENT CLASSIFICATION
                            </span>
                            <h2 className="text-xl font-black font-mono tracking-tight text-slate-900">
                                {extractedData.docType === 'WZ' ? 'WYDANIE ZEWNĘTRZNE (WZ)' :
                                 extractedData.docType === 'PZ' ? 'PRZYJĘCIE ZEWNĘTRZNE (PZ)' : 'FAKTURA VAT'}
                            </h2>
                        </div>
                        <div className="text-right">
                            <span className="text-[9px] text-slate-500 font-mono block">DOCUMENT NUMBER</span>
                            {renderOcrSnippet('docNumber', extractedData.docNumber, 'WZ/2026/08/1402', 'font-bold font-mono text-sm text-slate-900')}
                        </div>
                    </div>

                    {/* Metadata: Counterparty and Warehouse Dates */}
                    <div className="grid grid-cols-2 gap-3 pb-3 mb-3 border-b border-slate-200 text-[11px]">
                        <div className="bg-slate-50/70 p-2.5 rounded border border-slate-200 space-y-1.5">
                            <span className="font-bold text-[9px] text-slate-500 uppercase block font-mono">
                                SUPPLIER / CONTRACTOR
                            </span>
                            <div>
                                {renderOcrSnippet('contractorName', extractedData.contractorName, 'Apex Machinery Sp. z o.o.', 'font-bold text-slate-900 block')}
                            </div>
                            <div className="flex items-center gap-1 text-slate-600 font-mono text-[10px]">
                                <span>NIP:</span>
                                {renderOcrSnippet('contractorNip', extractedData.contractorNip, 'PL5252849102', 'font-semibold text-slate-800')}
                            </div>
                            <div className="text-slate-500 text-[10px] truncate">
                                {extractedData.contractorAddress}
                            </div>
                        </div>

                        <div className="bg-slate-50/70 p-2.5 rounded border border-slate-200 space-y-1.5">
                            <span className="font-bold text-[9px] text-slate-500 uppercase block font-mono">
                                DATES & DESTINATION
                            </span>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-500">Issue Date:</span>
                                {renderOcrSnippet('issueDate', extractedData.issueDate, '2026-08-01', 'font-mono font-bold text-slate-800')}
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-500">Delivery Date:</span>
                                {renderOcrSnippet('deliveryDate', extractedData.deliveryDate, '2026-08-02', 'font-mono font-bold text-slate-800')}
                            </div>
                            <div className="pt-0.5 text-[10px]">
                                <span className="text-slate-500 block">Warehouse:</span>
                                {renderOcrSnippet('destinationWarehouse', extractedData.destinationWarehouse, 'Main Zone A', 'text-slate-700 font-medium truncate block')}
                            </div>
                        </div>
                    </div>

                    {/* Specification of Goods Table */}
                    <div className="py-2">
                        <span className="font-bold text-[9px] text-slate-500 uppercase block font-mono mb-1.5">
                            SPECIFICATION OF GOODS / POSITIONS
                        </span>
                        <table className="w-full text-left text-[10px] border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-800 bg-slate-100 text-slate-800 font-bold font-mono">
                                    <th className="py-1.5 px-1.5">LP</th>
                                    <th className="py-1.5 px-1.5">SKU / Code</th>
                                    <th className="py-1.5 px-1.5">Product Name</th>
                                    <th className="py-1.5 px-1.5 text-right">Qty</th>
                                    <th className="py-1.5 px-1.5">Unit</th>
                                    <th className="py-1.5 px-1.5 text-right">Price Net</th>
                                    <th className="py-1.5 px-1.5">LOT / Batch</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 font-mono text-[10px]">
                                {extractedData.items.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-slate-50/80">
                                        <td className="py-1.5 px-1.5 text-slate-500">{idx + 1}</td>
                                        <td className="py-1.5 px-1.5">
                                            {renderOcrSnippet(`item_sku_${idx}`, item.sku, 'SKU', 'font-bold text-blue-900')}
                                        </td>
                                        <td className="py-1.5 px-1.5 font-sans font-medium text-slate-900 max-w-[150px] truncate">
                                            {renderOcrSnippet(`item_name_${idx}`, item.name, 'Name', 'truncate')}
                                        </td>
                                        <td className="py-1.5 px-1.5 text-right font-bold">
                                            {item.quantity}
                                        </td>
                                        <td className="py-1.5 px-1.5 text-slate-600">
                                            {item.unit}
                                        </td>
                                        <td className="py-1.5 px-1.5 text-right font-bold text-slate-800">
                                            {item.unitPriceNet.toFixed(2)}
                                        </td>
                                        <td className="py-1.5 px-1.5">
                                            {renderOcrSnippet(
                                                `item_lot_${idx}`,
                                                item.lotNumber || '',
                                                'LOT-BATCH',
                                                item.lotNumber
                                                    ? 'font-bold text-amber-900 bg-amber-50/70 border border-amber-300'
                                                    : 'text-amber-700 italic border border-dashed border-amber-400 bg-amber-50/40'
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Notes & Totals Summary */}
                    <div className="border-t-2 border-slate-800 pt-3 mt-4 flex justify-between items-end text-xs">
                        <div className="text-[10px] text-slate-600 font-mono">
                            {extractedData.notes && (
                                <div className="space-y-0.5">
                                    <span className="text-slate-400 font-bold block">LOGISTICS NOTE:</span>
                                    {renderOcrSnippet('notes', extractedData.notes, 'Note', 'bg-slate-50 border border-slate-200 max-w-[240px] block truncate')}
                                </div>
                            )}
                        </div>

                        <div className="space-y-1 text-right font-mono">
                            <div className="text-slate-600 text-[11px]">
                                Total Net: {renderOcrSnippet('totalNet', `${extractedData.totalNet.toFixed(2)} ${extractedData.currency}`, '0.00 PLN', 'font-bold text-slate-900')}
                            </div>
                            <div className="text-sm font-bold text-slate-900">
                                Total Gross: {renderOcrSnippet('totalGross', `${extractedData.totalGross.toFixed(2)} ${extractedData.currency}`, '0.00 PLN', 'text-blue-900 font-extrabold')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Unassigned Snippets Quick-Pick Bar */}
            {unassignedBoxes.length > 0 && (
                <div className="mt-3 bg-amber-50 border border-amber-300 rounded-md p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-amber-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            Unassigned OCR Snippets ({unassignedBoxes.length})
                        </span>
                        <span className="text-[10px] text-amber-700">
                            Click any snippet to insert into the active input field
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {unassignedBoxes.map(box => (
                            <button
                                key={box.id}
                                type="button"
                                onClick={() => onSnippetClick(box)}
                                className="bg-white hover:bg-amber-100 border border-amber-300 rounded px-2 py-1 text-[11px] font-mono text-slate-800 font-semibold cursor-pointer shadow-xs transition-colors"
                            >
                                <span>{box.text}</span>
                                <span className="ml-1 text-[9px] text-amber-700 font-bold">
                                    ({Math.round(box.confidence * 100)}%)
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
