import { forwardRef } from 'react';
import type { Supplier } from '@/models/supplier';
import { Button, FormBody, FormFooter, Modal } from '@/components/common';

interface SupplierDetailsModalProps {
    supplier: Supplier | null;
    onClose: () => void;
    onEdit: (supplier: Supplier) => void;
}

const STATUS_STYLE_MAP: Record<string, { textClass: string; dotClass: string }> = {
    'Active': { textClass: 'text-[#0e5f32]', dotClass: 'bg-[#0e5f32]' },
    'Under Review': { textClass: 'text-[#8f7d49]', dotClass: 'bg-[#AA9559]' },
    'Inactive': { textClass: 'text-slate-500', dotClass: 'bg-slate-400' }
};

export const SupplierDetailsModal = forwardRef<HTMLDialogElement, SupplierDetailsModalProps>(({
    supplier,
    onClose,
    onEdit
}, ref) => {
    if (!supplier) return null;

    const statusConfig = STATUS_STYLE_MAP[supplier.status || 'Active'] || STATUS_STYLE_MAP.Inactive;

    return (
        <Modal
            ref={ref}
            title={`Supplier Profile: ${supplier.name}`}
            size="lg"
            onClose={onClose}
        >
            <FormBody className="max-h-[75vh] space-y-4">
                {/* Status & Quick Stats */}
                <div className="grid grid-cols-3 gap-3 bg-slate-50/80 border border-slate-300 rounded-md p-3">
                    <div>
                        <span className="text-[0.6875rem] text-slate-500 block font-medium">Status</span>
                        <span className={`inline-flex items-center gap-1.5 mt-1 text-xs font-semibold ${statusConfig.textClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
                            {supplier.status || 'Active'}
                        </span>
                    </div>

                    <div>
                        <span className="text-[0.6875rem] text-slate-500 block font-medium">Payment Terms</span>
                        <span className="font-semibold text-slate-800 block mt-1">
                            {supplier.paymentTerms || 'Net 30'}
                        </span>
                    </div>

                    <div>
                        <span className="text-[0.6875rem] text-slate-500 block font-medium">Lead Time</span>
                        <span className="font-semibold text-slate-800 block mt-1">
                            {supplier.leadTimeDays ? `${supplier.leadTimeDays} Days` : '5 Days'}
                        </span>
                    </div>
                </div>

                {/* Contact & Company Details */}
                <div className="space-y-3 border border-slate-300 rounded-md p-3 bg-white">
                    <h4 className="text-[0.6875rem] font-bold text-slate-600 uppercase tracking-wider">
                        Contact Information
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                            <span className="text-slate-500 block text-[0.6875rem]">Contact Person:</span>
                            <span className="font-semibold text-slate-800">{supplier.contactPerson || 'Procurement Office'}</span>
                        </div>

                        <div>
                            <span className="text-slate-500 block text-[0.6875rem]">Tax / VAT ID:</span>
                            <span className="font-mono font-semibold text-slate-800">{supplier.taxId || 'N/A'}</span>
                        </div>

                        <div>
                            <span className="text-slate-500 block text-[0.6875rem]">Email Address:</span>
                            <a
                                href={`mailto:${supplier.email}`}
                                className="text-blue-700 hover:underline font-medium break-all"
                            >
                                {supplier.email || 'N/A'}
                            </a>
                        </div>

                        <div>
                            <span className="text-slate-500 block text-[0.6875rem]">Phone Number:</span>
                            <a
                                href={`tel:${supplier.phone}`}
                                className="text-blue-700 hover:underline font-medium"
                            >
                                {supplier.phone || 'N/A'}
                            </a>
                        </div>
                    </div>

                    {supplier.website && (
                        <div className="pt-1 text-xs">
                            <span className="text-slate-500 block text-[0.6875rem]">Official Website:</span>
                            <a
                                href={supplier.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-700 hover:underline font-medium"
                            >
                                {supplier.website}
                            </a>
                        </div>
                    )}
                </div>

                {/* Location & Address */}
                <div className="border border-slate-300 rounded-md p-3 bg-slate-50/80 space-y-1.5 text-xs">
                    <h4 className="text-[0.6875rem] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        Registered Warehouse / Sourcing Location
                    </h4>
                    <div className="flex items-center justify-between text-slate-700">
                        <span>Country & Region:</span>
                        <span className="font-semibold text-slate-900">{supplier.address?.country || 'USA'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                        <span>City:</span>
                        <span className="font-semibold text-slate-900">{supplier.address?.city || 'New York'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                        <span>Postal Code:</span>
                        <span className="font-mono font-semibold text-slate-900">{supplier.address?.postalCode || '10001'}</span>
                    </div>
                </div>

                {/* Catalog Items Metric */}
                <div className="flex items-center justify-between bg-slate-50/80 border border-slate-300 rounded-md p-3">
                    <div>
                        <span className="font-bold text-slate-800 block text-xs">Active Catalog SKUs</span>
                        <span className="text-[0.6875rem] text-slate-500">
                            This supplier provides {supplier.activeItemsCount || 24} warehouse inventory items
                        </span>
                    </div>
                    <span className="font-mono font-bold text-sm text-slate-900 bg-white border border-slate-300 px-3 py-1 rounded shadow-2xs">
                        {supplier.activeItemsCount || 24} SKUs
                    </span>
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
                        onEdit(supplier);
                    }}
                >
                    Edit Supplier Profile
                </Button>
            </FormFooter>
        </Modal>
    );
});

SupplierDetailsModal.displayName = 'SupplierDetailsModal';
