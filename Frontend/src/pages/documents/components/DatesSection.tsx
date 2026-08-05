import React from 'react';
import InfoCard from './InfoCard';
import { OcrSnippet } from './OcrSnippet';
import type { OcrBoundingBox } from '../models/ocrDocument';

interface DatesSectionProps {
    issueDate?: string;
    deliveryDate?: string;
    destinationWarehouse?: string;
    getBoxForField: (key: string) => OcrBoundingBox | undefined;
    onSnippetClick: (box: OcrBoundingBox) => void;
    showOcrHighlights: boolean;
    focusedFieldKey: string | null;
}

export const DatesSection: React.FC<DatesSectionProps> = ({
    issueDate,
    deliveryDate,
    destinationWarehouse,
    getBoxForField,
    onSnippetClick,
    showOcrHighlights,
    focusedFieldKey
}) => {
    return (
        <InfoCard title={"DATES & DESTINATION"}>
            <div className="flex justify-between items-center text-[0.625rem]">
                <span className="text-slate-500">Issue Date:</span>
                <OcrSnippet fieldKey="issueDate" textValue={issueDate as any} fallbackText="2026-08-01" customClass="font-mono font-bold text-slate-800" getBoxForField={getBoxForField} onSnippetClick={onSnippetClick} showOcrHighlights={showOcrHighlights} focusedFieldKey={focusedFieldKey} />
            </div>
            <div className="flex justify-between items-center text-[0.625rem]">
                <span className="text-slate-500">Delivery Date:</span>
                <OcrSnippet fieldKey="deliveryDate" textValue={deliveryDate as any} fallbackText="2026-08-02" customClass="font-mono font-bold text-slate-800" getBoxForField={getBoxForField} onSnippetClick={onSnippetClick} showOcrHighlights={showOcrHighlights} focusedFieldKey={focusedFieldKey} />
            </div>
            <div className="pt-0.5 text-[0.625rem]">
                <span className="text-slate-500 block">Warehouse:</span>
                <OcrSnippet fieldKey="destinationWarehouse" textValue={destinationWarehouse as any} fallbackText="Main Zone A" customClass="text-slate-700 font-medium truncate block" getBoxForField={getBoxForField} onSnippetClick={onSnippetClick} showOcrHighlights={showOcrHighlights} focusedFieldKey={focusedFieldKey} />
            </div>
        </InfoCard>
    );
};

export default DatesSection;
