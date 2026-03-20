import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/api';
import type { Product } from '../../models/product';
import { Link } from 'react-router-dom';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
                await api.delete(`/products/${id}`);
                navigate('/products');
            } catch {
                setError("Product not found");
            } finally {
                setLoading(false);
            }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get<Product>(`/products/${id}`);
                setProduct(res.data);
            } catch {
                setError("Product not found");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    if(loading) return <p>Loading...</p>;
    
    if(error) return <p style={{ color: 'red'}}>{error}</p>;

    return (
        <div>
            <h2>{product?.name}</h2>
            <p>Genre: {product?.genre}</p>
            <p>Unit: {product?.unit}</p>
            <p>Supplier: {product?.supplierName}</p>
            <Link to={`/products/edit/${id}`}>
                Edit product
            </Link>
            <button onClick={handleDelete}>
                Delete product
            </button>
        </div>
    )
}