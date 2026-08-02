export type DocumentType = 'WZ' | 'PZ' | 'INVOICE' | 'CMR';
export type OcrDocStatus = 'PROCESSED' | 'PENDING_REVIEW' | 'POSTED_TO_WMS';

export interface OcrBoundingBox {
    id: string;
    text: string;
    confidence: number; // 0.0 - 1.0
    rect: {
        topPercent: number;
        leftPercent: number;
        widthPercent: number;
        heightPercent: number;
    };
    targetFieldKey?: string; // e.g. 'docNumber', 'contractorName', 'contractorNip', 'issueDate', 'lotNumber'
    isExtracted: boolean;
}

export interface OcrLineItem {
    id: string;
    sku: string;
    name: string;
    quantity: number;
    unit: string;
    unitPriceNet: number;
    vatRate: number;
    lotNumber?: string;
}

export interface OcrExtractedData {
    docType: DocumentType;
    docNumber: string;
    issueDate: string;
    deliveryDate: string;
    contractorName: string;
    contractorNip: string;
    contractorAddress: string;
    destinationWarehouse: string;
    totalNet: number;
    totalGross: number;
    currency: string;
    items: OcrLineItem[];
    notes?: string;
}

export interface OcrDocument {
    id: string;
    fileName: string;
    fileSize: string;
    uploadedAt: string;
    status: OcrDocStatus;
    overallConfidence: number; // 0.0 - 1.0
    extractedData: OcrExtractedData;
    rawBoundingBoxes: OcrBoundingBox[];
}
