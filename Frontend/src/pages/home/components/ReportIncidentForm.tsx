import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/common';
import { useReportIncident } from '@/pages/maintenance/hooks/useReportIncident';
import toast from 'react-hot-toast';
import { type ReportIncident } from '@/models/maintenance';

interface ReportIncidentFormProps {
    onClose: () => void;
}

export default function ReportIncidentForm({ onClose }: ReportIncidentFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Low');
    const [assetId, setAssetId] = useState('');
    const [binLocationId, setBinLocationId] = useState('');

    const reportMutation = useReportIncident();

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!title || !description) {
            toast.error('Title and description are required');
            return;
        }

        const payload: ReportIncident = {
            title,
            description,
            priority,
            assetId: assetId || null,
            binLocationId: binLocationId ? Number(binLocationId) : null,
            photoUrl: null
        };

        reportMutation.mutate(payload, {
            onSuccess: () => {
                toast.success('Incident reported successfully');
                onClose();
            },
            onError: () => {
                toast.error('Failed to report incident');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Report Incident</h2>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">Title</label>
                <Input
                    placeholder="E.g. Broken forklift"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">Description</label>
                <textarea
                    className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500 min-h-25"
                    placeholder="Describe the issue in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Priority</label>
                    <Select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        options={[
                            { label: 'Low', value: 'Low' },
                            { label: 'Medium', value: 'Medium' },
                            { label: 'High', value: 'High' },
                            { label: 'Critical', value: 'Critical' }
                        ]}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Asset ID (Optional)</label>
                    <Input
                        placeholder="E.g. ASSET-001"
                        value={assetId}
                        onChange={(e) => setAssetId(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1 mb-4">
                <label className="text-sm font-semibold text-gray-600">Bin Location ID (Optional)</label>
                <Input
                    type="number"
                    placeholder="E.g. 1"
                    value={binLocationId}
                    onChange={(e) => setBinLocationId(e.target.value)}
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-2">
                <Button
                    type="button"
                    variant="outline"
                    className="p-1"
                    onClick={onClose}
                    disabled={reportMutation.isPending}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="danger"
                    className="p-1"
                    disabled={reportMutation.isPending}>
                    {reportMutation.isPending ? 'Submitting...' : 'Submit Report'}
                </Button>
            </div>
        </form>
    );
}
