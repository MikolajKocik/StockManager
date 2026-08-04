import React, { forwardRef } from 'react';
import type { Customer } from '@/models/customer';
import { Button, FormBody, FormFooter, Modal, Input, Select, Section } from '@/components/common';

interface CreateCustomerModalProps {
    initialData?: Customer | null;
    onClose: () => void;
    onSubmit: (customerData: Partial<Customer>, editingId?: number) => void;
}

export const CUSTOMER_SEGMENT_OPTIONS = [
    { value: 'Enterprise', label: 'Enterprise' },
    { value: 'Key Account', label: 'Key Account' },
    { value: 'Wholesale', label: 'Wholesale' },
    { value: 'Retail', label: 'Retail' }
] as const;

export const CUSTOMER_STATUS_OPTIONS = [
    { value: 'Active', label: 'Active' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Suspended', label: 'Suspended' }
] as const;

export const CreateCustomerModal = forwardRef<HTMLDialogElement, CreateCustomerModalProps>(({
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

        const code = data.code?.trim() || `CUST-${Date.now().toString().slice(-4)}`;

        const payload: Partial<Customer> = {
            id: initialData?.id || Date.now(),
            name,
            code,
            taxId: data.taxId?.trim() || '',
            contactPerson: data.contactPerson?.trim() || '',
            email: data.email?.trim() || '',
            phone: data.phone?.trim() || '',
            segment: (data.segment as 'Enterprise' | 'Wholesale' | 'Retail' | 'Key Account') || 'Enterprise',
            creditLimit: Number(data.creditLimit) || 50000,
            status: (data.status as 'Active' | 'Pending' | 'Suspended') || 'Active',
            totalSpent: initialData?.totalSpent || 0,
            addressId: initialData?.addressId || `addr-${Date.now()}`,
            address: {
                id: initialData?.address?.id || `addr-${Date.now()}`,
                supplierId: '',
                country: data.country?.trim() || 'Poland',
                city: data.city?.trim() || '',
                postalCode: data.postalCode?.trim() || ''
            }
        };

        onSubmit(payload, initialData?.id);
        onClose();
    };

    return (
        <Modal
            ref={ref}
            title={isEditMode ? `Edit Customer: ${initialData?.name}` : 'Create New B2B Client Account'}
            size="lg"
            onClose={onClose}
        >
            <form key={initialData?.id || 'new'} onSubmit={handleSubmit}>
                <FormBody className="max-h-[75vh] space-y-4">
                    {/* Basic Info */}
                    <Section title="Enterprise Information">
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Company / Enterprise Name *"
                                name="name"
                                required
                                defaultValue={initialData?.name || ''}
                                placeholder="e.g. EuroLogistics Inc."
                            />

                            <Input
                                label="Client Internal Code"
                                name="code"
                                defaultValue={initialData?.code || ''}
                                placeholder="e.g. CUST-EUR-0091"
                                className="font-mono"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Tax / NIP / VAT ID"
                                name="taxId"
                                defaultValue={initialData?.taxId || ''}
                                placeholder="PL5252819401"
                                className="font-mono"
                            />

                            <Input
                                label="Primary Contact Person"
                                name="contactPerson"
                                defaultValue={initialData?.contactPerson || ''}
                                placeholder="Anna Smith"
                            />
                        </div>
                    </Section>

                    {/* Email & Phone */}
                    <Section variant="subtle" title="Billing & Contact Channels">
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Billing / Contact Email"
                                name="email"
                                type="email"
                                defaultValue={initialData?.email || ''}
                                placeholder="billing@eurologistics.com"
                                className="bg-white font-mono"
                            />

                            <Input
                                label="Phone Number"
                                name="phone"
                                defaultValue={initialData?.phone || ''}
                                placeholder="+48 22 890 12 34"
                                className="bg-white font-mono"
                            />
                        </div>
                    </Section>

                    {/* Address Information */}
                    <Section variant="subtle" title="Billing Address & Location">
                        <div className="grid grid-cols-3 gap-2">
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

                    {/* Commercial Terms & Segment */}
                    <Section title="Commercial Terms & Credit Line">
                        <div className="grid grid-cols-3 gap-3">
                            <Select
                                label="Client Segment"
                                name="segment"
                                defaultValue={initialData?.segment || 'Enterprise'}
                                options={CUSTOMER_SEGMENT_OPTIONS}
                            />

                            <Input
                                label="Credit Limit (€)"
                                name="creditLimit"
                                type="number"
                                step="1000"
                                defaultValue={initialData?.creditLimit || 50000}
                                className="font-mono"
                            />

                            <Select
                                label="Account Status"
                                name="status"
                                defaultValue={initialData?.status || 'Active'}
                                options={CUSTOMER_STATUS_OPTIONS}
                            />
                        </div>
                    </Section>
                </FormBody>

                <FormFooter>
                    <Button variant="secondary" size="md" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="md" type="submit">
                        {isEditMode ? 'Save Changes' : 'Create Customer Account'}
                    </Button>
                </FormFooter>
            </form>
        </Modal>
    );
});

CreateCustomerModal.displayName = 'CreateCustomerModal';
