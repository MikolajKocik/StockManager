import React from 'react';
import type { OcrBoundingBox } from '../models/ocrDocument';

interface UnassignedSnippetsPanelProps {
    boxes: OcrBoundingBox[];
    onSnippetClick: (box: OcrBoundingBox) => void;
}

export const UnassignedSnippetsPanel: React.FC<UnassignedSnippetsPanelProps> = ({ boxes, onSnippetClick }) => {
    if (boxes.length === 0) return null;

    return (
        <div className="mt-3 bg-amber-50 border border-amber-300 rounded-md p-2.5 space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="font-bold text-[0.6875rem] text-amber-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Unassigned OCR Snippets ({boxes.length})
                </span>
                <span className="text-[0.625rem] text-amber-700">Click any snippet to insert into the active input field</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {boxes.map(box => (
                    <button key={box.id} type="button" onClick={() => onSnippetClick(box)} className="bg-white hover:bg-amber-100 border border-amber-300 rounded px-2 py-1 text-[0.6875rem] font-mono text-slate-800 font-semibold cursor-pointer shadow-xs transition-colors">
                        <span>{box.text}</span>
                        <span className="ml-1 text-[0.5625rem] text-amber-700 font-bold">({Math.round(box.confidence * 100)}%)</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default UnassignedSnippetsPanel;
