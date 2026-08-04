import { forwardRef, useMemo } from 'react';
import type { ProductCreateForm as ProductCreateFormPayload } from "@/models/product";
import { Button, FormBody, FormFooter, Modal, Input, Select, Section } from '@/components/common';
import { useGenres } from "@/hooks/queries/useGenres";
import { useWTypes } from "@/hooks/queries/useWTypes";
import { useCreateProduct } from "../hooks";

interface ProductCreateModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export const ProductCreateForm = forwardRef<HTMLDialogElement, ProductCreateModalProps>(({
    onClose,
    onSuccess
}, ref) => {
    const { data: genres = [], isLoading: isGenresLoading } = useGenres(true);
    const { data: types = [], isLoading: isTypesLoading } = useWTypes(true);
    const { mutate: createProduct, isPending: isCreating, error: mutationError } = useCreateProduct();

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formValues = Object.fromEntries(formData.entries()) as unknown as ProductCreateFormPayload;

        createProduct(formValues, {
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

    const isLoading = isGenresLoading || isTypesLoading;

    return (
        <Modal
            ref={ref}
            title="Add New Warehouse Master Product"
            size="lg"
            onClose={onClose}
        >
            {isLoading ? (
                <div className="p-8 text-center text-xs text-slate-500">Loading catalog options...</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <FormBody className="max-h-[75vh] space-y-4">
                        {mutationError && (
                            <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded text-xs font-medium">
                                Error occurred while saving product data.
                            </div>
                        )}

                        <Section title="General Information">
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Product Name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="e.g. Hydraulic Valve 24V"
                                />
                                <Select
                                    label="Category / Genre"
                                    name="genre"
                                    required
                                    defaultValue=""
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
                                    placeholder="e.g. pcs, kg, m, box"
                                />
                                <Select
                                    label="Warehouse Zone Type"
                                    name="type"
                                    required
                                    defaultValue=""
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
                                    placeholder="e.g. BATCH-2026-X"
                                    className="font-mono bg-white"
                                />
                                <Input
                                    label="Supplier Reference / ID"
                                    name="supplierId"
                                    type="text"
                                    placeholder="e.g. SUP-0012"
                                    className="font-mono bg-white"
                                />
                            </div>

                            <Input
                                label="Expiration Date"
                                name="expirationDate"
                                type="date"
                                className="font-mono bg-white"
                            />
                        </Section>
                    </FormBody>

                    <FormFooter>
                        <Button variant="secondary" size="md" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="md" type="submit" disabled={isCreating}>
                            {isCreating ? 'Saving...' : 'Create Master Product'}
                        </Button>
                    </FormFooter>
                </form>
            )}
        </Modal>
    );
});

ProductCreateForm.displayName = 'ProductCreateForm';
