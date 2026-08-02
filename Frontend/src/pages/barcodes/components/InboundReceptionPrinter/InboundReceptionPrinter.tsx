import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/common';
import type { LabelTemplate } from '../../models/labelTemplate';
import { Canvas } from '../LabelDesigner/Canvas';
import toast from 'react-hot-toast';

interface InboundReceptionPrinterProps {
    template: LabelTemplate;
}

export const InboundReceptionPrinter: React.FC<InboundReceptionPrinterProps> = ({ template }) => {
    const [selectedPo, setSelectedPo] = useState<string>('PO-2026-0812');
    const [productSku, setProductSku] = useState<string>('VLV-HYDR-24V-01');
    const [productName, setProductName] = useState<string>('Industrial Hydraulic Valve 24V');
    const [batchNumber, setBatchNumber] = useState<string>('LOT-2026-08-01X');
    const [expDate, setExpDate] = useState<string>('2028-12-31');
    const [palletQty, setPalletQty] = useState<number>(4);
    const [unitsPerPallet, setUnitsPerPallet] = useState<number>(48);
    const [targetBin, setTargetBin] = useState<string>('A-02-04');
    const [isPrintingBatch, setIsPrintingBatch] = useState<boolean>(false);

    const sampleData: Record<string, string> = {
        '{product.name}': productName,
        '{product.sku}': productSku,
        '{product.genre}': 'Hydraulics',
        '{product.unit}': 'pcs',
        '{batch.number}': batchNumber,
        '{batch.expirationDate}': expDate,
        '{warehouse.zone}': 'HIGH_BAY_A',
        '{warehouse.binLocation}': targetBin,
        '{pallet.sscc}': '003590123450000018',
        '{quantity}': String(unitsPerPallet)
    };

    const handlePrintBatch = () => {
        setIsPrintingBatch(true);

        const printPromise = new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });

        toast.promise(
            printPromise,
            {
                loading: `Printing ${palletQty} PZ Pallet Labels on Zebra ZT410 (Dock 2)...`,
                success: <b>{palletQty} standard PZ labels printed! Ready for putaway.</b>,
                error: <b>Printer error</b>
            },
            { id: 'pz-batch-print' }
        ).then(() => {
            setIsPrintingBatch(false);
        });
    };

    return (
        <div className="space-y-4">
            {/* Terminal Notice Card */}
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex items-start gap-3 shadow-xs">
                <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-amber-900">
                        Delegated Warehouse Operator Terminal (Zero-Error Layout Enforcement)
                    </h4>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                        The label layout and barcode standard are strictly locked by the logistics manager. The terminal operator simply selects the inbound delivery (PZ) and enters batch parameters. The backend automatically produces millimeter-perfect labels conforming to the corporate GS1 standard.
                    </p>
                </div>
            </div>

            {/* Split Screen Operator Workflow */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left Column: Inbound PZ Delivery Form */}
                <div className="lg:col-span-5 bg-white border border-slate-300 rounded-lg p-4 shadow-xs space-y-4 text-xs">
                    <div className="border-b border-slate-200 pb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Inbound Reception (PZ) Data
                        </span>
                        <h3 className="font-bold text-sm text-slate-800">
                            Pallet Reception Parameters
                        </h3>
                    </div>

                    {/* Active PO Selector */}
                    <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                            Inbound Delivery / Purchase Order (PZ)
                        </label>
                        <Select
                            value={selectedPo}
                            onChange={(e) => {
                                setSelectedPo(e.target.value);
                                if (e.target.value === 'PO-2026-0812') {
                                    setProductSku('VLV-HYDR-24V-01');
                                    setProductName('Industrial Hydraulic Valve 24V');
                                    setBatchNumber('LOT-2026-08-01X');
                                    setTargetBin('A-02-04');
                                } else {
                                    setProductSku('ELEC-SENS-OPT-09');
                                    setProductName('Optical Proximity Sensor 24V');
                                    setBatchNumber('LOT-2026-09-44B');
                                    setTargetBin('B-01-18');
                                }
                            }}
                            options={[
                                { label: 'PZ-2026-0812 — Apex Machinery (Hydraulic Valves)', value: 'PO-2026-0812' },
                                { label: 'PZ-2026-0815 — Nordic Sensorics (Optical Sensors)', value: 'PO-2026-0815' }
                            ]}
                        />
                    </div>

                    {/* Product Details (Read-only / verified) */}
                    <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
                        <div>
                            <span className="text-[10px] font-semibold text-slate-500 block">Material:</span>
                            <span className="font-bold text-slate-900 text-xs">{productName}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                                <span className="text-slate-500 block">SKU Code:</span>
                                <span className="font-mono font-semibold text-slate-800">{productSku}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Assigned Putaway Bin:</span>
                                <span className="font-mono font-bold text-slate-900">{targetBin}</span>
                            </div>
                        </div>
                    </div>

                    {/* Batch & LOT Input */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                                Supplier Batch / LOT #
                            </label>
                            <Input
                                value={batchNumber}
                                onChange={(e) => setBatchNumber(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                                Expiration Date
                            </label>
                            <Input
                                type="date"
                                value={expDate}
                                onChange={(e) => setExpDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Pallet Counts */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                        <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                                Number of Pallets (Copies)
                            </label>
                            <Input
                                type="number"
                                min={1}
                                max={50}
                                value={palletQty}
                                onChange={(e) => setPalletQty(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                                Units Per Pallet
                            </label>
                            <Input
                                type="number"
                                min={1}
                                value={unitsPerPallet}
                                onChange={(e) => setUnitsPerPallet(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* Print Button */}
                    <div className="pt-2">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handlePrintBatch}
                            isLoading={isPrintingBatch}
                            className="w-full text-xs font-semibold py-2.5 shadow-sm"
                        >
                            {isPrintingBatch
                                ? `Generating & Sending ${palletQty} Labels...`
                                : `Print ${palletQty} Inbound Pallet Labels (Zebra ZT410)`
                            }
                        </Button>
                    </div>
                </div>

                {/* Right Column: Master Standard Preview */}
                <div className="lg:col-span-7 bg-white border border-slate-300 rounded-lg p-4 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                                    Enforced Master Template Preview
                                </span>
                                <h3 className="font-bold text-sm text-slate-800">
                                    {template.name}
                                </h3>
                            </div>
                            <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded border border-slate-200">
                                Locked by Manager
                            </span>
                        </div>

                        {/* Live Canvas in Preview Mode */}
                        <div className="flex justify-center p-2">
                            <Canvas
                                template={template}
                                selectedElementId={null}
                                onSelectElement={() => { }}
                                onUpdateElement={() => { }}
                                sampleData={sampleData}
                                isPreviewMode={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
