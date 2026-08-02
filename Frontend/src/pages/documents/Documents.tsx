import { useState, useRef } from 'react';
import { DocumentsHeader } from './components/DocumentsHeader';
import { DocumentPdfViewer } from './components/DocumentPdfViewer';
import { DocumentOcrForm } from './components/DocumentOcrForm';

import { MOCK_OCR_DOCUMENTS } from './mocks/ocrDocuments.mocks';
import type { OcrDocument, OcrExtractedData, OcrBoundingBox } from './models/ocrDocument';
import toast from 'react-hot-toast';

export default function Documents() {
    const [documents, setDocuments] = useState<OcrDocument[]>(MOCK_OCR_DOCUMENTS);
    const [activeDocId, setActiveDocId] = useState<string>(MOCK_OCR_DOCUMENTS[0].id);
    const [focusedFieldKey, setFocusedFieldKey] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeDoc = documents.find(d => d.id === activeDocId) || documents[0];

    {/* OCR Handlers */ }
    const handleUpdateDocumentData = (updatedData: OcrExtractedData) => {
        setDocuments(prev => prev.map(d => d.id === activeDoc.id ? { ...d, extractedData: updatedData } : d));
    };

    const handleSnippetClick = (snippet: OcrBoundingBox) => {
        const targetKey = focusedFieldKey || snippet.targetFieldKey;

        if (!targetKey) {
            toast('Click on a form field on the right first, then click the scan text snippet to paste it.', {
                icon: 'ℹ️'
            });
            return;
        }

        // Check if target is a line item field (e.g. item_lot_0, item_sku_1)
        if (targetKey.startsWith('item_')) {
            const parts = targetKey.split('_');
            const fieldName = parts[1]; // lot, sku, name
            const itemIdx = parseInt(parts[2], 10);

            if (!isNaN(itemIdx) && activeDoc.extractedData.items[itemIdx]) {
                const newItems = [...activeDoc.extractedData.items];
                if (fieldName === 'lot') newItems[itemIdx].lotNumber = snippet.text;
                if (fieldName === 'sku') newItems[itemIdx].sku = snippet.text;
                if (fieldName === 'name') newItems[itemIdx].name = snippet.text;

                handleUpdateDocumentData({
                    ...activeDoc.extractedData,
                    items: newItems
                });
                toast.success(`Assigned "${snippet.text}" to item #${itemIdx + 1} (${fieldName.toUpperCase()})`);
                return;
            }
        }

        // Standard Top-Level Document Field
        if (targetKey in activeDoc.extractedData) {
            handleUpdateDocumentData({
                ...activeDoc.extractedData,
                [targetKey]: snippet.text
            });
            toast.success(`Assigned "${snippet.text}" to ${targetKey}`);
        }
    };

    const handlePostToWms = () => {
        setDocuments(prev => prev.map(d => d.id === activeDoc.id ? { ...d, status: 'POSTED_TO_WMS' } : d));
    };

    const handleReRunOcr = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 800)),
            {
                loading: 'Re-running optical character extraction model on scan...',
                success: <b>OCR extraction refreshed with 98% confidence!</b>,
                error: <b>OCR failed</b>
            }
        );
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const newDocId = `DOC-UP-${Date.now()}`;
        const newDoc: OcrDocument = {
            id: newDocId,
            fileName: file.name,
            fileSize: `${Math.round(file.size / 1024)} KB`,
            uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'PENDING_REVIEW',
            overallConfidence: 0.94,
            extractedData: {
                docType: 'WZ',
                docNumber: `WZ/${new Date().getFullYear()}/08/${Math.floor(1000 + Math.random() * 9000)}`,
                issueDate: new Date().toISOString().split('T')[0],
                deliveryDate: new Date().toISOString().split('T')[0],
                contractorName: 'Incoming Partner Logistics Sp. z o.o.',
                contractorNip: 'PL9921002910',
                contractorAddress: 'ul. Magazynowa 1, 00-001 Warszawa',
                destinationWarehouse: 'Main High-Bay Warehouse (Zone A)',
                totalNet: 4500.0,
                totalGross: 5535.0,
                currency: 'PLN',
                items: [
                    {
                        id: `item-${Date.now()}-1`,
                        sku: 'VALVE-SERVO-01',
                        name: 'Servo Proportional Valve 24V',
                        quantity: 6,
                        unit: 'pcs',
                        unitPriceNet: 750.0,
                        vatRate: 23,
                        lotNumber: 'LOT-2026-SRV-8'
                    }
                ],
                notes: 'Uploaded via manual scan ingestion'
            },
            rawBoundingBoxes: [
                {
                    id: 'b-up-1',
                    text: 'Incoming Partner Logistics Sp. z o.o.',
                    confidence: 0.96,
                    rect: { topPercent: 16, leftPercent: 8, widthPercent: 45, heightPercent: 3.5 },
                    targetFieldKey: 'contractorName',
                    isExtracted: true
                },
                {
                    id: 'b-up-2',
                    text: '4 500.00 PLN',
                    confidence: 0.98,
                    rect: { topPercent: 84, leftPercent: 68, widthPercent: 24, heightPercent: 3.5 },
                    targetFieldKey: 'totalNet',
                    isExtracted: true
                }
            ]
        };

        setDocuments(prev => [newDoc, ...prev]);
        setActiveDocId(newDocId);
        toast.success(`Uploaded and parsed ${file.name}`);
    };

    {/* KPI Calculations */ }
    const totalDocs = documents.length;
    const pendingCount = documents.filter(d => d.status === 'PENDING_REVIEW').length;
    const avgConfidence = documents.reduce((acc, d) => acc + d.overallConfidence, 0) / (totalDocs || 1);

    return (
        <div className="w-full space-y-4 pb-12">
            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
            />

            {/* Header & Metrics */}
            <DocumentsHeader
                documents={documents}
                activeDocId={activeDocId}
                onSelectDocument={setActiveDocId}
                onUploadClick={handleUploadClick}
                totalDocs={totalDocs}
                pendingCount={pendingCount}
                avgConfidence={avgConfidence}
            />

            {/* Wide Full-Width Split-Screen Workspace */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Left Pane: Interactive Document PDF & Scan Viewer */}
                <div className="lg:col-span-6 flex flex-col min-h-160">
                    <DocumentPdfViewer
                        document={activeDoc}
                        onSnippetClick={handleSnippetClick}
                        focusedFieldKey={focusedFieldKey}
                    />
                </div>

                {/* Right Pane: Extracted Data & WMS Verification Form */}
                <div className="lg:col-span-6 flex flex-col min-h-160">
                    <DocumentOcrForm
                        document={activeDoc}
                        onUpdateDocumentData={handleUpdateDocumentData}
                        onPostToWms={handlePostToWms}
                        onReRunOcr={handleReRunOcr}
                        focusedFieldKey={focusedFieldKey}
                        onFieldFocus={setFocusedFieldKey}
                    />
                </div>
            </div>
        </div>
    );
}
