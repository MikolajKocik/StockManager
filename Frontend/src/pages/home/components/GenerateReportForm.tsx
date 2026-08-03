import React, { useState } from 'react';
import { Button, FormBody, FormFooter, Input, Select } from '@/components/common';
import toast from 'react-hot-toast';
import type { DialogProps } from '../models';

const REPORT_DATASET_OPTIONS = [
    { label: 'Inventory Stock Valuation & Aging', value: 'Inventory Summary' },
    { label: 'Fleet Maintenance & Incident Log', value: 'Maintenance Log' },
    { label: 'Order Processing & Lead Time KPI', value: 'Order History' },
    { label: 'B2B Client Wholesale Volume Report', value: 'Financial Report' }
];

const EXPORT_FORMAT_OPTIONS = [
    { label: 'PDF Document (.pdf)', value: 'PDF' },
    { label: 'Excel Spreadsheet (.xlsx)', value: 'Excel' },
    { label: 'Raw CSV Data (.csv)', value: 'CSV' }
];

export default function GenerateReportForm({ onSuccess, onCancel }: DialogProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));

        if (!data.dateFrom || !data.dateTo) {
            toast.error('Please select a valid date range');
            return;
        }

        setIsGenerating(true);

        // generating fake process
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
            onSuccess();
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormBody>
                <Select
                    label="Report Dataset"
                    name="reportType"
                    defaultValue="Inventory Summary"
                    options={REPORT_DATASET_OPTIONS}
                />

                <Select
                    label="Export Format"
                    name="format"
                    defaultValue="PDF"
                    options={EXPORT_FORMAT_OPTIONS}
                />

                <div className="grid grid-cols-2 gap-3 pt-1">
                    <Input
                        label="Date From"
                        type="date"
                        name="dateFrom"
                        required
                    />

                    <Input
                        label="Date To"
                        type="date"
                        name="dateTo"
                        required
                    />
                </div>
            </FormBody>

            <FormFooter>
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={isGenerating}
                    className="text-xs"
                    onClick={onCancel}
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
            </FormFooter>
        </form>
    );
};