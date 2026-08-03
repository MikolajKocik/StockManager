import { useState, useRef } from 'react';
import type { Customer } from '@/models/customer';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useCustomersManager } from './hooks/useCustomersManager';
import { CustomerKpiSummary } from './components/CustomerKpiSummary';
import { CustomerTable } from './components/CustomerTable';
import { CustomerDetailsModal } from './components/CustomerDetailsModal';
import { CreateCustomerModal } from './components/CreateCustomerModal';

export default function Customers() {
    const {
        filteredCustomers,
        segments,
        filterQuery,
        setFilterQuery,
        selectedSegment,
        setSelectedSegment,
        selectedStatus,
        setSelectedStatus,
        handleSort,
        handleSaveCustomer,
        handleDeleteCustomer,
        resetFilters,
        isLoading,
        isError,
        hasLocalData,
        kpi
    } = useCustomersManager();

    const [selectedCustomerForDetails, setSelectedCustomerForDetails] = useState<Customer | null>(null);
    const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

    const createModalRef = useRef<HTMLDialogElement>(null);
    const detailsModalRef = useRef<HTMLDialogElement>(null);

    const openCreateModal = (customer?: Customer) => {
        setCustomerToEdit(customer || null);
        createModalRef.current?.showModal();
    };

    const openDetailsModal = (customer: Customer) => {
        setSelectedCustomerForDetails(customer);
        detailsModalRef.current?.showModal();
    };

    const confirmDelete = () => {
        if (customerToDelete) {
            handleDeleteCustomer(customerToDelete.id);
            setCustomerToDelete(null);
        }
    };

    if (isLoading && !hasLocalData) {
        return (
            <div className="p-8 text-center text-slate-500 font-medium">
                Loading customers directory...
            </div>
        );
    }

    if (isError && !hasLocalData) {
        return (
            <div className="p-8 text-center text-rose-700 font-medium">
                Error loading customer directory. Please retry.
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-4 pb-8">
            {/* Top KPI Header */}
            <CustomerKpiSummary
                totalCustomers={kpi.totalCustomers}
                activeCustomers={kpi.activeCustomers}
                totalSpentSum={kpi.totalSpentSum}
                totalCreditSum={kpi.totalCreditSum}
                onOpenCreateModal={() => openCreateModal()}
                filterQuery={filterQuery}
                onFilterChange={setFilterQuery}
                selectedSegment={selectedSegment}
                onSegmentChange={setSelectedSegment}
                segments={segments}
            />

            {/* Filters Bar & Results count */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-300 rounded-lg px-4 py-2.5 shadow-2xs">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">
                        Clients Found:
                    </span>
                    <span className="text-xs font-mono font-bold bg-[#2b6675] text-white px-2 py-0.5 rounded">
                        {filteredCustomers.length}
                    </span>
                    {(filterQuery || selectedSegment || selectedStatus) && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="text-xs text-[#2b6675] hover:underline font-semibold ml-2 cursor-pointer"
                        >
                            Reset filters &#10005;
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-600">Filter Status:</span>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        aria-label="Filter customers by status"
                        className="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1 font-semibold text-slate-700 outline-none focus:border-slate-800 cursor-pointer"
                    >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Main Data Table */}
            <CustomerTable
                customers={filteredCustomers}
                onSort={handleSort}
                onViewDetails={openDetailsModal}
                onEdit={(cust) => openCreateModal(cust)}
                onDelete={(cust) => setCustomerToDelete(cust)}
            />

            {/* Customer Details Modal */}
            <CustomerDetailsModal
                ref={detailsModalRef}
                customer={selectedCustomerForDetails}
                onClose={() => {
                    detailsModalRef.current?.close();
                    setSelectedCustomerForDetails(null);
                }}
                onEdit={(cust) => {
                    detailsModalRef.current?.close();
                    openCreateModal(cust);
                }}
            />

            {/* Create / Edit Modal */}
            <CreateCustomerModal
                ref={createModalRef}
                initialData={customerToEdit}
                onClose={() => {
                    createModalRef.current?.close();
                    setCustomerToEdit(null);
                }}
                onSubmit={handleSaveCustomer}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!customerToDelete}
                title="Confirm Customer Removal"
                message={`Are you sure you want to remove account ${customerToDelete?.name}? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onClose={() => setCustomerToDelete(null)}
            />
        </div>
    );
}
