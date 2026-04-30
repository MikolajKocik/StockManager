import type { ProductCreateForm } from "@/models/product";
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/api/internal/productsApi';
import Modal from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import './ProductForm.css';

interface ProductCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ProductCreateForm({ isOpen, onClose, onSuccess }: ProductCreateModalProps) {
    const queryClient = useQueryClient();
    const [form, setForm] = useState<ProductCreateForm>({
        name: '',
        genre: '',
        unit: '',
        type: '',
        batchNumber: '',
        supplierId: '',
        expirationDate: ''
    });

    const { data: genres = [], isLoading: isGenresLoading } = useQuery({
        queryKey: ['genres'],
        queryFn: productsApi.getGenres,
        enabled: isOpen
    });

    const { data: types = [], isLoading: isTypesLoading } = useQuery({
        queryKey: ['warehouses'],
        queryFn: productsApi.getWarehouses,
        enabled: isOpen
    });

    const { mutate: createProduct, isPending: isCreating, error: mutationError } = useMutation({
        mutationFn: (data: ProductCreateForm) => productsApi.createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            onSuccess?.();
            onClose();
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createProduct(form);
    };

    const isLoading = isGenresLoading || isTypesLoading;
    const error = mutationError ? "Error occurred while saving data..." : null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>Add new product</h2>

            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <form onSubmit={handleSubmit} className="product-form-grid">
                    <Input
                        label="Product Name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <Select
                        label="Genre/Category"
                        name="genre"
                        value={form.genre}
                        onChange={handleSelectChange}
                        options={genres}
                        required
                    />

                    <Input
                        label="Unit"
                        name="unit"
                        type="text"
                        value={form.unit}
                        onChange={handleChange}
                        required
                    />

                    <Select
                        label="Warehouse Type"
                        name="type"
                        value={form.type}
                        onChange={handleSelectChange}
                        options={types}
                        required
                    />

                    <Input
                        label="Batch Number"
                        name="batchNumber"
                        type="text"
                        value={form.batchNumber}
                        onChange={handleChange}
                    />

                    <Input
                        label="Supplier ID"
                        name="supplierId"
                        type="text"
                        value={form.supplierId}
                        onChange={handleChange}
                    />

                    <Input
                        label="Expiration Date"
                        name="expirationDate"
                        type="date"
                        value={form.expirationDate}
                        onChange={handleChange}
                    />

                    <div className="form-actions">
                        <Button type="button" id="cancel" variant="danger" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isCreating}>
                            {isCreating ? 'Adding...' : 'Add Product'}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    )
}
