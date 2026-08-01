import type { ProductUpdateForm } from "@/models/product";
import { useState, useEffect } from 'react';
import './ProductForm.css';
import { Modal, Input, Select, Button } from '@/components/common';
import { useGenres, useWTypes } from "@/hooks/queries";
import { useEditProduct, useProduct } from "../hooks";

interface ProductEditFormProps {
    isOpen: boolean;
    productId: string | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ProductEditForm({ isOpen, productId, onClose, onSuccess }: ProductEditFormProps) {
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

    const { data: genres = [], isLoading: isGenresLoading } = useGenres(isOpen);
    const { data: types = [], isLoading: isTypesLoading } = useWTypes(isOpen);
    const { data: product, isLoading: isProductLoading, error: productError } = useProduct(productId);
    const { mutate: updateProduct, isPending: isUpdating, error: mutationError } = useEditProduct(productId);

    useEffect(() => {
        if (product) {
            setForm(product);
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateProduct({ data: form });
    };

    const isLoading = isGenresLoading || isTypesLoading || isProductLoading;
    const error = productError ? "Error occurred while loading data" : (mutationError ? "Error occurred while updating product" : null);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <h2 className="text-2xl font-bold">Edit product</h2>

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
                        <Button type="button" variant="danger" className="p-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" className="p-1" isLoading={isUpdating}>
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    )
}
