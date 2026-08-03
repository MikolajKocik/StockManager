import { useState } from 'react';
import { LiveActivityFeed } from '@/components/LiveActivityFeed';
import { type DashboardWidgets } from './components/CustomizeViewForm';
import {
    DashboardHeader,
    DistributionDataWidget,
    LocationBinWidget,
    MaintenanceTasksWidget,
    PendingOrdersWidget
} from './widgets';

export default function Home() {
    const [widgets, setWidgets] = useState<DashboardWidgets>({
        locationBin: true,
        distributionData: true,
        maintenanceTasks: true,
        pendingOrders: true,
        liveActivityFeed: true
    });

    return (
        <div className="h-full grid grid-cols-6 grid-rows-[auto_1fr_1fr] gap-4">
            <DashboardHeader widgets={widgets} onUpdateWidgets={setWidgets} />

            {widgets.locationBin && <LocationBinWidget />}
            {widgets.distributionData && <DistributionDataWidget />}
            {widgets.maintenanceTasks && <MaintenanceTasksWidget />}
            {widgets.pendingOrders && <PendingOrdersWidget />}

            {widgets.liveActivityFeed && (
                <div className="col-span-2 card">
                    <LiveActivityFeed />
                </div>
            )}
        </div>
    );
}
