import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { DockRamp, DockShipment, DockCollision } from '../models/dockScheduler';

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
        <div className="w-full bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden flex flex-col">
            {/* Conflict Notification Banner */}
            {collisions.length > 0 && (
                <div className="bg-rose-50 border-b border-rose-300 px-4 py-2.5 flex items-center justify-between text-xs text-rose-900 animate-pulse-subtle">
                    <div className="flex items-center gap-2">
                        <span className="bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded font-mono uppercase">
                            DOCK COLLISION DETECTED ({collisions.length})
                        </span>
                        <span className="font-semibold">
                            Ramp scheduling conflict: {collisions[0].shipmentA.shipmentNumber} overlaps with {collisions[0].shipmentB.shipmentNumber} at {formatHour(collisions[0].overlapStartHour)} - {formatHour(collisions[0].overlapEndHour)}.
                        </span>
                    </div>
                    <span className="text-[11px] text-rose-700 font-medium">
                        Drag block to an empty time window or different ramp to resolve.
                    </span>
                </div>
            )}

            {/* Gantt Matrix Container */}
            <div className="w-full overflow-x-auto select-none">
                <div className="min-w-262.5">
                    {/* Header Row: Ramp Info Column + Horizontal Time Axis */}
                    <div className="flex border-b border-slate-300 bg-slate-100 text-slate-700 text-xs font-semibold">
                        <div className="w-64 shrink-0 p-2.5 border-r border-slate-300 flex items-center justify-between">
                            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                                Loading Docks / Ramp (Y)
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                                {ramps.length} Ramps
                            </span>
                        </div>

                        {/* Time Grid Header */}
                        <div className="flex-1 flex relative">
                            {timelineHours.map((h, idx) => (
                                <div
                                    key={h}
                                    className={`flex-1 text-center py-2 text-[11px] font-mono border-r border-slate-200 ${h === Math.floor(CURRENT_SIMULATED_HOUR) ? 'bg-amber-100/60 font-bold text-amber-900' : ''
                                        }`}
                                >
                                    <span>{String(h).padStart(2, '0')}:00</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline Body Rows */}
                    <div ref={timelineRef} className="relative divide-y divide-slate-200">
                        {/* Current Time Red Line Indicator */}
                        {CURRENT_SIMULATED_HOUR >= TIMELINE_START_HOUR && CURRENT_SIMULATED_HOUR <= TIMELINE_END_HOUR && (
                            <div
                                className="absolute top-0 bottom-0 z-20 pointer-events-none flex flex-col items-center"
                                style={{
                                    left: `calc(16rem + ${(CURRENT_SIMULATED_HOUR - TIMELINE_START_HOUR) / TOTAL_HOURS * 100}% - (16rem * ${(CURRENT_SIMULATED_HOUR - TIMELINE_START_HOUR) / TOTAL_HOURS}))`
                                }}
                            >
                                <div className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow-sm font-mono -mt-2">
                                    NOW {formatHour(CURRENT_SIMULATED_HOUR)}
                                </div>
                                <div className="w-0.5 flex-1 bg-rose-500/80 border-l border-dashed border-rose-600 shadow-sm" />
                            </div>
                        )}

                        {/* Ramp Rows */}
                        {ramps.map((ramp, rampIndex) => {
                            const rampShipments = shipments.filter(s => s.rampId === ramp.id);

                            return (
                                <div key={ramp.id} className="flex min-h-18.5 hover:bg-slate-50/50 transition-colors">
                                    {/* Left Column: Ramp Metadata */}
                                    <div className="w-64 shrink-0 p-2.5 border-r border-slate-300 bg-slate-50/90 flex flex-col justify-between">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-xs text-slate-900 font-mono">
                                                {ramp.code}
                                            </span>
                                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase font-mono ${ramp.type === 'INBOUND_HEAVY' ? 'bg-blue-100 text-blue-800' :
                                                    ramp.type === 'INBOUND_FAST' ? 'bg-emerald-100 text-emerald-800' :
                                                        ramp.type === 'OUTBOUND_DOMESTIC' ? 'bg-indigo-100 text-indigo-800' :
                                                            ramp.type === 'OUTBOUND_INTERNATIONAL' ? 'bg-purple-100 text-purple-800' :
                                                                ramp.type === 'COLD_HAZMAT' ? 'bg-cyan-100 text-cyan-800' :
                                                                    'bg-amber-100 text-amber-800'
                                                }`}>
                                                {ramp.type.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-slate-600 truncate" title={ramp.name}>
                                            {ramp.name}
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                                            <span>Max: {ramp.maxWeightTons}t</span>
                                            <span>Zone: {ramp.assignedZone}</span>
                                        </div>
                                    </div>

                                    {/* Right Gantt Canvas Area */}
                                    <div className="flex-1 relative bg-white min-h-18.5 flex">
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

                                            // If being dragged to another ramp, don't render on this row (unless it's target ramp)
                                            if (isBeingDragged && displayRampId !== ramp.id) {
                                                return null;
                                            }

                                            const leftPercent = ((displayStartHour - TIMELINE_START_HOUR) / TOTAL_HOURS) * 100;
                                            const widthPercent = (shipment.durationHours / TOTAL_HOURS) * 100;
                                            const hasConflict = isShipmentInCollision(shipment.id);
                                            const isSelected = selectedShipmentId === shipment.id;

                                            return (
                                                <div
                                                    key={shipment.id}
                                                    onMouseDown={(e) => handleMouseDown(e, shipment, rampIndex)}
                                                    onClick={() => onSelectShipment(shipment)}
                                                    className={`absolute top-1.5 bottom-1.5 rounded-md p-1.5 cursor-grab active:cursor-grabbing transition-all text-xs flex flex-col justify-between overflow-hidden shadow-xs ${hasConflict
                                                            ? 'ring-2 ring-rose-500 bg-rose-100 border border-rose-400 text-rose-950 animate-shake-subtle z-30'
                                                            : isSelected
                                                                ? 'ring-2 ring-blue-600 shadow-md z-30'
                                                                : isBeingDragged
                                                                    ? 'opacity-90 ring-2 ring-amber-500 shadow-xl z-40'
                                                                    : shipment.direction === 'INBOUND_PZ'
                                                                        ? 'bg-emerald-50 border border-emerald-300 text-emerald-950 hover:border-emerald-500'
                                                                        : 'bg-indigo-50 border border-indigo-300 text-indigo-950 hover:border-indigo-500'
                                                        }`}
                                                    style={{
                                                        left: `${Math.max(0, leftPercent)}%`,
                                                        width: `${Math.max(2, widthPercent)}%`
                                                    }}
                                                >
                                                    {/* Block Top Header */}
                                                    <div className="flex items-center justify-between gap-1 leading-none">
                                                        <div className="flex items-center gap-1 min-w-0">
                                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${shipment.status === 'LOADING' ? 'bg-cyan-500 animate-pulse' :
                                                                    shipment.status === 'DELAYED' ? 'bg-amber-500' :
                                                                        shipment.status === 'COMPLETED' ? 'bg-slate-400' :
                                                                            'bg-emerald-500'
                                                                }`} />
                                                            <span className="font-bold text-[10px] font-mono truncate">
                                                                {shipment.shipmentNumber}
                                                            </span>
                                                        </div>
                                                        <span className="font-mono text-[9px] font-semibold bg-white/70 px-1 py-0.2 rounded shrink-0 border border-slate-200">
                                                            {formatHour(displayStartHour)} - {formatHour(displayStartHour + shipment.durationHours)}
                                                        </span>
                                                    </div>

                                                    {/* Block Center: Carrier & Cargo */}
                                                    <div className="min-w-0 py-0.5">
                                                        <div className="text-[10px] font-semibold truncate leading-tight">
                                                            {shipment.carrierName} ({shipment.truckPlateNumber})
                                                        </div>
                                                        <div className="text-[9px] text-slate-600 truncate leading-tight">
                                                            {shipment.palletCount} pal. • {shipment.cargoDescription}
                                                        </div>
                                                    </div>

                                                    {/* Block Footer Status Tag */}
                                                    <div className="flex items-center justify-between text-[9px] leading-none pt-0.5 border-t border-slate-200/50">
                                                        <span className="font-medium truncate text-slate-600">
                                                            {shipment.direction === 'INBOUND_PZ' ? 'PZ Inbound' : 'WZ Outbound'}
                                                        </span>
                                                        <span className={`font-bold uppercase font-mono text-[8px] px-1 py-0.2 rounded ${shipment.status === 'LOADING' ? 'bg-cyan-600 text-white' :
                                                                shipment.status === 'DELAYED' ? 'bg-amber-500 text-slate-950 font-black' :
                                                                    shipment.status === 'COMPLETED' ? 'bg-slate-200 text-slate-700' :
                                                                        'bg-emerald-600 text-white'
                                                            }`}>
                                                            {shipment.status}
                                                        </span>
                                                    </div>
                                                </div>
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
            <div className="bg-slate-100 border-t border-slate-300 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
                <div className="flex items-center gap-4">
                    <span className="font-semibold text-slate-800 text-[11px]">Legend:</span>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-400" />
                        <span className="text-[11px]">Inbound (PZ)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-indigo-100 border border-indigo-400" />
                        <span className="text-[11px]">Outbound (WZ)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-cyan-100 border border-cyan-500" />
                        <span className="text-[11px]">Loading In Progress</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-rose-100 border border-rose-500" />
                        <span className="text-[11px] font-bold text-rose-700">Collision / Conflict</span>
                    </div>
                </div>

                <div className="text-[11px] text-slate-500">
                    💡 Tip: Click and drag any truck block horizontally to change time slot, or vertically between ramps.
                </div>
            </div>
        </div>
    );
};
