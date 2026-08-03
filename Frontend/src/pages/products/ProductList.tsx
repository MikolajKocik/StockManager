import { useState, useRef } from 'react';
import { Button } from '@/components/common';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useProductsManager } from './hooks';
import {
    ProductKpiSummary,
    ProductTable,
    ProductCreateForm,
    ProductEditForm,
    ProductDetailsForm
} from './components';

export default function ProductList() {
    const {
        displayedProducts,
        genres,
        units,
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        selectedUnit,
        setSelectedUnit,
        stockFilter,
        setStockFilter,
        activeSort,
        sortAsc,
        toggleSort,
        resetFilters,
        getProductStock,
        handleDeleteProduct,
        handleRefetch,
        isLoading,
        isFetching,
        isError,
        isDeleting,
        kpi
    } = useProductsManager();

    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

    const createModalRef = useRef<HTMLDialogElement>(null);
    const editModalRef = useRef<HTMLDialogElement>(null);
    const detailsModalRef = useRef<HTMLDialogElement>(null);

    const handleOpenCreate = () => {
        createModalRef.current?.showModal();
    };

    const handleCloseCreate = () => {
        createModalRef.current?.close();
    };

    const handleOpenDetails = (id: number) => {
        setSelectedProductId(id.toString());
        detailsModalRef.current?.showModal();
    };

    const handleCloseDetails = () => {
        detailsModalRef.current?.close();
        setSelectedProductId(null);
    };

    const handleOpenEdit = (id: number | string) => {
        setSelectedProductId(id.toString());
        editModalRef.current?.showModal();
    };

    const handleCloseEdit = () => {
        editModalRef.current?.close();
        setSelectedProductId(null);
    };

    const handleOpenDelete = (id: number) => {
        setSelectedProductId(id.toString());
        setIsConfirmOpen(true);
    };

    const handleCloseDelete = () => {
        setIsConfirmOpen(false);
        setSelectedProductId(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedProductId) return;
        await handleDeleteProduct(Number(selectedProductId));
        handleCloseDelete();
    };

    if (isLoading) {
        return <div className="p-8 text-center text-xs text-slate-500 font-medium">Loading warehouse product catalog...</div>;
    }

    if (isError) {
        return <div className="p-8 text-center text-xs text-red-600 font-medium">Error loading products. Please try again.</div>;
    }

    return (
        <div className="space-y-4 pb-10">
            {/* Top Header & Actions Bar */}
            <div className="bg-white border border-slate-300 rounded-lg shadow-2xs p-4 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[11px] text-[#2b6675] bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded-xs uppercase">
                                Master Catalog
                            </span>
                            <h1 className="text-lg font-bold text-slate-800 leading-tight">
                                Products & Item Registry
                            </h1>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Warehouse master product index, batch trace numbers, shelf-life and stock allocations.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={handleRefetch}
                            disabled={isFetching}
                        >
                            {isFetching ? 'Refreshing...' : 'Refresh'}
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleOpenCreate}
                        >
                            + Add Product
                        </Button>
                    </div>
                </div>

                {/* KPI Metrics */}
                <ProductKpiSummary
                    totalProducts={kpi.totalProducts}
                    totalStockUnits={kpi.totalStockUnits}
                    outOfStockCount={kpi.outOfStockCount}
                    genresCount={kpi.genresCount}
                />

                {/* Filter and Search Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Live Search */}
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, SKU, category, batch, supplier..."
                                className="text-xs bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-slate-800 focus:bg-white px-3 py-1.5 rounded outline-none w-72 transition-colors shadow-inner font-medium text-slate-800 placeholder:text-slate-400"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                                >
                                    &#10005;
                                </button>
                            )}
                        </div>

                        {/* Genre Filter */}
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-700 outline-none focus:border-slate-800 cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            {genres.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>

                        {/* Unit Filter */}
                        <select
                            value={selectedUnit}
                            onChange={(e) => setSelectedUnit(e.target.value)}
                            className="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-700 outline-none focus:border-slate-800 cursor-pointer"
                        >
                            <option value="">All Units</option>
                            {units.map(u => (
                                <option key={u} value={u}>{u}</option>
                            ))}
                        </select>

                        {/* Stock Status Filter */}
                        <select
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value as any)}
                            className="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-700 outline-none focus:border-slate-800 cursor-pointer"
                        >
                            <option value="ALL">All Stock Levels</option>
                            <option value="IN_STOCK">In Stock Only</option>
                            <option value="OUT_OF_STOCK">Zero Stock (Out of Stock)</option>
                        </select>

                        {(searchQuery || selectedGenre || selectedUnit || stockFilter !== 'ALL') && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="text-xs text-[#2b6675] hover:underline font-semibold cursor-pointer px-1"
                            >
                                Reset Filters
                            </button>
                        )}
                    </div>

                    <span className="text-[11px] font-mono text-slate-500">
                        Showing {displayedProducts.length} of {kpi.totalProducts} records
                    </span>
                </div>
            </div>

            {/* Product Table */}
            <ProductTable
                products={displayedProducts}
                getProductStock={getProductStock}
                activeSort={activeSort}
                sortAsc={sortAsc}
                onSort={toggleSort}
                onOpenDetails={handleOpenDetails}
                onOpenEdit={handleOpenEdit}
                onOpenDelete={handleOpenDelete}
                isDeleting={isDeleting}
            />

            {/* Product Details Modal */}
            <ProductDetailsForm
                ref={detailsModalRef}
                productId={selectedProductId}
                onClose={handleCloseDetails}
                onEdit={handleOpenEdit}
            />

            {/* Product Create Modal */}
            <ProductCreateForm
                ref={createModalRef}
                onClose={handleCloseCreate}
            />

            {/* Product Edit Modal */}
            <ProductEditForm
                ref={editModalRef}
                productId={selectedProductId}
                onClose={handleCloseEdit}
            />

            {/* Confirm Delete Modal */}
            {isConfirmOpen && selectedProductId && (
                <ConfirmModal
                    isOpen={isConfirmOpen}
                    onClose={handleCloseDelete}
                    onConfirm={handleConfirmDelete}
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this master product record? This operation cannot be undone."
                />
            )}
        </div>
    );
}
