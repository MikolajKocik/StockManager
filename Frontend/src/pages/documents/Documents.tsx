import { useRef } from 'react';
import './Documents.css';
import DocumentSection from './components/DocumentSection';
import type { Document, FileMetadata } from '@/models/document';
import { Button } from '@/components/common/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/api/internal/documentsApi';

export default function Documents() {
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
        <div className="documents-container animate-fade">
            <header className="documents-header">
                <h1>Document Management</h1>
                <div className="upload-wrapper">
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleUpload}
                    />

                    <Button
                        variant="primary"
                        onClick={onUploadButtonClick}
                        isLoading={isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Upload Scan'}
                    </Button>
                </div>
            </header>

            <DocumentSection title="Generated Documents">
                {docs.map((doc: Document) => (
                    <div key={doc.id} className="doc-card">
                        <div className="doc-icon">📄</div>
                        <div className="doc-info">
                            <span className="doc-number">{doc.documentNumber}</span>
                            <span className="doc-date">
                                {new Date(doc.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="btn-download">Download</a>
                    </div>
                ))}
            </DocumentSection>

            <DocumentSection title="Uploaded Scans">
                {files.map((file: FileMetadata) => (
                    <div key={file.id} className="doc-card">
                        <div className="doc-icon">📎</div>
                        <div className="doc-info">
                            <span className="doc-number">{file.fileName}</span>
                            <span className="doc-date">
                                {new Date(file.uploadedAt).toLocaleDateString()}
                            </span>
                        </div>
                        <a href={file.blobUrl} target="_blank" rel="noreferrer" className="btn-download">Download</a>
                    </div>
                ))}
            </DocumentSection>
        </div>
    );
};
