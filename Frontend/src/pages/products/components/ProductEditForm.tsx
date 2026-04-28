import type { ProductUpdateForm } from "@/models/product";
import { useState, useEffect } from 'react';
import api from '@/api/api';
import type { Product } from '@/models/product';
import Modal from '@/components/common/Modal';

interface ProductEditFormProps {
    isOpen: boolean;
    productId: number | string;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ProductEditForm({ isOpen, productId, onClose, onSuccess }: ProductEditFormProps) {
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await api.put(`/products/${productId}`, form);
            onSuccess?.();
            onClose();
        } catch (err) {
            setError("Error occurred while updating product");
            console.error(`Error occurred while updating product: ${err}`);
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [genresRes, typesRes, formRes] = await Promise.all([
                    api.get<string[]>('/products/genres'),
                    api.get<string[]>('products/warehouses'),
                    api.get<Product>(`/products/${productId}`)
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
    }, [isOpen, productId]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>Edit product</h2>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input name="name" type="text" value={form.name ?? ''} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Genre:</label>
                        <select name="genre" value={form.genre ?? ''} onChange={handleSelectChange}>
                            <option value="">Select genre</option>
                            {genres.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Unit:</label>
                        <input name="unit" type="text" value={form.unit ?? ''} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Type:</label>
                        <select name="type" value={form.type ?? ''} onChange={handleSelectChange}>
                            <option value="">Select type</option>
                            {types.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Batch Number:</label>
                        <input name="batchNumber" type="text" value={form.batchNumber ?? ''} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Supplier ID:</label>
                        <input name="supplierId" type="text" value={form.supplierId ?? ''} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Expiration Date:</label>
                        <input name="expirationDate" type="date" value={form.expirationDate ?? ''} onChange={handleChange} />
                    </div>
                    <div>
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            )}
        </Modal>
    )
}
