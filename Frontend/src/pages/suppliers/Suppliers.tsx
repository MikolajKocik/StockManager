import { useState, useRef } from 'react';
import type { Supplier } from '@/models/supplier';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useSuppliersManager } from './hooks/useSuppliersManager';
import { SupplierKpiSummary } from './components/SupplierKpiSummary';
import { SupplierTable } from './components/SupplierTable';
import { SupplierDetailsModal } from './components/SupplierDetailsModal';
import { CreateSupplierModal } from './components/CreateSupplierModal';

export default function Suppliers() {
    const {
        filteredSuppliers,
        countries,
        filterQuery,
        setFilterQuery,
        selectedCountry,
        setSelectedCountry,
        selectedStatus,
        setSelectedStatus,
        handleSort,
        handleSaveSupplier,
        handleDeleteSupplier,
        resetFilters,
        isLoading,
        isError,
        hasLocalData,
        kpi
    } = useSuppliersManager();

    const [selectedSupplierForDetails, setSelectedSupplierForDetails] = useState<Supplier | null>(null);
    const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);
    const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

    const createModalRef = useRef<HTMLDialogElement>(null);
    const detailsModalRef = useRef<HTMLDialogElement>(null);

    const openCreateModal = (supplier?: Supplier) => {
        setSupplierToEdit(supplier || null);
        createModalRef.current?.showModal();
    };

    const openDetailsModal = (supplier: Supplier) => {
        setSelectedSupplierForDetails(supplier);
        detailsModalRef.current?.showModal();
    };

    const confirmDelete = () => {
        if (supplierToDelete) {
            handleDeleteSupplier(supplierToDelete.id);
            setSupplierToDelete(null);
        }
    };

    if (isLoading && !hasLocalData) {
        return (
            <div className="p-8 text-center text-slate-500 font-medium">
                Loading suppliers directory...
            </div>
        );
    }

    if (isError && !hasLocalData) {
        return (
            <div className="p-8 text-center text-rose-700 font-medium">
                Error loading supplier directory. Please retry.
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-4 pb-8">
            {/* Top KPI Header */}
            <SupplierKpiSummary
                totalSuppliers={kpi.totalSuppliers}
                activeSuppliers={kpi.activeSuppliers}
                avgLeadTime={kpi.avgLeadTime}
                avgRating={kpi.avgRating}
                onOpenCreateModal={() => openCreateModal()}
                filterQuery={filterQuery}
                onFilterChange={setFilterQuery}
                selectedCountry={selectedCountry}
                onCountryChange={setSelectedCountry}
                countries={countries}
            />

            {/* Filters Bar & Results count */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-300 rounded-lg px-4 py-2.5 shadow-2xs">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">
                        Suppliers Found:
                    </span>
                    <span className="text-xs font-mono font-bold bg-[#2b6675] text-white px-2 py-0.5 rounded">
                        {filteredSuppliers.length}
                    </span>
                    {(filterQuery || selectedCountry || selectedStatus) && (
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
                        aria-label="Filter suppliers by status"
                        className="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1 font-semibold text-slate-700 outline-none focus:border-slate-800 cursor-pointer"
                    >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Main Data Table */}
            <SupplierTable
                suppliers={filteredSuppliers}
                onSort={handleSort}
                onViewDetails={openDetailsModal}
                onEdit={(sup) => openCreateModal(sup)}
                onDelete={(sup) => setSupplierToDelete(sup)}
            />

            {/* Supplier Details Modal */}
            <SupplierDetailsModal
                ref={detailsModalRef}
                supplier={selectedSupplierForDetails}
                onClose={() => {
                    detailsModalRef.current?.close();
                    setSelectedSupplierForDetails(null);
                }}
                onEdit={(sup) => {
                    detailsModalRef.current?.close();
                    openCreateModal(sup);
                }}
            />

            {/* Create / Edit Modal */}
            <CreateSupplierModal
                ref={createModalRef}
                initialData={supplierToEdit}
                onClose={() => {
                    createModalRef.current?.close();
                    setSupplierToEdit(null);
                }}
                onSubmit={handleSaveSupplier}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!supplierToDelete}
                title="Confirm Supplier Removal"
                message={`Are you sure you want to remove ${supplierToDelete?.name}? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onClose={() => setSupplierToDelete(null)}
            />
        </div>
    );
}
