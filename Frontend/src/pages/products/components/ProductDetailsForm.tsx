import React, { useState } from 'react';
import { Button } from '@/components/common';
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
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'stock'>('overview');

    if (!isOpen) return null;

    const inventoryItems = inventoryData?.data ?? [];
    const productStock = inventoryItems.filter(item => item.productId === Number(productId));
    const totalStock = productStock.reduce((acc, curr) => acc + curr.quantityOnHand, 0);
    const isLoading = isProductLoading || isInventoryLoading;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
                <div className="bg-white border border-slate-300 rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden text-slate-800 animate-scale-in">
                    {/* Header */}
                    <div className="bg-[#384155] text-white px-4 py-3 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-sm text-white">
                                {product?.name || 'Product Details'}
                            </h3>
                            <span className="text-[11px] text-slate-300 font-mono">
                                ID: #{productId} {product?.slug ? `• ${product.slug}` : ''}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-300 hover:text-white text-lg leading-none p-1 cursor-pointer"
                        >
                            &#10005;
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="p-8 text-center text-xs text-slate-500">Loading details...</div>
                    ) : product ? (
                        <div>
                            {/* Subheader Banner */}
                            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <button
                                        className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                                            activeTab === 'overview'
                                                ? 'bg-slate-800 text-white shadow-xs'
                                                : 'text-slate-600 hover:bg-slate-200/70'
                                        }`}
                                        onClick={() => setActiveTab('overview')}
                                    >
                                        Overview
                                    </button>
                                    <button
                                        className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                                            activeTab === 'stock'
                                                ? 'bg-slate-800 text-white shadow-xs'
                                                : 'text-slate-600 hover:bg-slate-200/70'
                                        }`}
                                        onClick={() => setActiveTab('stock')}
                                    >
                                        Stock Allocations ({productStock.length})
                                    </button>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                                    totalStock > 0 
                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                                        : 'bg-rose-100 text-rose-800 border-rose-300'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${totalStock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    {totalStock > 0 ? `In Stock: ${totalStock} ${product.unit}` : 'Out of Stock'}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-4 text-xs">
                                {activeTab === 'overview' && (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 rounded-md p-3">
                                            <div>
                                                <span className="text-[11px] text-slate-500 block font-medium">Category</span>
                                                <span className="font-semibold text-slate-800">{product.genre || 'Standard'}</span>
                                            </div>
                                            <div>
                                                <span className="text-[11px] text-slate-500 block font-medium">Storage Type</span>
                                                <span className="font-semibold text-slate-800">{product.type || 'General'}</span>
                                            </div>
                                            <div>
                                                <span className="text-[11px] text-slate-500 block font-medium">Unit Measurement</span>
                                                <span className="font-semibold text-slate-800">{product.unit}</span>
                                            </div>
                                        </div>

                                        <div className="border border-slate-200 rounded-md p-3 space-y-2">
                                            <span className="font-bold text-[11px] text-slate-600 uppercase tracking-wider block">
                                                Supply & Traceability
                                            </span>
                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                <div>
                                                    <span className="text-slate-500 block text-[11px]">Supplier Link:</span>
                                                    <span className="font-semibold text-slate-800">
                                                        {product.supplierName ? `${product.supplierName} (${product.supplierId})` : (product.supplierId || 'Direct / Internal')}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 block text-[11px]">Batch Number:</span>
                                                    <span className="font-mono font-semibold text-slate-800">
                                                        {product.batchNumber || 'N/A'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 block text-[11px]">Expiration Date:</span>
                                                    <span className="font-medium text-slate-700">
                                                        {product.expirationDate ? new Date(product.expirationDate).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 block text-[11px]">Delivered At:</span>
                                                    <span className="font-medium text-slate-700">
                                                        {product.deliveredAt ? new Date(product.deliveredAt).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'stock' && (
                                    <div>
                                        {productStock.length === 0 ? (
                                            <div className="text-slate-400 text-center py-8 text-xs italic bg-slate-50 rounded border border-slate-200">
                                                No warehouse bins currently holding this product.
                                            </div>
                                        ) : (
                                            <div className="rounded border border-slate-300 overflow-hidden shadow-xs">
                                                <table className="w-full text-xs text-left border-collapse">
                                                    <thead className="bg-slate-800 text-white font-bold uppercase text-[10px] tracking-wider border-b border-slate-700">
                                                        <tr>
                                                            <th className="py-2 px-3 bg-slate-800 text-white">Bin Location</th>
                                                            <th className="py-2 px-3 bg-slate-800 text-white text-right">Qty on Hand</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-200 bg-white">
                                                        {productStock.map(item => (
                                                            <tr key={item.id} className="odd:bg-white even:bg-slate-50/80 hover:bg-slate-100 transition-colors">
                                                                <td className="py-2 px-3 font-mono font-bold text-slate-800">
                                                                    Bin #{item.binLocationId}
                                                                </td>
                                                                <td className="py-2 px-3 font-mono text-right font-bold text-slate-900">
                                                                    {item.quantityOnHand} {product.unit}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-2 p-3 bg-slate-50 border-t border-slate-200">
                                <Button variant="secondary" size="sm" onClick={onClose} className="text-xs">
                                    Close
                                </Button>
                                <Button 
                                    variant="primary" 
                                    size="sm" 
                                    onClick={() => setIsEditOpen(true)}
                                    className="text-xs font-semibold"
                                >
                                    Edit Product
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-xs text-rose-500">Product not found.</div>
                    )}
                </div>
            </div>

            {isEditOpen && (
                <ProductEditForm
                    isOpen={isEditOpen}
                    productId={productId}
                    onClose={() => setIsEditOpen(false)}
                />
            )}
        </>
    );
};
