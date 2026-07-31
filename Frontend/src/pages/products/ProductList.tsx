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
                <Button variant="primary" className="p-2" onClick={() => setIsCreateModalOpen(true)}>Add Product</Button>
            </div>

            <div className="col-span-2 card">
                <div className="flex flex-row justify-between items-center">
                    <h2 className="card-header">Product List</h2>
                    <Button
                        variant="accent"
                        className="p-1 m-[0.4rem]"
                        onClick={() => handleRefetch()}
                        disabled={isFetching}
                    >
                        Refresh
                    </Button>
                </div>
                <div className="card-body">
                    <Table className="w-full h-full border-collapse mb-2 border [&_td]:p-1 [&_th]:p-1">
                        <TableHead className="bg-slate-200 border">
                            <TableRow className="text-center bg-slate-300">
                                <TableHeaderCell>
                                    Identificator
                                </TableHeaderCell>
                                <TableHeaderCell>
                                    Name
                                </TableHeaderCell>
                                <TableHeaderCell>
                                    Slug
                                </TableHeaderCell>
                                <TableHeaderCell>
                                    Genre
                                </TableHeaderCell>
                                <TableHeaderCell isFiltered={activeSort === 'unit'} onClick={() => toggleFilter('unit')}>
                                    Unit
                                </TableHeaderCell>
                                <TableHeaderCell>
                                    Expiration-Date
                                </TableHeaderCell>
                                <TableHeaderCell>
                                    Delivered-At
                                </TableHeaderCell>
                                <TableHeaderCell>
                                    Batch-number
                                </TableHeaderCell>
                                <TableHeaderCell>
                                    Supplier-identifactor
                                </TableHeaderCell>
                                <TableHeaderCell>
                                    Supplier-name
                                </TableHeaderCell>
                                <TableHeaderCell>
                                    Actions
                                </TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedProducts.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell className="border">
                                        {p.id}
                                    </TableCell>
                                    <TableCell className="border">
                                        {p.name}
                                    </TableCell>
                                    <TableCell className="border">
                                        {p.slug}
                                    </TableCell>
                                    <TableCell className="border">
                                        {p.genre}
                                    </TableCell>
                                    <TableCell className="border text-center">
                                        {p.unit}
                                    </TableCell>
                                    <TableCell className="border">
                                        {p.expirationDate}
                                    </TableCell>
                                    <TableCell className="border">
                                        {p.deliveredAt}
                                    </TableCell>
                                    <TableCell className="border">
                                        {p.batchNumber}
                                    </TableCell>
                                    <TableCell className="border">
                                        {p.supplierId}
                                    </TableCell>
                                    <TableCell className="border">
                                        {p.supplierName}
                                    </TableCell>
                                    <TableCell className="border text-center">
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                variant="ghost"
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
                                                        setSelectedProductId(p.id.toString())
                                                        setIsConfirmModalOpen(true)
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
