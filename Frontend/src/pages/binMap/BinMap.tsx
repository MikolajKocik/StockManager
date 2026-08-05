import { useBinMap } from './hooks/useBinMap';
import { BinMapToolbar } from './components/BinMapToolbar';
import { BinMapCanvas } from './components/BinMapCanvas';
import { BinMapDetails } from './components/BinMapDetails';

export default function BinMap() {
    const {
        zones,
        filteredZones,
        selectedZone,
        stats,
        isLoading,
        isFetching,
        isDispatching,
        isUpdatingMaintenance,
        selectedZoneId,
        hoveredZoneId,
        selectedSector,
        searchTerm,
        setSelectedZoneId,
        setHoveredZoneId,
        setSelectedSector,
        setSearchTerm,
        handleResetFilter,
        handleDispatch,
        handleToggleMaintenance,
        refetch
    } = useBinMap();

    return (
        <main className="w-full flex flex-col gap-3">
            <BinMapToolbar
                selectedSector={selectedSector}
                searchTerm={searchTerm}
                stats={stats}
                isFetching={isFetching}
                onSectorChange={setSelectedSector}
                onSearchChange={setSearchTerm}
                onResetFilters={handleResetFilter}
                onRefresh={() => refetch()}
            />

            <section className="grid grid-cols-1 xl:grid-cols-[1fr_21rem] gap-3 items-start">
                <BinMapCanvas
                    zones={zones}
                    filteredZones={filteredZones}
                    selectedZoneId={selectedZoneId}
                    hoveredZoneId={hoveredZoneId}
                    isLoading={isLoading}
                    onSelectZone={setSelectedZoneId}
                    onHoverZone={setHoveredZoneId}
                />

                <BinMapDetails
                    selectedZone={selectedZone}
                    isDispatching={isDispatching}
                    isUpdatingMaintenance={isUpdatingMaintenance}
                    onDispatch={handleDispatch}
                    onToggleMaintenance={handleToggleMaintenance}
                />
            </section>
        </main>
    );
}