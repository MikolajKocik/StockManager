import api from '../../api/api';
import { useEffect, useState } from 'react';
import type { ProductCollection } from '../../models/product';
import { Link } from 'react-router-dom';
import ProductCreateForm from '../../components/products/forms/ProductCreateForm';
import './ProductList.css';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/common/Table';

export default function ProductList() {
    const [products, setProducts] = useState<ProductCollection>({ data: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

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
        <div className="product-list-container">
            <div className="list-header">
                <h1>Products Inventory</h1>
                <button className="add-btn" onClick={() => setIsCreateModalOpen(true)}>
                    + Add New Product
                </button>
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
                                <Link to={`/products/${product.id}`} className="view-btn">View Details</Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
