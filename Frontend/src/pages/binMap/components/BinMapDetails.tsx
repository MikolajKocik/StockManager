import React from 'react';
import { Badge, Meter } from '@/components/common/custom';
import { Button } from '@/components/common/core'
import type { BinZoneData } from '@/models/binMap';

interface BinMapDetailsProps {
    selectedZone: BinZoneData | null;
    isDispatching: boolean;
    isUpdatingMaintenance: boolean;
    onDispatch: () => void;
    onToggleMaintenance: () => void;
}

export const BinMapDetails: React.FC<BinMapDetailsProps> = ({
    selectedZone,
    isDispatching,
    isUpdatingMaintenance,
    onDispatch,
    onToggleMaintenance
}) => {
    return (
        <div className="bg-white border border-slate-300 rounded-lg shadow-xs overflow-hidden">
            <div className="flex flex-row justify-between items-center px-4 py-2.5 border-b border-slate-200 bg-slate-50">
                <h2 className="text-sm text-slate-900 font-bold font-mono uppercase tracking-tight">
                    {selectedZone ? `Bin Location ${selectedZone.id}` : 'Bin Details'}
                </h2>
                {selectedZone && (
                    <Badge
                        variant={selectedZone.status === 'active' ? 'success' : 'danger'}
                    >
                        {selectedZone.status === 'active' ? 'Active' : 'Maintenance'}
                    </Badge>
                )}
            </div>

            <div className="p-4 flex flex-col justify-between gap-4">
                {selectedZone ? (
                    <div className="flex flex-col gap-3">
                        {/* Occupancy Gauge */}
                        <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                            <div className="flex justify-between items-center mb-1 text-xs text-slate-700 font-medium">
                                <span className="font-mono text-[10px] uppercase font-bold text-slate-500">Occupancy Level</span>
                                <span className="font-mono font-bold text-slate-900">{selectedZone.fillPercentage}%</span>
                            </div>
                            <Meter
                                value={selectedZone.fillPercentage}
                                min={0}
                                max={100}
                                low={50}
                                high={90}
                                optimum={20}
                            />
                            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1.5">
                                <span>{selectedZone.items} units stored</span>
                                <span>Capacity: {selectedZone.maxCapacity || 500} pcs</span>
                            </div>
                        </div>

                        {/* Information Matrix */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-slate-50 p-2 rounded border border-slate-200">
                                <span className="text-slate-500 text-[10px] font-mono uppercase block">Category</span>
                                <span className="font-semibold text-slate-800 truncate block" title={selectedZone.category}>
                                    {selectedZone.category}
                                </span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded border border-slate-200">
                                <span className="text-slate-500 text-[10px] font-mono uppercase block">Sector / Code</span>
                                <span className="font-semibold text-slate-800 font-mono">
                                    Sec {selectedZone.sector} ({selectedZone.code})
                                </span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded border border-slate-200">
                                <span className="text-slate-500 text-[10px] font-mono uppercase block">Storage Temp</span>
                                <span className="font-semibold text-slate-800 font-mono">{selectedZone.temperature || '20°C'}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded border border-slate-200">
                                <span className="text-slate-500 text-[10px] font-mono uppercase block">Supervisor</span>
                                <span className="font-semibold text-slate-800 truncate block" title={selectedZone.supervisor}>
                                    {selectedZone.supervisor || 'Shift Lead'}
                                </span>
                            </div>
                        </div>

                        {/* Stored inventory items list if available */}
                        {selectedZone.inventoryItems && selectedZone.inventoryItems.length > 0 && (
                            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs">
                                <span className="text-slate-600 font-semibold block mb-1 font-mono text-[10px] uppercase">
                                    Stored SKUs:
                                </span>
                                <div className="max-h-24 overflow-y-auto space-y-1">
                                    {selectedZone.inventoryItems.map((item, idx) => (
                                        <div key={item.id || idx} className="flex justify-between text-[11px] bg-white p-1.5 rounded border border-slate-200">
                                            <span className="font-medium text-slate-700 truncate">{item.productName || `Product #${item.productId}`}</span>
                                            <span className="text-slate-600 font-mono font-bold">{item.quantityOnHand} pcs</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                            <Button
                                variant="primary"
                                size="md"
                                className="w-full"
                                onClick={onDispatch}
                                isLoading={isDispatching}
                                disabled={selectedZone.status === 'maintenance' || isDispatching}
                            >
                                Dispatch Rack Order
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={onToggleMaintenance}
                                isLoading={isUpdatingMaintenance}
                                disabled={isUpdatingMaintenance}
                            >
                                {selectedZone.status === 'active' ? 'Set to Maintenance' : 'Activate Sector'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-slate-500 py-10 text-xs font-mono">
                        Select a rack on the floor plan to view live telemetry and dispatch SKU operations.
                    </div>
                )}
            </div>
        </div>
    );
};
