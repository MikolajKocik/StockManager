import React from 'react';
import { Header, Button, Select } from '@/components/common/core';
import { KpiCard, Badge } from '@/components/common/custom'
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
    const documentOptions = documents.map(d => ({
        label: `${d.extractedData.docType}: ${d.extractedData.docNumber} (${d.fileName})`,
        value: d.id
    }));

    return (
        <div className="w-full space-y-4 mb-4">
            <Header
                title="Document OCR & Invoice Processing"
                subtitle="Automated document text extraction, PO matching, and split-screen visual verification"
                badge={
                    <Badge variant="brand">
                        OCR ENGINE
                    </Badge>
                }
                actions={
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="w-72">
                            <Select
                                value={activeDocId}
                                onChange={(e) => onSelectDocument(e.target.value)}
                                options={documentOptions}
                            />
                        </div>

                        <Button
                            variant="primary"
                            size="sm"
                            onClick={onUploadClick}
                        >
                            Upload Scan (PDF/PNG)
                        </Button>
                    </div>
                }
            />

            {/* Quick KPI Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KpiCard
                    title="Loaded Scans"
                    value={`${totalDocs} Documents`}
                    subtitle="Processed in current batch"
                    variant="primary"
                />

                <KpiCard
                    title="Pending Verification"
                    value={`${pendingCount} Pending`}
                    subtitle={pendingCount > 0 ? 'Requires human confirmation' : 'All invoices validated'}
                    variant={pendingCount > 0 ? 'warning' : 'default'}
                    badge={pendingCount > 0 ? <Badge variant="warning">Review</Badge> : undefined}
                />

                <KpiCard
                    title="OCR Accuracy Score"
                    value={`${Math.round(avgConfidence * 100)}%`}
                    subtitle="Confidence threshold score"
                    variant="success"
                />

                <KpiCard
                    title="Extraction Mode"
                    value="Split-Screen"
                    subtitle="Interactive visual sync"
                    variant="default"
                />
            </div>
        </div>
    );
};
