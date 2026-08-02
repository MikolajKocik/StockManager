import React from 'react';
import type { Supplier } from '@/models/supplier';
import { Button } from '@/components/common';

interface SupplierDetailsModalProps {
    supplier: Supplier | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (supplier: Supplier) => void;
}

export const SupplierDetailsModal: React.FC<SupplierDetailsModalProps> = ({
    supplier,
    isOpen,
    onClose,
    onEdit
}) => {
    if (!isOpen || !supplier) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white border border-slate-300 rounded-lg shadow-2xl max-w-xl w-full overflow-hidden text-slate-800 animate-scale-in">
                {/* Modal Header */}
                <div className="bg-[#384155] text-white px-4 py-3 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs bg-white/20 px-2 py-0.5 rounded font-bold">
                                ID: #{supplier.id}
                            </span>
                            <span className="text-xs font-semibold text-slate-300">
                                {supplier.slug}
                            </span>
                        </div>
                        <h3 className="font-bold text-sm text-white mt-1">
                            {supplier.name}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-300 hover:text-white text-lg leading-none p-1 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 space-y-4 text-xs">
                    {/* Status & Quick Stats */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 rounded-md p-3">
                        <div>
                            <span className="text-[11px] text-slate-500 block font-medium">Status</span>
                            <span className={`inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full border ${supplier.status === 'Active'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : supplier.status === 'Under Review'
                                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                                        : 'bg-slate-100 text-slate-700 border-slate-300'
                                }`}>
                                {supplier.status || 'Active'}
                            </span>
                        </div>

                        <div>
                            <span className="text-[11px] text-slate-500 block font-medium">Payment Terms</span>
                            <span className="font-semibold text-slate-800 block mt-0.5">
                                {supplier.paymentTerms || 'Net 30'}
                            </span>
                        </div>

                        <div>
                            <span className="text-[11px] text-slate-500 block font-medium">Lead Time</span>
                            <span className="font-semibold text-slate-800 block mt-0.5">
                                {supplier.leadTimeDays ? `${supplier.leadTimeDays} Days` : '5 Days'}
                            </span>
                        </div>
                    </div>

                    {/* Contact & Company Details */}
                    <div className="space-y-2 border border-slate-200 rounded-md p-3 bg-white">
                        <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                            Contact Information
                        </h4>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <span className="text-slate-500 block text-[11px]">Contact Person:</span>
                                <span className="font-semibold text-slate-800">{supplier.contactPerson || 'Procurement Office'}</span>
                            </div>

                            <div>
                                <span className="text-slate-500 block text-[11px]">Tax / VAT ID:</span>
                                <span className="font-mono font-semibold text-slate-800">{supplier.taxId || 'N/A'}</span>
                            </div>

                            <div>
                                <span className="text-slate-500 block text-[11px]">Email Address:</span>
                                <a
                                    href={`mailto:${supplier.email}`}
                                    className="text-blue-600 hover:underline font-medium break-all"
                                >
                                    {supplier.email || 'N/A'}
                                </a>
                            </div>

                            <div>
                                <span className="text-slate-500 block text-[11px]">Phone Number:</span>
                                <a
                                    href={`tel:${supplier.phone}`}
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    {supplier.phone || 'N/A'}
                                </a>
                            </div>
                        </div>

                        {supplier.website && (
                            <div className="pt-1 text-xs">
                                <span className="text-slate-500 block text-[11px]">Official Website:</span>
                                <a
                                    href={supplier.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    {supplier.website}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Location & Address */}
                    <div className="border border-slate-200 rounded-md p-3 bg-slate-50 space-y-1 text-xs">
                        <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
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
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md p-2.5">
                        <div>
                            <span className="font-bold text-blue-900 block text-xs">Active Catalog SKUs</span>
                            <span className="text-[11px] text-blue-700">
                                This supplier provides {supplier.activeItemsCount || 24} warehouse inventory items
                            </span>
                        </div>
                        <span className="font-mono font-bold text-base text-blue-900 bg-white border border-blue-200 px-2.5 py-1 rounded">
                            {supplier.activeItemsCount || 24} SKUs
                        </span>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-2 p-3 bg-slate-50 border-t border-slate-200">
                    <Button variant="secondary" size="sm" onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                            onClose();
                            onEdit(supplier);
                        }}
                    >
                        Edit Supplier Profile
                    </Button>
                </div>
            </div>
        </div>
    );
};
