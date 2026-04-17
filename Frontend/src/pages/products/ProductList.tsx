import api from '../../api/api';
import { useEffect, useState } from 'react';
import type { ProductCollection } from '../../models/product';
import { Link } from 'react-router-dom';
import ProductCreateForm from '../../components/products/forms/ProductCreateForm';
 
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

    if (loading) return <p>Loading...</p>;

    if (error) return <p style={{ color: 'red'}}>{error}</p>;

    return (
        <div>
            <h2>Products list</h2>
            <button onClick={() => setIsCreateModalOpen(true)}>Add new product</button>
            
            <ProductCreateForm 
                isOpen={isCreateModalOpen} 
                onClose={handleCreateSuccess}
            />
            
            <ul>
                {products.data.map(product => (
                    <li key={product.id}>
                        <Link to={`/products/${product.id}`}>
                            {product.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
