import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCreateForm from './components/ProductCreateForm';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Button, Header } from '@/components/common';

import { QueryClient, useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/internal/productsApi';

export default function ProductList() {
    const queryClient = new QueryClient();
    const { data: products = { data: [] }, isLoading, isError } = useQuery({
        queryKey: ['products'],
        queryFn: productsApi.getProducts
    });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['products'] });
    };


    if (isLoading) return <div className="loading">Loading products...</div>;
    if (isError) return <div className="error-message">Error occurred. Try again later.</div>;

    return (
        <div>
            <h2>Product List</h2>
        </div>
    )
}
