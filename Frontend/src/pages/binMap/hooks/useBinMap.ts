import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { binMapApi } from '@/api/internal/binMapApi';
import type { BinZoneData, BinMapStats } from '@/models/binMap';
import toast from 'react-hot-toast';

export function useBinMap() {
    const queryClient = useQueryClient();

    const [selectedZoneId, setSelectedZoneId] = useState<string | null>('A-01');
    const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
    const [selectedSector, setSelectedSector] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const {
        data: zones = [],
        isLoading,
        isError,
        isFetching,
        refetch
    } = useQuery<BinZoneData[]>({
        queryKey: ['bin-map-zones'],
        queryFn: binMapApi.getLiveZones,
        staleTime: 1000 * 30, // 30 sec
    });

    const dispatchMutation = useMutation({
        mutationFn: (vars: { binCode: string; notes?: string }) =>
            binMapApi.dispatchOrder(vars.binCode, vars.notes),
        onSuccess: (_, vars) => {
            toast.success(`Dispatch order generated for Bin ${vars.binCode}`);
            queryClient.invalidateQueries({ queryKey: ['bin-map-zones'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
        },
        onError: () => {
            toast.error('Failed to generate dispatch order');
        }
    });

    const maintenanceMutation = useMutation({
        mutationFn: (vars: { binCode: string; status: 'active' | 'maintenance' }) =>
            binMapApi.toggleMaintenance(vars.binCode, vars.status),
        onSuccess: (_, vars) => {
            toast.success(`Bin ${vars.binCode} status updated to ${vars.status === 'active' ? 'Active' : 'Maintenance'}`);
            queryClient.invalidateQueries({ queryKey: ['bin-map-zones'] });
        },
        onError: () => {
            toast.error('Failed to update maintenance status');
        }
    });

    const selectedZone = useMemo(
        () => zones.find(z => z.id === selectedZoneId || z.code === selectedZoneId) || null,
        [zones, selectedZoneId]
    );

    const filteredZones = useMemo(() => {
        return zones.filter(zone => {
            const matchesSector = selectedSector === 'ALL' || zone.sector === selectedSector || zone.id.startsWith(selectedSector);
            const matchesSearch = !searchTerm.trim() ||
                zone.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                zone.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                zone.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (zone.inventoryItems && zone.inventoryItems.some(it => (it.productName || '').toLowerCase().includes(searchTerm.toLowerCase())));
            return matchesSector && matchesSearch;
        });
    }, [zones, selectedSector, searchTerm]);

    const stats: BinMapStats = useMemo(() => {
        const totalItems = zones.reduce((acc, z) => acc + (z.items || 0), 0);
        const totalCapacity = zones.reduce((acc, z) => acc + (z.maxCapacity || 500), 0);
        const activeCount = zones.filter(z => z.status === 'active').length;
        const maintCount = zones.filter(z => z.status === 'maintenance').length;
        const occupancyPercent = totalCapacity > 0 ? Math.round((totalItems / totalCapacity) * 100) : 0;
        return { totalItems, totalCapacity, activeCount, maintCount, occupancyPercent };
    }, [zones]);

    const handleDispatch = (notes?: string) => {
        if (!selectedZone) return;
        dispatchMutation.mutate({ binCode: selectedZone.code || selectedZone.id, notes });
    };

    const handleToggleMaintenance = () => {
        if (!selectedZone) return;
        const newStatus: 'active' | 'maintenance' = selectedZone.status === 'active' ? 'maintenance' : 'active';
        maintenanceMutation.mutate({ binCode: selectedZone.code || selectedZone.id, status: newStatus });
    };

    const handleResetFilter = () => {
        setSelectedSector('ALL');
        setSearchTerm('');
    };

    return {
        // Data
        zones,
        filteredZones,
        selectedZone,
        stats,
        // Status
        isLoading,
        isError,
        isFetching,
        isDispatching: dispatchMutation.isPending,
        isUpdatingMaintenance: maintenanceMutation.isPending,
        // UI state
        selectedZoneId,
        hoveredZoneId,
        selectedSector,
        searchTerm,
        // Actions
        setSelectedZoneId,
        setHoveredZoneId,
        setSelectedSector,
        setSearchTerm,
        handleResetFilter,
        handleDispatch,
        handleToggleMaintenance,
        refetch
    };
}
