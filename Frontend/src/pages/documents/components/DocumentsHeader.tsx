import React from 'react';
import { Button, Select } from '@/components/common';
import type { OcrDocument } from '../models/ocrDocument';

interface DocumentsHeaderProps {
    documents: OcrDocument[];
    activeDocId: string;
    onSelectDocument: (id: string) => void;
    onUploadClick: () => void;
    totalDocs: number;
    pendingCount: number;
    avgConfidence: number;
}

export const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({
    documents,
    activeDocId,
    onSelectDocument,
    onUploadClick,
    totalDocs,
    pendingCount,
    avgConfidence
}) => {
    return (
        <div className="w-full space-y-4 mb-4">
            {/* Top Dark Header */}
            <div className="w-full bg-[#384155] text-white p-4 rounded-lg shadow-md border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h1 className="bg-amber-400 text-slate-900 font-black text-2xl px-2 py-0.5 rounded tracking-wide font-mono uppercase">
                            DOCUMENT OCR STUDIO
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="w-64">
                        <Select
                            value={activeDocId}
                            onChange={(e) => onSelectDocument(e.target.value)}
                            options={documents.map(d => ({
                                label: `${d.extractedData.docType}: ${d.extractedData.docNumber} (${d.fileName})`,
                                value: d.id
                            }))}
                        />
                    </div>

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onUploadClick}
                        className="text-xs font-semibold shadow-sm bg-emerald-600 hover:bg-emerald-700 border-emerald-700"
                    >
                        + Upload Scan (PDF/PNG)
                    </Button>
                </div>
            </div>

            {/* Quick KPI Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Loaded Scans
                    </span>
                    <span className="text-xl font-bold font-mono text-slate-900">
                        {totalDocs} Documents
                    </span>
                </div>

                <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Pending Verification
                    </span>
                    <span className={`text-xl font-bold font-mono ${pendingCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                        {pendingCount} Pending
                    </span>
                </div>

                <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        OCR Accuracy Score
                    </span>
                    <span className="text-xl font-bold font-mono text-emerald-600">
                        {Math.round(avgConfidence * 100)}% Verified
                    </span>
                </div>

                <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Extraction Mode
                    </span>
                    <span className="text-xs font-bold font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded inline-block mt-1">
                        Split-Screen Visual Sync
                    </span>
                </div>
            </div>
        </div>
    );
};
