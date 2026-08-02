import { Button } from '@/components/common';

export interface DashboardWidgets {
    locationBin: boolean;
    distributionData: boolean;
    maintenanceTasks: boolean;
    pendingOrders: boolean;
    liveActivityFeed: boolean;
}

interface CustomizeViewFormProps {
    isOpen?: boolean;
    widgets: DashboardWidgets;
    onChange: (key: keyof DashboardWidgets) => void;
    onClose: () => void;
}

export default function CustomizeViewForm({
    isOpen = true,
    widgets,
    onChange,
    onClose
}: CustomizeViewFormProps) {
    if (!isOpen) return null;

    const options: { key: keyof DashboardWidgets; label: string; desc: string }[] = [
        { key: 'locationBin', label: 'Location Bin Availability', desc: 'Overview of occupied vs empty warehouse rack bins.' },
        { key: 'distributionData', label: 'Distribution & Operations Summary', desc: 'Real-time intake and dispatch performance metrics.' },
        { key: 'maintenanceTasks', label: 'Maintenance & Incidents Feed', desc: 'Active equipment faults and servicing alerts.' },
        { key: 'pendingOrders', label: 'Pending Customer / Inbound Orders', desc: 'List of queued warehouse shipments needing processing.' },
        { key: 'liveActivityFeed', label: 'Live Audit & Activity Log', desc: 'Stream of operator scans and stock changes.' }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white border border-slate-300 rounded-lg shadow-2xl max-w-md w-full overflow-hidden text-slate-800 animate-scale-in">
                {/* Header */}
                <div className="bg-[#384155] text-white px-4 py-3 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">
                        Customize Dashboard Widgets
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-300 hover:text-white text-lg leading-none p-1 cursor-pointer"
                    >
                        &#10005;
                    </button>
                </div>

                <div className="p-4 space-y-2 text-xs">
                    <p className="text-slate-500 mb-2">
                        Toggle the visibility of widgets on your operational dashboard:
                    </p>

                    <div className="space-y-1.5">
                        {options.map((opt) => (
                            <label
                                key={opt.key}
                                className={`flex items-start gap-3 p-2.5 rounded border transition-colors cursor-pointer ${
                                    widgets[opt.key]
                                        ? 'bg-slate-50 border-slate-300'
                                        : 'bg-white border-slate-200 opacity-60 hover:opacity-100'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 mt-0.5 cursor-pointer accent-slate-800"
                                    checked={widgets[opt.key]}
                                    onChange={() => onChange(opt.key)}
                                />
                                <div>
                                    <span className="font-semibold text-slate-800 block text-xs">
                                        {opt.label}
                                    </span>
                                    <span className="text-[11px] text-slate-500 block">
                                        {opt.desc}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-3 bg-slate-50 border-t border-slate-200">
                    <Button
                        variant="primary"
                        size="sm"
                        className="text-xs font-semibold"
                        onClick={onClose}
                    >
                        Apply & Done
                    </Button>
                </div>
            </div>
        </div>
    );
}
