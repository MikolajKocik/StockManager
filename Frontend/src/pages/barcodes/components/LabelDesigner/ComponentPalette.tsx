import React from 'react';
import type { LabelElementType, DynamicFieldType } from '../../models/labelTemplate';

interface ComponentPaletteProps {
    onAddElement: (type: LabelElementType, defaultContent?: string, extra?: { symbology?: any; label?: string; width?: number; height?: number }) => void;
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onAddElement }) => {
    return (
        <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs space-y-4">
            <div>
                <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Component Palette</span>
                    <span className="text-[10px] text-slate-400 font-mono font-normal">Click to insert</span>
                </h3>
                <p className="text-[11px] text-slate-500 mb-3">
                    Select warehouse elements to place on the thermal label canvas.
                </p>
            </div>

            {/* Section 1: Barcodes & 2D Matrices */}
            <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    1. Barcodes & 2D Matrices
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                    <button
                        onClick={() => onAddElement('BARCODE', '003590123450000018', { symbology: 'CODE128', label: 'Code 128 (SSCC / Tracking)', width: 80, height: 30 })}
                        className="text-left p-2 rounded border border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition-colors text-xs cursor-pointer group"
                    >
                        <span className="font-semibold text-slate-800 block group-hover:text-slate-950">Code 128</span>
                        <span className="text-[10px] text-slate-500 block">Pallet & SSCC standard</span>
                    </button>

                    <button
                        onClick={() => onAddElement('BARCODE', '5901234123457', { symbology: 'EAN13', label: 'EAN-13 Retail Barcode', width: 60, height: 25 })}
                        className="text-left p-2 rounded border border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition-colors text-xs cursor-pointer group"
                    >
                        <span className="font-semibold text-slate-800 block group-hover:text-slate-950">EAN-13</span>
                        <span className="text-[10px] text-slate-500 block">GS1 13-digit product code</span>
                    </button>

                    <button
                        onClick={() => onAddElement('QR_CODE', '{product.sku}|{batch.number}|{pallet.sscc}', { symbology: 'QR', label: 'AGV QR Matrix', width: 25, height: 25 })}
                        className="text-left p-2 rounded border border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition-colors text-xs cursor-pointer group"
                    >
                        <span className="font-semibold text-slate-800 block group-hover:text-slate-950">2D QR Matrix</span>
                        <span className="text-[10px] text-slate-500 block">Autonomous AMR scan</span>
                    </button>

                    <button
                        onClick={() => onAddElement('BARCODE', 'LOC-A-04-12', { symbology: 'CODE39', label: 'Code 39 Alphanumeric', width: 70, height: 25 })}
                        className="text-left p-2 rounded border border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition-colors text-xs cursor-pointer group"
                    >
                        <span className="font-semibold text-slate-800 block group-hover:text-slate-950">Code 39</span>
                        <span className="text-[10px] text-slate-500 block">Bin rack alphanumeric</span>
                    </button>
                </div>
            </div>

            {/* Section 2: Dynamic Logistics Fields */}
            <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    2. Dynamic Product & WMS Fields
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <button
                        onClick={() => onAddElement('DYNAMIC_FIELD', '{product.name}', { label: 'Product Name', width: 85, height: 8 })}
                        className="text-left p-1.5 rounded border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-[11px] font-medium text-slate-800 cursor-pointer"
                    >
                        + Product Name
                    </button>

                    <button
                        onClick={() => onAddElement('DYNAMIC_FIELD', '{product.sku}', { label: 'Product SKU', width: 45, height: 7 })}
                        className="text-left p-1.5 rounded border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-[11px] font-medium text-slate-800 cursor-pointer"
                    >
                        + Product SKU
                    </button>

                    <button
                        onClick={() => onAddElement('DYNAMIC_FIELD', 'BATCH: {batch.number}', { label: 'Batch / LOT', width: 45, height: 6 })}
                        className="text-left p-1.5 rounded border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-[11px] font-medium text-slate-800 cursor-pointer"
                    >
                        + Batch / LOT #
                    </button>

                    <button
                        onClick={() => onAddElement('DYNAMIC_FIELD', 'EXP: {batch.expirationDate}', { label: 'Exp Date', width: 45, height: 6 })}
                        className="text-left p-1.5 rounded border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-[11px] font-medium text-slate-800 cursor-pointer"
                    >
                        + Expiration Date
                    </button>

                    <button
                        onClick={() => onAddElement('DYNAMIC_FIELD', 'QTY: {quantity} {product.unit}', { label: 'Quantity', width: 45, height: 6 })}
                        className="text-left p-1.5 rounded border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-[11px] font-medium text-slate-800 cursor-pointer"
                    >
                        + Quantity & Unit
                    </button>

                    <button
                        onClick={() => onAddElement('DYNAMIC_FIELD', 'BIN #{warehouse.binLocation}', { label: 'Bin Location', width: 50, height: 7 })}
                        className="text-left p-1.5 rounded border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-[11px] font-medium text-slate-800 cursor-pointer"
                    >
                        + Bin Location
                    </button>
                </div>
            </div>

            {/* Section 3: Branding, Boxes & Formatting */}
            <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    3. Header, Borders & Text
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                    <button
                        onClick={() => onAddElement('IMAGE_LOGO', 'STOCKMANAGER LOGISTICS', { label: 'Company Header', width: 88, height: 10 })}
                        className="text-left p-1.5 rounded border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-[11px] font-medium text-slate-800 cursor-pointer"
                    >
                        + Company Header
                    </button>

                    <button
                        onClick={() => onAddElement('TEXT', 'CUSTOM TEXT LABEL', { label: 'Static Text', width: 60, height: 7 })}
                        className="text-left p-1.5 rounded border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-[11px] font-medium text-slate-800 cursor-pointer"
                    >
                        + Static Text
                    </button>

                    <button
                        onClick={() => onAddElement('BOX', '', { label: 'Container Box', width: 88, height: 25 })}
                        className="text-left p-1.5 rounded border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-[11px] font-medium text-slate-800 cursor-pointer"
                    >
                        + Outline Box
                    </button>

                    <button
                        onClick={() => onAddElement('LINE', '', { label: 'Divider Line', width: 88, height: 1 })}
                        className="text-left p-1.5 rounded border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-[11px] font-medium text-slate-800 cursor-pointer"
                    >
                        + Divider Line
                    </button>
                </div>
            </div>
        </div>
    );
};
