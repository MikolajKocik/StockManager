import React from 'react';
import type { Customer } from '@/models/customer';
import { Button } from '@/components/common';

interface CustomerDetailsModalProps {
    customer: Customer | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (customer: Customer) => void;
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
    customer,
    isOpen,
    onClose,
    onEdit
}) => {
    if (!isOpen || !customer) return null;

    const segmentColors: Record<string, string> = {
        Enterprise: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        'Key Account': 'bg-purple-100 text-purple-800 border-purple-300',
        Wholesale: 'bg-blue-100 text-blue-800 border-blue-300',
        Retail: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white border border-slate-300 rounded-lg shadow-2xl max-w-xl w-full overflow-hidden text-slate-800 animate-scale-in">
                {/* Modal Header */}
                <div className="bg-[#384155] text-white px-4 py-3 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs bg-white/20 px-2 py-0.5 rounded font-bold">
                                ID: #{customer.id}
                            </span>
                            <span className="text-xs font-semibold text-slate-300">
                                {customer.code || `CUST-00${customer.id}`}
                            </span>
                        </div>
                        <h3 className="font-bold text-sm text-white mt-1">
                            {customer.name}
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
                    {/* Segment, Status & Credit Stats */}
                    <div className="grid grid-cols-4 gap-2 bg-slate-50 border border-slate-200 rounded-md p-3">
                        <div>
                            <span className="text-[11px] text-slate-500 block font-medium">Status</span>
                            <span className={`inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                                customer.status === 'Active' || !customer.status
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : customer.status === 'Pending'
                                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                                        : 'bg-rose-100 text-rose-800 border-rose-300'
                            }`}>
                                {customer.status || 'Active'}
                            </span>
                        </div>

                        <div>
                            <span className="text-[11px] text-slate-500 block font-medium">Account Segment</span>
                            <span className={`inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                                segmentColors[customer.segment || 'Enterprise'] || 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}>
                                {customer.segment || 'Enterprise'}
                            </span>
                        </div>

                        <div>
                            <span className="text-[11px] text-slate-500 block font-medium">Credit Limit</span>
                            <span className="font-semibold text-slate-800 block mt-0.5 font-mono">
                                {customer.creditLimit ? `€${customer.creditLimit.toLocaleString()}` : '€50,000'}
                            </span>
                        </div>

                        <div>
                            <span className="text-[11px] text-slate-500 block font-medium">Completed Orders</span>
                            <span className="font-semibold text-slate-800 block mt-0.5 font-mono">
                                {customer.totalOrdersCount || 12} Orders
                            </span>
                        </div>
                    </div>

                    {/* Contact & Company Details */}
                    <div className="space-y-2 border border-slate-200 rounded-md p-3 bg-white">
                        <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                            Account & Contact Information
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <span className="text-slate-500 block text-[11px]">Primary Contact Person:</span>
                                <span className="font-semibold text-slate-800">{customer.contactPerson || 'Purchasing Department'}</span>
                            </div>

                            <div>
                                <span className="text-slate-500 block text-[11px]">Tax / VAT ID (NIP):</span>
                                <span className="font-mono font-semibold text-slate-800">{customer.taxId || 'N/A'}</span>
                            </div>

                            <div>
                                <span className="text-slate-500 block text-[11px]">Email Address:</span>
                                <a 
                                    href={`mailto:${customer.email}`}
                                    className="text-blue-600 hover:underline font-medium break-all"
                                >
                                    {customer.email || 'N/A'}
                                </a>
                            </div>

                            <div>
                                <span className="text-slate-500 block text-[11px]">Direct Phone:</span>
                                <a 
                                    href={`tel:${customer.phone}`}
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    {customer.phone || 'N/A'}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Invoicing & Shipping Location */}
                    <div className="border border-slate-200 rounded-md p-3 bg-slate-50 space-y-1 text-xs">
                        <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Registered Invoicing & Delivery Address
                        </h4>
                        <div className="flex items-center justify-between text-slate-700">
                            <span>Country & Jurisdiction:</span>
                            <span className="font-semibold text-slate-900">{customer.address?.country || 'Poland'}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-700">
                            <span>City & District:</span>
                            <span className="font-semibold text-slate-900">{customer.address?.city || 'Warsaw'}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-700">
                            <span>Postal Code:</span>
                            <span className="font-mono font-semibold text-slate-900">{customer.address?.postalCode || '00-001'}</span>
                        </div>
                    </div>

                    {/* Lifetime Volume Banner */}
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-md p-2.5">
                        <div>
                            <span className="font-bold text-emerald-900 block text-xs">Total Lifetime Billing</span>
                            <span className="text-[11px] text-emerald-700">
                                Cumulative closed wholesale orders volume
                            </span>
                        </div>
                        <span className="font-mono font-bold text-base text-emerald-900 bg-white border border-emerald-200 px-2.5 py-1 rounded">
                            €{(customer.totalSpent || 54000).toLocaleString()}
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
                            onEdit(customer);
                        }}
                    >
                        Edit Customer Account
                    </Button>
                </div>
            </div>
        </div>
    );
};
