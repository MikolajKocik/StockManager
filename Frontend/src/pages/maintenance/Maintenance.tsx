import { useFleetManager } from './hooks/useFleetManager';
import { FleetKpiSummary } from './components/FleetKpiSummary';
import { FleetZoneContainer } from './components/FleetZoneContainer';
import { MachineInspectorPanel } from './components/MachineInspectorPanel';
import { ReportIncidentModal } from './components/ReportIncidentModal';
import { Button } from '@/components/common/core';

export default function Maintenance() {
    const {
        machines,
        selectedMachine,
        selectedMachineId,
        draggedMachineId,
        dragOverZone,
        kpis,
        incidents,
        machinesByZone,
        filterQuery,
        isReportModalOpen,
        setFilterQuery,
        setIsReportModalOpen,
        setSelectedMachineId,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleDragEnd,
        updateMachineStatus,
        reportIncident,
        resolveIncident
    } = useFleetManager();

    // Active (open) incidents
    const openIncidents = incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed');

    return (
        <div className="w-full flex flex-col gap-4 pb-8">
            {/* Top KPI Bar and Controls */}
            <FleetKpiSummary
                kpis={kpis}
                filterQuery={filterQuery}
                onFilterChange={setFilterQuery}
                onOpenReportModal={() => setIsReportModalOpen(true)}
            />

            {/* Active Incidents Banner (if any) */}
            {openIncidents.length > 0 && (
                <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div>
                        <h4 className="text-xs font-bold text-amber-900 uppercase font-mono tracking-wider">
                            Active Maintenance Incidents ({openIncidents.length})
                        </h4>
                        <p className="text-xs text-amber-900 mt-0.5">
                            {openIncidents[0].title} – <span className="font-semibold">{openIncidents[0].assetName}</span> ({openIncidents[0].priority} priority)
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resolveIncident(openIncidents[0].id, 'Confirmed and resolved by fleet dispatcher')}
                    >
                        Resolve ticket #{openIncidents[0].id}
                    </Button>
                </div>
            )}

            {/* Main Interactive Grid: Inspector (Left) + 3 Drop Zones (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Left Column: Live Machine Telemetry & Inspector */}
                <div className="lg:col-span-4 xl:col-span-4 order-2 lg:order-1">
                    <MachineInspectorPanel
                        machine={selectedMachine}
                        onUpdateStatus={updateMachineStatus}
                        onOpenReportModal={() => setIsReportModalOpen(true)}
                    />
                </div>

                {/* Right Column: 3 Work Zones with Drag and Drop */}
                <div className="lg:col-span-8 xl:col-span-8 order-1 lg:order-2">
                    <FleetZoneContainer
                        machinesByZone={machinesByZone}
                        selectedMachineId={selectedMachineId}
                        draggedMachineId={draggedMachineId}
                        dragOverZone={dragOverZone}
                        onSelectMachine={setSelectedMachineId}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                    />
                </div>
            </div>

            {/* Modal for reporting breakdown */}
            <ReportIncidentModal
                isOpen={isReportModalOpen}
                machines={machines}
                defaultAssetId={selectedMachineId}
                onClose={() => setIsReportModalOpen(false)}
                onSubmit={reportIncident}
            />
        </div>
    );
}
