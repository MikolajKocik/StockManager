import React from 'react';
import type { BinZoneData } from '@/models/binMap';
import { BinMapLegend } from './BinMapLegend';

interface BinMapCanvasProps {
    zones: BinZoneData[];
    filteredZones: BinZoneData[];
    selectedZoneId: string | null;
    hoveredZoneId: string | null;
    isLoading: boolean;
    onSelectZone: (zoneId: string) => void;
    onHoverZone: (zoneId: string | null) => void;
}

export const BinMapCanvas: React.FC<BinMapCanvasProps> = ({
    zones,
    filteredZones,
    selectedZoneId,
    hoveredZoneId,
    isLoading,
    onSelectZone,
    onHoverZone
}) => {
    const getZoneColor = (zone: BinZoneData): string => {
        if (zone.status === 'maintenance') return '#8E959B';
        if (zone.fillPercentage >= 90) return '#CC6557';
        if (zone.fillPercentage >= 50) return '#D4B85E';
        return '#9BB477';
    };

    return (
        <div className="card border border-slate-300">
            <div className="flex flex-row justify-between items-center px-3 py-1.5 border-b border-slate-300 bg-slate-200">
                <h2 className="card-header m-0 p-0 text-slate-900 font-bold">
                    Warehouse Bin Layout & Heatmap
                </h2>
                <span className="text-xs text-slate-500 font-normal">
                    {isLoading ? 'Loading live bins...' : 'Scale 1:100 • Main Storage Facility'}
                </span>
            </div>

            <div className="card-body p-3 bg-white flex flex-col gap-3">
                <div className="w-full bg-[#f8fafc] border border-slate-300 p-2 overflow-x-auto relative min-h-75 flex items-center justify-center">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-2 text-slate-500">
                            <span className="loader"></span>
                            <span className="text-xs">Fetching live warehouse state...</span>
                        </div>
                    ) : (
                        <svg
                            viewBox="0 0 890 440"
                            className="w-full h-auto select-none min-w-162.5"
                            style={{ maxHeight: '580px' }}
                        >
                            {/* Background Grid Pattern */}
                            <defs>
                                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.75" />
                                </pattern>
                            </defs>
                            <rect width="890" height="440" fill="url(#grid)" />

                            {/* Top Inbound Receiving & Unloading Dock */}
                            <rect x="30" y="15" width="830" height="36" fill="#37393B" rx="4" />
                            <text x="445" y="38" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#FFFFFF" letterSpacing="2">
                                INBOUND RECEIVING & UNLOADING DOCK
                            </text>

                            {/* Sector Column Headers & Aisle Dividers */}
                            <g opacity="0.85">
                                <text x="132" y="85" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#475569">SECTOR A (Electronics)</text>
                                <text x="342" y="85" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#475569">SECTOR B (Appliances)</text>
                                <text x="552" y="85" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#475569">SECTOR C (Hardware)</text>
                                <text x="762" y="85" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#475569">SECTOR D (Packaging)</text>

                                {/* Aisle divider dotted lines */}
                                <line x1="237" y1="70" x2="237" y2="420" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,5" />
                                <line x1="447" y1="70" x2="447" y2="420" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,5" />
                                <line x1="657" y1="70" x2="657" y2="420" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,5" />
                            </g>

                            {/* Render Racks / Bins */}
                            {zones.map((zone) => {
                                const isSelected = selectedZoneId === zone.id || selectedZoneId === zone.code;
                                const isHovered = hoveredZoneId === zone.id || hoveredZoneId === zone.code;
                                const isFiltered = filteredZones.some(fz => fz.id === zone.id || fz.code === zone.code);
                                const zoneColor = getZoneColor(zone);

                                return (
                                    <g
                                        key={zone.id}
                                        onClick={() => onSelectZone(zone.id)}
                                        onMouseEnter={() => onHoverZone(zone.id)}
                                        onMouseLeave={() => onHoverZone(null)}
                                        style={{
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease-in-out',
                                            opacity: isFiltered ? (isHovered || isSelected ? 1 : 0.95) : 0.2
                                        }}
                                    >
                                        {/* Rack Container */}
                                        <rect
                                            x={zone.x}
                                            y={zone.y}
                                            width={zone.width}
                                            height={zone.height}
                                            fill={zoneColor}
                                            stroke={isSelected ? '#1e293b' : isHovered ? '#475569' : '#94a3b8'}
                                            strokeWidth={isSelected ? 3.5 : isHovered ? 2 : 1}
                                            rx="4"
                                        />

                                        {/* Top Rack Identification Header */}
                                        <rect
                                            x={zone.x}
                                            y={zone.y}
                                            width={zone.width}
                                            height="22"
                                            fill={zone.status === 'maintenance' ? '#64748b' : '#37393B'}
                                            opacity="0.85"
                                            rx="3"
                                        />
                                        <text
                                            x={zone.x + 10}
                                            y={zone.y + 15}
                                            fontSize="12"
                                            fontWeight="bold"
                                            fill="#FFFFFF"
                                        >
                                            {zone.id}
                                        </text>
                                        <text
                                            x={zone.x + zone.width - 10}
                                            y={zone.y + 15}
                                            fontSize="11"
                                            fontWeight="bold"
                                            textAnchor="end"
                                            fill="#FFFFFF"
                                        >
                                            {zone.status === 'maintenance' ? 'MAINT' : `${zone.fillPercentage}%`}
                                        </text>

                                        {/* Rack Category and Item Count */}
                                        <text
                                            x={zone.x + 10}
                                            y={zone.y + 38}
                                            fontSize="11"
                                            fontWeight="600"
                                            fill="#FFFFFF"
                                        >
                                            {zone.category}
                                        </text>
                                        <text
                                            x={zone.x + 10}
                                            y={zone.y + 51}
                                            fontSize="10"
                                            fill="#F1F5F9"
                                            opacity="0.9"
                                        >
                                            {zone.items} / {zone.maxCapacity || 500} pcs
                                        </text>

                                        {/* Mini Occupancy Bar within Rack */}
                                        <rect
                                            x={zone.x + 10}
                                            y={zone.y + 54}
                                            width={zone.width - 20}
                                            height="3"
                                            fill="#ffffff"
                                            opacity="0.3"
                                            rx="1.5"
                                        />
                                        <rect
                                            x={zone.x + 10}
                                            y={zone.y + 54}
                                            width={((zone.width - 20) * zone.fillPercentage) / 100}
                                            height="3"
                                            fill="#ffffff"
                                            rx="1.5"
                                        />
                                    </g>
                                );
                            })}

                            {/* Bottom Staging / Outbound Shipping Zone */}
                            <rect x="30" y="420" width="830" height="15" fill="#C5CBD3" rx="2" />
                            <text x="445" y="432" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#37393B" letterSpacing="1.5">
                                OUTBOUND PACKING & DISPATCH LANE
                            </text>
                        </svg>
                    )}
                </div>

                {/* Heatmap Legend */}
                <BinMapLegend />
            </div>
        </div>
    );
};
