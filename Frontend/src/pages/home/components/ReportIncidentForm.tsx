import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/common';
import { useReportIncident } from '@/pages/maintenance/hooks/useReportIncident';
import toast from 'react-hot-toast';
import { type ReportIncident } from '@/models/maintenance';

interface ReportIncidentFormProps {
    isOpen?: boolean;
    onClose: () => void;
}

export default function ReportIncidentForm({ isOpen = true, onClose }: ReportIncidentFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Low');
    const [assetId, setAssetId] = useState('');
    const [binLocationId, setBinLocationId] = useState('');

    const reportMutation = useReportIncident();

    if (!isOpen) return null;

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            toast.error('Title and description are required');
            return;
        }

        const payload: ReportIncident = {
            title: title.trim(),
            description: description.trim(),
            priority,
            assetId: assetId.trim() || null,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white border border-slate-300 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden text-slate-800 animate-scale-in">
                {/* Header */}
                <div className="bg-[#384155] text-white px-4 py-3 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">
                        Report Technical Incident / Fault
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
                                Incident Title <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="E.g. Forklift FL-01 hydraulic fluid leak"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                                Description & Details <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-normal outline-none focus:border-slate-800 focus:bg-white min-h-24 resize-none transition-colors"
                                placeholder="Provide exact symptom, equipment sounds, or error codes..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Priority</label>
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

                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Asset ID (Opt.)</label>
                                <Input
                                    placeholder="FL-01"
                                    value={assetId}
                                    onChange={(e) => setAssetId(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Bin ID (Opt.)</label>
                                <Input
                                    type="number"
                                    placeholder="104"
                                    value={binLocationId}
                                    onChange={(e) => setBinLocationId(e.target.value)}
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
                            disabled={reportMutation.isPending}
                            className="text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="danger"
                            size="sm"
                            isLoading={reportMutation.isPending}
                            className="text-xs font-semibold"
                        >
                            {reportMutation.isPending ? 'Submitting...' : 'Submit Incident'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
