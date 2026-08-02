import { useState, useMemo } from 'react';
import { useCustomers } from '@/hooks/queries/useCustomers';
import type { Customer } from '@/models/customer';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Button } from '@/components/common';
import ConfirmModal from '@/components/common/ConfirmModal';
import { CustomerKpiSummary } from './components/CustomerKpiSummary';
import { CustomerDetailsModal } from './components/CustomerDetailsModal';
import { CreateCustomerModal } from './components/CreateCustomerModal';

export default function Customers() {
    const { data: initialCustomersData, isLoading, isError } = useCustomers();

    const [localCustomers, setLocalCustomers] = useState<Customer[] | null>(null);
    const [filterQuery, setFilterQuery] = useState('');
    const [selectedSegment, setSelectedSegment] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [sortField, setSortField] = useState<keyof Customer>('name');
    const [sortAsc, setSortAsc] = useState(true);

    const [selectedCustomerForDetails, setSelectedCustomerForDetails] = useState<Customer | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

    const customers: Customer[] = useMemo(() => {
        if (localCustomers !== null) return localCustomers;
        return initialCustomersData?.data || [];
    }, [localCustomers, initialCustomersData]);

    const segments = useMemo(() => {
        const set = new Set<string>();
        customers.forEach(c => {
            if (c.segment) set.add(c.segment);
        });
        return Array.from(set).sort();
    }, [customers]);

    const filteredCustomers = useMemo(() => {
        let list = [...customers];

        if (filterQuery.trim()) {
            const q = filterQuery.toLowerCase();
            list = list.filter(c =>
                c.name.toLowerCase().includes(q) ||
                (c.code && c.code.toLowerCase().includes(q)) ||
                (c.taxId && c.taxId.toLowerCase().includes(q)) ||
                (c.contactPerson && c.contactPerson.toLowerCase().includes(q)) ||
                (c.email && c.email.toLowerCase().includes(q)) ||
                (c.address?.city && c.address.city.toLowerCase().includes(q)) ||
                (c.address?.country && c.address.country.toLowerCase().includes(q))
            );
        }

        if (selectedSegment) {
            list = list.filter(c => (c.segment || 'Enterprise') === selectedSegment);
        }

        if (selectedStatus) {
            list = list.filter(c => (c.status || 'Active') === selectedStatus);
        }

        list.sort((a, b) => {
            let valA: any = a[sortField] || '';
            let valB: any = b[sortField] || '';

            if (sortField === 'address') {
                valA = a.address?.city || '';
                valB = b.address?.city || '';
            }

            if (typeof valA === 'string') {
                return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(a[sortField] || '');
            }
            return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });

        return list;
    }, [customers, filterQuery, selectedSegment, selectedStatus, sortField, sortAsc]);

    const handleSort = (field: keyof Customer) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const handleSaveCustomer = (customerData: Partial<Customer>) => {
        if (customerToEdit) {
            setLocalCustomers(prev => {
                const base = prev || customers;
                return base.map(c => c.id === customerToEdit.id ? { ...c, ...customerData } as Customer : c);
            });
        } else {
            const newCustomer: Customer = {
                id: customerData.id || Date.now(),
                name: customerData.name || 'New Customer Account',
                code: customerData.code || `CUST-${Math.floor(100 + Math.random() * 900)}`,
                taxId: customerData.taxId || 'PL0000000000',
                email: customerData.email || '',
                phone: customerData.phone || '',
                contactPerson: customerData.contactPerson,
                segment: customerData.segment || 'Enterprise',
                creditLimit: customerData.creditLimit || 50000,
                currency: customerData.currency || 'EUR',
                status: customerData.status || 'Active',
                totalOrdersCount: 0,
                totalSpent: 0,
                addressId: `${Date.now()}`,
                address: customerData.address
            };
            setLocalCustomers(prev => [newCustomer, ...(prev || customers)]);
        }
        setIsCreateModalOpen(false);
        setCustomerToEdit(null);
    };

    const handleDeleteCustomer = () => {
        if (!customerToDelete) return;
        setLocalCustomers(prev => (prev || customers).filter(c => c.id !== customerToDelete.id));
        setCustomerToDelete(null);
    };

    const segmentColors: Record<string, string> = {
        Enterprise: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        'Key Account': 'bg-purple-100 text-purple-800 border-purple-300',
        Wholesale: 'bg-blue-100 text-blue-800 border-blue-300',
        Retail: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };

    if (isLoading && !localCustomers) {
        return (
            <div className="p-8 text-center text-slate-500 font-medium">
                Loading customers directory...
            </div>
        );
    }

    if (isError && !localCustomers) {
        return (
            <div className="p-8 text-center text-rose-600 font-medium">
                Error loading customer directory. Please retry.
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-4 pb-8">
            {/* Top KPI Header */}
            <CustomerKpiSummary
                customers={customers}
                onOpenCreateModal={() => {
                    setCustomerToEdit(null);
                    setIsCreateModalOpen(true);
                }}
                filterQuery={filterQuery}
                onFilterChange={setFilterQuery}
                selectedSegment={selectedSegment}
                onSegmentChange={setSelectedSegment}
                segments={segments}
            />

            {/* Filters Bar & Results count */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-300 rounded-lg px-4 py-2.5 shadow-xs">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">
                        Clients Found:
                    </span>
                    <span className="text-xs font-mono font-bold bg-slate-800 text-white px-2 py-0.5 rounded">
                        {filteredCustomers.length}
                    </span>
                    {(filterQuery || selectedSegment || selectedStatus) && (
                        <button
                            onClick={() => {
                                setFilterQuery('');
                                setSelectedSegment('');
                                setSelectedStatus('');
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold ml-2 cursor-pointer"
                        >
                            Reset filters ✕
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Filter Status:</span>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        aria-label="Filter customers by status"
                        className="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1 font-semibold text-slate-700 outline-none focus:border-slate-800"
                    >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {/* Main Data Table */}
            <Table className="shadow-sm">
                <TableHead>
                    <TableRow>
                        <TableHeaderCell isFiltered onClick={() => handleSort('id')}>
                            Account Code
                        </TableHeaderCell>
                        <TableHeaderCell isFiltered onClick={() => handleSort('name')}>
                            Client / Company Name
                        </TableHeaderCell>
                        <TableHeaderCell isFiltered onClick={() => handleSort('address')}>
                            Jurisdiction / City
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Contact Person & Channel
                        </TableHeaderCell>
                        <TableHeaderCell isFiltered onClick={() => handleSort('segment')}>
                            Segment
                        </TableHeaderCell>
                        <TableHeaderCell isFiltered onClick={() => handleSort('creditLimit')}>
                            Credit & Billing
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
                    {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                            <TableRow key={customer.id} className="hover:bg-slate-50">
                                {/* Account Code */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-mono font-bold text-xs text-slate-800">
                                            #{customer.id}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono">
                                            {customer.code || `CUST-00${customer.id}`}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Company Name & Tax ID */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <button
                                            onClick={() => setSelectedCustomerForDetails(customer)}
                                            className="text-left font-bold text-xs text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                                        >
                                            {customer.name}
                                        </button>
                                        <span className="text-[10px] text-slate-500 font-mono">
                                            Tax ID: {customer.taxId}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Jurisdiction / City */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-xs text-slate-800">
                                            {customer.address?.city || 'N/A'}
                                        </span>
                                        <span className="text-[10px] text-slate-500">
                                            {customer.address?.country || 'Poland'}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Contact Person & Channel */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-xs text-slate-800">
                                            {customer.contactPerson || 'Procurement Contact'}
                                        </span>
                                        <span className="text-[10px] text-slate-500 truncate max-w-48">
                                            {customer.email || customer.phone || 'No direct phone'}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Segment */}
                                <TableCell>
                                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full border ${segmentColors[customer.segment || 'Enterprise'] || 'bg-slate-100 text-slate-700 border-slate-300'
                                        }`}>
                                        {customer.segment || 'Enterprise'}
                                    </span>
                                </TableCell>

                                {/* Credit & Billing */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-mono font-semibold text-xs text-slate-800">
                                            Limit: €{(customer.creditLimit || 50000).toLocaleString()}
                                        </span>
                                        <span className="text-[10px] text-emerald-700 font-semibold font-mono">
                                            Spent: €{(customer.totalSpent || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Status */}
                                <TableCell>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${customer.status === 'Active' || !customer.status
                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                        : customer.status === 'Pending'
                                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                                            : 'bg-rose-100 text-rose-800 border-rose-300'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${customer.status === 'Active' || !customer.status ? 'bg-emerald-500' : 'bg-amber-500'
                                            }`} />
                                        {customer.status || 'Active'}
                                    </span>
                                </TableCell>

                                {/* Actions */}
                                <TableCell className="text-right">
                                    <div className="inline-flex items-center gap-1.5">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setSelectedCustomerForDetails(customer)}
                                            className="text-xs px-2 py-1"
                                        >
                                            Details
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => {
                                                setCustomerToEdit(customer);
                                                setIsCreateModalOpen(true);
                                            }}
                                            className="text-xs px-2 py-1"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => setCustomerToDelete(customer)}
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
                                No customer accounts matched the current filters.
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

            {/* Customer Details Modal */}
            <CustomerDetailsModal
                customer={selectedCustomerForDetails}
                isOpen={!!selectedCustomerForDetails}
                onClose={() => setSelectedCustomerForDetails(null)}
                onEdit={(cust) => {
                    setCustomerToEdit(cust);
                    setIsCreateModalOpen(true);
                }}
            />

            {/* Create / Edit Modal */}
            <CreateCustomerModal
                isOpen={isCreateModalOpen}
                initialData={customerToEdit}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setCustomerToEdit(null);
                }}
                onSubmit={handleSaveCustomer}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!customerToDelete}
                title="Confirm Customer Removal"
                message={`Are you sure you want to remove account ${customerToDelete?.name}? This action cannot be undone.`}
                onConfirm={handleDeleteCustomer}
                onCancel={() => setCustomerToDelete(null)}
            />
        </div>
    );
}
