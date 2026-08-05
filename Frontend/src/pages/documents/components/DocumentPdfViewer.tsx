import React, { useState } from 'react';
import type { OcrDocument, OcrBoundingBox } from '../models/ocrDocument';
import ViewerToolbar from './ViewerToolbar';
import DocumentHeader from './DocumentHeader';
import SupplierSection from './SupplierSection';
import DatesSection from './DatesSection';
import GoodsTable from './GoodsTable';
import TotalsSection from './TotalsSection';
import UnassignedSnippetsPanel from './UnassignedSnippetsPanel';

interface DocumentPdfViewerProps {
    document: OcrDocument;
    onSnippetClick: (snippet: OcrBoundingBox) => void;
    focusedFieldKey: string | null;
}

export const DocumentPdfViewer: React.FC<DocumentPdfViewerProps> = ({ document, onSnippetClick, focusedFieldKey }) => {
    const [zoom, setZoom] = useState<number>(1.0);
    const [showOcrHighlights, setShowOcrHighlights] = useState<boolean>(true);

    const { extractedData, rawBoundingBoxes } = document;
    const unassignedBoxes = rawBoundingBoxes.filter(b => !b.isExtracted);

    const getBoxForField = (fieldKey: string): OcrBoundingBox | undefined => rawBoundingBoxes.find(b => b.targetFieldKey === fieldKey);

    return (
        <div className="w-full bg-slate-100 border border-slate-300 rounded-lg p-3 flex flex-col h-full shadow-xs text-xs">
            <ViewerToolbar fileName={document.fileName} zoom={zoom} setZoom={setZoom as any} showOcrHighlights={showOcrHighlights} setShowOcrHighlights={setShowOcrHighlights} />

            <div className="flex-1 overflow-auto flex justify-center p-2 bg-slate-200/50 rounded border border-slate-200">
                <div className="bg-white shadow-md border border-slate-300 select-none transition-transform origin-top text-slate-900 font-sans rounded-xs" style={{ width: `${560 * zoom}px`, minHeight: `${760 * zoom}px`, padding: `${24 * zoom}px` }}>
                    <DocumentHeader docType={extractedData.docType} docNumber={extractedData.docNumber} getBoxForField={getBoxForField} onSnippetClick={onSnippetClick} showOcrHighlights={showOcrHighlights} focusedFieldKey={focusedFieldKey} />

                    <div className="grid grid-cols-2 gap-3 pb-3 mb-3 border-b border-slate-200 text-[0.6875rem]">
                        <SupplierSection contractorName={extractedData.contractorName} contractorNip={extractedData.contractorNip} contractorAddress={extractedData.contractorAddress} getBoxForField={getBoxForField} onSnippetClick={onSnippetClick} showOcrHighlights={showOcrHighlights} focusedFieldKey={focusedFieldKey} />
                        <DatesSection issueDate={extractedData.issueDate} deliveryDate={extractedData.deliveryDate} destinationWarehouse={extractedData.destinationWarehouse} getBoxForField={getBoxForField} onSnippetClick={onSnippetClick} showOcrHighlights={showOcrHighlights} focusedFieldKey={focusedFieldKey} />
                    </div>

                    <GoodsTable items={extractedData.items} getBoxForField={getBoxForField} onSnippetClick={onSnippetClick} showOcrHighlights={showOcrHighlights} focusedFieldKey={focusedFieldKey} />

                    <TotalsSection notes={extractedData.notes} totalNet={extractedData.totalNet} totalGross={extractedData.totalGross} currency={extractedData.currency} getBoxForField={getBoxForField} onSnippetClick={onSnippetClick} showOcrHighlights={showOcrHighlights} focusedFieldKey={focusedFieldKey} />
                </div>
            </div>

            <UnassignedSnippetsPanel boxes={unassignedBoxes} onSnippetClick={onSnippetClick} />
        </div>
    );
};

export default DocumentPdfViewer;
