import { useState, useEffect } from 'react';
import { warehouseApi } from '../api/warehouseApi';
import './Documents.css';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [docRes, fileRes] = await Promise.all([
            warehouseApi.getDocuments(),
            warehouseApi.getFiles()
        ]);
        setDocuments(docRes.data);
        setFiles(fileRes.data);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setUploading(true);
        try {
            await warehouseApi.uploadFile(e.target.files[0]);
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="documents-container">
            <header className="documents-header">
                <h1>Document Management</h1>
                <div className="upload-wrapper">
                    <label className="btn-primary">
                        {uploading ? 'Uploading...' : 'Upload Scan'}
                        <input type="file" hidden onChange={handleUpload} disabled={uploading} />
                    </label>
                </div>
            </header>

            <section className="doc-section">
                <h2>Generated Documents</h2>
                <div className="doc-grid">
                    {documents.map((doc: any) => (
                        <div key={doc.id} className="doc-card">
                            <div className="doc-icon">📄</div>
                            <div className="doc-info">
                                <span className="doc-number">{doc.documentNumber}</span>
                                <span className="doc-date">{new Date(doc.createdAt).toLocaleDateString()}</span>
                            </div>
                            <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="btn-download">Download</a>
                        </div>
                    ))}
                </div>
            </section>

            <section className="doc-section">
                <h2>Uploaded Scans</h2>
                <div className="doc-grid">
                    {files.map((file: any) => (
                        <div key={file.id} className="doc-card">
                            <div className="doc-icon">📎</div>
                            <div className="doc-info">
                                <span className="doc-number">{file.fileName}</span>
                                <span className="doc-date">{new Date(file.uploadedAt).toLocaleDateString()}</span>
                            </div>
                            <a href={file.blobUrl} target="_blank" rel="noreferrer" className="btn-download">Download</a>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Documents;
