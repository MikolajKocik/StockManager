import React from 'react';
import { Button } from '@/components/common';
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
                    {selectedZone ? `Bin Location ${selectedZone.id}` : 'Bin Details'}
                </h2>
                {selectedZone && (
                    <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded text-white ${
                            selectedZone.status === 'active' ? 'bg-[#9BB477]' : 'bg-[#CC6557]'
                        }`}
                    >
                        {selectedZone.status === 'active' ? 'Active' : 'Maintenance'}
                    </span>
                )}
            </div>

            <div className="card-body p-3 flex flex-col justify-between gap-4">
                {selectedZone ? (
                    <div className="flex flex-col gap-3">
                        {/* Occupancy Gauge */}
                        <div className="bg-slate-200 p-2.5 rounded border border-slate-300">
                            <div className="flex justify-between items-center mb-1 text-xs text-slate-700 font-medium">
                                <span>Current Occupancy</span>
                                <span className="font-bold">{selectedZone.fillPercentage}%</span>
                            </div>
                            <div className="w-full bg-slate-300 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{
                                        width: `${selectedZone.fillPercentage}%`,
                                        backgroundColor: getZoneColor(selectedZone)
                                    }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                                <span>{selectedZone.items} units stored</span>
                                <span>Capacity: {selectedZone.maxCapacity || 500}</span>
                            </div>
                        </div>

                        {/* Information Matrix */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-slate-200 p-2 rounded border border-slate-300">
                                <span className="text-slate-500 block">Category</span>
                                <span className="font-semibold text-slate-800 truncate block" title={selectedZone.category}>
                                    {selectedZone.category}
                                </span>
                            </div>
                            <div className="bg-slate-200 p-2 rounded border border-slate-300">
                                <span className="text-slate-500 block">Sector / Code</span>
                                <span className="font-semibold text-slate-800">
                                    Sector {selectedZone.sector} ({selectedZone.code})
                                </span>
                            </div>
                            <div className="bg-slate-200 p-2 rounded border border-slate-300">
                                <span className="text-slate-500 block">Temperature</span>
                                <span className="font-semibold text-slate-800">{selectedZone.temperature || '20°C'}</span>
                            </div>
                            <div className="bg-slate-200 p-2 rounded border border-slate-300">
                                <span className="text-slate-500 block">Supervisor</span>
                                <span className="font-semibold text-slate-800 truncate block" title={selectedZone.supervisor}>
                                    {selectedZone.supervisor || 'Staff'}
                                </span>
                            </div>
                        </div>

                        {/* Stored inventory items list if available */}
                        {selectedZone.inventoryItems && selectedZone.inventoryItems.length > 0 && (
                            <div className="bg-slate-200 p-2 rounded border border-slate-300 text-xs">
                                <span className="text-slate-600 font-semibold block mb-1">Stored SKUs:</span>
                                <div className="max-h-24 overflow-y-auto space-y-1">
                                    {selectedZone.inventoryItems.map((item, idx) => (
                                        <div key={item.id || idx} className="flex justify-between text-[11px] bg-white p-1 rounded border border-slate-300">
                                            <span className="font-medium text-slate-700 truncate">{item.productName || `Product #${item.productId}`}</span>
                                            <span className="text-slate-500 font-mono">{item.quantityOnHand} pcs</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-col gap-2 pt-2 border-t border-slate-300">
                            <Button
                                variant="accent"
                                className="w-full py-1.5 text-sm"
                                onClick={onDispatch}
                                isLoading={isDispatching}
                                disabled={selectedZone.status === 'maintenance' || isDispatching}
                            >
                                Dispatch Order
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full py-1.5 text-xs bg-white text-slate-700 hover:bg-slate-100"
                                onClick={onToggleMaintenance}
                                isLoading={isUpdatingMaintenance}
                                disabled={isUpdatingMaintenance}
                            >
                                {selectedZone.status === 'active' ? 'Set to Maintenance' : 'Activate Sector'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-slate-500 py-8 text-xs">
                        Select a rack on the floor plan to view live details and available dispatch operations.
                    </div>
                )}
            </div>
        </div>
    );
};
