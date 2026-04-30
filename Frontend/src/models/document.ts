export interface Document {
    id: number,
    operationId: number,
    documentNumber: string,
    fileUrl: string,
    createdAt: string
}

export interface FileMetadata {
    id: number;
    fileName: string;
    blobUrl: string;
    uploadedAt: string;
    operationId?: number;
}
