import React from 'react';
import type { DockCollision } from '../models/dockScheduler';
import { Badge } from '@/components/common';

interface DockGanttConflictBannerProps {
    collisions: DockCollision[];
    formatHour: (hour: number) => string;
}

export const DockGanttConflictBanner: React.FC<DockGanttConflictBannerProps> = ({
    collisions,
    formatHour
}) => {
    if (collisions.length === 0) return null;

    const firstCollision = collisions[0];

    return (
        <div className="bg-red-50 border-b border-red-300 px-4 py-2.5 flex items-center justify-between text-xs text-red-900">
            <div className="flex items-center gap-2">
                <Badge variant="danger">
                    COLLISION DETECTED ({collisions.length})
                </Badge>
                <span className="font-semibold">
                    Ramp conflict: {firstCollision.shipmentA.shipmentNumber} overlaps with {firstCollision.shipmentB.shipmentNumber} ({formatHour(firstCollision.overlapStartHour)} - {formatHour(firstCollision.overlapEndHour)}).
                </span>
            </div>
            <span className="text-[11px] text-red-700 font-medium hidden sm:inline">
                Drag block to an empty time window or different ramp to resolve.
            </span>
        </div>
    );
};
