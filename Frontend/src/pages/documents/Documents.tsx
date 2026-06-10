import { useRef } from 'react';
import type { Document, FileMetadata } from '@/models/document';
import { Button, Header, Section } from '@/components/common';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/api/internal/documentsApi';

export default function Documents() {
    const _tempDoc: Document | null = null;
    const _tempMeta: FileMetadata | null = null;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    const onUploadButtonClick = () => {
        fileInputRef.current?.click();
    }

    const { data: docs = [] } = useQuery({
        queryKey: ['docs'],
        queryFn: documentsApi.getDocuments
    })

    const { data: files = [] } = useQuery({
        queryKey: ['files'],
        queryFn: documentsApi.getFiles
    })

    const { mutate: uploadFile, isPending: isUploading } = useMutation({
        mutationFn: (file: File) => documentsApi.uploadFile(file),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['files'] }),
        onError: () => alert("Upload failed")
    });

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        uploadFile(file);
    };

    return (
        <div>
            <h2>Documents</h2>
        </div>
    );
};
