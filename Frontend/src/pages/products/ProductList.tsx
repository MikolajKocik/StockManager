import { useState, useRef } from 'react';
import { Button, Header, Badge, Input, Select } from '@/components/common';
import ConfirmModal from '@/components/common/custom/ConfirmModal';
import { useProductsManager } from './hooks';
import {
    ProductKpiSummary,
    ProductTable,
    ProductCreateForm,
    ProductEditForm,
    ProductDetailsForm
} from './components';

export const STOCK_FILTER_OPTIONS = [
    { label: 'All Stock Levels', value: 'ALL' },
    { label: 'In Stock Only', value: 'IN_STOCK' },
    { label: 'Zero Stock (Out of Stock)', value: 'OUT_OF_STOCK' }
] as const;

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

    const headerActions = (
        <>
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
                Add Product
            </Button>
        </>
    );

    const categoryOptions = [
        { label: 'All Categories', value: '' },
        ...genres.map(g => ({ label: g, value: g }))
    ];

    const unitOptions = [
        { label: 'All Units', value: '' },
        ...units.map(u => ({ label: u, value: u }))
    ];

    return (
        <div className="space-y-4 pb-10">
            {/* Top Header & Actions Bar */}
            <Header
                title="Products & Item Registry"
                subtitle="Warehouse master product index, batch trace numbers, shelf-life and stock allocations."
                badge={
                    <Badge variant="brand" className="font-mono text-[10px]">
                        MASTER CATALOG
                    </Badge>
                }
                actions={headerActions}
            >
                {/* KPI Metrics */}
                <div className="pt-2 border-t border-slate-200">
                    <ProductKpiSummary
                        totalProducts={kpi.totalProducts}
                        totalStockUnits={kpi.totalStockUnits}
                        outOfStockCount={kpi.outOfStockCount}
                        genresCount={kpi.genresCount}
                    />
                </div>

                {/* Filter and Search Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Live Search */}
                        <div className="w-64">
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, SKU, category..."
                                className="text-xs"
                            />
                        </div>

                        {/* Genre Filter */}
                        <div className="w-40">
                            <Select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                options={categoryOptions}
                                className="text-xs"
                            />
                        </div>

                        {/* Unit Filter */}
                        <div className="w-32">
                            <Select
                                value={selectedUnit}
                                onChange={(e) => setSelectedUnit(e.target.value)}
                                options={unitOptions}
                                className="text-xs"
                            />
                        </div>

                        {/* Stock Status Filter */}
                        <div className="w-44">
                            <Select
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value as any)}
                                options={STOCK_FILTER_OPTIONS}
                                className="text-xs"
                            />
                        </div>

                        {(searchQuery || selectedGenre || selectedUnit || stockFilter !== 'ALL') && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={resetFilters}
                                className="text-xs px-2"
                            >
                                Reset Filters
                            </Button>
                        )}
                    </div>

                    <span className="text-[11px] font-mono text-slate-500">
                        Showing {displayedProducts.length} of {kpi.totalProducts} records
                    </span>
                </div>
            </Header>

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
