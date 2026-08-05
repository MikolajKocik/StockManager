import React from 'react';
import { Header, Badge, Button, KpiCard } from '@/components/common';
import type { RmaKpiSummary } from '@/models/rma';

export interface ReturnsHeaderProps {
    kpis: RmaKpiSummary;
    onOpenCreateModal: () => void;
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

const RMA_STATUS_TABS = [
    { key: 'ALL', label: 'All Returns' },
    { key: 'PENDING', label: 'Pending Inspection' },
    { key: 'RESTOCKED', label: 'Prime Restocked' },
    { key: 'SERVICED', label: 'In Service / Repair' },
    { key: 'DISPOSED', label: 'Disposed / Scrapped' }
] as const;

export const ReturnsHeader: React.FC<ReturnsHeaderProps> = ({
    kpis,
    onOpenCreateModal,
    activeFilter,
    onFilterChange
}) => {
    const tabCountMap: Record<string, number> = {
        ALL: kpis.totalRmas,
        PENDING: kpis.pendingInspection,
        RESTOCKED: kpis.restockedPrime,
        SERVICED: kpis.routedToService,
        DISPOSED: kpis.disposedScrap
    };

    return (
        <div className="space-y-4 mb-4">
            <Header
                title="Return Merchandise Authorization (RMA)"
                subtitle="Visual Classification Assistant for returns routing: Prime Restock, Technical Service, and Certified Scrap"
                badge={
                    <Badge variant="brand" className="text-xs font-mono">
                        RMA ASSISTANT ENGINE
                    </Badge>
                }
            >
                <div className="flex items-center gap-2">
                    <Button
                        variant="primary"
                        onClick={onOpenCreateModal}
                    >
                        Register Incoming RMA
                    </Button>
                </div>
            </Header>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <KpiCard
                    title="Total RMAs"
                    value={kpis.totalRmas}
                    subtitle="Recorded returns"
                />
                <KpiCard
                    title="Pending Inspection"
                    value={kpis.pendingInspection}
                    subtitle="Awaiting classification"
                    variant={kpis.pendingInspection > 0 ? 'warning' : 'default'}
                />
                <KpiCard
                    title="Prime Restocked"
                    value={kpis.restockedPrime}
                    subtitle="Returned to prime shelf"
                    variant="success"
                />
                <KpiCard
                    title="Routed to Service"
                    value={kpis.routedToService}
                    subtitle="Technical repair"
                    variant="primary"
                />
                <KpiCard
                    title="Certified Scrapped"
                    value={kpis.disposedScrap}
                    subtitle="Disposed & write-offs"
                    variant="danger"
                />
            </div>

            <div className="bg-white border border-slate-300 rounded-lg p-2 shadow-2xs flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                    {RMA_STATUS_TABS.map((tab) => {
                        const isActive = activeFilter === tab.key;
                        const count = tabCountMap[tab.key] ?? 0;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => onFilterChange(tab.key)}
                                className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                                    isActive
                                        ? 'bg-[#2b6675] text-white shadow-2xs'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                    isActive ? 'bg-white/20 text-white' : 'bg-slate-300 text-slate-800'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
