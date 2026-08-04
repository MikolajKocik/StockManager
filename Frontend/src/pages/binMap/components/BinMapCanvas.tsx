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
    const getZoneTheme = (zone: BinZoneData) => {
        if (zone.status === 'maintenance') {
            return {
                fill: '#f1f5f9',
                headerFill: '#475569',
                stroke: '#94a3b8',
                textColor: '#1e293b',
                barFill: '#64748b'
            };
        }
        if (zone.fillPercentage >= 90) {
            return {
                fill: '#fef2f2',
                headerFill: '#991b1b',
                stroke: '#f87171',
                textColor: '#7f1d1d',
                barFill: '#dc2626'
            };
        }
        if (zone.fillPercentage >= 50) {
            return {
                fill: '#fffbeb',
                headerFill: '#AA9559',
                stroke: '#fbbf24',
                textColor: '#78350f',
                barFill: '#d97706'
            };
        }
        return {
            fill: '#f0fdf4',
            headerFill: '#0e5f32',
            stroke: '#4ade80',
            textColor: '#064e3b',
            barFill: '#059669'
        };
    };

    return (
        <div className="bg-white border border-slate-300 rounded-lg shadow-xs overflow-hidden">
            <div className="flex flex-row justify-between items-center px-4 py-2.5 border-b border-slate-200 bg-slate-50">
                <h2 className="text-sm text-slate-900 font-bold font-mono uppercase tracking-tight">
                    Warehouse Bin Layout & Live Heatmap
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                    {isLoading ? 'Loading live bins...' : 'Scale 1:100 • Main Logistics Center'}
                </span>
            </div>

            <div className="p-3 bg-white flex flex-col gap-3">
                <div className="w-full bg-[#f8fafc] border border-slate-200 rounded p-2 overflow-x-auto relative min-h-75 flex items-center justify-center">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-2 text-slate-500">
                            <span className="text-xs font-mono">Fetching live warehouse state...</span>
                        </div>
                    ) : (
                        <svg
                            viewBox="0 0 890 440"
                            className="w-full h-auto select-none min-w-162.5"
                            style={{ maxHeight: '580px' }}
                        >
                            {/* Background Grid Pattern */}
                            <defs>
                                <pattern id="bin-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.75" />
                                </pattern>
                            </defs>
                            <rect width="890" height="440" fill="url(#bin-grid)" />

                            {/* Top Inbound Receiving & Unloading Dock */}
                            <rect x="30" y="15" width="830" height="34" fill="#2b6675" rx="4" />
                            <text x="445" y="37" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#FFFFFF" letterSpacing="2" fontFamily="monospace">
                                INBOUND RECEIVING & UNLOADING DOCKS (PZ)
                            </text>

                            {/* Sector Column Headers & Aisle Dividers */}
                            <g opacity="0.9">
                                <text x="132" y="82" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#334155" fontFamily="monospace">SECTOR A (Electronics)</text>
                                <text x="342" y="82" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#334155" fontFamily="monospace">SECTOR B (Appliances)</text>
                                <text x="552" y="82" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#334155" fontFamily="monospace">SECTOR C (Hardware)</text>
                                <text x="762" y="82" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#334155" fontFamily="monospace">SECTOR D (Packaging)</text>

                                {/* Aisle divider dotted lines */}
                                <line x1="237" y1="70" x2="237" y2="420" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4,4" />
                                <line x1="447" y1="70" x2="447" y2="420" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4,4" />
                                <line x1="657" y1="70" x2="657" y2="420" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4,4" />
                            </g>

                            {/* Render Racks / Bins */}
                            {zones.map((zone) => {
                                const isSelected = selectedZoneId === zone.id || selectedZoneId === zone.code;
                                const isHovered = hoveredZoneId === zone.id || hoveredZoneId === zone.code;
                                const isFiltered = filteredZones.some(fz => fz.id === zone.id || fz.code === zone.code);
                                const theme = getZoneTheme(zone);

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
                                            fill={theme.fill}
                                            stroke={isSelected ? '#2b6675' : isHovered ? '#475569' : theme.stroke}
                                            strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                                            rx="4"
                                        />

                                        {/* Top Rack Identification Header */}
                                        <rect
                                            x={zone.x}
                                            y={zone.y}
                                            width={zone.width}
                                            height="22"
                                            fill={theme.headerFill}
                                            rx="3"
                                        />
                                        <text
                                            x={zone.x + 8}
                                            y={zone.y + 15}
                                            fontSize="11"
                                            fontWeight="bold"
                                            fill="#FFFFFF"
                                            fontFamily="monospace"
                                        >
                                            {zone.id}
                                        </text>
                                        <text
                                            x={zone.x + zone.width - 8}
                                            y={zone.y + 15}
                                            fontSize="10"
                                            fontWeight="bold"
                                            textAnchor="end"
                                            fill="#FFFFFF"
                                            fontFamily="monospace"
                                        >
                                            {zone.status === 'maintenance' ? 'MAINT' : `${zone.fillPercentage}%`}
                                        </text>

                                        {/* Rack Category and Item Count */}
                                        <text
                                            x={zone.x + 8}
                                            y={zone.y + 36}
                                            fontSize="10"
                                            fontWeight="600"
                                            fill={theme.textColor}
                                        >
                                            {zone.category}
                                        </text>
                                        <text
                                            x={zone.x + 8}
                                            y={zone.y + 49}
                                            fontSize="9"
                                            fontFamily="monospace"
                                            fill="#475569"
                                        >
                                            {zone.items} / {zone.maxCapacity || 500} pcs
                                        </text>

                                        {/* Mini Occupancy Bar within Rack */}
                                        <rect
                                            x={zone.x + 8}
                                            y={zone.y + 53}
                                            width={zone.width - 16}
                                            height="3"
                                            fill="#cbd5e1"
                                            opacity="0.6"
                                            rx="1.5"
                                        />
                                        <rect
                                            x={zone.x + 8}
                                            y={zone.y + 53}
                                            width={((zone.width - 16) * zone.fillPercentage) / 100}
                                            height="3"
                                            fill={theme.barFill}
                                            rx="1.5"
                                        />
                                    </g>
                                );
                            })}

                            {/* Bottom Staging / Outbound Shipping Zone */}
                            <rect x="30" y="420" width="830" height="15" fill="#5a6c7d" rx="2" />
                            <text x="445" y="431" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#FFFFFF" letterSpacing="1.5" fontFamily="monospace">
                                OUTBOUND PACKING & DISPATCH LANE (WZ)
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
