import React, { forwardRef, useState } from 'react';
import type { KanbanOperation, OperationType, OperationPriority } from '../models/operationKanban';
import { Button, FormBody, FormFooter, Modal } from '@/components/common';
import toast from 'react-hot-toast';

interface CreateOperationModalProps {
    onClose: () => void;
    onCreate: (op: KanbanOperation) => void;
}

export const CreateOperationModal = forwardRef<HTMLDialogElement, CreateOperationModalProps>(({
    onClose,
    onCreate
}, ref) => {
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

    const handleSubmit = (e: React.SubmitEvent) => {
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
        <Modal
            ref={ref}
            title="Create & Dispatch Warehouse Task"
            size="lg"
            onClose={onClose}
        >
            <form onSubmit={handleSubmit}>
                <FormBody className="max-h-[75vh] space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-bold text-slate-700 block mb-1">Operation Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as OperationType)}
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 outline-none focus:border-slate-800 cursor-pointer"
                            >
                                <option value="PICKING">PICKING (Kompletacja WZ)</option>
                                <option value="PUTAWAY">PUTAWAY (Rozkładanie PZ)</option>
                                <option value="REPLENISHMENT">REPLENISHMENT (MM Bufor)</option>
                                <option value="INTERNAL_TRANSFER">INTERNAL TRANSFER (Przesunięcie)</option>
                            </select>
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 block mb-1">Initial Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as OperationPriority)}
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 outline-none focus:border-slate-800 cursor-pointer"
                            >
                                <option value="CRITICAL">CRITICAL (Emergency Priority #1)</option>
                                <option value="HIGH">HIGH Priority</option>
                                <option value="NORMAL">NORMAL</option>
                                <option value="LOW">LOW</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-bold text-slate-700 block mb-1">Order / Registry Reference</label>
                            <input
                                type="text"
                                required
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                placeholder="WZ/2026/08/1420"
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 block mb-1">Warehouse Zone / Aisle</label>
                            <input
                                type="text"
                                required
                                value={zone}
                                onChange={(e) => setZone(e.target.value)}
                                placeholder="Aisle 04 (Zone High-Bay A)"
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:border-slate-800 focus:bg-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="font-bold text-slate-700 block mb-1">Assigned Floor Operator</label>
                        <input
                            type="text"
                            value={operatorName}
                            onChange={(e) => setOperatorName(e.target.value)}
                            placeholder="Karol Zieliński"
                            className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:border-slate-800 focus:bg-white"
                        />
                    </div>

                    {/* SKU Items section */}
                    <div className="p-3 bg-slate-50 border border-slate-300 rounded space-y-3">
                        <span className="font-bold text-[11px] text-slate-600 uppercase tracking-wider block">
                            Initial SKU Line Specification
                        </span>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="font-semibold text-slate-600 block mb-0.5">SKU Code</label>
                                <input
                                    type="text"
                                    required
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    placeholder="HYD-PUMP-400X"
                                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-mono outline-none focus:border-slate-800"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-slate-600 block mb-0.5">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="Hydraulic Pump 400 bar"
                                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:border-slate-800"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="font-semibold text-slate-600 block mb-0.5">Quantity (pcs)</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-mono outline-none focus:border-slate-800"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-slate-600 block mb-0.5">Source Location</label>
                                <input
                                    type="text"
                                    required
                                    value={sourceBin}
                                    onChange={(e) => setSourceBin(e.target.value)}
                                    placeholder="BIN-A-04-10"
                                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-mono outline-none focus:border-slate-800"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-slate-600 block mb-0.5">Target Location</label>
                                <input
                                    type="text"
                                    required
                                    value={targetBin}
                                    onChange={(e) => setTargetBin(e.target.value)}
                                    placeholder="RAMP-01-STAGE"
                                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-mono outline-none focus:border-slate-800"
                                />
                            </div>
                        </div>
                    </div>
                </FormBody>

                <FormFooter>
                    <Button variant="secondary" size="md" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="md" type="submit">
                        Dispatch Operation
                    </Button>
                </FormFooter>
            </form>
        </Modal>
    );
});

CreateOperationModal.displayName = 'CreateOperationModal';
