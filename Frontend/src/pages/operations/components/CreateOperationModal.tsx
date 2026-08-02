import React, { useState } from 'react';
import type { KanbanOperation, OperationType, OperationPriority } from '../models/operationKanban';
import toast from 'react-hot-toast';

interface CreateOperationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (op: KanbanOperation) => void;
}

export const CreateOperationModal: React.FC<CreateOperationModalProps> = ({
    isOpen,
    onClose,
    onCreate
}) => {
    const [type, setType] = useState<OperationType>('PICKING');
    const [priority, setPriority] = useState<OperationPriority>('HIGH');
    const [orderNumber, setOrderNumber] = useState('WZ/2026/08/1420');
    const [zone, setZone] = useState('Aisle 04 (Zone High-Bay A)');
    const [operatorName, setOperatorName] = useState('Karol Zieliński');
    const [sku, setSku] = useState('HYD-PUMP-400X');
    const [productName, setProductName] = useState('Hydraulic High-Pressure Pump 400 bar');
    const [quantity, setQuantity] = useState(5);
    const [sourceBin, setSourceBin] = useState('BIN-A-04-10');
    const [targetBin, setTargetBin] = useState('RAMP-01-STAGE');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newOp: KanbanOperation = {
            id: `op-${Date.now()}`,
            operationNumber: `OP-${Math.floor(1000 + Math.random() * 9000)}-${type.substring(0, 4)}`,
            type,
            status: 'QUEUED',
            priority,
            orderNumber,
            zone,
            assignedOperatorName: operatorName,
            assignedEquipment: 'Handheld Mobile Terminal',
            totalItemsCount: 1,
            totalWeightKg: quantity * 25,
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            estimatedMinutes: 20,
            elapsedMinutes: 0,
            items: [
                {
                    id: `item-${Date.now()}`,
                    sku,
                    productName,
                    quantity,
                    pickedQuantity: 0,
                    unit: 'pcs',
                    sourceBin,
                    targetBin
                }
            ]
        };

        onCreate(newOp);
        toast.success(`Dispatched ${newOp.operationNumber} to warehouse queue`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-800 animate-scale-in">
                {/* Header */}
                <div className="bg-[#384155] p-4 text-white flex items-center justify-between border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <span className="bg-[#fbbf24] text-slate-950 font-black text-xs px-2 py-0.5 rounded font-mono uppercase">
                            DISPATCH
                        </span>
                        <h2 className="text-base font-bold">
                            Create & Dispatch Warehouse Task
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-300 hover:text-white font-mono text-lg font-bold cursor-pointer px-2 py-0.5 rounded hover:bg-slate-700 transition-colors"
                        dangerouslySetInnerHTML={{ __html: '&#10005;' }}
                    />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="font-semibold block text-slate-700">Operation Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as OperationType)}
                                className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-bold"
                            >
                                <option value="PICKING">PICKING (Kompletacja WZ)</option>
                                <option value="PUTAWAY">PUTAWAY (Rozkładanie PZ)</option>
                                <option value="REPLENISHMENT">REPLENISHMENT (MM Bufor)</option>
                                <option value="INTERNAL_TRANSFER">INTERNAL TRANSFER (Przesunięcie)</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="font-semibold block text-slate-700">Initial Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as OperationPriority)}
                                className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-bold font-mono"
                            >
                                <option value="CRITICAL">CRITICAL (Awaryjne #1)</option>
                                <option value="HIGH">HIGH (Wysoki)</option>
                                <option value="NORMAL">NORMAL (Standard)</option>
                                <option value="LOW">LOW</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="font-semibold block text-slate-700">Order / Reference Number</label>
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                required
                                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="font-semibold block text-slate-700">Target Warehouse Zone</label>
                            <input
                                type="text"
                                value={zone}
                                onChange={(e) => setZone(e.target.value)}
                                required
                                className="w-full px-3 py-1.5 border border-slate-300 rounded"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="font-semibold block text-slate-700">Assign Operator (Optional)</label>
                        <select
                            value={operatorName}
                            onChange={(e) => setOperatorName(e.target.value)}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                        >
                            <option value="Karol Zieliński">Karol Zieliński (Order Picker)</option>
                            <option value="Krzysztof Kaczmarek">Krzysztof Kaczmarek (Reach Truck)</option>
                            <option value="Tomasz Lewandowski">Tomasz Lewandowski (Shift Foreman)</option>
                            <option value="Paweł Nowak">Paweł Nowak (Picker)</option>
                        </select>
                    </div>

                    {/* First Line Item */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                        <span className="font-bold uppercase font-mono text-[10px] text-slate-700 block">
                            Initial Goods / SKU Details
                        </span>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-1 space-y-1">
                                <label className="text-[10px] text-slate-600 block">SKU Code</label>
                                <input
                                    type="text"
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    className="w-full px-2 py-1 border border-slate-300 rounded font-mono"
                                />
                            </div>

                            <div className="col-span-2 space-y-1">
                                <label className="text-[10px] text-slate-600 block">Product Name</label>
                                <input
                                    type="text"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    className="w-full px-2 py-1 border border-slate-300 rounded"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-600 block">Qty (pcs)</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    className="w-full px-2 py-1 border border-slate-300 rounded font-mono"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-600 block">Source Bin</label>
                                <input
                                    type="text"
                                    value={sourceBin}
                                    onChange={(e) => setSourceBin(e.target.value)}
                                    className="w-full px-2 py-1 border border-slate-300 rounded font-mono"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-600 block">Target Bin / Ramp</label>
                                <input
                                    type="text"
                                    value={targetBin}
                                    onChange={(e) => setTargetBin(e.target.value)}
                                    className="w-full px-2 py-1 border border-slate-300 rounded font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors shadow-xs"
                        >
                            Dispatch Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
