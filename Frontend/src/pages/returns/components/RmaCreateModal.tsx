import React, { useState } from 'react';
import { 
    Modal, 
    Button, 
    Input, 
    Select, 
    Textarea 
} from '@/components/common';
import type { CustomerReturnReason } from '@/models/rma';
import { mockProduct } from '@/mocks/product.mocks';
import type { returnsApi } from '@/api/internal/returnsApi';

export interface RmaCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (newRecord: Parameters<typeof returnsApi.createRma>[0]) => Promise<any>;
}

const CUSTOMER_REASON_OPTIONS = [
    { value: 'DAMAGED_IN_TRANSIT', label: 'Damaged in Transit / Courier Drop' },
    { value: 'DEFECTIVE_DEVICE', label: 'Defective Device / Hardware Malfunction' },
    { value: 'WRONG_ITEM_SENT', label: 'Wrong Item Sent / Mismatched SKU' },
    { value: 'EXPIRED_PERISHABLE', label: 'Expired Perishable / Cold Chain Fail' },
    { value: 'CUSTOMER_MISTAKE', label: 'Customer Mistake / Over-ordered' },
    { value: 'COSMETIC_DAMAGE', label: 'Cosmetic Scuff / Box Wear' }
] as const;

export const RmaCreateModal: React.FC<RmaCreateModalProps> = ({
    isOpen,
    onClose,
    onCreated
}) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const productOptions = mockProduct.map(p => ({
        value: p.id,
        label: `${p.name} (${p.batchNumber}) - ${p.type}`
    }));

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const productId = Number(data.productId) || mockProduct[0].id;
        const chosenProduct = mockProduct.find(p => p.id === productId) || mockProduct[0];
        const quantity = Number(data.quantity) || 1;

        try {
            await onCreated({
                salesOrderId: String(data.salesOrderId || 'SO-9920'),
                customerName: String(data.customerName || 'TechLogix Distribution'),
                customerContact: String(data.customerContact || 'returns@techlogix.pl'),
                productId: chosenProduct.id,
                productName: chosenProduct.name,
                productSku: `${chosenProduct.batchNumber} / SKU-${chosenProduct.slug.toUpperCase()}`,
                quantity,
                unit: chosenProduct.unit,
                returnDate: new Date().toISOString().slice(0, 10),
                status: 'INSPECTION_PENDING',
                customerReason: (data.customerReason as CustomerReturnReason) || 'DAMAGED_IN_TRANSIT',
                customerNotes: String(data.customerNotes || ''),
                baseline: {
                    productName: chosenProduct.name,
                    sku: `${chosenProduct.batchNumber} / SKU-${chosenProduct.slug.toUpperCase()}`,
                    batchNumber: chosenProduct.batchNumber,
                    originalGrade: 'Grade A - Certified Quality Standard',
                    shelfLocation: `Zone ${chosenProduct.type.slice(0, 1).toUpperCase()}-01`,
                    storageTemperature: chosenProduct.type === 'RefrigeratedSection' ? '+2°C to +6°C' : chosenProduct.type === 'FreezerSection' ? '-18°C' : '+15°C to +25°C',
                    expiryDate: chosenProduct.expirationDate,
                    warrantyStatus: 'Standard 12M Warehouse Warranty',
                    specifications: {
                        Supplier: chosenProduct.supplierName || 'Default Supplier',
                        StorageType: chosenProduct.type,
                        Unit: chosenProduct.unit
                    }
                },
                damageSeverity: 'NONE',
                damagePhotos: [],
                checklist: {
                    packagingIntact: true,
                    powerOnBoot: true,
                    accessoriesIncluded: true,
                    tamperSealIntact: true,
                    noFluidLeakage: true,
                    labelReadable: true
                },
                inspectorNotes: '',
                suggestedAction: 'RESTOCK_PRIME',
                suggestedActionReason: 'Pending visual inspection via classification wizard.',
                suggestedActionConfidence: 90,
                finalAction: 'PENDING'
            });
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Register Incoming Return (RMA)"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="p-4 space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                        name="salesOrderId"
                        label="Sales Order Ref"
                        defaultValue="SO-9920"
                        required
                    />
                    <Select
                        name="productId"
                        label="Product Catalog Item"
                        defaultValue={1}
                        options={productOptions}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                        name="customerName"
                        label="Customer / Client Name"
                        defaultValue="TechLogix Distribution Sp. z o.o."
                        required
                    />
                    <Input
                        name="customerContact"
                        label="Customer Contact Email / Phone"
                        defaultValue="returns@techlogix.pl"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                        name="quantity"
                        label="Returned Quantity"
                        type="number"
                        min={1}
                        defaultValue={10}
                        required
                    />
                    <Select
                        name="customerReason"
                        label="Claim Reason"
                        defaultValue="DAMAGED_IN_TRANSIT"
                        options={CUSTOMER_REASON_OPTIONS as any}
                    />
                </div>

                <div>
                    <Textarea
                        name="customerNotes"
                        label="Customer Intake Notes"
                        rows={2}
                        defaultValue="Package delivered with crushed outer box."
                        placeholder="Details provided during return authorization intake..."
                    />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                    <Button variant="secondary" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" isLoading={isSubmitting}>
                        Register RMA Intake
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
