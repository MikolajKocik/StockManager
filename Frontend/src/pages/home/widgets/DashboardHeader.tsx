import { useRef } from 'react';
import toast from 'react-hot-toast';
import { Button, Modal } from '@/components/common';
import ReportIncidentForm from '../components/ReportIncidentForm';
import CustomizeViewForm, { type DashboardWidgets } from '../components/CustomizeViewForm';
import GenerateReportForm from '../components/GenerateReportForm';
import { useInventoryItems } from '@/pages/inventoryItems/hooks/useInventoryItems';
import { useDistributionData } from '@/hooks/queries/useStatistics';
import { useSalesOrders } from '@/hooks/queries/useSalesOrders';
import { usePurchaseOrders } from '@/hooks/queries/usePurchaseOrders';
import { useMaintenanceIncidents } from '@/pages/maintenance/hooks/useMaintenanceIncidents';

interface DashboardHeaderProps {
    widgets: DashboardWidgets;
    onUpdateWidgets: (newWidgets: DashboardWidgets) => void;
}

export function DashboardHeader({ widgets, onUpdateWidgets }: DashboardHeaderProps) {
    const reportRef = useRef<HTMLDialogElement>(null);
    const customizeRef = useRef<HTMLDialogElement>(null);
    const incidentRef = useRef<HTMLDialogElement>(null);

    const { refetch: refetchItems, isFetching: isFetchingItems } = useInventoryItems();
    const { refetch: refetchStatistics, isFetching: isFetchingStatistics } = useDistributionData();
    const { refetch: refetchSalesOrders, isFetching: isFetchingSalesOrders } = useSalesOrders();
    const { refetch: refetchPurchaseOrders, isFetching: isFetchingPurchaseOrders } = usePurchaseOrders();
    const { refetch: refetchIncidents, isFetching: isFetchingIncidents } = useMaintenanceIncidents();

    const isFetchingAny =
        isFetchingItems ||
        isFetchingStatistics ||
        isFetchingSalesOrders ||
        isFetchingPurchaseOrders ||
        isFetchingIncidents;

    const handleRefresh = () => {
        const refreshPromise = Promise.all([
            refetchItems(),
            refetchIncidents(),
            refetchPurchaseOrders(),
            refetchSalesOrders(),
            refetchStatistics()
        ]);

        toast.promise(
            refreshPromise,
            {
                loading: 'Refreshing...',
                success: <b>Refreshed!</b>,
                error: <b>Failed to refresh</b>
            },
            { id: 'refetch-toast' }
        );
    };

    return (
        <div className="col-span-6">
            <div className="flex flex-row-reverse items-center gap-2 mb-2">
                <Button
                    variant="danger"
                    size="md"
                    onClick={() => incidentRef.current?.showModal()}
                >
                    Report Incident
                </Button>
                <Button
                    variant="warning"
                    size="md"
                    onClick={() => customizeRef.current?.showModal()}
                >
                    Customize View
                </Button>
                <Button
                    variant="success"
                    size="md"
                    onClick={() => reportRef.current?.showModal()}
                >
                    Generate Report
                </Button>
                <Button
                    variant="secondary"
                    size="md"
                    onClick={handleRefresh}
                    disabled={isFetchingAny}
                >
                    Refresh
                </Button>
            </div>

            <Modal ref={incidentRef} title="Report Incident">
                <ReportIncidentForm
                    onSuccess={() => incidentRef.current?.close()}
                    onCancel={() => incidentRef.current?.close()}
                />
            </Modal>

            <Modal ref={customizeRef} title="Customize Widgets">
                <CustomizeViewForm
                    widgets={widgets}
                    onSuccess={(newWidgets) => {
                        onUpdateWidgets(newWidgets);
                        customizeRef.current?.close();
                    }}
                    onCancel={() => customizeRef.current?.close()}
                />
            </Modal>

            <Modal ref={reportRef} title="Generate Report">
                <GenerateReportForm
                    onSuccess={() => reportRef.current?.close()}
                    onCancel={() => reportRef.current?.close()}
                />
            </Modal>
        </div>
    );
}
