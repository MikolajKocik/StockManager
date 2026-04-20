import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/api';
import type { Product } from '../../models/product';
import ProductEditForm from '../../components/products/forms/ProductEditForm';
import './ProductDetails.css';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const res = await api.get<Product>(`/products/${id}`);
            setProduct(res.data);
        } catch {
            setError("Product not found");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            navigate('/products');
        } catch {
            setError("Could not delete product");
        }
    }

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        fetchProduct();
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    if (loading) return <div className="loading">Loading product details...</div>;

    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="product-details-container">
            <Link to="/products" className="back-link">← Back to products</Link>

            <div className="details-header">
                <div>
                    <h1>{product?.name}</h1>
                    <span className={`status-badge ${product?.isDeleted ? 'status-deleted' : 'status-active'}`}>
                        {product?.isDeleted ? 'Deleted' : 'Active'}
                    </span>
                </div>
                <div className="action-bar">
                    <button className="edit-btn" onClick={() => setIsEditModalOpen(true)}>
                        Edit Product
                    </button>
                    <button className="delete-btn" onClick={handleDelete}>
                        Delete Product
                    </button>
                </div>
            </div>

            <div className="details-grid">
                <div className="detail-item">
                    <label>Genre/Category</label>
                    <span>{product?.genre}</span>
                </div>
                <div className="detail-item">
                    <label>Type</label>
                    <span>{product?.type}</span>
                </div>
                <div className="detail-item">
                    <label>Unit</label>
                    <span>{product?.unit}</span>
                </div>
                <div className="detail-item">
                    <label>Batch Number</label>
                    <span>{product?.batchNumber}</span>
                </div>
                <div className="detail-item">
                    <label>Supplier</label>
                    <span>{product?.supplierName}</span>
                </div>
                <div className="detail-item">
                    <label>Expiration Date</label>
                    <span>{product?.expirationDate ? new Date(product.expirationDate).toLocaleDateString() : 'N/A'}</span>
                </div>
            </div>

            <ProductEditForm
                isOpen={isEditModalOpen}
                productId={id || ''}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={handleEditSuccess}
            />
        </div>
    )
}