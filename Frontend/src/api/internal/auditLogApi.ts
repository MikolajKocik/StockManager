import api from '../config/api';
import { USE_MOCKS } from '../config/mock';
import { MOCK_AUDIT_LOG_EVENTS } from '@/mocks/auditLog.mocks';
import type { AuditLogEvent, AuditKpiSummary, AuditEventType } from '@/models/auditLog';

let localAuditEvents: AuditLogEvent[] = [...MOCK_AUDIT_LOG_EVENTS];

export const auditLogApi = {
    /**
     * Retrieves audit events with optional filtering.
     */
    getEvents: async (filters?: {
        entityId?: number | string;
        entityType?: string;
        action?: AuditEventType | 'ALL';
        searchQuery?: string;
    }): Promise<AuditLogEvent[]> => {
        if (USE_MOCKS) {
            return localAuditEvents.filter(evt => {
                if (filters?.entityId && String(evt.entityId) !== String(filters.entityId)) {
                    return false;
                }
                if (filters?.entityType && filters.entityType !== 'ALL' && evt.entityType !== filters.entityType) {
                    return false;
                }
                if (filters?.action && filters.action !== 'ALL' && evt.action !== filters.action) {
                    return false;
                }
                if (filters?.searchQuery && filters.searchQuery.trim()) {
                    const q = filters.searchQuery.toLowerCase();
                    const matchName = evt.entityName.toLowerCase().includes(q);
                    const matchUser = evt.user.name.toLowerCase().includes(q);
                    const matchHash = evt.commitHash.toLowerCase().includes(q);
                    const matchSummary = evt.summary.toLowerCase().includes(q);
                    return matchName || matchUser || matchHash || matchSummary;
                }
                return true;
            });
        }

        try {
            const res = await api.get('/audit-log', { params: filters });
            return res.data;
        } catch {
            return [...localAuditEvents];
        }
    },

    /**
     * Retrieves the complete Event Sourcing timeline for a selected entity.
     */
    getEntityTimeline: async (entityType: string, entityId: number | string): Promise<AuditLogEvent[]> => {
        if (USE_MOCKS) {
            return localAuditEvents.filter(
                e => e.entityType === entityType && String(e.entityId) === String(entityId)
            );
        }

        try {
            const res = await api.get(`/audit-log/entity/${entityType}/${entityId}`);
            return res.data;
        } catch {
            return localAuditEvents.filter(
                e => e.entityType === entityType && String(e.entityId) === String(entityId)
            );
        }
    },

    /**
     * Retrieves a single event by event ID or commit hash.
     */
    getEventById: async (eventId: string): Promise<AuditLogEvent | null> => {
        if (USE_MOCKS) {
            const found = localAuditEvents.find(e => e.id === eventId || e.eventId === eventId || e.commitHash === eventId);
            return found ? { ...found } : null;
        }

        try {
            const res = await api.get(`/audit-log/${eventId}`);
            return res.data;
        } catch {
            const found = localAuditEvents.find(e => e.id === eventId || e.eventId === eventId || e.commitHash === eventId);
            return found ? { ...found } : null;
        }
    },

    /**
     * Simulates rolling back an entity state to a specific historical commit snapshot.
     */
    simulateRollback: async (eventId: string): Promise<{ success: boolean; message: string; restoredState: Record<string, any> }> => {
        const event = localAuditEvents.find(e => e.id === eventId || e.commitHash === eventId);
        if (!event) {
            throw new Error(`Audit event ${eventId} not found`);
        }

        return {
            success: true,
            message: `Simulated rollback of ${event.entityName} to state prior to commit #${event.commitHash}`,
            restoredState: event.previousStateSnapshot
        };
    },

    /**
     * Calculates KPI statistics for system logs.
     */
    getKpis: async (): Promise<AuditKpiSummary> => {
        const uniqueEntities = new Set(localAuditEvents.map(e => `${e.entityType}-${e.entityId}`)).size;
        const uniqueUsers = new Set(localAuditEvents.map(e => e.user.id)).size;

        return {
            totalEvents: localAuditEvents.length,
            uniqueEntities,
            priceChanges: localAuditEvents.filter(e => e.action === 'PRICE_CHANGE').length,
            locationTransfers: localAuditEvents.filter(e => e.action === 'LOCATION_TRANSFER').length,
            activeAuditors: uniqueUsers
        };
    }
};
