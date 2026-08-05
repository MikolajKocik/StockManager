import { useState } from 'react';
import { ShipmentsHeader, type ShipmentsViewMode } from './components/ShipmentsHeader';
import { DockSchedulerGantt } from './components/DockSchedulerGantt';
import { ShipmentsListTable } from './components/ShipmentsListTable';
import { ShipmentDetailsModal } from './components/ShipmentDetailsModal';
import { ShipmentCreateModal } from './components/ShipmentCreateModal';
import { Card, CardHeader, CardBody } from '@/components/common';

import { MOCK_RAMPS, MOCK_SHIPMENTS } from './mocks/shipments.mocks';
import type { DockRamp, DockShipment } from './models/dockScheduler';

export default function Shipments() {
    const [viewMode, setViewMode] = useState<ShipmentsViewMode>('GANTT');
    const [ramps] = useState<DockRamp[]>(MOCK_RAMPS);
    const [shipments, setShipments] = useState<DockShipment[]>(MOCK_SHIPMENTS);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const [selectedShipment, setSelectedShipment] = useState<DockShipment | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    const handleUpdateShipment = (id: string, updates: Partial<DockShipment>) => {
        setShipments(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const handleDeleteShipment = (id: string) => {
        setShipments(prev => prev.filter(s => s.id !== id));
        if (selectedShipment?.id === id) {
            setSelectedShipment(null);
            setIsDetailsModalOpen(false);
        }
    };

    const handleCreateShipment = (newShipment: DockShipment) => {
        setShipments(prev => [newShipment, ...prev]);
    };

    const handleSelectShipment = (shipment: DockShipment) => {
        setSelectedShipment(shipment);
        setIsDetailsModalOpen(true);
    };

    const totalShipments = shipments.length;
    const occupiedRampIds = new Set(shipments.filter(s => s.status === 'LOADING' || s.status === 'ARRIVED_ON_TIME').map(s => s.rampId));
    const activeRampsCount = occupiedRampIds.size;
    const delayedCount = shipments.filter(s => s.status === 'DELAYED').length;
    const totalPallets = shipments.reduce((acc, s) => acc + (s.palletCount || 0), 0);

    {/** Complex logic: O(N^2) time interval overlap detection across active dock ramps */}
    let conflictsCount = 0;
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
                    conflictsCount++;
                }
            }
        }
    }

    return (
        <div className="w-full space-y-4 pb-12">
            <ShipmentsHeader
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                totalShipments={totalShipments}
                activeRampsCount={activeRampsCount}
                delayedCount={delayedCount}
                totalPallets={totalPallets}
                conflictsCount={conflictsCount}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
            />

            {viewMode === 'GANTT' ? (
                <div className="w-full space-y-4">
                    <DockSchedulerGantt
                        ramps={ramps}
                        shipments={shipments}
                        onUpdateShipment={handleUpdateShipment}
                        onSelectShipment={handleSelectShipment}
                        selectedShipmentId={selectedShipment?.id}
                    />

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between w-full">
                                <h3 className="font-bold text-xs uppercase font-mono text-slate-800">
                                    Active Fleet & Waybills Registry
                                </h3>
                                <span className="text-xs text-slate-500 font-mono">
                                    Showing all {shipments.length} assigned dock operations
                                </span>
                            </div>
                        </CardHeader>
                        <CardBody className="p-0">
                            <ShipmentsListTable
                                shipments={shipments}
                                ramps={ramps}
                                onSelectShipment={handleSelectShipment}
                            />
                        </CardBody>
                    </Card>
                </div>
            ) : (
                <ShipmentsListTable
                    shipments={shipments}
                    ramps={ramps}
                    onSelectShipment={handleSelectShipment}
                />
            )}

            <ShipmentDetailsModal
                isOpen={isDetailsModalOpen}
                shipment={selectedShipment}
                ramps={ramps}
                onClose={() => setIsDetailsModalOpen(false)}
                onUpdate={handleUpdateShipment}
                onDelete={handleDeleteShipment}
            />

            <ShipmentCreateModal
                isOpen={isCreateModalOpen}
                ramps={ramps}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateShipment}
            />
        </div>
    );
}
