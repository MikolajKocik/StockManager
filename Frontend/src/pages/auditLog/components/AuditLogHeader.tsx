import React from 'react';
import { Header, Badge, KpiCard } from '@/components/common';
import type { AuditKpiSummary } from '@/models/auditLog';

export interface AuditLogHeaderProps {
    kpis: AuditKpiSummary;
}

export const AuditLogHeader: React.FC<AuditLogHeaderProps> = ({ kpis }) => {
    return (
        <div className="space-y-4 mb-4">
            <Header
                title="System Audit Log & Entity Timeline"
                subtitle="Event Sourcing Git-Diff inspector: trace field-by-field mutations, provenance, and historical states"
                badge={
                    <Badge variant="brand">
                        EVENT SOURCING DIFF
                    </Badge>
                }
            />

            {/* KPI Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <KpiCard
                    title="Total Mutations"
                    value={kpis.totalEvents}
                    subtitle="Recorded entity events"
                />
                <KpiCard
                    title="Monitored Entities"
                    value={kpis.uniqueEntities}
                    subtitle="Active catalog items"
                />
                <KpiCard
                    title="Price Changes"
                    value={kpis.priceChanges}
                    subtitle="Rate adjustments"
                    variant="warning"
                />
                <KpiCard
                    title="Location Transfers"
                    value={kpis.locationTransfers}
                    subtitle="Zone reassignments"
                    variant="primary"
                />
                <KpiCard
                    title="Active Auditors"
                    value={kpis.activeAuditors}
                    subtitle="Authorized staff"
                    variant="success"
                />
            </div>
        </div>
    );
};
