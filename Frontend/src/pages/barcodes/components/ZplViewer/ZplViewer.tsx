import React, { useState, useMemo } from 'react';
import { Button } from '@/components/common';
import type { LabelTemplate } from '../../models/labelTemplate';
import { generateZplFromTemplate } from '../../utils/zplEngine';
import { MOCK_SAMPLE_DATA } from '../../mocks/labelTemplates.mocks';
import toast from 'react-hot-toast';

interface ZplViewerProps {
    template: LabelTemplate;
}

export const ZplViewer: React.FC<ZplViewerProps> = ({ template }) => {
    const [selectedPrinter, setSelectedPrinter] = useState<string>('ZT410-DOCK-3');
    const [isSimulating, setIsSimulating] = useState<boolean>(false);

    const rawZpl = useMemo(() => {
        return generateZplFromTemplate(template, MOCK_SAMPLE_DATA);
    }, [template]);

    const handleCopy = () => {
        navigator.clipboard.writeText(rawZpl);
        toast.success('Raw ZPL-II code copied to clipboard');
    };

    const handleDownloadFile = () => {
        const blob = new Blob([rawZpl], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${template.id}.zpl`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success(`Downloaded ${template.id}.zpl`);
    };

    const handleSimulate = () => {
        setIsSimulating(true);
        setTimeout(() => {
            setIsSimulating(false);
            toast.success(`ZPL payload accepted by ${selectedPrinter} (Buffer: 100% OK, Thermal Head 203 DPI)`);
        }, 1200);
    };

    const printers = [
        { id: 'ZT410-DOCK-3', name: 'Zebra ZT410 (Inbound Dock #3)', status: 'ONLINE', ip: '192.168.10.42', dpi: '203 DPI' },
        { id: 'GK420D-OFFICE', name: 'Zebra GK420d (Logistics Office Desk)', status: 'ONLINE', ip: '192.168.10.45', dpi: '203 DPI' },
        { id: 'ZT410-FL-03', name: 'Zebra ZT410 (Forklift Mobile FL-03)', status: 'ONLINE', ip: '192.168.10.88', dpi: '203 DPI' },
        { id: 'ZD621-PACKING', name: 'Zebra ZD621 (High-Bay Packing Station)', status: 'ONLINE', ip: '192.168.10.51', dpi: '300 DPI' }
    ];

    return (
        <div className="space-y-4 text-xs">
            {/* Top Printer Telemetry Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {printers.map(p => (
                    <div 
                        key={p.id}
                        onClick={() => setSelectedPrinter(p.id)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer ${
                            selectedPrinter === p.id 
                                ? 'bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-amber-400' 
                                : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400 shadow-xs'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-xs truncate">{p.name}</span>
                            <span className={`w-2 h-2 rounded-full ${selectedPrinter === p.id ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                        </div>
                        <div className="flex justify-between text-[0.625rem] opacity-80 font-mono">
                            <span>IP: {p.ip}</span>
                            <span>{p.dpi}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ZPL Code Inspector */}
            <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                        <span className="text-[0.625rem] font-bold uppercase tracking-wider text-slate-500 block">
                            Raw Zebra Programming Language (ZPL-II)
                        </span>
                        <h3 className="font-bold text-sm text-slate-800">
                            ZPL Stream Output for {template.name}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 font-semibold text-xs cursor-pointer"
                        >
                            Copy ZPL Code
                        </button>
                        <button
                            type="button"
                            onClick={handleDownloadFile}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 font-semibold text-xs cursor-pointer"
                        >
                            Download .ZPL File
                        </button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleSimulate}
                            isLoading={isSimulating}
                            className="text-xs font-semibold"
                        >
                            Send to {selectedPrinter}
                        </Button>
                    </div>
                </div>

                <pre className="bg-slate-950 text-emerald-400 p-4 rounded-md font-mono text-xs overflow-auto max-h-96 border border-slate-800 leading-relaxed shadow-inner">
                    {rawZpl}
                </pre>
            </div>
        </div>
    );
};
