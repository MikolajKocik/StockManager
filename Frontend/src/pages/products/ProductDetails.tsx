import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import ProductEditForm from './components/ProductEditForm';
import { Button } from '@/components/common/Button';
import './ProductDetails.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/api/productsApi';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: product = null, isLoading, error } = useQuery({
        queryKey: ['products', id],
        queryFn: () => productsApi.getProductById(id!)
    });

    const { mutate: deleteProduct } = useMutation({
        mutationFn: () => productsApi.deleteProduct(id!),
        onSuccess: () => navigate("/products"),
        onError: () => alert("Could not delete product")
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        deleteProduct();
    }

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['products', id] });
    };

    if (isLoading) return <div className="loading">Loading product details...</div>;

    if (error) return <div className="error-message">{error.message}</div>;

    return (
        <div className="product-details-container animate-fade">
            <Link to="/products" className="back-link">← Back to products</Link>

            <div className="details-header">
                <div className="header-info">
                    <h1>{product?.name}</h1>
                    <span className={`status-badge ${product?.isDeleted ? 'status-deleted' : 'status-active'}`}>
                        {product?.isDeleted ? 'Deleted' : 'Active'}
                    </span>
                </div>
                <div className="action-bar">
                    <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>
                        Edit Product
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete Product
                    </Button>
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