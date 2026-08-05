import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { returnsApi } from '@/api/internal/returnsApi';
import type { RmaRecord, RmaKpiSummary } from '@/models/rma';
import toast from 'react-hot-toast';

export function useReturnsManager() {
    const queryClient = useQueryClient();

    // Query for all RMA records
    const { 
        data: rmas = [], 
        isLoading: isRmasLoading, 
        isError: isRmasError, 
        refetch: refetchRmas 
    } = useQuery<RmaRecord[]>({
        queryKey: ['returns'],
        queryFn: returnsApi.getAll
    });

    // Query for KPI statistics
    const { 
        data: kpis = {
            totalRmas: 0,
            pendingInspection: 0,
            restockedPrime: 0,
            routedToService: 0,
            disposedScrap: 0,
            avgInspectionMinutes: 14.5
        },
        isLoading: isKpisLoading
    } = useQuery<RmaKpiSummary>({
        queryKey: ['returns', 'kpis'],
        queryFn: returnsApi.getKpis
    });

    // Filtering & search state
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeStatusTab, setActiveStatusTab] = useState<string>('ALL');

    // Active modal states
    const [selectedRmaForWizard, setSelectedRmaForWizard] = useState<RmaRecord | null>(null);
    const [selectedRmaForDetail, setSelectedRmaForDetail] = useState<RmaRecord | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    // Filtered RMA list
    const filteredRmas = useMemo(() => {
        return rmas.filter((rma) => {
            // Status Tab filtering
            if (activeStatusTab === 'PENDING' && rma.status !== 'INSPECTION_PENDING' && rma.status !== 'DRAFT') {
                return false;
            }
            if (activeStatusTab === 'RESTOCKED' && rma.status !== 'RESTOCKED' && rma.finalAction !== 'RESTOCK_PRIME') {
                return false;
            }
            if (activeStatusTab === 'SERVICED' && rma.status !== 'SERVICED' && rma.finalAction !== 'TRANSFER_TO_SERVICE') {
                return false;
            }
            if (activeStatusTab === 'DISPOSED' && rma.status !== 'DISPOSED' && rma.finalAction !== 'DISPOSE_SCRAP') {
                return false;
            }

            // Search query matching
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchId = rma.id.toLowerCase().includes(q);
                const matchOrder = rma.salesOrderId.toLowerCase().includes(q);
                const matchCustomer = rma.customerName.toLowerCase().includes(q);
                const matchProduct = rma.productName.toLowerCase().includes(q);
                const matchSku = rma.productSku.toLowerCase().includes(q);
                return matchId || matchOrder || matchCustomer || matchProduct || matchSku;
            }

            return true;
        });
    }, [rmas, activeStatusTab, searchQuery]);

    // Mutation: Create RMA
    const createRmaMutation = useMutation({
        mutationFn: returnsApi.createRma,
        onSuccess: (newRma) => {
            queryClient.invalidateQueries({ queryKey: ['returns'] });
            queryClient.invalidateQueries({ queryKey: ['returns', 'kpis'] });
            toast.success(`Created return order ${newRma.id}`);
            setIsCreateModalOpen(false);
        },
        onError: () => {
            toast.error('Failed to create return order.');
        }
    });

    // Mutation: Save Visual Inspection
    const saveInspectionMutation = useMutation({
        mutationFn: ({ rmaId, payload }: { rmaId: string; payload: Parameters<typeof returnsApi.saveInspection>[1] }) =>
            returnsApi.saveInspection(rmaId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['returns'] });
            queryClient.invalidateQueries({ queryKey: ['returns', 'kpis'] });
        },
        onError: () => {
            toast.error('Failed to save inspection.');
        }
    });

    // Mutation: Finalize Disposition
    const finalizeDispositionMutation = useMutation({
        mutationFn: ({ rmaId, payload }: { rmaId: string; payload: Parameters<typeof returnsApi.finalizeDisposition>[1] }) =>
            returnsApi.finalizeDisposition(rmaId, payload),
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ['returns'] });
            queryClient.invalidateQueries({ queryKey: ['returns', 'kpis'] });
            toast.success(`RMA ${updated.id} classified: ${updated.finalAction.replace('_', ' ')}`);
            setSelectedRmaForWizard(null);
        },
        onError: () => {
            toast.error('Failed to finalize RMA disposition.');
        }
    });

    const handleCreateRma = useCallback((newRecord: Parameters<typeof returnsApi.createRma>[0]) => {
        return createRmaMutation.mutateAsync(newRecord);
    }, [createRmaMutation]);

    const handleSaveInspection = useCallback((rmaId: string, payload: Parameters<typeof returnsApi.saveInspection>[1]) => {
        return saveInspectionMutation.mutateAsync({ rmaId, payload });
    }, [saveInspectionMutation]);

    const handleFinalizeDisposition = useCallback((rmaId: string, payload: Parameters<typeof returnsApi.finalizeDisposition>[1]) => {
        return finalizeDispositionMutation.mutateAsync({ rmaId, payload });
    }, [finalizeDispositionMutation]);

    return {
        rmas,
        filteredRmas,
        kpis,
        isLoading: isRmasLoading || isKpisLoading,
        isError: isRmasError,
        refetchRmas,
        searchQuery,
        setSearchQuery,
        activeStatusTab,
        setActiveStatusTab,
        selectedRmaForWizard,
        setSelectedRmaForWizard,
        selectedRmaForDetail,
        setSelectedRmaForDetail,
        isCreateModalOpen,
        setIsCreateModalOpen,
        handleCreateRma,
        handleSaveInspection,
        handleFinalizeDisposition,
        isSubmitting: createRmaMutation.isPending || saveInspectionMutation.isPending || finalizeDispositionMutation.isPending
    };
}
