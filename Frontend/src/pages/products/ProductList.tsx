import { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { useDeleteProduct } from './hooks/useDeleteProduct';
import { Button, Modal, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/common';
import { useInventoryItems } from '../inventoryItems/hooks/useInventoryItems';
import { useQueryClient } from '@tanstack/react-query';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { genericSort } from '@/utils/sort';

export default function ProductList() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
    const [activeSort, setActiveSort] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const { data, isError, isLoading, refetch } = useProducts();
    const { data: inventoryData, isLoading: isInventoryLoading } = useInventoryItems();
    const deleteProductMutation = useDeleteProduct();

    // TODO
    // const editProductMutation = useEditProduct();

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

    // TOOD
    const handleEdit = (id: number) => {
        // state with modal and edit form here
    }

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProductMutation.mutate(id.toString());
        }
    };

    const handleOpenDetails = (id: number) => {
        setSelectedProductId(id.toString());
        setIsDetailsModalOpen(true);
    };

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['products'] });
    };

    if (isLoading || isInventoryLoading) return <div className="loading">Loading products...</div>;
    if (isError) return <div className="error-message">Error occurred. Try again later.</div>;

    const displayedProducts = genericSort(productList, activeSort);

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
                        onClick={() => refetch()}>
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
                                            {/* disabled={editProductMutation.isPending} */}
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                onClick={() => handleEdit(p.id)}
                                            >
                                                Edit
                                            </Button>
                                            {getProductStock(p.id) <= 0 && (
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(p.id)}
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

            {/* MOCK - TODO */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <div className="p-6 w-[500px] max-w-full">
                    <h2 className="text-xl font-bold mb-4">Create New Product</h2>
                    <p className="text-gray-600 mb-6">Form to create a product will go here.</p>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleCreateSuccess}>Save (Mock)</Button>
                    </div>
                </div>
            </Modal>

            <ProductDetailsModal
                productId={selectedProductId}
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
            />
        </div>
    )
}
