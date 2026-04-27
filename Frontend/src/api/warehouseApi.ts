import type { WarehouseOperation } from '@/models/warehouseOperation';
import api from './api';

export const warehouseApi = {
    getOperations: () => api.get('/warehouse-operations'),
    createOperation: (data: WarehouseOperation) => api.post('/warehouse-operations', data),
    getDocuments: () => api.get('/documents'),
    getFiles: () => api.get('/documents/filesMetadata'),
    uploadFile: (file: File, operationId?: number) => {
        const formData = new FormData();
        formData.append('file', file);
        if (operationId) formData.append('operationId', operationId.toString());
        return api.post('/files/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};
