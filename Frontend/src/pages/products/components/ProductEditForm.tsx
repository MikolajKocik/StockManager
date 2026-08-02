import type { ProductUpdateForm } from "@/models/product";
import { useState, useEffect } from 'react';
import { Button, Input, Select } from '@/components/common';
import { useGenres, useWTypes } from "@/hooks/queries";
import { useEditProduct, useProduct } from "../hooks";

interface ProductEditFormProps {
    isOpen: boolean;
    productId: string | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ProductEditForm({ isOpen, productId, onClose }: ProductEditFormProps) {
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

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        updateProduct({ data: form }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const isLoading = isGenresLoading || isTypesLoading || isProductLoading;
    const error = productError ? "Error occurred while loading data." : (mutationError ? "Error occurred while updating product." : null);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white border border-slate-300 rounded-lg shadow-2xl max-w-xl w-full overflow-hidden text-slate-800 animate-scale-in">
                {/* Header */}
                <div className="bg-[#384155] text-white px-4 py-3 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">
                        Edit Product: {form.name || `#${productId}`}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-300 hover:text-white text-lg leading-none p-1 cursor-pointer"
                    >
                        &#10005;
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center text-xs text-slate-500">Loading product details...</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="p-4 space-y-3 text-xs">
                            {error && (
                                <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs">
                                    {error}
                                </div>
                            )}

                            {/* Section 1: General Information */}
                            <div>
                                <span className="font-bold text-[11px] text-slate-600 uppercase tracking-wider block mb-2">
                                    General Information
                                </span>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">
                                            Product Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name="name"
                                            type="text"
                                            value={form.name ?? ''}
                                            onChange={handleChange}
                                            placeholder="Product name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">
                                            Category / Genre <span className="text-red-500">*</span>
                                        </label>
                                        <Select
                                            name="genre"
                                            value={form.genre ?? ''}
                                            onChange={handleSelectChange}
                                            options={[
                                                { label: 'Select genre', value: '' },
                                                ...genres.map(g => ({ label: g, value: g }))
                                            ]}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Units and Storage Type */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-semibold text-slate-700 block mb-1">
                                        Unit <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="unit"
                                        type="text"
                                        value={form.unit ?? ''}
                                        onChange={handleChange}
                                        placeholder="E.g. pcs, kg, box"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold text-slate-700 block mb-1">
                                        Warehouse Storage Type <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        name="type"
                                        value={form.type ?? ''}
                                        onChange={handleSelectChange}
                                        options={[
                                            { label: 'Select type', value: '' },
                                            ...types.map(t => ({ label: t, value: t }))
                                        ]}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Section 3: Traceability & Supplier */}
                            <div className="pt-2 border-t border-slate-200">
                                <span className="font-bold text-[11px] text-slate-600 uppercase tracking-wider block mb-2">
                                    Traceability & Supplier Link
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">Batch Number</label>
                                        <Input
                                            name="batchNumber"
                                            type="text"
                                            value={form.batchNumber ?? ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">Supplier ID</label>
                                        <Input
                                            name="supplierId"
                                            type="text"
                                            value={form.supplierId ?? ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">Expiration Date</label>
                                        <Input
                                            name="expirationDate"
                                            type="date"
                                            value={form.expirationDate ? new Date(form.expirationDate).toISOString().split('T')[0] : ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 p-3 bg-slate-50 border-t border-slate-200">
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={onClose}
                                disabled={isUpdating}
                                className="text-xs"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="sm"
                                isLoading={isUpdating}
                                className="text-xs font-semibold"
                            >
                                {isUpdating ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
