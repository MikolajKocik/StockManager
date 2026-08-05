import React from 'react';
import { TimelineNode, Badge } from '@/components/common';
import type { AuditLogEvent, AuditEventType } from '@/models/auditLog';

export interface AuditTimelineProps {
    events: AuditLogEvent[];
    selectedEventId: string | null;
    onSelectEvent: (event: AuditLogEvent) => void;
    className?: string;
}

const ACTION_BADGE_MAP: Record<AuditEventType, 'brand' | 'blue' | 'purple' | 'amber' | 'emerald' | 'rose'> = {
    CREATE: 'emerald',
    UPDATE: 'brand',
    PRICE_CHANGE: 'amber',
    LOCATION_TRANSFER: 'blue',
    STOCK_ADJUSTMENT: 'purple',
    STATUS_CHANGE: 'amber',
    QUALITY_HOLD: 'rose',
    SPEC_UPDATE: 'brand'
};

export const AuditTimeline: React.FC<AuditTimelineProps> = ({
    events,
    selectedEventId,
    onSelectEvent,
    className = ''
}) => {
    if (events.length === 0) {
        return (
            <div className="p-8 text-center border border-dashed border-slate-300 rounded-lg bg-slate-50 font-mono text-xs text-slate-500">
                No audit events recorded for the selected entity filter.
            </div>
        );
    }

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-xs font-bold uppercase font-mono tracking-wider text-slate-700">
                    Operation Event Stream ({events.length})
                </span>
                <span className="text-xs font-mono text-slate-500">
                    Chronological Order
                </span>
            </div>

            <div className="space-y-2.5">
                {events.map((evt, idx) => {
                    const isSelected = selectedEventId === evt.id;
                    const isLast = idx === events.length - 1;
                    const badgeVariant = ACTION_BADGE_MAP[evt.action] || 'brand';

                    return (
                        <TimelineNode
                            key={evt.id}
                            id={evt.id}
                            title={evt.actionLabel.replace(/_/g, ' ')}
                            subtitle={evt.summary}
                            timestamp={evt.timestamp}
                            authorName={evt.user.name}
                            authorRole={evt.user.role}
                            actionBadgeText={evt.action}
                            actionBadgeVariant={badgeVariant}
                            hash={evt.commitHash}
                            isSelected={isSelected}
                            isLast={isLast}
                            onClick={() => onSelectEvent(evt)}
                        >
                            <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1 border-t border-slate-100">
                                <span>Entity: <strong className="text-slate-700">{evt.entityName}</strong></span>
                                <Badge variant="slate" className="text-xs font-mono">
                                    {evt.diffFields.length} field diff{evt.diffFields.length !== 1 ? 's' : ''}
                                </Badge>
                            </div>
                        </TimelineNode>
                    );
                })}
            </div>
        </div>
    );
};
