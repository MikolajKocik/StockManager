import React from 'react';
import { Header, Button, Input } from '@/components/common/core';
import { KpiCard } from '@/components/common/custom';

interface FleetKpiSummaryProps {
    kpis: {
        total: number;
        operational: number;
        charging: number;
        maintenance: number;
        critical: number;
        avgBattery: number;
        readinessRate: number;
        activeIncidentsCount: number;
    };
    filterQuery: string;
    onFilterChange: (query: string) => void;
    onOpenReportModal: () => void;
}

export const FleetKpiSummary: React.FC<FleetKpiSummaryProps> = ({
    kpis,
    filterQuery,
    onFilterChange,
    onOpenReportModal
}) => {
    const actions = (
        <div className="flex items-center gap-2">
            <div className="w-64">
                <Input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => onFilterChange(e.target.value)}
                    placeholder="Search machine, code, operator..."
                />
            </div>
            <Button
                variant="primary"
                size="md"
                onClick={onOpenReportModal}
            >
                Report Fault / Service
            </Button>
        </div>
    );

    return (
        <div className="space-y-3">
            <Header
                title="Maintenance Center & Fleet Management"
                subtitle="Visual machinery tracking, live battery telemetry, and workspace dispatch zones"
                actions={actions}
            />

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <KpiCard
                    title="Total Fleet"
                    value={`${kpis.total} units`}
                    variant="default"
                />
                <KpiCard
                    title="Operational"
                    value={`${kpis.operational} units`}
                    subtitle={`${kpis.total > 0 ? Math.round((kpis.operational / kpis.total) * 100) : 0}% ready`}
                    variant="success"
                />
                <KpiCard
                    title="Charging"
                    value={`${kpis.charging} units`}
                    subtitle="Fast-charging"
                    variant="primary"
                />
                <KpiCard
                    title="Faults / Outages"
                    value={`${kpis.critical} units`}
                    subtitle={kpis.critical > 0 ? 'Requires Action' : 'Optimal'}
                    variant={kpis.critical > 0 ? 'danger' : 'success'}
                />
                <KpiCard
                    title="Fleet Avg Battery"
                    value={`${kpis.avgBattery}%`}
                    subtitle="24V/48V pack"
                    variant={kpis.avgBattery > 50 ? 'success' : 'warning'}
                />
                <KpiCard
                    title="Availability (OEE)"
                    value={`${kpis.readinessRate}%`}
                    subtitle="Fleet uptime"
                    variant="success"
                />
            </div>
        </div>
    );
};
