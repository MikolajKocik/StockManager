import type { Document, FileMetadata } from "@/models/document";
import api from "./api";

export const documentsApi = {
    getDocuments: async (): Promise<Document[]> => {
        const res = await api.get("/documents");
        return res.data;
    },
    getFiles: async (): Promise<FileMetadata[]> => {
        const res = await api.get("/documents/filesMetadata");
        return res.data;
    },
    uploadFile: async (file: File, operationId?: number): Promise<FileMetadata> => {
        const formData = new FormData();
        formData.append("file", file);
        if (operationId) formData.append('operationId', operationId.toString());
        const res = await api.post("/documents", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        return res.data;
    }
}