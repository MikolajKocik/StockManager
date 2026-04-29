import type { ProductUpdateForm } from "@/models/product";
import { useState, useEffect } from 'react';
import api from '@/api/api';
import type { Product } from '@/models/product';
import Modal from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import './ProductForm.css';

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
                <form onSubmit={handleSubmit} className="product-form-grid">
                    <Input
                        label="Product Name"
                        name="name"
                        type="text"
                        value={form.name ?? ''}
                        onChange={handleChange}
                        required
                    />

                    <Select
                        label="Genre/Category"
                        name="genre"
                        value={form.genre ?? ''}
                        onChange={handleSelectChange}
                        options={[{ value: '', label: 'Select genre' },
                        ...genres.map(g => ({ value: g, label: g }))]}
                        required
                    />

                    <Input
                        label="Unit"
                        name="unit"
                        type="text"
                        value={form.unit ?? ''}
                        onChange={handleChange}
                        required
                    />

                    <Select
                        label="Warehouse Type"
                        name="type"
                        value={form.type ?? ''}
                        onChange={handleSelectChange}
                        options={[{ value: '', label: 'Select type' },
                        ...types.map(t => ({ value: t, label: t }))]}
                        required
                    />

                    <Input
                        label="Batch Number"
                        name="batchNumber"
                        type="text"
                        value={form.batchNumber ?? ''}
                        onChange={handleChange}
                    />

                    <Input
                        label="Supplier ID"
                        name="supplierId"
                        type="text"
                        value={form.supplierId ?? ''}
                        onChange={handleChange}
                    />

                    <Input
                        label="Expiration Date"
                        name="expirationDate"
                        type="date"
                        value={form.expirationDate ?
                            new Date(form.expirationDate).toISOString().split('T')[0] : ''}
                        onChange={handleChange}
                    />

                    <div className="form-actions">
                        <Button type="button" variant="danger" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Save Changes
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    )
}
