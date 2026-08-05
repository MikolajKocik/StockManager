import React from 'react';
import InfoCard from './InfoCard';
import { OcrSnippet } from './OcrSnippet';
import type { OcrBoundingBox } from '../models/ocrDocument';

interface SupplierSectionProps {
    contractorName?: string;
    contractorNip?: string;
    contractorAddress?: string;
    getBoxForField: (key: string) => OcrBoundingBox | undefined;
    onSnippetClick: (box: OcrBoundingBox) => void;
    showOcrHighlights: boolean;
    focusedFieldKey: string | null;
}

export const SupplierSection: React.FC<SupplierSectionProps> = ({
    contractorName,
    contractorNip,
    contractorAddress,
    getBoxForField,
    onSnippetClick,
    showOcrHighlights,
    focusedFieldKey
}) => {
    return (
        <InfoCard title={"SUPPLIER / CONTRACTOR"}>
            <div>
                <OcrSnippet fieldKey="contractorName" textValue={contractorName as any} fallbackText="Apex Machinery Sp. z o.o." customClass="font-bold text-slate-900 block" getBoxForField={getBoxForField} onSnippetClick={onSnippetClick} showOcrHighlights={showOcrHighlights} focusedFieldKey={focusedFieldKey} />
            </div>
            <div className="flex items-center gap-1 text-slate-600 font-mono text-[0.625rem]">
                <span>NIP:</span>
                <OcrSnippet fieldKey="contractorNip" textValue={contractorNip as any} fallbackText="PL5252849102" customClass="font-semibold text-slate-800" getBoxForField={getBoxForField} onSnippetClick={onSnippetClick} showOcrHighlights={showOcrHighlights} focusedFieldKey={focusedFieldKey} />
            </div>
            <div className="text-slate-500 text-[0.625rem] truncate">{contractorAddress}</div>
        </InfoCard>
    );
};

export default SupplierSection;
