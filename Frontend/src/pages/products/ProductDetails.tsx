import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import ProductEditForm from './components/ProductEditForm';
import { Button } from '@/components/common/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/api/internal/productsApi';

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
        <div>
            <h2>Product Details</h2>
        </div>
    )
}
