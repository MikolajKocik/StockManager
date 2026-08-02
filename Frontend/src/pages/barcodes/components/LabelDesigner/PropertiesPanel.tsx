import React from 'react';
import { Button, Input, Select } from '@/components/common';
import type { LabelTemplate, LabelElement } from '../../models/labelTemplate';
import type { BarcodeSymbology } from '../../utils/barcodeEngine';

interface PropertiesPanelProps {
    template: LabelTemplate;
    selectedElement: LabelElement | null;
    onUpdateElement: (id: string, updates: Partial<LabelElement>) => void;
    onDeleteElement: (id: string) => void;
    onDuplicateElement: (id: string) => void;
    onUpdateTemplate: (updates: Partial<LabelTemplate>) => void;
    templatesList: LabelTemplate[];
    onSelectTemplate: (templateId: string) => void;
    isPreviewMode: boolean;
    onTogglePreviewMode: () => void;
    onOpenPublishModal: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
    template,
    selectedElement,
    onUpdateElement,
    onDeleteElement,
    onDuplicateElement,
    onUpdateTemplate,
    templatesList,
    onSelectTemplate,
    isPreviewMode,
    onTogglePreviewMode,
    onOpenPublishModal
}) => {
    return (
        <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs space-y-4 text-xs">
            {selectedElement ? (
                /* Selected Element Properties */
                <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                                Selected Element
                            </span>
                            <h4 className="font-bold text-slate-800 text-xs">
                                {selectedElement.label || selectedElement.type}
                            </h4>
                        </div>
                        <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                            {selectedElement.type}
                        </span>
                    </div>

                    {/* Position & Size Grid */}
                    <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Coordinates (mm)
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">X Position</label>
                                <Input
                                    type="number"
                                    value={Math.round(selectedElement.x)}
                                    onChange={(e) => onUpdateElement(selectedElement.id, { x: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Y Position</label>
                                <Input
                                    type="number"
                                    value={Math.round(selectedElement.y)}
                                    onChange={(e) => onUpdateElement(selectedElement.id, { y: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Width</label>
                                <Input
                                    type="number"
                                    value={Math.round(selectedElement.width)}
                                    onChange={(e) => onUpdateElement(selectedElement.id, { width: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Height</label>
                                <Input
                                    type="number"
                                    value={Math.round(selectedElement.height)}
                                    onChange={(e) => onUpdateElement(selectedElement.id, { height: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content / Value */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Content / Template String
                        </label>
                        <textarea
                            className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-mono outline-none focus:border-slate-800 focus:bg-white resize-none"
                            rows={3}
                            value={selectedElement.content}
                            onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
                            placeholder="Enter text or dynamic tags like {product.sku}"
                        />
                    </div>

                    {/* Barcode Specifics */}
                    {selectedElement.type === 'BARCODE' && (
                        <div className="space-y-2 pt-2 border-t border-slate-200">
                            <span className="text-[10px] font-bold text-slate-500 uppercase block">
                                Barcode Specifications
                            </span>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Symbology Standard</label>
                                <Select
                                    value={selectedElement.symbology || 'CODE128'}
                                    onChange={(e) => onUpdateElement(selectedElement.id, { symbology: e.target.value as BarcodeSymbology })}
                                    options={[
                                        { label: 'Code 128 (SSCC / Pallet)', value: 'CODE128' },
                                        { label: 'EAN-13 (GS1 Retail)', value: 'EAN13' },
                                        { label: 'Code 39 (Alphanumeric)', value: 'CODE39' }
                                    ]}
                                />
                            </div>
                            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium pt-1">
                                <input
                                    type="checkbox"
                                    checked={selectedElement.showHumanReadableText !== false}
                                    onChange={(e) => onUpdateElement(selectedElement.id, { showHumanReadableText: e.target.checked })}
                                    className="w-3.5 h-3.5 accent-slate-800"
                                />
                                <span>Show Human-Readable Text</span>
                            </label>
                        </div>
                    )}

                    {/* Text Styling Specifics */}
                    {(selectedElement.type === 'TEXT' || selectedElement.type === 'DYNAMIC_FIELD') && (
                        <div className="space-y-2 pt-2 border-t border-slate-200">
                            <span className="text-[10px] font-bold text-slate-500 uppercase block">
                                Typography & Alignment
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-slate-600 block mb-0.5">Font Size (pt)</label>
                                    <Input
                                        type="number"
                                        value={selectedElement.fontSize || 12}
                                        onChange={(e) => onUpdateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-600 block mb-0.5">Weight</label>
                                    <Select
                                        value={selectedElement.fontWeight || 'normal'}
                                        onChange={(e) => onUpdateElement(selectedElement.id, { fontWeight: e.target.value as 'normal' | 'bold' })}
                                        options={[
                                            { label: 'Normal', value: 'normal' },
                                            { label: 'Bold', value: 'bold' }
                                        ]}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Alignment</label>
                                <div className="grid grid-cols-3 gap-1">
                                    {(['left', 'center', 'right'] as const).map(align => (
                                        <button
                                            key={align}
                                            type="button"
                                            onClick={() => onUpdateElement(selectedElement.id, { alignment: align })}
                                            className={`p-1 text-center rounded border capitalize cursor-pointer ${selectedElement.alignment === align
                                                    ? 'bg-slate-800 text-white border-slate-800'
                                                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                                                }`}
                                        >
                                            {align}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions on Element */}
                    <div className="pt-2 border-t border-slate-200 space-y-1.5">
                        <button
                            type="button"
                            onClick={() => {
                                const newX = Math.round((template.dimensions.widthMm - selectedElement.width) / 2);
                                onUpdateElement(selectedElement.id, { x: newX });
                            }}
                            className="w-full py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 text-[11px] font-semibold cursor-pointer"
                        >
                            Center Horizontally (X)
                        </button>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => onDuplicateElement(selectedElement.id)}
                                className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 text-[11px] font-semibold cursor-pointer"
                            >
                                Duplicate
                            </button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => onDeleteElement(selectedElement.id)}
                                className="flex-1 text-[11px]"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Global Template Settings */
                <div className="space-y-3">
                    <div className="border-b border-slate-200 pb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Global Label Template
                        </span>
                        <h4 className="font-bold text-slate-800 text-xs">
                            Standard Parameters
                        </h4>
                    </div>

                    {/* Active Template Select */}
                    <div>
                        <label className="text-[10px] font-semibold text-slate-700 block mb-1">
                            Load Pre-configured Standard
                        </label>
                        <Select
                            value={template.id}
                            onChange={(e) => onSelectTemplate(e.target.value)}
                            options={templatesList.map(t => ({
                                label: t.name,
                                value: t.id
                            }))}
                        />
                    </div>

                    {/* Target Zone & Category */}
                    <div>
                        <label className="text-[10px] font-semibold text-slate-700 block mb-1">
                            Target WMS Zone Binding
                        </label>
                        <Select
                            value={template.targetZone}
                            onChange={(e) => onUpdateTemplate({ targetZone: e.target.value })}
                            options={[
                                { label: 'All Warehouse Sectors (Global)', value: 'ALL_ZONES' },
                                { label: 'High-Bay Rack Hall A', value: 'HIGH_BAY_A' },
                                { label: 'Picking Zone B (Cartons)', value: 'PICKING_B' },
                                { label: 'Cold Storage / Hazmat C', value: 'COLD_STORAGE_C' }
                            ]}
                        />
                    </div>

                    {/* Label Dimensions */}
                    <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Physical Label Size (mm)
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Width (mm)</label>
                                <Input
                                    type="number"
                                    value={template.dimensions.widthMm}
                                    onChange={(e) => onUpdateTemplate({
                                        dimensions: { ...template.dimensions, widthMm: Number(e.target.value) }
                                    })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 block mb-0.5">Height (mm)</label>
                                <Input
                                    type="number"
                                    value={template.dimensions.heightMm}
                                    onChange={(e) => onUpdateTemplate({
                                        dimensions: { ...template.dimensions, heightMm: Number(e.target.value) }
                                    })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* DPI Resolution */}
                    <div>
                        <label className="text-[10px] font-semibold text-slate-700 block mb-1">
                            Printer Head Resolution (DPI)
                        </label>
                        <Select
                            value={String(template.dimensions.dpi)}
                            onChange={(e) => onUpdateTemplate({
                                dimensions: { ...template.dimensions, dpi: Number(e.target.value) }
                            })}
                            options={[
                                { label: '203 DPI (8 dots/mm - Standard Zebra)', value: '203' },
                                { label: '300 DPI (12 dots/mm - High Precision)', value: '300' }
                            ]}
                        />
                    </div>

                    {/* Live Data Toggle & Review/Publish Modal */}
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                        <button
                            type="button"
                            onClick={onTogglePreviewMode}
                            className={`w-full py-2 px-3 rounded border font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${isPreviewMode
                                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                                }`}
                        >
                            <span>{isPreviewMode ? 'Exit Live Data Preview' : 'Preview Real WMS Data'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={onOpenPublishModal}
                            className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                        >
                            Review & Publish Standard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
