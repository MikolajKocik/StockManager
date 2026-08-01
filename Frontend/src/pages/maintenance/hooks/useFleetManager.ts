import { useState, useMemo, useCallback } from 'react';
import type { FleetZone, MachineStatus, MaintenanceIncident, MaintenanceMachine } from '@/models/maintenance';
import { mockMaintenanceIncidents, mockMaintenanceMachines } from '@/mocks/maintenance.mocks';

export function useFleetManager() {
    const [machines, setMachines] = useState<MaintenanceMachine[]>(() => mockMaintenanceMachines);
    const [incidents, setIncidents] = useState<MaintenanceIncident[]>(() => mockMaintenanceIncidents);
    const [selectedMachineId, setSelectedMachineId] = useState<string>(() => mockMaintenanceMachines[0]?.id || '');
    const [draggedMachineId, setDraggedMachineId] = useState<string | null>(null);
    const [dragOverZone, setDragOverZone] = useState<FleetZone | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState('');

    // Selected machine reference
    const selectedMachine = useMemo(() => {
        return machines.find(m => m.id === selectedMachineId) || machines[0] || null;
    }, [machines, selectedMachineId]);

    // KPI Metrics calculation
    const kpis = useMemo(() => {
        const total = machines.length;
        if (total === 0) {
            return {
                total: 0,
                operational: 0,
                charging: 0,
                maintenance: 0,
                critical: 0,
                avgBattery: 0,
                readinessRate: 0,
                activeIncidentsCount: incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length
            };
        }

        const operational = machines.filter(m => m.status === 'OPERATIONAL').length;
        const charging = machines.filter(m => m.status === 'CHARGING').length;
        const maintenance = machines.filter(m => m.status === 'MAINTENANCE').length;
        const critical = machines.filter(m => m.status === 'CRITICAL_FAULT').length;
        const totalBattery = machines.reduce((acc, m) => acc + m.batteryLevel, 0);
        const avgBattery = Math.round(totalBattery / total);
        const readinessRate = Math.round((operational / total) * 100);
        const activeIncidentsCount = incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;

        return {
            total,
            operational,
            charging,
            maintenance,
            critical,
            avgBattery,
            readinessRate,
            activeIncidentsCount
        };
    }, [machines, incidents]);

    // Filtered machines
    const filteredMachines = useMemo(() => {
        if (!filterQuery.trim()) return machines;
        const q = filterQuery.toLowerCase();
        return machines.filter(m => 
            m.name.toLowerCase().includes(q) || 
            m.code.toLowerCase().includes(q) || 
            m.serialNumber.toLowerCase().includes(q) ||
            (m.assignedOperator && m.assignedOperator.toLowerCase().includes(q))
        );
    }, [machines, filterQuery]);

    // Grouping by Zone
    const machinesByZone = useMemo(() => {
        return {
            HALA_A: filteredMachines.filter(m => m.zone === 'HALA_A'),
            HALA_B: filteredMachines.filter(m => m.zone === 'HALA_B'),
            WORKSHOP_CHARGING: filteredMachines.filter(m => m.zone === 'WORKSHOP_CHARGING')
        };
    }, [filteredMachines]);

    // Drag and Drop Handlers
    const handleDragStart = useCallback((e: React.DragEvent, machineId: string) => {
        setDraggedMachineId(machineId);
        e.dataTransfer.setData('text/plain', machineId);
        e.dataTransfer.effectAllowed = 'move';
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, zone: FleetZone) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverZone !== zone) {
            setDragOverZone(zone);
        }
    }, [dragOverZone]);

    const handleDragLeave = useCallback(() => {
        setDragOverZone(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, targetZone: FleetZone) => {
        e.preventDefault();
        setDragOverZone(null);
        const machineId = e.dataTransfer.getData('text/plain') || draggedMachineId;
        if (!machineId) return;

        setMachines(prev => prev.map(m => {
            if (m.id !== machineId) return m;
            if (m.zone === targetZone) return m;

            // Determine zone name label for logs
            const zoneNames: Record<FleetZone, string> = {
                HALA_A: 'Hall A (High Bay & Receiving)',
                HALA_B: 'Hall B (Picking & Dispatch)',
                WORKSHOP_CHARGING: 'Workshop & Charging Bay'
            };

            // Smart status transition based on destination zone
            let newStatus: MachineStatus = m.status;
            let isCharging = m.isCharging;

            if (targetZone === 'WORKSHOP_CHARGING') {
                if (m.status !== 'CRITICAL_FAULT') {
                    newStatus = m.batteryLevel < 40 ? 'CHARGING' : 'MAINTENANCE';
                    isCharging = newStatus === 'CHARGING';
                }
            } else {
                if (m.status === 'CHARGING' || m.status === 'MAINTENANCE') {
                    newStatus = 'OPERATIONAL';
                    isCharging = false;
                }
            }

            const newLog = {
                id: `log-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'ZONE_CHANGE' as const,
                message: `Assigned to zone: ${zoneNames[targetZone]}`
            };

            return {
                ...m,
                zone: targetZone,
                status: newStatus,
                isCharging,
                logs: [newLog, ...m.logs]
            };
        }));

        setDraggedMachineId(null);
    }, [draggedMachineId]);

    const handleDragEnd = useCallback(() => {
        setDraggedMachineId(null);
        setDragOverZone(null);
    }, []);

    // Quick machine actions
    const updateMachineStatus = useCallback((machineId: string, status: MachineStatus) => {
        setMachines(prev => prev.map(m => {
            if (m.id !== machineId) return m;
            const logMsg: Record<MachineStatus, string> = {
                OPERATIONAL: 'Restored to duty (Status: Operational)',
                CHARGING: 'Connected to fast-charging station',
                MAINTENANCE: 'Dispatched for scheduled technical maintenance',
                CRITICAL_FAULT: 'Critical fault reported on asset'
            };

            const isCharging = status === 'CHARGING';
            const targetZone = (status === 'CHARGING' || status === 'MAINTENANCE' || status === 'CRITICAL_FAULT') 
                ? 'WORKSHOP_CHARGING' 
                : m.zone;

            return {
                ...m,
                status,
                isCharging,
                zone: targetZone,
                logs: [
                    {
                        id: `log-${Date.now()}`,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        type: 'STATUS_CHANGE',
                        message: logMsg[status]
                    },
                    ...m.logs
                ]
            };
        }));
    }, []);

    // Add Incident
    const reportIncident = useCallback((title: string, description: string, priority: 'Low' | 'Medium' | 'High' | 'Critical', assetId: string) => {
        const targetMachine = machines.find(m => m.id === assetId);
        const newIncident: MaintenanceIncident = {
            id: Date.now(),
            title,
            description,
            priority,
            status: 'Open',
            photoUrl: null,
            createdAt: new Date().toISOString(),
            resolvedAt: null,
            resolutionNotes: null,
            reportedById: 'U-CURRENT',
            reportedByName: 'Shift Supervisor',
            assignedToId: null,
            assignedToName: null,
            assetId,
            assetName: targetMachine ? `${targetMachine.code} (${targetMachine.name})` : 'Warehouse Asset',
            binLocationId: null,
            binLocationCode: null
        };

        setIncidents(prev => [newIncident, ...prev]);

        // If high or critical, set machine status to CRITICAL_FAULT
        if (targetMachine && (priority === 'High' || priority === 'Critical')) {
            updateMachineStatus(assetId, 'CRITICAL_FAULT');
        }

        setIsReportModalOpen(false);
    }, [machines, updateMachineStatus]);

    const resolveIncident = useCallback((incidentId: number, notes: string) => {
        setIncidents(prev => prev.map(inc => {
            if (inc.id !== incidentId) return inc;
            return {
                ...inc,
                status: 'Resolved',
                resolvedAt: new Date().toISOString(),
                resolutionNotes: notes
            };
        }));
    }, []);

    return {
        machines,
        selectedMachine,
        selectedMachineId,
        draggedMachineId,
        dragOverZone,
        kpis,
        incidents,
        machinesByZone,
        filterQuery,
        isReportModalOpen,
        setFilterQuery,
        setIsReportModalOpen,
        setSelectedMachineId,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleDragEnd,
        updateMachineStatus,
        reportIncident,
        resolveIncident
    };
}
