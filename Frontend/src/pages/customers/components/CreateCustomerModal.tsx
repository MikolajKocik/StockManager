import React, { useState, useEffect } from 'react';
import type { Customer } from '@/models/customer';
import { Button } from '@/components/common';

interface CreateCustomerModalProps {
    isOpen: boolean;
    initialData?: Customer | null;
    onClose: () => void;
    onSubmit: (customerData: Partial<Customer>) => void;
}

export const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({
    isOpen,
    initialData,
    onClose,
    onSubmit
}) => {
    const isEditMode = !!initialData;

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [taxId, setTaxId] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [segment, setSegment] = useState<'Enterprise' | 'Wholesale' | 'Retail' | 'Key Account'>('Enterprise');
    const [creditLimit, setCreditLimit] = useState(100000);
    const [currency, setCurrency] = useState('EUR');
    const [country, setCountry] = useState('Poland');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [status, setStatus] = useState<'Active' | 'Suspended' | 'Pending'>('Active');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setCode(initialData.code || '');
            setTaxId(initialData.taxId || '');
            setContactPerson(initialData.contactPerson || '');
            setEmail(initialData.email || '');
            setPhone(initialData.phone || '');
            setSegment(initialData.segment || 'Enterprise');
            setCreditLimit(initialData.creditLimit || 100000);
            setCurrency(initialData.currency || 'EUR');
            setCountry(initialData.address?.country || 'Poland');
            setCity(initialData.address?.city || '');
            setPostalCode(initialData.address?.postalCode || '');
            setStatus(initialData.status || 'Active');
        } else {
            setName('');
            setCode('');
            setTaxId('');
            setContactPerson('');
            setEmail('');
            setPhone('');
            setSegment('Enterprise');
            setCreditLimit(100000);
            setCurrency('EUR');
            setCountry('Poland');
            setCity('');
            setPostalCode('');
            setStatus('Active');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleNameChange = (val: string) => {
        setName(val);
        if (!isEditMode && !code) {
            setCode(`CUST-${Math.floor(100 + Math.random() * 900)}`);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const payload: Partial<Customer> = {
            id: initialData?.id || Date.now(),
            name: name.trim(),
            code: code.trim() || `CUST-${Math.floor(100 + Math.random() * 900)}`,
            taxId: taxId.trim(),
            contactPerson: contactPerson.trim(),
            email: email.trim(),
            phone: phone.trim(),
            segment,
            creditLimit: Number(creditLimit) || 50000,
            currency,
            status,
            totalOrdersCount: initialData?.totalOrdersCount || 0,
            totalSpent: initialData?.totalSpent || 0,
            addressId: initialData?.addressId || `${Date.now()}`,
            address: {
                id: initialData?.address?.id || `${Date.now()}`,
                country: country.trim(),
                city: city.trim(),
                postalCode: postalCode.trim(),
                supplierId: '0'
            }
        };

        onSubmit(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white border border-slate-300 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden text-slate-800 animate-scale-in">
                {/* Modal Header */}
                <div className="bg-[#384155] text-white px-4 py-3 flex items-center justify-between">
                    <h3 className="font-bold text-sm">
                        {isEditMode ? `Edit Account: ${initialData.name}` : 'Register New B2B Customer'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-300 hover:text-white text-lg leading-none p-1 cursor-pointer"
                    >
                        &#10005;
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs max-h-[80vh] overflow-y-auto">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Enterprise / Client Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="e.g. Apex Logistics Hub Sp. z o.o."
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Customer Account Code
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="e.g. CUST-009"
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Tax ID & Contact Person */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Tax ID / VAT (NIP)
                            </label>
                            <input
                                type="text"
                                value={taxId}
                                onChange={(e) => setTaxId(e.target.value)}
                                placeholder="e.g. PL5252819401"
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Contact Person
                            </label>
                            <input
                                type="text"
                                value={contactPerson}
                                onChange={(e) => setContactPerson(e.target.value)}
                                placeholder="e.g. Alexander Novak"
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Invoicing / Contact Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="e.g. orders@client.com"
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Direct Phone
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g. +48 22 590 12 34"
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
                        <span className="font-bold text-[11px] text-slate-600 uppercase tracking-wider block">
                            Billing & Delivery Address
                        </span>

                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="font-semibold text-slate-600 block mb-0.5">Country</label>
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    placeholder="Poland"
                                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:border-slate-800"
                                />
                            </div>
                            <div>
                                <label className="font-semibold text-slate-600 block mb-0.5">City</label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Warsaw"
                                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:border-slate-800"
                                />
                            </div>
                            <div>
                                <label className="font-semibold text-slate-600 block mb-0.5">Postal Code</label>
                                <input
                                    type="text"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    placeholder="00-001"
                                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-mono outline-none focus:border-slate-800"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Commercial Segment, Credit Limit & Status */}
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Client Segment
                            </label>
                            <select
                                value={segment}
                                onChange={(e) => setSegment(e.target.value as any)}
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 font-medium outline-none focus:border-slate-800"
                            >
                                <option value="Enterprise">Enterprise</option>
                                <option value="Key Account">Key Account</option>
                                <option value="Wholesale">Wholesale</option>
                                <option value="Retail">Retail</option>
                            </select>
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Credit Limit (€)
                            </label>
                            <input
                                type="number"
                                min={0}
                                step={5000}
                                value={creditLimit}
                                onChange={(e) => setCreditLimit(Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 font-mono outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Account Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 font-semibold outline-none focus:border-slate-800"
                            >
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                        <Button variant="secondary" size="sm" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" type="submit">
                            {isEditMode ? 'Save Changes' : 'Create Account'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
