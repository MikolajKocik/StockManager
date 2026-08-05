import { forwardRef } from 'react';
import type { Customer } from '@/models/customer';
import { Button, FormBody, FormFooter, Modal } from '@/components/common';

interface CustomerDetailsModalProps {
    customer: Customer | null;
    onClose: () => void;
    onEdit: (customer: Customer) => void;
}

const STATUS_STYLE_MAP: Record<string, { textClass: string; dotClass: string }> = {
    Active: { textClass: 'text-[#0e5f32]', dotClass: 'bg-[#0e5f32]' },
    Pending: { textClass: 'text-[#8f7d49]', dotClass: 'bg-[#AA9559]' },
    Suspended: { textClass: 'text-slate-500', dotClass: 'bg-slate-400' }
};

export const CustomerDetailsModal = forwardRef<HTMLDialogElement, CustomerDetailsModalProps>(({
    customer,
    onClose,
    onEdit
}, ref) => {
    if (!customer) return null;

    const statusConfig = STATUS_STYLE_MAP[customer.status || 'Active'] || STATUS_STYLE_MAP.Active;

    return (
        <Modal
            ref={ref}
            title={`Customer Profile: ${customer.name}`}
            size="lg"
            onClose={onClose}
        >
            <FormBody className="max-h-[75vh] space-y-4">
                {/* Status & Commercial Terms */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50/80 border border-slate-300 rounded-md p-3">
                    <div>
                        <span className="text-[0.6875rem] text-slate-500 block font-medium">Status</span>
                        <span className={`inline-flex items-center gap-1.5 mt-1 text-xs font-semibold ${statusConfig.textClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
                            {customer.status || 'Active'}
                        </span>
                    </div>

                    <div>
                        <span className="text-[0.6875rem] text-slate-500 block font-medium">Segment</span>
                        <span className="font-semibold text-slate-800 block mt-1">
                            {customer.segment || 'Enterprise'}
                        </span>
                    </div>
                </div>

                {/* Contact & Legal Info */}
                <div className="space-y-3 border border-slate-300 rounded-md p-3 bg-white">
                    <h4 className="text-[0.6875rem] font-bold text-slate-600 uppercase tracking-wider">
                        Company & Billing Contact
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                            <span className="text-slate-500 block text-[0.6875rem]">Contact Person:</span>
                            <span className="font-semibold text-slate-800">{customer.contactPerson || 'Procurement Contact'}</span>
                        </div>

                        <div>
                            <span className="text-slate-500 block text-[0.6875rem]">Tax / VAT / NIP ID:</span>
                            <span className="font-mono font-semibold text-slate-800">{customer.taxId || 'N/A'}</span>
                        </div>

                        <div>
                            <span className="text-slate-500 block text-[0.6875rem]">Email Address:</span>
                            <a
                                href={`mailto:${customer.email}`}
                                className="text-[#2b6675] hover:underline font-medium break-all"
                            >
                                {customer.email || 'N/A'}
                            </a>
                        </div>

                        <div>
                            <span className="text-slate-500 block text-[0.6875rem]">Phone Number:</span>
                            <a
                                href={`tel:${customer.phone}`}
                                className="text-[#2b6675] hover:underline font-medium"
                            >
                                {customer.phone || 'N/A'}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Location & Address */}
                <div className="border border-slate-300 rounded-md p-3 bg-slate-50/80 space-y-1.5 text-xs">
                    <h4 className="text-[0.6875rem] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        Registered Billing Headquarters
                    </h4>
                    <div className="flex items-center justify-between text-slate-700">
                        <span>Country:</span>
                        <span className="font-semibold text-slate-900">{customer.address?.country || 'Poland'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                        <span>City:</span>
                        <span className="font-semibold text-slate-900">{customer.address?.city || 'Warsaw'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                        <span>Postal Code:</span>
                        <span className="font-mono font-semibold text-slate-900">{customer.address?.postalCode || '00-001'}</span>
                    </div>
                </div>

                {/* Credit Limits & Volume */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50/80 border border-slate-300 rounded-md p-3">
                        <span className="font-bold text-slate-800 block text-xs">Commercial Credit Limit</span>
                        <span className="font-mono font-bold text-base text-slate-900 mt-1 block">
                            €{(customer.creditLimit || 50000).toLocaleString()}
                        </span>
                    </div>

                    <div className="bg-slate-50/80 border border-slate-300 rounded-md p-3">
                        <span className="font-bold text-slate-800 block text-xs">Total Billed Lifetime Volume</span>
                        <span className="font-mono font-bold text-base text-[#0e5f32] mt-1 block">
                            €{(customer.totalSpent || 0).toLocaleString()}
                        </span>
                    </div>
                </div>
            </FormBody>

            <FormFooter>
                <Button variant="secondary" size="md" onClick={onClose}>
                    Close
                </Button>
                <Button
                    variant="warning"
                    size="md"
                    onClick={() => {
                        onClose();
                        onEdit(customer);
                    }}
                >
                    Edit Customer Account
                </Button>
            </FormFooter>
        </Modal>
    );
});

CustomerDetailsModal.displayName = 'CustomerDetailsModal';
