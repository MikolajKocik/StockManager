import React from 'react';
import type { MaintenanceMachine } from '@/models/maintenance';
import Modal from '@/components/common/core/Modal';
import { Button, Input, Select, FormBody, FormFooter } from '@/components/common/core';

interface ReportIncidentModalProps {
    isOpen: boolean;
    machines: MaintenanceMachine[];
    defaultAssetId?: string;
    onClose: () => void;
    onSubmit: (
        title: string,
        description: string,
        priority: 'Low' | 'Medium' | 'High' | 'Critical',
        assetId: string
    ) => void;
}

const PRIORITY_OPTIONS = [
    { label: 'Low (Scheduled Inspection)', value: 'Low' },
    { label: 'Medium (Minor Issue)', value: 'Medium' },
    { label: 'High (Needs Intervention)', value: 'High' },
    { label: 'Critical (Immediate Outage)', value: 'Critical' }
] as const;

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
    isOpen,
    machines,
    defaultAssetId,
    onClose,
    onSubmit
}) => {
    const machineOptions = React.useMemo(() => {
        return machines.map(m => ({
            label: `[${m.code}] ${m.name} – (SN: ${m.serialNumber})`,
            value: m.id
        }));
    }, [machines]);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const title = (data.title as string)?.trim() || '';
        const description = (data.description as string)?.trim() || '';
        const priority = (data.priority as 'Low' | 'Medium' | 'High' | 'Critical') || 'High';
        const assetId = (data.assetId as string) || defaultAssetId || machines[0]?.id || '';

        if (!title) return;

        onSubmit(title, description, priority, assetId);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Report Machine Fault / Service Ticket"
            size="md"
        >
            <form onSubmit={handleSubmit}>
                <FormBody>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                            Select machinery asset
                        </label>
                        <Select
                            name="assetId"
                            defaultValue={defaultAssetId || machines[0]?.id || ''}
                            options={machineOptions}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                            Priority Level
                        </label>
                        <Select
                            name="priority"
                            defaultValue="High"
                            options={PRIORITY_OPTIONS}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                            Incident Title / Fault Code
                        </label>
                        <Input
                            name="title"
                            type="text"
                            placeholder="e.g. Hydraulic pump pressure loss, code ERR-401"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                            Detailed Description & Symptoms
                        </label>
                        <textarea
                            name="description"
                            rows={3}
                            placeholder="Describe symptoms, whether machine is immobilised, towing requirements..."
                            className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-800 outline-none focus:border-[#2b6675] resize-none"
                        />
                    </div>
                </FormBody>

                <FormFooter>
                    <Button variant="outline" size="md" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" size="md" type="submit">
                        Submit Service Ticket
                    </Button>
                </FormFooter>
            </form>
        </Modal>
    );
};
