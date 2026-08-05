import React from 'react';
import { OcrSnippet } from './OcrSnippet';
import { formatCurrency } from '@/utils/format';
import type { OcrBoundingBox } from '../models/ocrDocument';

interface TotalsSectionProps {
    notes?: string;
    totalNet: number;
    totalGross: number;
    currency?: string;
    getBoxForField: (key: string) => OcrBoundingBox | undefined;
    onSnippetClick: (box: OcrBoundingBox) => void;
    showOcrHighlights: boolean;
    focusedFieldKey: string | null;
}

export const TotalsSection: React.FC<TotalsSectionProps> = ({ notes, totalNet, totalGross, currency, getBoxForField, onSnippetClick, showOcrHighlights, focusedFieldKey }) => {
    return (
        <div className="border-t-2 border-slate-800 pt-3 mt-4 flex justify-between items-end text-xs">
            <div className="text-[0.625rem] text-slate-600 font-mono">
                {notes && (
                    <div className="space-y-0.5">
                        <span className="text-slate-400 font-bold block">LOGISTICS NOTE:</span>
                        <OcrSnippet fieldKey="notes" textValue={notes as any} fallbackText="Note" customClass="bg-slate-50 border border-slate-200 max-w-[15rem] block truncate" getBoxForField={getBoxForField} onSnippetClick={onSnippetClick} showOcrHighlights={showOcrHighlights} focusedFieldKey={focusedFieldKey} />
                    </div>
                )}
            </div>

            <div className="space-y-1 text-right font-mono">
                <div className="text-slate-600 text-[0.6875rem]">
                    Total Net: <OcrSnippet fieldKey="totalNet" textValue={formatCurrency(totalNet, currency || 'PLN')} fallbackText="0.00 PLN" customClass="font-bold text-slate-900" getBoxForField={getBoxForField} onSnippetClick={onSnippetClick} showOcrHighlights={showOcrHighlights} focusedFieldKey={focusedFieldKey} />
                </div>
                <div className="text-sm font-bold text-slate-900">
                    Total Gross: <OcrSnippet fieldKey="totalGross" textValue={formatCurrency(totalGross, currency || 'PLN')} fallbackText="0.00 PLN" customClass="text-blue-900 font-extrabold" getBoxForField={getBoxForField} onSnippetClick={onSnippetClick} showOcrHighlights={showOcrHighlights} focusedFieldKey={focusedFieldKey} />
                </div>
            </div>
        </div>
    );
};

export default TotalsSection;
