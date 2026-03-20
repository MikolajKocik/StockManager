import type { ProductUpdateForm } from "../../models/product";
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useParams } from 'react-router-dom';
import type { Product } from '../../models/product';
 
export default function ProductEditForm() {
    const { id } = useParams();
    const [genres, setGenres] = useState<string[]>([]);
    const [types, setTypes] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [form, setForm] = useState<ProductUpdateForm>({
        id: null,
        name: '',
        genre: '',
        unit: '',
        type: '',
        batchNumber: '',
        supplierId: '',
        expirationDate: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await api.put(`/products/${id}`, form);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [genresRes, typesRes, formRes] = await Promise.all([
                    api.get<string[]>('/products/genres'),
                    api.get<string[]>('products/warehouses'),
                    api.get<Product>(`/products/${id}`)
                ]);

                setGenres(genresRes.data);
                setTypes(typesRes.data);
                setForm(formRes.data);
            } catch (err) {
                console.log("Error occurred while loading data", err);
                setError("Error occurred while loading data");
            }
            finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);
    
    if (loading) return <p>Loading...</p>;

    if (error) return <p style={{ color: 'red'}}>{error}</p>;

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input name="name" type="text" value={form.name ?? ''} onChange={handleChange} />
            </div>
            <div>
                <select name="genre" value={form.genre ?? ''} onChange={handleSelectChange}>
                    {genres.map(g => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
            </div>
            <div>
                <input name="unit" type="text" value={form.unit ?? ''} onChange={handleChange} />
            </div>
            <div>
                <select name="type" value={form.type ?? ''} onChange={handleSelectChange}>
                    {types.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>
            <div>
                <input name="batchNumber" type="text" value={form.batchNumber ?? ''} onChange={handleChange} />
            </div>
            <div>
                <input name="supplierId" type="text" value={form.supplierId ?? ''} onChange={handleChange} />
            </div>
            <div>
                <input name="expirationDate" type="date" value={form.expirationDate ?? ''} onChange={handleChange} />
            </div>
            <div>
                <button type="submit">Edit product</button>
            </div>
        </form>
    )
}