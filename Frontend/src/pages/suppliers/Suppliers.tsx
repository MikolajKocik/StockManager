import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { suppliersApi } from '@/api/internal/suppliersApi';
import type { Supplier } from '@/models/supplier';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Button } from '@/components/common';
import ConfirmModal from '@/components/common/ConfirmModal';
import { SupplierKpiSummary } from './components/SupplierKpiSummary';
import { SupplierDetailsModal } from './components/SupplierDetailsModal';
import { CreateSupplierModal } from './components/CreateSupplierModal';

export default function Suppliers() {
    const { data: initialSuppliersData, isLoading, isError } = useQuery({
        queryKey: ['suppliers'],
        queryFn: suppliersApi.getAll
    });

    const [localSuppliers, setLocalSuppliers] = useState<Supplier[] | null>(null);
    const [filterQuery, setFilterQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [sortField, setSortField] = useState<keyof Supplier>('name');
    const [sortAsc, setSortAsc] = useState(true);

    const [selectedSupplierForDetails, setSelectedSupplierForDetails] = useState<Supplier | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);
    const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

    const suppliers: Supplier[] = useMemo(() => {
        if (localSuppliers !== null) return localSuppliers;
        return initialSuppliersData?.data || [];
    }, [localSuppliers, initialSuppliersData]);

    const countries = useMemo(() => {
        const set = new Set<string>();
        suppliers.forEach(s => {
            if (s.address?.country) set.add(s.address.country);
        });
        return Array.from(set).sort();
    }, [suppliers]);

    const filteredSuppliers = useMemo(() => {
        let list = [...suppliers];

        if (filterQuery.trim()) {
            const q = filterQuery.toLowerCase();
            list = list.filter(s =>
                s.name.toLowerCase().includes(q) ||
                s.slug.toLowerCase().includes(q) ||
                (s.taxId && s.taxId.toLowerCase().includes(q)) ||
                (s.contactPerson && s.contactPerson.toLowerCase().includes(q)) ||
                (s.email && s.email.toLowerCase().includes(q)) ||
                (s.address?.city && s.address.city.toLowerCase().includes(q)) ||
                (s.address?.country && s.address.country.toLowerCase().includes(q))
            );
        }

        if (selectedCountry) {
            list = list.filter(s => s.address?.country === selectedCountry);
        }

        if (selectedStatus) {
            list = list.filter(s => (s.status || 'Active') === selectedStatus);
        }

        list.sort((a, b) => {
            let valA: any = a[sortField] || '';
            let valB: any = b[sortField] || '';

            if (sortField === 'address') {
                valA = a.address?.country || '';
                valB = b.address?.country || '';
            }

            if (typeof valA === 'string') {
                return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });

        return list;
    }, [suppliers, filterQuery, selectedCountry, selectedStatus, sortField, sortAsc]);

    const handleSort = (field: keyof Supplier) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const handleSaveSupplier = (supplierData: Partial<Supplier>) => {
        if (supplierToEdit) {
            setLocalSuppliers(prev => {
                const base = prev || suppliers;
                return base.map(s => s.id === supplierToEdit.id ? { ...s, ...supplierData } as Supplier : s);
            });
        } else {
            const newSupplier: Supplier = {
                id: supplierData.id || `SUP-${Date.now().toString().slice(-4)}`,
                name: supplierData.name || 'New Supplier',
                slug: supplierData.slug || 'new-supplier',
                taxId: supplierData.taxId,
                contactPerson: supplierData.contactPerson,
                email: supplierData.email,
                phone: supplierData.phone,
                website: supplierData.website,
                paymentTerms: supplierData.paymentTerms || 'Net 30',
                leadTimeDays: supplierData.leadTimeDays || 5,
                rating: supplierData.rating || 5.0,
                status: supplierData.status || 'Active',
                activeItemsCount: 0,
                address: supplierData.address
            };
            setLocalSuppliers(prev => [newSupplier, ...(prev || suppliers)]);
        }
        setIsCreateModalOpen(false);
        setSupplierToEdit(null);
    };

    const handleDeleteSupplier = () => {
        if (!supplierToDelete) return;
        setLocalSuppliers(prev => (prev || suppliers).filter(s => s.id !== supplierToDelete.id));
        setSupplierToDelete(null);
    };

    if (isLoading && !localSuppliers) {
        return (
            <div className="p-8 text-center text-slate-500 font-medium">
                Loading suppliers directory...
            </div>
        );
    }

    if (isError && !localSuppliers) {
        return (
            <div className="p-8 text-center text-rose-600 font-medium">
                Error loading supplier directory. Please retry.
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-4 pb-8">
            {/* Top KPI Header */}
            <SupplierKpiSummary
                suppliers={suppliers}
                onOpenCreateModal={() => {
                    setSupplierToEdit(null);
                    setIsCreateModalOpen(true);
                }}
                filterQuery={filterQuery}
                onFilterChange={setFilterQuery}
                selectedCountry={selectedCountry}
                onCountryChange={setSelectedCountry}
                countries={countries}
            />

            {/* Filters Bar & Results count */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-300 rounded-lg px-4 py-2.5 shadow-xs">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">
                        Suppliers Found:
                    </span>
                    <span className="text-xs font-mono font-bold bg-slate-800 text-white px-2 py-0.5 rounded">
                        {filteredSuppliers.length}
                    </span>
                    {(filterQuery || selectedCountry || selectedStatus) && (
                        <button
                            onClick={() => {
                                setFilterQuery('');
                                setSelectedCountry('');
                                setSelectedStatus('');
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold ml-2 cursor-pointer"
                        >
                            Reset filters &#10005;
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Filter Status:</span>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        aria-label="Filter suppliers by status"
                        className="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1 font-semibold text-slate-700 outline-none focus:border-slate-800"
                    >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Main Data Table */}
            <Table className="shadow-sm">
                <TableHead>
                    <TableRow>
                        <TableHeaderCell isFiltered onClick={() => handleSort('id')}>
                            Vendor Code
                        </TableHeaderCell>
                        <TableHeaderCell isFiltered onClick={() => handleSort('name')}>
                            Company Name
                        </TableHeaderCell>
                        <TableHeaderCell isFiltered onClick={() => handleSort('address')}>
                            Origin Location
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Contact Person & Channel
                        </TableHeaderCell>
                        <TableHeaderCell isFiltered onClick={() => handleSort('leadTimeDays')}>
                            Terms & SLA
                        </TableHeaderCell>
                        <TableHeaderCell isFiltered onClick={() => handleSort('rating')}>
                            Score & SKUs
                        </TableHeaderCell>
                        <TableHeaderCell isFiltered onClick={() => handleSort('status')}>
                            Status
                        </TableHeaderCell>
                        <TableHeaderCell className="text-right">
                            Actions
                        </TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredSuppliers.length > 0 ? (
                        filteredSuppliers.map((supplier) => (
                            <TableRow key={supplier.id} className="hover:bg-slate-50">
                                {/* Vendor Code */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-mono font-bold text-xs text-slate-800">
                                            #{supplier.id}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono">
                                            {supplier.slug}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Company Name & Tax ID */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <button
                                            onClick={() => setSelectedSupplierForDetails(supplier)}
                                            className="text-left font-bold text-xs text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                                        >
                                            {supplier.name}
                                        </button>
                                        {supplier.taxId && (
                                            <span className="text-[10px] text-slate-500 font-mono">
                                                Tax: {supplier.taxId}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>

                                {/* Origin Location */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-xs text-slate-800">
                                            {supplier.address?.city || 'N/A'}
                                        </span>
                                        <span className="text-[10px] text-slate-500">
                                            {supplier.address?.country || 'USA'}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Contact Person & Channel */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-xs text-slate-800">
                                            {supplier.contactPerson || 'Procurement Office'}
                                        </span>
                                        <span className="text-[10px] text-slate-500 truncate max-w-48">
                                            {supplier.email || supplier.phone || 'No direct phone'}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Terms & SLA */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-xs text-slate-800">
                                            {supplier.paymentTerms || 'Net 30'}
                                        </span>
                                        <span className="text-[10px] text-blue-700 font-medium">
                                            {supplier.leadTimeDays ? `${supplier.leadTimeDays}d lead time` : '5d lead time'}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Score & SKUs */}
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-xs text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                            ★ {supplier.rating || 4.8}
                                        </span>
                                        <span className="text-[11px] text-slate-600 font-medium">
                                            {supplier.activeItemsCount || 0} SKUs
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Status */}
                                <TableCell>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${supplier.status === 'Active'
                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                        : supplier.status === 'Under Review'
                                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                                            : 'bg-slate-100 text-slate-700 border-slate-300'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${supplier.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                                            }`} />
                                        {supplier.status || 'Active'}
                                    </span>
                                </TableCell>

                                {/* Actions */}
                                <TableCell className="text-right">
                                    <div className="inline-flex items-center gap-1.5">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setSelectedSupplierForDetails(supplier)}
                                            className="text-xs px-2 py-1"
                                        >
                                            Details
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => {
                                                setSupplierToEdit(supplier);
                                                setIsCreateModalOpen(true);
                                            }}
                                            className="text-xs px-2 py-1"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => setSupplierToDelete(supplier)}
                                            className="text-xs px-2 py-1"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell className="text-center py-8 text-slate-500 font-medium">
                                No suppliers matched the current filters.
                            </TableCell>
                            <TableCell className="hidden" />
                            <TableCell className="hidden" />
                            <TableCell className="hidden" />
                            <TableCell className="hidden" />
                            <TableCell className="hidden" />
                            <TableCell className="hidden" />
                            <TableCell className="hidden" />
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Supplier Details Modal */}
            <SupplierDetailsModal
                supplier={selectedSupplierForDetails}
                isOpen={!!selectedSupplierForDetails}
                onClose={() => setSelectedSupplierForDetails(null)}
                onEdit={(sup) => {
                    setSupplierToEdit(sup);
                    setIsCreateModalOpen(true);
                }}
            />

            {/* Create / Edit Modal */}
            <CreateSupplierModal
                isOpen={isCreateModalOpen}
                initialData={supplierToEdit}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setSupplierToEdit(null);
                }}
                onSubmit={handleSaveSupplier}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!supplierToDelete}
                title="Confirm Supplier Removal"
                message={`Are you sure you want to remove ${supplierToDelete?.name}? This action cannot be undone.`}
                onConfirm={handleDeleteSupplier}
                onClose={() => setSupplierToDelete(null)}
            />
        </div>
    );
}
