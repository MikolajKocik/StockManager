import React, { useState } from 'react';
import { Modal, Button } from '@/components/common';
import './ProductDetailsForm.css';
import { useProduct } from '../hooks/useProduct';
import { useInventoryItems } from '../../inventoryItems/hooks/useInventoryItems';
import ProductEditForm from './ProductEditForm';

interface ProductDetailsModalProps {
    productId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProductDetailsForm: React.FC<ProductDetailsModalProps> = ({ productId, isOpen, onClose }) => {
    const { data: product, isLoading: isProductLoading } = useProduct(productId);
    const { data: inventoryData, isLoading: isInventoryLoading } = useInventoryItems();
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

    const [activeTab, setActiveTab] = useState<'overview' | 'stock'>('overview');

    if (!isOpen) return null;

    const inventoryItems = inventoryData?.data ?? [];
    const productStock = inventoryItems.filter(item => item.productId === Number(productId));
    const totalStock = productStock.reduce((acc, curr) => acc + curr.quantityOnHand, 0);

    const isLoading = isProductLoading || isInventoryLoading;

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading details...</div>
                ) : product ? (
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6 border-b pb-4">
                            <div>
                                <h2 className="text-2xl font-bold">{product.name}</h2>
                                <p className="text-sm text-gray-500">ID: {product.id} | Slug: {product.slug}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${totalStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {totalStock > 0 ? `IN STOCK (${totalStock} ${product.unit})` : 'OUT OF STOCK'}
                            </span>
                        </div>

                        <div className="flex gap-4 mb-4 border-b">
                            <button
                                className={`pb-2 px-2 border-b-2 font-medium ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                            <button
                                className={`pb-2 px-2 border-b-2 font-medium ${activeTab === 'stock' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('stock')}
                            >
                                Stock Locations
                            </button>
                        </div>

                        <div className="py-4">
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                    <div>
                                        <p className="overview-label">Genre</p>
                                        <p className="overview-value">{product.genre}</p>
                                    </div>
                                    <div>
                                        <p className="overview-label">Supplier</p>
                                        <p className="overview-value">{product.supplierName} (ID: {product.supplierId})</p>
                                    </div>
                                    <div>
                                        <p className="overview-label">Batch Number</p>
                                        <p className="overview-value">{product.batchNumber || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="overview-label">Expiration Date</p>
                                        <p className="overview-value">{product.expirationDate || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="overview-label">Delivered At</p>
                                        <p className="overview-value">{product.deliveredAt || 'N/A'}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'stock' && (
                                <div>
                                    {productStock.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No stock records found for this product.</p>
                                    ) : (
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="p-2 border">Bin Location</th>
                                                    <th className="p-2 border">Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {productStock.map(item => (
                                                    <tr key={item.id}>
                                                        <td className="p-2 border font-mono">{item.binLocationId}</td>
                                                        <td className="p-2 border">{item.quantityOnHand}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                            <Button variant="outline" className="p-1" onClick={onClose}>Close</Button>
                            <Button variant="primary" className="p-1" onClick={() => setIsFormOpen(true)}>Edit Product</Button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center text-red-500">Product not found.</div>
                )}
            </Modal>

            {isFormOpen && (
                <ProductEditForm
                    isOpen={isFormOpen}
                    productId={productId}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </>
    );
};
