import React, { forwardRef, useState, useEffect } from 'react';
import type { Supplier } from '@/models/supplier';
import { Button, FormBody, FormFooter, Modal } from '@/components/common';

interface CreateSupplierModalProps {
    initialData?: Supplier | null;
    onClose: () => void;
    onSubmit: (supplierData: Partial<Supplier>, editingId?: string) => void;
}

export const CreateSupplierModal = forwardRef<HTMLDialogElement, CreateSupplierModalProps>(({
    initialData,
    onClose,
    onSubmit
}, ref) => {
    const isEditMode = !!initialData;

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [taxId, setTaxId] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [country, setCountry] = useState('Poland');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('Net 30');
    const [leadTimeDays, setLeadTimeDays] = useState(5);
    const [status, setStatus] = useState<'Active' | 'Under Review' | 'Inactive'>('Active');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setSlug(initialData.slug || '');
            setTaxId(initialData.taxId || '');
            setContactPerson(initialData.contactPerson || '');
            setEmail(initialData.email || '');
            setPhone(initialData.phone || '');
            setWebsite(initialData.website || '');
            setCountry(initialData.address?.country || 'Poland');
            setCity(initialData.address?.city || '');
            setPostalCode(initialData.address?.postalCode || '');
            setPaymentTerms(initialData.paymentTerms || 'Net 30');
            setLeadTimeDays(initialData.leadTimeDays || 5);
            setStatus(initialData.status || 'Active');
        } else {
            setName('');
            setSlug('');
            setTaxId('');
            setContactPerson('');
            setEmail('');
            setPhone('');
            setWebsite('');
            setCountry('Poland');
            setCity('');
            setPostalCode('');
            setPaymentTerms('Net 30');
            setLeadTimeDays(5);
            setStatus('Active');
        }
    }, [initialData]);

    const handleNameChange = (val: string) => {
        setName(val);
        if (!isEditMode && !slug) {
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const payload: Partial<Supplier> = {
            id: initialData?.id || `SUP-${Date.now().toString().slice(-4)}`,
            name: name.trim(),
            slug: slug.trim() || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            taxId: taxId.trim(),
            contactPerson: contactPerson.trim(),
            email: email.trim(),
            phone: phone.trim(),
            website: website.trim(),
            paymentTerms,
            leadTimeDays: Number(leadTimeDays) || 5,
            status,
            activeItemsCount: initialData?.activeItemsCount || 0,
            rating: initialData?.rating || 4.8,
            address: {
                id: initialData?.address?.id || `ADDR-${Date.now().toString().slice(-4)}`,
                country: country.trim(),
                city: city.trim(),
                postalCode: postalCode.trim(),
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
            <form onSubmit={handleSubmit}>
                <FormBody className="max-h-[75vh] space-y-3">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="e.g. Acme Industrial Logistics"
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Vendor Slug / Identifier
                            </label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="e.g. acme-industrial"
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Tax ID & Contact Person */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Tax / VAT ID
                            </label>
                            <input
                                type="text"
                                value={taxId}
                                onChange={(e) => setTaxId(e.target.value)}
                                placeholder="e.g. PL-5252819401"
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
                                placeholder="e.g. James Wilson"
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Procurement Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="e.g. procurement@supplier.com"
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Contact Phone
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

                    {/* Website */}
                    <div>
                        <label className="font-bold text-slate-700 block mb-1">
                            Supplier Website
                        </label>
                        <input
                            type="text"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="e.g. https://www.supplier.com"
                            className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:border-slate-800 focus:bg-white"
                        />
                    </div>

                    {/* Address Information */}
                    <div className="p-3 bg-slate-50 border border-slate-300 rounded space-y-2">
                        <span className="font-bold text-[11px] text-slate-600 uppercase tracking-wider block">
                            Address & Regional Details
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

                    {/* Commercial Terms & Status */}
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Payment Terms
                            </label>
                            <select
                                value={paymentTerms}
                                onChange={(e) => setPaymentTerms(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 font-medium outline-none focus:border-slate-800 cursor-pointer"
                            >
                                <option value="Net 14">Net 14</option>
                                <option value="Net 30">Net 30</option>
                                <option value="Net 45">Net 45</option>
                                <option value="Net 60">Net 60</option>
                                <option value="Prepayment">Prepayment</option>
                            </select>
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Lead Time (Days)
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={90}
                                value={leadTimeDays}
                                onChange={(e) => setLeadTimeDays(Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 font-mono outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as 'Active' | 'Under Review' | 'Inactive')}
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 font-semibold outline-none focus:border-slate-800 cursor-pointer"
                            >
                                <option value="Active">Active</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </FormBody>

                <FormFooter>
                    <Button variant="secondary" size="md" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="md" type="submit">
                        {isEditMode ? 'Save Changes' : 'Create Supplier'}
                    </Button>
                </FormFooter>
            </form>
        </Modal>
    );
});

CreateSupplierModal.displayName = 'CreateSupplierModal';
