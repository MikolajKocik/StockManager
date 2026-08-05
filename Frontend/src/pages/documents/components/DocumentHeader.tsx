import React from 'react';
import { OcrSnippet } from './OcrSnippet';
import type { OcrBoundingBox } from '../models/ocrDocument';

interface DocumentHeaderProps {
    docType: string;
    docNumber: string | number | undefined;
    getBoxForField: (key: string) => OcrBoundingBox | undefined;
    onSnippetClick: (box: OcrBoundingBox) => void;
    showOcrHighlights: boolean;
    focusedFieldKey: string | null;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
    docType,
    docNumber,
    getBoxForField,
    onSnippetClick,
    showOcrHighlights,
    focusedFieldKey
}) => {
    return (
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-4">
            <div>
                <span className="text-[0.5625rem] font-bold text-slate-500 uppercase tracking-widest block font-mono">DOCUMENT CLASSIFICATION</span>
                <h2 className="text-xl font-black font-mono tracking-tight text-slate-900">
                    {docType === 'WZ' ? 'WYDANIE ZEWNĘTRZNE (WZ)' : docType === 'PZ' ? 'PRZYJĘCIE ZEWNĘTRZNE (PZ)' : 'FAKTURA VAT'}
                </h2>
            </div>
            <div className="text-right">
                <span className="text-[0.5625rem] text-slate-500 font-mono block">DOCUMENT NUMBER</span>
                <OcrSnippet
                    fieldKey="docNumber"
                    textValue={docNumber as any}
                    fallbackText="WZ/2026/08/1402"
                    customClass="font-bold font-mono text-sm text-slate-900"
                    getBoxForField={getBoxForField}
                    onSnippetClick={onSnippetClick}
                    showOcrHighlights={showOcrHighlights}
                    focusedFieldKey={focusedFieldKey}
                />
            </div>
        </div>
    );
};

export default DocumentHeader;
