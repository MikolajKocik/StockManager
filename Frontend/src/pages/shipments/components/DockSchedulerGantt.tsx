import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { DockRamp, DockShipment, DockCollision } from '../models/dockScheduler';
import { Badge } from '@/components/common';
import { DockGanttConflictBanner } from './DockGanttConflictBanner';
import { DockGanttBlock } from './DockGanttBlock';
import { DockGanttLegend } from './DockGanttLegend';

interface DockSchedulerGanttProps {
    ramps: DockRamp[];
    shipments: DockShipment[];
    onUpdateShipment: (id: string, updates: Partial<DockShipment>) => void;
    onSelectShipment: (shipment: DockShipment) => void;
    selectedShipmentId?: string | null;
}

const TIMELINE_START_HOUR = 6;  // 06:00
const TIMELINE_END_HOUR = 22;    // 22:00
const TOTAL_HOURS = TIMELINE_END_HOUR - TIMELINE_START_HOUR; // 16 hours
const CURRENT_SIMULATED_HOUR = 14.5; // 14:30

export const DockSchedulerGantt: React.FC<DockSchedulerGanttProps> = ({
    ramps,
    shipments,
    onUpdateShipment,
    onSelectShipment,
    selectedShipmentId
}) => {
    const timelineRef = useRef<HTMLDivElement>(null);
    const [draggingShipmentId, setDraggingShipmentId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState<{ startX: number; originalStartHour: number; originalRampIndex: number }>({
        startX: 0,
        originalStartHour: 0,
        originalRampIndex: 0
    });

    const [tempStartHour, setTempStartHour] = useState<number | null>(null);
    const [tempRampId, setTempRampId] = useState<string | null>(null);

    {/* Collision Detection Algorithm */ }
    const collisions = useMemo<DockCollision[]>(() => {
        const detected: DockCollision[] = [];
        for (let i = 0; i < shipments.length; i++) {
            for (let j = i + 1; j < shipments.length; j++) {
                const s1 = shipments[i];
                const s2 = shipments[j];

                if (s1.rampId === s2.rampId && s1.status !== 'CANCELLED' && s2.status !== 'CANCELLED') {
                    const start1 = s1.startHour;
                    const end1 = s1.startHour + s1.durationHours;
                    const start2 = s2.startHour;
                    const end2 = s2.startHour + s2.durationHours;

                    if (start1 < end2 && end1 > start2) {
                        detected.push({
                            rampId: s1.rampId,
                            shipmentA: s1,
                            shipmentB: s2,
                            overlapStartHour: Math.max(start1, start2),
                            overlapEndHour: Math.min(end1, end2)
                        });
                    }
                }
            }
        }
        return detected;
    }, [shipments]);

    const isShipmentInCollision = useCallback((shipmentId: string) => {
        return collisions.some(c => c.shipmentA.id === shipmentId || c.shipmentB.id === shipmentId);
    }, [collisions]);

    const formatHour = (hourDecimal: number) => {
        const h = Math.floor(hourDecimal);
        const m = Math.round((hourDecimal - h) * 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    {/* Mouse Drag Handlers */ }
    const handleMouseDown = (e: React.MouseEvent, shipment: DockShipment, rampIndex: number) => {
        e.stopPropagation();
        setDraggingShipmentId(shipment.id);
        setTempStartHour(shipment.startHour);
        setTempRampId(shipment.rampId);
        setDragOffset({
            startX: e.clientX,
            originalStartHour: shipment.startHour,
            originalRampIndex: rampIndex
        });
    };

    useEffect(() => {
        if (!draggingShipmentId) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!timelineRef.current) return;
            const rect = timelineRef.current.getBoundingClientRect();
            const width = rect.width;
            if (width <= 0) return;

            const deltaX = e.clientX - dragOffset.startX;
            const hoursDelta = (deltaX / width) * TOTAL_HOURS;

            // Snap to 15-minute intervals (0.25 hour)
            const rawNewHour = dragOffset.originalStartHour + hoursDelta;
            const activeShipment = shipments.find(s => s.id === draggingShipmentId);
            const duration = activeShipment ? activeShipment.durationHours : 1.5;

            const clampedStartHour = Math.max(
                TIMELINE_START_HOUR,
                Math.min(TIMELINE_END_HOUR - duration, Math.round(rawNewHour * 4) / 4)
            );
            setTempStartHour(clampedStartHour);

            // Calculate Target Ramp (Vertical)
            const clientY = e.clientY;
            const rowHeight = rect.height / ramps.length;
            const relativeY = clientY - rect.top;
            const targetRampIndex = Math.max(0, Math.min(ramps.length - 1, Math.floor(relativeY / rowHeight)));
            setTempRampId(ramps[targetRampIndex].id);
        };

        const handleMouseUp = () => {
            if (draggingShipmentId && tempStartHour !== null && tempRampId !== null) {
                onUpdateShipment(draggingShipmentId, {
                    startHour: tempStartHour,
                    rampId: tempRampId
                });
            }
            setDraggingShipmentId(null);
            setTempStartHour(null);
            setTempRampId(null);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingShipmentId, dragOffset, ramps, shipments, tempStartHour, tempRampId, onUpdateShipment]);

    {/* Hours header array */ }
    const timelineHours: number[] = [];
    for (let h = TIMELINE_START_HOUR; h <= TIMELINE_END_HOUR; h++) {
        timelineHours.push(h);
    }

    return (
        <div className="w-full bg-white border border-slate-300 rounded-lg shadow-2xs overflow-hidden flex flex-col">
            {/* Conflict Notification Banner */}
            <DockGanttConflictBanner
                collisions={collisions}
                formatHour={formatHour}
            />

            {/* Gantt Matrix Container */}
            <div className="w-full overflow-x-auto select-none">
                <div className="min-w-262.5">
                    {/* Header Row: Ramp Info Column + Horizontal Time Axis */}
                    <div className="flex border-b border-slate-300 bg-slate-100/80 text-slate-700 text-xs font-semibold">
                        <div className="w-60 shrink-0 p-2.5 border-r border-slate-300 flex items-center justify-between">
                            <span className="font-bold text-slate-700 uppercase tracking-wider text-[0.625rem] font-mono">
                                Loading Docks / Ramp
                            </span>
                            <Badge variant="slate">
                                {ramps.length} Ramps
                            </Badge>
                        </div>

                        {/* Time Grid Header */}
                        <div className="flex-1 flex relative">
                            {timelineHours.map((h) => (
                                <div
                                    key={h}
                                    className={`flex-1 text-center py-2 text-[0.6875rem] font-mono border-r border-slate-200 ${h === Math.floor(CURRENT_SIMULATED_HOUR) ? 'bg-amber-50 font-bold text-amber-900' : ''
                                        }`}
                                >
                                    <span>{String(h).padStart(2, '0')}:00</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline Body Rows */}
                    <div ref={timelineRef} className="relative divide-y divide-slate-200">
                        {/* Current Time Indicator */}
                        {CURRENT_SIMULATED_HOUR >= TIMELINE_START_HOUR && CURRENT_SIMULATED_HOUR <= TIMELINE_END_HOUR && (
                            <div
                                className="absolute top-0 bottom-0 z-20 pointer-events-none flex flex-col items-center"
                                style={{
                                    left: `calc(15rem + ${(CURRENT_SIMULATED_HOUR - TIMELINE_START_HOUR) / TOTAL_HOURS * 100}% - (15rem * ${(CURRENT_SIMULATED_HOUR - TIMELINE_START_HOUR) / TOTAL_HOURS}))`
                                }}
                            >
                                <div className="bg-[#991b1b] text-white text-[0.5625rem] font-bold px-1.5 py-0.2 rounded-xs shadow-xs font-mono -mt-2">
                                    NOW {formatHour(CURRENT_SIMULATED_HOUR)}
                                </div>
                                <div className="w-0.5 flex-1 bg-[#991b1b]/80 border-l border-dashed border-[#991b1b]" />
                            </div>
                        )}

                        {/* Ramp Rows */}
                        {ramps.map((ramp, rampIndex) => {
                            const rampShipments = shipments.filter(s => s.rampId === ramp.id);

                            return (
                                <div key={ramp.id} className="flex min-h-19 hover:bg-slate-50/50 transition-colors">
                                    {/* Left Column: Ramp Metadata */}
                                    <div className="w-60 shrink-0 p-2.5 border-r border-slate-300 bg-slate-50/80 flex flex-col justify-between">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-xs text-slate-900 font-mono">
                                                {ramp.code}
                                            </span>
                                            <Badge variant="slate" className="text-[0.5625rem]">
                                                {ramp.type.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <div className="text-[0.625rem] text-slate-600 truncate font-medium" title={ramp.name}>
                                            {ramp.name}
                                        </div>
                                        <div className="flex items-center justify-between text-[0.625rem] text-slate-500 font-mono pt-0.5">
                                            <span>Max: {ramp.maxWeightTons}t</span>
                                            <span>Zone: {ramp.assignedZone}</span>
                                        </div>
                                    </div>

                                    {/* Right Gantt Canvas Area */}
                                    <div className="flex-1 relative bg-white min-h-19 flex">
                                        {/* Background Vertical Hour Grid Lines */}
                                        {timelineHours.map((h) => (
                                            <div
                                                key={h}
                                                className={`flex-1 border-r border-slate-100 pointer-events-none ${h % 2 === 0 ? 'bg-slate-50/30' : ''
                                                    }`}
                                            />
                                        ))}

                                        {/* Shipment Gantt Blocks */}
                                        {rampShipments.map((shipment) => {
                                            const isBeingDragged = draggingShipmentId === shipment.id;
                                            const displayStartHour = isBeingDragged && tempStartHour !== null ? tempStartHour : shipment.startHour;
                                            const displayRampId = isBeingDragged && tempRampId !== null ? tempRampId : shipment.rampId;

                                            if (isBeingDragged && displayRampId !== ramp.id) {
                                                return null;
                                            }

                                            return (
                                                <DockGanttBlock
                                                    key={shipment.id}
                                                    shipment={shipment}
                                                    displayStartHour={displayStartHour}
                                                    timelineStartHour={TIMELINE_START_HOUR}
                                                    totalHours={TOTAL_HOURS}
                                                    hasConflict={isShipmentInCollision(shipment.id)}
                                                    isSelected={selectedShipmentId === shipment.id}
                                                    isBeingDragged={isBeingDragged}
                                                    rampIndex={rampIndex}
                                                    formatHour={formatHour}
                                                    onMouseDown={handleMouseDown}
                                                    onClick={() => onSelectShipment(shipment)}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Legend Bar */}
            <DockGanttLegend />
        </div>
    );
};
