import api from '../../api/api';
import { useEffect, useState } from 'react';
import type { ProductCollection } from '../../models/product';
import { Link } from 'react-router-dom';
 
export default function ProductList() {
    const [products, setProducts] = useState<ProductCollection>({ data: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
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

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;

    if (error) return <p style={{ color: 'red'}}>{error}</p>;

    return (
        <div>
            <h2>Lista produktów</h2>
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
