import React from 'react';
import type { OcrBoundingBox } from '../models/ocrDocument';

interface OcrSnippetProps {
    fieldKey: string;
    textValue: string | number | undefined | null;
    fallbackText?: string;
    customClass?: string;
    getBoxForField: (key: string) => OcrBoundingBox | undefined;
    onSnippetClick: (box: OcrBoundingBox) => void;
    showOcrHighlights: boolean;
    focusedFieldKey: string | null;
}

export const OcrSnippet: React.FC<OcrSnippetProps> = ({
    fieldKey,
    textValue,
    fallbackText,
    customClass = '',
    getBoxForField,
    onSnippetClick,
    showOcrHighlights,
    focusedFieldKey
}) => {
    const matchingBox = getBoxForField(fieldKey) || {
        id: `box-${fieldKey}`,
        text: String(textValue || fallbackText || ''),
        confidence: 0.98,
        rect: { topPercent: 0, leftPercent: 0, widthPercent: 0, heightPercent: 0 },
        targetFieldKey: fieldKey,
        isExtracted: true
    } as OcrBoundingBox;

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

            <span className="hidden group-hover:inline-block absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[0.5625rem] font-mono font-bold px-1.5 py-0.5 rounded shadow-md z-40 whitespace-nowrap pointer-events-none">
                {confidencePct}% OCR • Click to map
            </span>
        </span>
    );
};

export default OcrSnippet;
