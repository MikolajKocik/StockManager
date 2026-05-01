import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCreateForm from './components/ProductCreateForm';
import './ProductList.css';
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
        <div className="product-list-container animate-fade">
            <Header 
                title="Products Inventory" 
                actions={
                    <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                        Add New Product
                    </Button>
                }
            />

            <ProductCreateForm
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>Product Name</TableHeaderCell>
                        <TableHeaderCell>Genre/Category</TableHeaderCell>
                        <TableHeaderCell>Supplier</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                        <TableHeaderCell>Actions</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.data.map(product => (
                        <TableRow key={product.id}>
                            <TableCell>
                                <Link to={`/products/${product.id}`} className="product-link">
                                    {product.name}
                                </Link>
                            </TableCell>
                            <TableCell>{product.genre}</TableCell>
                            <TableCell>{product.supplierName}</TableCell>
                            <TableCell>
                                <span className={`status-badge ${product.isDeleted ? 'status-deleted' : 'status-active'}`}>
                                    {product.isDeleted ? 'Deleted' : 'Active'}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/products/${product.id}`)}
                                >
                                    View Details
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
