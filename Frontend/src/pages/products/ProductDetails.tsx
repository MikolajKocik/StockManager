import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/api';
import type { Product } from '../../models/product';
import ProductEditForm from '../../components/products/forms/ProductEditForm';

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
        try {
            await api.delete(`/products/${id}`);
            navigate('/products');
        } catch {
            setError("Product not found");
        }
    }

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        fetchProduct();
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    if(loading) return <p>Loading...</p>;
    
    if(error) return <p style={{ color: 'red'}}>{error}</p>;

    return (
        <div>
            <h2>{product?.name}</h2>
            <p>Genre: {product?.genre}</p>
            <p>Unit: {product?.unit}</p>
            <p>Supplier: {product?.supplierName}</p>
            <button onClick={() => setIsEditModalOpen(true)}>
                Edit product
            </button>
            <button onClick={handleDelete}>
                Delete product
            </button>

            <ProductEditForm 
                isOpen={isEditModalOpen}
                productId={id || ''}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={handleEditSuccess}
            />
        </div>
    )
}