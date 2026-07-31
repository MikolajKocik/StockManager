import { Button } from '@/components/common';

export interface DashboardWidgets {
    locationBin: boolean;
    distributionData: boolean;
    maintenanceTasks: boolean;
    pendingOrders: boolean;
    liveActivityFeed: boolean;
}

interface CustomizeViewFormProps {
    widgets: DashboardWidgets;
    onChange: (key: keyof DashboardWidgets) => void;
    onClose: () => void;
}

export default function CustomizeViewForm({ widgets, onChange, onClose }: CustomizeViewFormProps) {
    const options: { key: keyof DashboardWidgets; label: string }[] = [
        { key: 'locationBin', label: 'Location bin availability' },
        { key: 'distributionData', label: 'Distribution data' },
        { key: 'maintenanceTasks', label: 'Maintenance Tasks' },
        { key: 'pendingOrders', label: 'Pending Orders' },
        { key: 'liveActivityFeed', label: 'Live Activity Feed' }
    ];

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Customize View</h2>
            <p className="text-sm text-gray-600 mb-2">Select which widgets you want to see on your dashboard.</p>

            <div className="flex flex-col gap-3">
                {options.map((opt) => (
                    <label key={opt.key} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-md transition-colors">
                        <input
                            type="checkbox"
                            className="w-5 h-5 cursor-pointer accent-blue-600"
                            checked={widgets[opt.key]}
                            onChange={() => onChange(opt.key)}
                        />
                        <span className="text-gray-700 font-medium">{opt.label}</span>
                    </label>
                ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-2">
                <Button
                    variant="primary"
                    className="p-1"
                    onClick={onClose}
                >
                    Done
                </Button>
            </div>
        </div>
    );
}
