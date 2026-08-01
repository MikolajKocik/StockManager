import type { Document, FileMetadata } from "@/models/document";
import api from "../config/api";
import { USE_MOCKS } from "../config/mock";
import { mockDocuments } from "@/mocks/document.mocks";

export const documentsApi = {
    getDocuments: async (): Promise<Document[]> => {
        if (USE_MOCKS) return mockDocuments;
        const res = await api.get("/documents");
        return res.data;
    },
    getFiles: async (): Promise<FileMetadata[]> => {
        if (USE_MOCKS) return [{ id: 1, fileName: "test.pdf", blobUrl: "http://example.com/test.pdf", uploadedAt: new Date().toISOString() }];
        const res = await api.get("/documents/filesMetadata");
        return res.data;
    },
    uploadFile: async (file: File, operationId?: number): Promise<FileMetadata> => {
        if (USE_MOCKS) return { id: 2, fileName: file.name, blobUrl: "http://example.com/mock.pdf", uploadedAt: new Date().toISOString(), operationId };
        const formData = new FormData();
        formData.append("file", file);
        if (operationId) formData.append('operationId', operationId.toString());
        const res = await api.post("/documents", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        return res.data;
    }
}