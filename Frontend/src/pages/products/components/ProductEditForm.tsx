import { forwardRef, useMemo } from 'react';
import type { ProductUpdateForm } from "@/models/product";
import { Button, FormBody, FormFooter, Modal, Input, Select, Section } from '@/components/common';
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

    const genreOptions = useMemo(() => [
        { value: '', label: 'Select category', disabled: true },
        ...genres.map(g => ({ value: g, label: g }))
    ], [genres]);

    const typeOptions = useMemo(() => [
        { value: '', label: 'Select storage type', disabled: true },
        ...types.map(t => ({ value: t, label: t }))
    ], [types]);

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
                            <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded text-xs font-medium">
                                {error}
                            </div>
                        )}

                        <Section title="General Information">
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Product Name"
                                    name="name"
                                    type="text"
                                    required
                                    defaultValue={product.name}
                                    placeholder="Product name"
                                />
                                <Select
                                    label="Category / Genre"
                                    name="genre"
                                    required
                                    defaultValue={product.genre || ''}
                                    options={genreOptions}
                                />
                            </div>
                        </Section>

                        <Section title="Units & Storage Specification">
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Unit of Measure"
                                    name="unit"
                                    type="text"
                                    required
                                    defaultValue={product.unit}
                                />
                                <Select
                                    label="Warehouse Storage Type"
                                    name="type"
                                    required
                                    defaultValue={product.type || ''}
                                    options={typeOptions}
                                />
                            </div>
                        </Section>

                        <Section variant="subtle" title="Supply & Traceability">
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Batch / Lot Number"
                                    name="batchNumber"
                                    type="text"
                                    defaultValue={product.batchNumber || ''}
                                    className="font-mono bg-white"
                                />
                                <Input
                                    label="Supplier Reference / ID"
                                    name="supplierId"
                                    type="text"
                                    defaultValue={product.supplierId || ''}
                                    className="font-mono bg-white"
                                />
                            </div>

                            <Input
                                label="Expiration Date"
                                name="expirationDate"
                                type="date"
                                defaultValue={product.expirationDate ? product.expirationDate.split('T')[0] : ''}
                                className="font-mono bg-white"
                            />
                        </Section>
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
