import api from '../../api/api';
import { useEffect, useState } from 'react';
import type { ProductCollection } from '../../models/product';
import { Link, useNavigate } from 'react-router-dom';
import ProductCreateForm from './components/ProductCreateForm';
import './ProductList.css';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/common/Table';

import { Button } from '@/components/common/Button';

export default function ProductList() {
    const [products, setProducts] = useState<ProductCollection>({ data: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const res = await api.get<ProductCollection>("/products");
            setProducts(res.data);
        } catch (err) {
            console.error("Error occurred while fetching data", err)
            setError("Error occurred while fetching data. Try again later.")
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        fetchProducts();
    };

    if (loading) return <div className="loading">Loading products...</div>;

    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="product-list-container animate-fade">
            <div className="list-header">
                <h1>Products Inventory</h1>
                <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                    Add New Product
                </Button>
            </div>

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
