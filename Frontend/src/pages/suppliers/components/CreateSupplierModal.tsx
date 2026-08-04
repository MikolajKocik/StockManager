import React, { forwardRef } from 'react';
import type { Supplier } from '@/models/supplier';
import { Button, FormBody, FormFooter, Modal, Input, Select, Section } from '@/components/common';

interface CreateSupplierModalProps {
    initialData?: Supplier | null;
    onClose: () => void;
    onSubmit: (supplierData: Partial<Supplier>, editingId?: string) => void;
}

export const SUPPLIER_PAYMENT_TERMS_OPTIONS = [
    { value: 'Net 14', label: 'Net 14' },
    { value: 'Net 30', label: 'Net 30' },
    { value: 'Net 45', label: 'Net 45' },
    { value: 'Net 60', label: 'Net 60' },
    { value: 'Prepayment', label: 'Prepayment' }
] as const;

export const SUPPLIER_STATUS_OPTIONS = [
    { value: 'Active', label: 'Active' },
    { value: 'Under Review', label: 'Under Review' },
    { value: 'Inactive', label: 'Inactive' }
] as const;

export const CreateSupplierModal = forwardRef<HTMLDialogElement, CreateSupplierModalProps>(({
    initialData,
    onClose,
    onSubmit
}, ref) => {
    const isEditMode = !!initialData;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as Record<string, string>;

        const name = data.name?.trim() || '';
        if (!name) return;

        const slug = data.slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const payload: Partial<Supplier> = {
            id: initialData?.id || `SUP-${Date.now().toString().slice(-4)}`,
            name,
            slug,
            taxId: data.taxId?.trim() || '',
            contactPerson: data.contactPerson?.trim() || '',
            email: data.email?.trim() || '',
            phone: data.phone?.trim() || '',
            website: data.website?.trim() || '',
            paymentTerms: data.paymentTerms || 'Net 30',
            leadTimeDays: Number(data.leadTimeDays) || 5,
            status: (data.status as 'Active' | 'Under Review' | 'Inactive') || 'Active',
            activeItemsCount: initialData?.activeItemsCount || 0,
            rating: initialData?.rating || 4.8,
            address: {
                id: initialData?.address?.id || `ADDR-${Date.now().toString().slice(-4)}`,
                country: data.country?.trim() || 'Poland',
                city: data.city?.trim() || '',
                postalCode: data.postalCode?.trim() || '',
                supplierId: initialData?.id || '0'
            }
        };

        onSubmit(payload, initialData?.id);
        onClose();
    };

    return (
        <Modal
            ref={ref}
            title={isEditMode ? `Edit Supplier: ${initialData?.name}` : 'Add New Vendor / Supplier'}
            size="lg"
            onClose={onClose}
        >
            <form key={initialData?.id || 'new'} onSubmit={handleSubmit}>
                <FormBody className="max-h-[75vh] space-y-4">
                    {/* Basic Info */}
                    <Section title="Company Identification">
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Company Name *"
                                name="name"
                                required
                                defaultValue={initialData?.name || ''}
                                placeholder="e.g. Apex Industrial Supplies"
                            />

                            <Input
                                label="Identifier / Slug"
                                name="slug"
                                defaultValue={initialData?.slug || ''}
                                placeholder="apex-industrial"
                                className="font-mono"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Tax ID / VAT Registration"
                                name="taxId"
                                defaultValue={initialData?.taxId || ''}
                                placeholder="PL1234567890"
                                className="font-mono"
                            />

                            <Input
                                label="Official Website"
                                name="website"
                                defaultValue={initialData?.website || ''}
                                placeholder="https://apexindustrial.com"
                            />
                        </div>
                    </Section>

                    {/* Contact details */}
                    <Section variant="subtle" title="Primary Contact & Logistics Lead">
                        <div className="grid grid-cols-3 gap-3">
                            <Input
                                label="Contact Person"
                                name="contactPerson"
                                defaultValue={initialData?.contactPerson || ''}
                                placeholder="John Doe"
                                className="bg-white"
                            />

                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                defaultValue={initialData?.email || ''}
                                placeholder="orders@supplier.com"
                                className="bg-white font-mono"
                            />

                            <Input
                                label="Phone Number"
                                name="phone"
                                defaultValue={initialData?.phone || ''}
                                placeholder="+48 123 456 789"
                                className="bg-white font-mono"
                            />
                        </div>
                    </Section>

                    {/* Address section */}
                    <Section variant="subtle" title="Warehouse & Headquarter Address">
                        <div className="grid grid-cols-3 gap-3">
                            <Input
                                label="Country"
                                name="country"
                                defaultValue={initialData?.address?.country || 'Poland'}
                                placeholder="Poland"
                                className="bg-white"
                            />

                            <Input
                                label="City"
                                name="city"
                                defaultValue={initialData?.address?.city || ''}
                                placeholder="Warsaw"
                                className="bg-white"
                            />

                            <Input
                                label="Postal Code"
                                name="postalCode"
                                defaultValue={initialData?.address?.postalCode || ''}
                                placeholder="00-001"
                                className="bg-white font-mono"
                            />
                        </div>
                    </Section>

                    {/* Commercial Terms */}
                    <Section title="Commercial Terms & Status">
                        <div className="grid grid-cols-3 gap-3">
                            <Select
                                label="Payment Terms"
                                name="paymentTerms"
                                defaultValue={initialData?.paymentTerms || 'Net 30'}
                                options={SUPPLIER_PAYMENT_TERMS_OPTIONS}
                            />

                            <Input
                                label="Lead Time (Days)"
                                name="leadTimeDays"
                                type="number"
                                min={1}
                                max={90}
                                defaultValue={initialData?.leadTimeDays || 5}
                                className="font-mono"
                            />

                            <Select
                                label="Account Status"
                                name="status"
                                defaultValue={initialData?.status || 'Active'}
                                options={SUPPLIER_STATUS_OPTIONS}
                            />
                        </div>
                    </Section>
                </FormBody>

                <FormFooter>
                    <Button variant="secondary" size="md" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="md" type="submit">
                        {isEditMode ? 'Save Changes' : 'Register Supplier'}
                    </Button>
                </FormFooter>
            </form>
        </Modal>
    );
});

CreateSupplierModal.displayName = 'CreateSupplierModal';
