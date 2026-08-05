import React, { useState, useEffect, useMemo } from 'react';
import {
    Select,
    Input,
    Badge
} from '@/components/common';
import type { AuditLogEvent, AuditKpiSummary, AuditEventType } from '@/models/auditLog';
import { mockProduct } from '@/mocks/product.mocks';
import { auditLogApi } from '@/api/internal/auditLogApi';
import { AuditLogHeader } from './components/AuditLogHeader';
import { AuditTimeline } from './components/AuditTimeline';
import { GitDiffInspector } from './components/GitDiffInspector';
import { RollbackModal } from './components/RollbackModal';

export const AuditLog: React.FC = () => {
    const [events, setEvents] = useState<AuditLogEvent[]>([]);
    const [kpis, setKpis] = useState<AuditKpiSummary>({
        totalEvents: 0,
        uniqueEntities: 0,
        priceChanges: 0,
        locationTransfers: 0,
        activeAuditors: 0
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [selectedEntityId, setSelectedEntityId] = useState<string>('ALL');
    const [selectedAction, setSelectedAction] = useState<AuditEventType | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [selectedEvent, setSelectedEvent] = useState<AuditLogEvent | null>(null);

    const [rollbackEvent, setRollbackEvent] = useState<AuditLogEvent | null>(null);

    const loadAuditData = async () => {
        setIsLoading(true);
        try {
            const [evts, kpiData] = await Promise.all([
                auditLogApi.getEvents(),
                auditLogApi.getKpis()
            ]);
            setEvents(evts);
            setKpis(kpiData);
            if (evts.length > 0 && !selectedEvent) {
                setSelectedEvent(evts[0]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAuditData();
    }, []);

    // Filtered events
    const filteredEvents = useMemo(() => {
        return events.filter(evt => {
            if (selectedEntityId !== 'ALL' && String(evt.entityId) !== selectedEntityId) {
                return false;
            }
            if (selectedAction !== 'ALL' && evt.action !== selectedAction) {
                return false;
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchName = evt.entityName.toLowerCase().includes(q);
                const matchUser = evt.user.name.toLowerCase().includes(q);
                const matchHash = evt.commitHash.toLowerCase().includes(q);
                const matchSummary = evt.summary.toLowerCase().includes(q);
                return matchName || matchUser || matchHash || matchSummary;
            }
            return true;
        });
    }, [events, selectedEntityId, selectedAction, searchQuery]);

    // Keep selected event valid when filter changes
    useEffect(() => {
        if (filteredEvents.length > 0) {
            const isCurrentInFiltered = filteredEvents.some(e => e.id === selectedEvent?.id);
            if (!isCurrentInFiltered) {
                setSelectedEvent(filteredEvents[0]);
            }
        } else {
            setSelectedEvent(null);
        }
    }, [filteredEvents, selectedEvent]);

    // Entity selector options
    const entityOptions = [
        { value: 'ALL', label: 'All Catalog Entities & Products' },
        ...mockProduct.map(p => ({
            value: String(p.id),
            label: `Product: ${p.name} (${p.batchNumber}) - ${p.genre}`
        }))
    ];

    return (
        <div className="space-y-4">
            {/* Header & KPI Summary */}
            <AuditLogHeader kpis={kpis} />

            {/* Entity Picker & Filter Toolbar */}
            <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs uppercase tracking-wider text-slate-800">
                        Event Sourcing Entity Inspector
                    </span>
                    <Badge variant="brand" className="text-[0.625rem]">
                        Target Filter Active
                    </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Entity / Product Selector */}
                    <div>
                        <Select
                            label="Target Product / Entity"
                            value={selectedEntityId}
                            onChange={(e) => setSelectedEntityId(e.target.value)}
                            options={entityOptions}
                        />
                    </div>

                    {/* Action Filter */}
                    <div>
                        <Select
                            label="Operation Action Type"
                            value={selectedAction}
                            onChange={(e) => setSelectedAction(e.target.value as AuditEventType | 'ALL')}
                            options={[
                                { value: 'ALL', label: 'All Action Types' },
                                { value: 'LOCATION_TRANSFER', label: 'Storage Zone / Location Transfers' },
                                { value: 'PRICE_CHANGE', label: 'Price & Cost Indexations' },
                                { value: 'QUALITY_HOLD', label: 'HACCP & Quality Quarantines' },
                                { value: 'STOCK_ADJUSTMENT', label: 'Cycle Count Stock Adjustments' },
                                { value: 'CREATE', label: 'Entity Initializations' },
                                { value: 'UPDATE', label: 'General Spec Updates' }
                            ]}
                        />
                    </div>

                    {/* Search query */}
                    <div>
                        <Input
                            label="Filter Text / Commit Hash / Auditor"
                            placeholder="Search by auditor, hash (#8b4d12f), etc..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Main Side-by-Side Workspace: Timeline (Left) + Live Git Diff Inspector (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Left Column: Timeline */}
                <div className="lg:col-span-5 space-y-4">
                    {isLoading ? (
                        <div className="p-8 text-center border border-slate-200 rounded-lg bg-white font-mono text-xs text-slate-500">
                            Loading operation timeline stream...
                        </div>
                    ) : (
                        <AuditTimeline
                            events={filteredEvents}
                            selectedEventId={selectedEvent?.id || null}
                            onSelectEvent={(evt) => setSelectedEvent(evt)}
                        />
                    )}
                </div>

                {/* Right Column: Live Git Diff Inspector */}
                <div className="lg:col-span-7 sticky top-4">
                    <GitDiffInspector
                        event={selectedEvent}
                        onRollbackClick={(evt) => setRollbackEvent(evt)}
                    />
                </div>
            </div>

            {/* Rollback Simulation Modal */}
            {rollbackEvent && (
                <RollbackModal
                    event={rollbackEvent}
                    isOpen={!!rollbackEvent}
                    onClose={() => setRollbackEvent(null)}
                    onRollbackComplete={loadAuditData}
                />
            )}
        </div>
    );
};

export default AuditLog;
