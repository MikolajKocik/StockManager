import React from 'react';
import { Button } from '@/components/common';

export type BarcodeModuleTab = 'DESIGNER' | 'EMERGENCY' | 'INBOUND_PRINT' | 'ZPL_ENGINE';

interface BarcodesHeaderProps {
    activeTab: BarcodeModuleTab;
    onTabChange: (tab: BarcodeModuleTab) => void;
    onSaveTemplate?: () => void;
    onResetTemplate?: () => void;
    templateName?: string;
    isDirty?: boolean;
}

export const BarcodesHeader: React.FC<BarcodesHeaderProps> = ({
    activeTab,
    onTabChange,
    onSaveTemplate,
    onResetTemplate,
    templateName,
    isDirty
}) => {
    return (
        <div className="space-y-4 mb-4">
            {/* Top Bar with Title and Actions */}
            <div className="bg-[#384155] text-white p-4 rounded-lg shadow-md border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h1 className="bg-amber-400 text-slate-900 font-black text-2xl px-2 py-0.5 rounded tracking-wide font-mono uppercase">
                            WMS ZEBRA ENGINE
                        </h1>
                    </div>
                </div>

                {activeTab === 'DESIGNER' && (
                    <div className="flex items-center gap-2">
                        {onResetTemplate && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={onResetTemplate}
                                className="text-xs"
                            >
                                Reset Layout
                            </Button>
                        )}
                        {onSaveTemplate && (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={onSaveTemplate}
                                className={`text-xs font-semibold shadow-sm ${isDirty ? 'ring-2 ring-amber-400' : ''}`}
                            >
                                Save Template {isDirty && '•'}
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Sub-Navigation Tabs & KPI Overview */}
            <div className="bg-white border border-slate-300 rounded-lg p-2 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                    <button
                        onClick={() => onTabChange('DESIGNER')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'DESIGNER'
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        <span className="border p-2">Visual Label Designer</span>
                        {templateName && activeTab === 'DESIGNER' && (
                            <span className="text-[10px] bg-slate-700 text-slate-200 px-1.5 py-0.2 rounded font-mono">
                                {templateName}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => onTabChange('EMERGENCY')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'EMERGENCY'
                            ? 'bg-rose-700 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        <span className="border p-2">Emergency Visual Generator</span>
                    </button>

                    <button
                        onClick={() => onTabChange('INBOUND_PRINT')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'INBOUND_PRINT'
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        <span className="border p-2">Inbound PZ Terminal Printing</span>
                    </button>

                    <button
                        onClick={() => onTabChange('ZPL_ENGINE')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'ZPL_ENGINE'
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        <span className="border p-2">Zebra ZPL-II Engine</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
