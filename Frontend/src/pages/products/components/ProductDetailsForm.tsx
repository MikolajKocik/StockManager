import { forwardRef, useState } from 'react';
import { Button, FormBody, FormFooter, Modal } from '@/components/common';
import { useProduct } from '../hooks/useProduct';
import { useInventoryItems } from '@/pages/inventoryItems/hooks/useInventoryItems';
import { formatDate, formatNumber, formatValue } from '@/utils/format';

interface ProductDetailsFormProps {
    productId: string | null;
    onClose: () => void;
    onEdit?: (productId: string) => void;
}

export const ProductDetailsForm = forwardRef<HTMLDialogElement, ProductDetailsFormProps>(({
    productId,
    onClose,
    onEdit
}, ref) => {
    const { data: product, isLoading: isProductLoading } = useProduct(productId);
    const { data: inventoryData, isLoading: isInventoryLoading } = useInventoryItems();
    const [activeTab, setActiveTab] = useState<'overview' | 'stock'>('overview');

    const inventoryItems = inventoryData?.data ?? [];
    const productStock = inventoryItems.filter(item => item.productId === Number(productId));
    const totalStock = productStock.reduce((acc, curr) => acc + (curr.quantityOnHand || 0), 0);
    const isLoading = isProductLoading || isInventoryLoading;

    return (
        <Modal
            ref={ref}
            title={product ? `Product Profile: ${product.name}` : `Product #${productId}`}
            size="lg"
            onClose={onClose}
        >
            {isLoading ? (
                <div className="p-8 text-center text-xs text-slate-500">Loading details...</div>
            ) : product ? (
                <div>
                    {/* Subheader Banner */}
                    <div className="bg-slate-50 border-b border-slate-300 px-4 py-2 flex items-center justify-between">
                        <div className="flex gap-1.5">
                            <button
                                type="button"
                                className={`px-2.5 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                                    activeTab === 'overview'
                                        ? 'bg-[#2b6675] text-white shadow-2xs'
                                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                                }`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                            <button
                                type="button"
                                className={`px-2.5 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                                    activeTab === 'stock'
                                        ? 'bg-[#2b6675] text-white shadow-2xs'
                                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                                }`}
                                onClick={() => setActiveTab('stock')}
                            >
                                Bin Allocations ({productStock.length})
                            </button>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold ${
                            totalStock > 0 ? 'text-[#0e5f32]' : 'text-[#991b1b]'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${totalStock > 0 ? 'bg-[#0e5f32]' : 'bg-[#991b1b]'}`} />
                            {totalStock > 0 ? `Stock on Hand: ${formatNumber(totalStock)} ${product.unit}` : 'Zero Stock'}
                        </span>
                    </div>

                    {/* Content */}
                    <FormBody className="max-h-[70vh] space-y-4 p-4">
                        {activeTab === 'overview' && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-3 bg-slate-50/80 border border-slate-300 rounded-md p-3">
                                    <div>
                                        <span className="text-[11px] text-slate-500 block font-medium">Category</span>
                                        <span className="font-semibold text-slate-800">{formatValue(product.genre)}</span>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-slate-500 block font-medium">Storage Type</span>
                                        <span className="font-semibold text-slate-800">{formatValue(product.type)}</span>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-slate-500 block font-medium">Unit Measurement</span>
                                        <span className="font-mono font-semibold text-slate-800">{product.unit}</span>
                                    </div>
                                </div>

                                <div className="border border-slate-300 rounded-md p-3 space-y-2 bg-white">
                                    <span className="font-bold text-[11px] text-slate-600 uppercase tracking-wider block font-mono">
                                        Supply & Traceability
                                    </span>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <span className="text-slate-500 block text-[11px]">Supplier Reference:</span>
                                            <span className="font-semibold text-slate-800">
                                                {product.supplierName ? `${product.supplierName} (${product.supplierId})` : formatValue(product.supplierId)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block text-[11px]">Batch Number:</span>
                                            <span className="font-mono font-semibold text-slate-800">
                                                {formatValue(product.batchNumber)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block text-[11px]">Expiration Date:</span>
                                            <span className="font-medium text-slate-700">
                                                {formatDate(product.expirationDate)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block text-[11px]">Delivered Date:</span>
                                            <span className="font-medium text-slate-700">
                                                {formatDate(product.deliveredAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'stock' && (
                            <div>
                                {productStock.length === 0 ? (
                                    <div className="text-slate-400 text-center py-8 text-xs italic bg-slate-50 rounded border border-slate-300">
                                        No warehouse bins currently holding this SKU.
                                    </div>
                                ) : (
                                    <div className="rounded-md border border-slate-300 overflow-hidden shadow-2xs">
                                        <table className="w-full text-xs text-left border-collapse">
                                            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-300 font-mono">
                                                <tr>
                                                    <th className="py-2 px-3">Bin Location Reference</th>
                                                    <th className="py-2 px-3 text-right">Quantity on Hand</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 bg-white font-mono">
                                                {productStock.map(item => (
                                                    <tr key={item.id} className="odd:bg-white even:bg-slate-50/60 hover:bg-slate-100 transition-colors">
                                                        <td className="py-2 px-3 font-bold text-slate-800">
                                                            Bin #{item.binLocationId}
                                                        </td>
                                                        <td className="py-2 px-3 text-right font-bold text-slate-900">
                                                            {formatNumber(item.quantityOnHand)} {product.unit}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </FormBody>

                    <FormFooter>
                        <Button variant="secondary" size="md" onClick={onClose}>
                            Close
                        </Button>
                        {onEdit && (
                            <Button
                                variant="warning"
                                size="md"
                                onClick={() => {
                                    onClose();
                                    onEdit(product.id.toString());
                                }}
                            >
                                Edit Product
                            </Button>
                        )}
                    </FormFooter>
                </div>
            ) : (
                <div className="p-8 text-center text-xs text-red-500">Product not found.</div>
            )}
        </Modal>
    );
});

ProductDetailsForm.displayName = 'ProductDetailsForm';
export default ProductDetailsForm;
