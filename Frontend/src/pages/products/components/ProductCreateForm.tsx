import type { ProductCreateForm } from "@/models/product";
import { useState, useEffect } from 'react';
import api from '@/api/api';
import Modal from '@/components/common/Modal';

interface ProductCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ProductCreateForm({ isOpen, onClose, onSuccess }: ProductCreateModalProps) {
    const [genres, setGenres] = useState<string[]>([]);
    const [types, setTypes] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [form, setForm] = useState<ProductCreateForm>({
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
            await api.post('/products', form);
            onSuccess?.();
            onClose();
        } catch (err) {
            setError("Error occurred while saving data...");
            console.error(`Error ocurred while saving data: ${err}`);
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [genresRes, typesRes] = await Promise.all([
                    api.get<string[]>('/products/genres'),
                    api.get<string[]>('/products/warehouses')
                ]);
                setGenres(genresRes.data);
                setTypes((typesRes.data));
            } catch (err) {
                console.log("Error occurred while loading data", err);
                setError("Error occurred while loading data");
            }
            finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>Add new product</h2>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <input name="name" type="text" value={form.name} onChange={handleChange} />
                    </div>
                    <div>
                        <select name="genre" value={form.genre} onChange={handleSelectChange}>
                            {genres.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input name="unit" type="text" value={form.unit} onChange={handleChange} />
                    </div>
                    <div>
                        <select name="type" value={form.type} onChange={handleSelectChange}>
                            {types.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input name="batchNumber" type="text" value={form.batchNumber} onChange={handleChange} />
                    </div>
                    <div>
                        <input name="supplierId" type="text" value={form.supplierId} onChange={handleChange} />
                    </div>
                    <div>
                        <input name="expirationDate" type="date" value={form.expirationDate} onChange={handleChange} />
                    </div>
                    <div>
                        <button type="submit">Add product</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            )}
        </Modal>
    )
}
