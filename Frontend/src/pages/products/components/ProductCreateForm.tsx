import { forwardRef } from 'react';
import type { ProductCreateForm as ProductCreateFormPayload } from "@/models/product";
import { Button, FormBody, FormFooter, Modal } from '@/components/common';
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
                            <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
                                Error occurred while saving product data.
                            </div>
                        )}

                        {/* General Information */}
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
                                        placeholder="e.g. Hydraulic Valve 24V"
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
                                        defaultValue=""
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

                        {/* Units and Storage Type */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="font-bold text-slate-700 block mb-1">
                                    Unit of Measure <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="unit"
                                    type="text"
                                    required
                                    placeholder="e.g. pcs, kg, m, box"
                                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium outline-none focus:border-slate-800 focus:bg-white text-xs"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700 block mb-1">
                                    Warehouse Zone Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="type"
                                    required
                                    defaultValue=""
                                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium outline-none focus:border-slate-800 cursor-pointer text-xs"
                                >
                                    <option value="" disabled>Select storage type</option>
                                    {types.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Traceability & Supply */}
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
                                        placeholder="e.g. BATCH-2026-X"
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
                                        placeholder="e.g. SUP-0012"
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
                                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:border-slate-800 text-xs font-mono"
                                />
                            </div>
                        </div>
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
