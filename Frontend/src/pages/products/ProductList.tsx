import api from '../../api/api';
import { useEffect, useState } from 'react';
import type { ProductCollection } from '../../models/product';
import { Link } from 'react-router-dom';
import ProductCreateForm from '../../components/products/forms/ProductCreateForm';
import './ProductList.css';

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

            <table className="product-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Genre/Category</th>
                        <th>Supplier</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.data.map(product => (
                        <tr key={product.id}>
                            <td>
                                <Link to={`/products/${product.id}`} className="product-link">
                                    {product.name}
                                </Link>
                            </td>
                            <td>{product.genre}</td>
                            <td>{product.supplierName}</td>
                            <td>
                                <span className={`status-badge ${product.isDeleted ? 'status-deleted' : 'status-active'}`}>
                                    {product.isDeleted ? 'Deleted' : 'Active'}
                                </span>
                            </td>
                            <td>
                                <Link to={`/products/${product.id}`} className="view-btn">View Details</Link>
                            </td>
                        </tr>
                    ))}
                    {products.data.length === 0 && (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: 'var(--secondary)' }}>
                                No products found. Click "Add New Product" to get started.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
