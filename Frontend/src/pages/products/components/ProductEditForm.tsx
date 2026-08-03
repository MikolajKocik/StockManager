import { forwardRef } from 'react';
import type { ProductUpdateForm } from "@/models/product";
import { Button, FormBody, FormFooter, Modal } from '@/components/common';
import { useGenres, useWTypes } from "@/hooks/queries";
import { useEditProduct, useProduct } from "../hooks";

interface ProductEditFormProps {
    productId: string | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export const ProductEditForm = forwardRef<HTMLDialogElement, ProductEditFormProps>(({
    productId,
    onClose,
    onSuccess
}, ref) => {
    const { data: genres = [], isLoading: isGenresLoading } = useGenres(true);
    const { data: types = [], isLoading: isTypesLoading } = useWTypes(true);
    const { data: product, isLoading: isProductLoading, error: productError } = useProduct(productId);
    const { mutate: updateProduct, isPending: isUpdating, error: mutationError } = useEditProduct(productId);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const formValues = Object.fromEntries(formData.entries()) as unknown as ProductUpdateForm;

        updateProduct({ data: formValues }, {
            onSuccess: () => {
                onClose();
                onSuccess?.();
            }
        });
    };

    const isLoading = isGenresLoading || isTypesLoading || isProductLoading;
    const error = productError ? "Error occurred while loading product details." : (mutationError ? "Error occurred while updating product." : null);

    return (
        <Modal
            ref={ref}
            title={product ? `Edit Product: ${product.name}` : `Edit Product #${productId}`}
            size="lg"
            onClose={onClose}
        >
            {isLoading ? (
                <div className="p-8 text-center text-xs text-slate-500">Loading product details...</div>
            ) : product ? (
                <form key={product.id} onSubmit={handleSubmit}>
                    <FormBody className="max-h-[75vh] space-y-4">
                        {error && (
                            <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
                                {error}
                            </div>
                        )}

                        {/* Section 1: General Information */}
                        <div>
                            <span className="font-bold text-[11px] text-slate-600 uppercase tracking-wider block mb-2 font-mono">
                                General Information
                            </span>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        defaultValue={product.name}
                                        placeholder="Product name"
                                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium outline-none focus:border-slate-800 focus:bg-white text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">
                                        Category / Genre <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="genre"
                                        required
                                        defaultValue={product.genre || ''}
                                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium outline-none focus:border-slate-800 cursor-pointer text-xs"
                                    >
                                        <option value="" disabled>Select category</option>
                                        {genres.map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Units and Storage Type */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="font-bold text-slate-700 block mb-1">
                                    Unit of Measure <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="unit"
                                    type="text"
                                    required
                                    defaultValue={product.unit}
                                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium outline-none focus:border-slate-800 focus:bg-white text-xs"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700 block mb-1">
                                    Warehouse Storage Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="type"
                                    required
                                    defaultValue={product.type || ''}
                                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium outline-none focus:border-slate-800 cursor-pointer text-xs"
                                >
                                    <option value="" disabled>Select storage type</option>
                                    {types.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Section 3: Traceability & Supply */}
                        <div className="p-3 bg-slate-50/80 border border-slate-300 rounded space-y-3">
                            <span className="font-bold text-[11px] text-slate-600 uppercase tracking-wider block font-mono">
                                Supply & Traceability
                            </span>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-semibold text-slate-700 block mb-1">
                                        Batch / Lot Number
                                    </label>
                                    <input
                                        name="batchNumber"
                                        type="text"
                                        defaultValue={product.batchNumber || ''}
                                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono outline-none focus:border-slate-800 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold text-slate-700 block mb-1">
                                        Supplier Reference / ID
                                    </label>
                                    <input
                                        name="supplierId"
                                        type="text"
                                        defaultValue={product.supplierId || ''}
                                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono outline-none focus:border-slate-800 text-xs"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">
                                    Expiration Date
                                </label>
                                <input
                                    name="expirationDate"
                                    type="date"
                                    defaultValue={product.expirationDate ? product.expirationDate.split('T')[0] : ''}
                                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:border-slate-800 text-xs font-mono"
                                />
                            </div>
                        </div>
                    </FormBody>

                    <FormFooter>
                        <Button variant="secondary" size="md" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="md" type="submit" disabled={isUpdating}>
                            {isUpdating ? 'Saving...' : 'Save Product Changes'}
                        </Button>
                    </FormFooter>
                </form>
            ) : (
                <div className="p-8 text-center text-xs text-red-500">Product not found.</div>
            )}
        </Modal>
    );
});

ProductEditForm.displayName = 'ProductEditForm';
export default ProductEditForm;
