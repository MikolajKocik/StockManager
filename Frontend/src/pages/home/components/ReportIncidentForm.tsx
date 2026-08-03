import { Button, FormBody, FormFooter, Input, Select, Textarea } from '@/components/common';
import { useReportIncident } from '@/pages/maintenance/hooks/useReportIncident';
import toast from 'react-hot-toast';
import { type ReportIncident } from '@/models/maintenance';
import type { DialogProps } from '../models';

const PRIORITY_OPTIONS = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
    { label: 'Critical', value: 'Critical' }
];

export default function ReportIncidentForm({ onSuccess, onCancel }: DialogProps) {
    const reportMutation = useReportIncident();

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));

        const title = String(data.title || '').trim();
        const description = String(data.description || '').trim();
        const assetId = String(data.assetId || '').trim() || null;
        const priority = String(data.priority || '').trim();
        const binLocationId = Number(data.binLocationId) || null;

        if (!title || !description) {
            toast.error('Title and description are required');
            return;
        }

        const payload: ReportIncident = {
            title: title,
            description: description,
            priority: priority,
            assetId: assetId,
            binLocationId: binLocationId,
            photoUrl: null
        };

        reportMutation.mutate(payload, {
            onSuccess: () => {
                toast.success('Incident reported successfully');
                onSuccess();
            },
            onError: () => {
                toast.error('Failed to report incident');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormBody>
                <Input
                    label="Incident Title"
                    placeholder="E.g. Forklift FL-01 hydraulic fluid leak"
                    name="title"
                    required
                />

                <Textarea
                    label="Description & Details"
                    placeholder="Detailed explanation of the incident..."
                    name="description"
                    required
                />

                <div className="grid grid-cols-3 gap-2">
                    <Select
                        label="Priority"
                        defaultValue="Low"
                        name="priority"
                        options={PRIORITY_OPTIONS}
                    />

                    <Input
                        label="Asset ID (Opt.)"
                        placeholder="FL-01"
                        name="assetId"
                    />

                    <Input
                        label="Bin ID (Opt.)"
                        type="number"
                        placeholder="104"
                        name="binLocationId"
                    />
                </div>
            </FormBody>

            <FormFooter>
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={onCancel}
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
            </FormFooter>
        </form>
    );
}

