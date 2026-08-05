import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auditLogApi } from '@/api/internal/auditLogApi';
import type { AuditLogEvent, AuditKpiSummary, AuditEventType } from '@/models/auditLog';
import toast from 'react-hot-toast';

export function useAuditLogManager() {
    const queryClient = useQueryClient();

    const { 
        data: events = [], 
        isLoading: isEventsLoading, 
        isError: isEventsError, 
        refetch: refetchEvents 
    } = useQuery<AuditLogEvent[]>({
        queryKey: ['audit-log'],
        queryFn: () => auditLogApi.getEvents()
    });

    const { 
        data: kpis = {
            totalEvents: 0,
            uniqueEntities: 0,
            priceChanges: 0,
            locationTransfers: 0,
            activeAuditors: 0
        },
        isLoading: isKpisLoading
    } = useQuery<AuditKpiSummary>({
        queryKey: ['audit-log', 'kpis'],
        queryFn: auditLogApi.getKpis
    });

    const [selectedEntityId, setSelectedEntityId] = useState<string>('ALL');
    const [selectedAction, setSelectedAction] = useState<AuditEventType | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [rollbackEvent, setRollbackEvent] = useState<AuditLogEvent | null>(null);

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

    const selectedEvent = useMemo(() => {
        if (filteredEvents.length === 0) return null;
        if (!selectedEventId) return filteredEvents[0];
        return filteredEvents.find(e => e.id === selectedEventId) ?? filteredEvents[0];
    }, [filteredEvents, selectedEventId]);

    const rollbackMutation = useMutation({
        mutationFn: (eventId: string) => auditLogApi.simulateRollback(eventId),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['audit-log'] });
            queryClient.invalidateQueries({ queryKey: ['audit-log', 'kpis'] });
            toast.success(res.message);
            setRollbackEvent(null);
        },
        onError: () => {
            toast.error('Failed to simulate rollback.');
        }
    });

    const handleRollback = useCallback((eventId: string) => {
        return rollbackMutation.mutateAsync(eventId);
    }, [rollbackMutation]);

    return {
        events,
        filteredEvents,
        kpis,
        isLoading: isEventsLoading || isKpisLoading,
        isError: isEventsError,
        refetchEvents,
        selectedEntityId,
        setSelectedEntityId,
        selectedAction,
        setSelectedAction,
        searchQuery,
        setSearchQuery,
        selectedEvent,
        setSelectedEvent: (event: AuditLogEvent | null) => setSelectedEventId(event?.id ?? null),
        rollbackEvent,
        setRollbackEvent,
        handleRollback,
        isRollingBack: rollbackMutation.isPending
    };
}
