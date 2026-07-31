import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/common';
import toast from 'react-hot-toast';

interface GenerateReportFormProps {
    onClose: () => void;
}

export default function GenerateReportForm({ onClose }: GenerateReportFormProps) {
    const [reportType, setReportType] = useState('Inventory Summary');
    const [format, setFormat] = useState('PDF');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!dateFrom || !dateTo) {
            toast.error('Please select a date range');
            return;
        }

        setIsGenerating(true);

        const generatePromise = new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });

        toast.promise(
            generatePromise,
            {
                loading: 'Generating report...',
                success: <b>Report downloaded!</b>,
                error: <b>Failed to generate report</b>
            },
            { id: 'generate-report' }
        ).then(() => {
            setIsGenerating(false);
            onClose();
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Generate Report</h2>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">Report Type</label>
                <Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    options={[
                        { label: 'Inventory Summary', value: 'Inventory Summary' },
                        { label: 'Financial Report', value: 'Financial Report' },
                        { label: 'Maintenance Log', value: 'Maintenance Log' },
                        { label: 'Order History', value: 'Order History' }
                    ]}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">Export Format</label>
                <Select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    options={[
                        { label: 'PDF Document (.pdf)', value: 'PDF' },
                        { label: 'Excel Spreadsheet (.xlsx)', value: 'Excel' },
                        { label: 'CSV File (.csv)', value: 'CSV' }
                    ]}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Date From</label>
                    <Input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Date To</label>
                    <Input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-2">
                <Button
                    type="button"
                    variant="outline"
                    className="p-1"
                    onClick={onClose}
                    disabled={isGenerating}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="success"
                    className="p-1"
                    disabled={isGenerating}
                >
                    {isGenerating ? 'Generating...' : 'Generate & Download'}
                </Button>
            </div>
        </form>
    );
}
