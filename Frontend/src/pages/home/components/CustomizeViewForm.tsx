import { Button, CheckboxCard, FormBody, FormFooter } from "@/components/common";
import type { DialogProps } from "../models";
import toast from "react-hot-toast";

export interface DashboardWidgets {
    locationBin: boolean;
    distributionData: boolean;
    maintenanceTasks: boolean;
    pendingOrders: boolean;
    liveActivityFeed: boolean;
}

interface CustomizeDialogProps extends Omit<DialogProps, 'onSuccess'> {
    widgets: DashboardWidgets;
    onSuccess: (newWidgets: DashboardWidgets) => void;
}

const WIDGET_OPTIONS: { key: keyof DashboardWidgets; label: string; desc: string }[] = [
    { key: 'locationBin', label: 'Location Bin Availability', desc: 'Overview of occupied vs empty warehouse rack bins.' },
    { key: 'distributionData', label: 'Distribution & Operations Summary', desc: 'Real-time intake and dispatch performance metrics.' },
    { key: 'maintenanceTasks', label: 'Maintenance & Incidents Feed', desc: 'Active equipment faults and servicing alerts.' },
    { key: 'pendingOrders', label: 'Pending Customer / Inbound Orders', desc: 'List of queued warehouse shipments needing processing.' },
    { key: 'liveActivityFeed', label: 'Live Audit & Activity Log', desc: 'Stream of operator scans and stock changes.' }
];

export default function CustomizeViewForm({ widgets, onSuccess, onCancel }: CustomizeDialogProps) {

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);

        const newWidgets = WIDGET_OPTIONS.reduce((acc, opt) => {
            acc[opt.key] = data.has(opt.key);
            return acc;
        }, {} as DashboardWidgets);

        const generatePromise = new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });

        toast.promise(
            generatePromise,
            {
                loading: 'Changing the view...',
                success: <b>View has been changed!</b>,
                error: <b>Failed to change view</b>
            },
            { id: 'customize-widgets' }
        ).then(() => {
            onSuccess(newWidgets);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormBody className="space-y-2">
                <p className="text-slate-500 mb-2">
                    Toggle the visibility of widgets on your operational dashboard:
                </p>

                <div className="space-y-1.5">
                    {WIDGET_OPTIONS.map((opt) => (
                        <CheckboxCard
                            key={opt.key}
                            name={opt.key}
                            label={opt.label}
                            description={opt.desc}
                            defaultChecked={widgets[opt.key]}
                        />
                    ))}
                </div>
            </FormBody>

            <FormFooter>
                <Button
                    variant="primary"
                    size="sm"
                    className="text-xs font-semibold"
                    onClick={onCancel}
                >
                    Apply & Done
                </Button>
            </FormFooter>
        </form>
    );
};
