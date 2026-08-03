import React, { forwardRef, useState, useEffect } from 'react';
import type { Customer } from '@/models/customer';
import { Button, FormBody, FormFooter, Modal } from '@/components/common';

interface CreateCustomerModalProps {
    initialData?: Customer | null;
    onClose: () => void;
    onSubmit: (customerData: Partial<Customer>, editingId?: number) => void;
}

export const CreateCustomerModal = forwardRef<HTMLDialogElement, CreateCustomerModalProps>(({
    initialData,
    onClose,
    onSubmit
}, ref) => {
    const isEditMode = !!initialData;

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [taxId, setTaxId] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('Poland');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [segment, setSegment] = useState<'Enterprise' | 'Wholesale' | 'Retail' | 'Key Account'>('Enterprise');
    const [creditLimit, setCreditLimit] = useState(50000);
    const [status, setStatus] = useState<'Active' | 'Pending' | 'Suspended'>('Active');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setCode(initialData.code || '');
            setTaxId(initialData.taxId || '');
            setContactPerson(initialData.contactPerson || '');
            setEmail(initialData.email || '');
            setPhone(initialData.phone || '');
            setCountry(initialData.address?.country || 'Poland');
            setCity(initialData.address?.city || '');
            setPostalCode(initialData.address?.postalCode || '');
            setSegment(initialData.segment || 'Enterprise');
            setCreditLimit(initialData.creditLimit || 50000);
            setStatus(initialData.status || 'Active');
        } else {
            setName('');
            setCode('');
            setTaxId('');
            setContactPerson('');
            setEmail('');
            setPhone('');
            setCountry('Poland');
            setCity('');
            setPostalCode('');
            setSegment('Enterprise');
            setCreditLimit(50000);
            setStatus('Active');
        }
    }, [initialData]);

    const handleNameChange = (val: string) => {
        setName(val);
        if (!isEditMode && !code) {
            setCode(`CUST-${val.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name.trim()) return;

        const payload: Partial<Customer> = {
            id: initialData?.id || Date.now(),
            name: name.trim(),
            code: code.trim() || `CUST-${Date.now().toString().slice(-4)}`,
            taxId: taxId.trim(),
            contactPerson: contactPerson.trim(),
            email: email.trim(),
            phone: phone.trim(),
            segment,
            creditLimit: Number(creditLimit) || 50000,
            status,
            totalSpent: initialData?.totalSpent || 0,
            addressId: initialData?.addressId || `addr-${Date.now()}`,
            address: {
                id: initialData?.address?.id || `addr-${Date.now()}`,
                supplierId: '',
                country: country.trim(),
                city: city.trim(),
                postalCode: postalCode.trim()
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
            <form onSubmit={handleSubmit}>
                <FormBody className="max-h-[75vh] space-y-3">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Company / Enterprise Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="e.g. EuroLogistics Sp. z o.o."
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Client Internal Code
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="e.g. CUST-EUR-0091"
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Tax ID & Contact Person */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Tax / NIP / VAT ID
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
                                Primary Contact Person
                            </label>
                            <input
                                type="text"
                                value={contactPerson}
                                onChange={(e) => setContactPerson(e.target.value)}
                                placeholder="e.g. Anna Kowalska"
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Billing / Contact Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="e.g. billing@eurologistics.pl"
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g. +48 22 890 12 34"
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="p-3 bg-slate-50 border border-slate-300 rounded space-y-2">
                        <span className="font-bold text-[11px] text-slate-600 uppercase tracking-wider block">
                            Billing Address & Location
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

                    {/* Commercial Terms & Segment */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Client Segment
                            </label>
                            <select
                                value={segment}
                                onChange={(e) => setSegment(e.target.value as any)}
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium outline-none focus:border-slate-800 cursor-pointer"
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
                                step="1000"
                                value={creditLimit}
                                onChange={(e) => setCreditLimit(Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold outline-none focus:border-slate-800 cursor-pointer"
                            >
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>
                    </div>
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
