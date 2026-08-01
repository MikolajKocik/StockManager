import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useProducts, useDeleteProduct } from './hooks';
import { Button, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/common';
import { useInventoryItems } from '../inventoryItems/hooks/useInventoryItems';
import { ProductDetailsForm, ProductEditForm, ProductCreateForm as ProductCreateModal } from './components';
import { genericSort } from '@/utils/sort';
import ConfirmModal from '@/components/common/ConfirmModal';

export default function ProductList() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [activeSort, setActiveSort] = useState<string | null>(null);

    const { data, isError, isLoading, refetch, isFetching } = useProducts();
    const { data: inventoryData, isLoading: isInventoryLoading } = useInventoryItems();

    const deleteProductMutation = useDeleteProduct();

    const productList = data?.data ?? [];
    const inventoryItems = inventoryData?.data ?? [];

    const getProductStock = (productId: number) => {
        return inventoryItems
            .filter(item => item.productId === productId)
            .reduce((acc, curr) => acc + curr.quantityOnHand, 0);
    };

    const toggleFilter = (key: string) => {
        setActiveSort(prev => prev === key ? null : key);
    };

    const displayedProducts = useMemo(() => {
        return genericSort(productList, activeSort);
    }, [productList, activeSort]);

    const handleDelete = (id: number) => {
        deleteProductMutation.mutate(id.toString(), {
            onSuccess: () => {
                toast.success('Product deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete product');
            }
        });
    };

    const handleRefetch = () => {
        toast.promise(
            refetch(),
            {
                loading: 'Refreshing...',
                success: <b>Refreshed!</b>,
                error: <b>Failed to refresh</b>
            },
            { id: 'refetch-toast' }
        )
    }

    const handleOpenDetails = (id: number) => {
        setSelectedProductId(id.toString());
        setIsDetailsModalOpen(true);
    };

    if (isLoading || isInventoryLoading) return <div className="loading">Loading products...</div>;
    if (isError) return <div className="error-message">Error occurred. Try again later.</div>;

    return (
        <div>
            <div className="flex flex-row-reverse gap-4 mb-4">
                <Button 
                    variant="primary" 
                    size="md"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    + Add Product
                </Button>
            </div>

            <div className="col-span-2 card">
                <div className="flex flex-row justify-between items-center pb-2 mb-2 border-b border-slate-300">
                    <h2 className="card-header m-0 p-0">Product List</h2>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRefetch()}
                        disabled={isFetching}
                    >
                        Refresh
                    </Button>
                </div>
                <div className="card-body">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>ID</TableHeaderCell>
                                <TableHeaderCell>Name</TableHeaderCell>
                                <TableHeaderCell>Slug</TableHeaderCell>
                                <TableHeaderCell>Genre</TableHeaderCell>
                                <TableHeaderCell isFiltered={activeSort === 'unit'} onClick={() => toggleFilter('unit')}>
                                    Unit
                                </TableHeaderCell>
                                <TableHeaderCell>Exp. Date</TableHeaderCell>
                                <TableHeaderCell>Delivered At</TableHeaderCell>
                                <TableHeaderCell>Batch No.</TableHeaderCell>
                                <TableHeaderCell>Supplier ID</TableHeaderCell>
                                <TableHeaderCell>Supplier Name</TableHeaderCell>
                                <TableHeaderCell className="text-center">Actions</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedProducts.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-mono font-bold text-slate-700">
                                        #{p.id}
                                    </TableCell>
                                    <TableCell className="font-semibold text-slate-900">
                                        {p.name}
                                    </TableCell>
                                    <TableCell className="text-slate-500 font-mono text-[11px]">
                                        {p.slug}
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                            {p.genre}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                                            {p.unit}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        {p.expirationDate}
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        {p.deliveredAt}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-slate-600">
                                        {p.batchNumber}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-slate-500">
                                        {p.supplierId}
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-800">
                                        {p.supplierName}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center items-center gap-1.5">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleOpenDetails(p.id)}
                                            >
                                                Details
                                            </Button>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedProductId(p.id.toString());
                                                    setIsEditModalOpen(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            {getProductStock(p.id) <= 0 && (
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedProductId(p.id.toString());
                                                        setIsConfirmModalOpen(true);
                                                    }}
                                                    disabled={deleteProductMutation.isPending}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {isConfirmModalOpen && selectedProductId && (
                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={() => handleDelete(Number(selectedProductId))}
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this product?"
                />
            )}

            {isCreateModalOpen && (
                <ProductCreateModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                />
            )}

            {isEditModalOpen && selectedProductId && (
                <ProductEditForm
                    isOpen={isEditModalOpen}
                    productId={selectedProductId}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}

            {isDetailsModalOpen && (
                <ProductDetailsForm
                    productId={selectedProductId}
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                />
            )}
        </div>
    )
}
