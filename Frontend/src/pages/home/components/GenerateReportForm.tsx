import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/common';
import toast from 'react-hot-toast';

interface GenerateReportFormProps {
    isOpen?: boolean;
    onClose: () => void;
}

export default function GenerateReportForm({ isOpen = true, onClose }: GenerateReportFormProps) {
    const [reportType, setReportType] = useState('Inventory Summary');
    const [format, setFormat] = useState('PDF');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!dateFrom || !dateTo) {
            toast.error('Please select a valid date range');
            return;
        }

        setIsGenerating(true);

        const generatePromise = new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });

        toast.promise(
            generatePromise,
            {
                loading: 'Compiling analytics & generating report...',
                success: <b>Report downloaded successfully!</b>,
                error: <b>Failed to generate report</b>
            },
            { id: 'generate-report' }
        ).then(() => {
            setIsGenerating(false);
            onClose();
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white border border-slate-300 rounded-lg shadow-2xl max-w-md w-full overflow-hidden text-slate-800 animate-scale-in">
                {/* Header */}
                <div className="bg-[#384155] text-white px-4 py-3 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">
                        Generate Warehouse Analytical Report
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-300 hover:text-white text-lg leading-none p-1 cursor-pointer"
                    >
                        &#10005;
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-4 space-y-3 text-xs">
                        <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                                Report Dataset
                            </label>
                            <Select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                options={[
                                    { label: 'Inventory Stock Valuation & Aging', value: 'Inventory Summary' },
                                    { label: 'Fleet Maintenance & Incident Log', value: 'Maintenance Log' },
                                    { label: 'Order Processing & Lead Time KPI', value: 'Order History' },
                                    { label: 'B2B Client Wholesale Volume Report', value: 'Financial Report' }
                                ]}
                            />
                        </div>

                        <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                                Export Format
                            </label>
                            <Select
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                options={[
                                    { label: 'PDF Document (.pdf)', value: 'PDF' },
                                    { label: 'Excel Spreadsheet (.xlsx)', value: 'Excel' },
                                    { label: 'Raw CSV Data (.csv)', value: 'CSV' }
                                ]}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Date From</label>
                                <Input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Date To</label>
                                <Input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 p-3 bg-slate-50 border-t border-slate-200">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={onClose}
                            disabled={isGenerating}
                            className="text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            isLoading={isGenerating}
                            className="text-xs font-semibold"
                        >
                            {isGenerating ? 'Generating...' : 'Export & Download'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
