import React from 'react';
import { 
    Table, 
    TableHead, 
    TableRow, 
    TableHeaderCell, 
    TableBody, 
    TableCell, 
    Badge, 
    Button, 
    Input, 
    Modal 
} from '@/components/common';
import type { RmaStatus, DispositionAction } from '@/models/rma';
import { ReturnsHeader } from './components/ReturnsHeader';
import { VisualClassificationWizard } from './components/VisualClassificationWizard';
import { RmaDetailModal } from './components/RmaDetailModal';
import { RmaCreateModal } from './components/RmaCreateModal';
import { useReturnsManager } from './hooks/useReturnsManager';

const STATUS_BADGE_MAP: Record<RmaStatus, 'emerald' | 'brand' | 'danger' | 'amber'> = {
    RESTOCKED: 'emerald',
    SERVICED: 'brand',
    DISPOSED: 'danger',
    INSPECTION_PENDING: 'amber',
    DRAFT: 'amber',
    INSPECTED: 'brand',
    REJECTED: 'danger'
};

const ACTION_BADGE_MAP: Record<DispositionAction, 'emerald' | 'brand' | 'danger' | 'slate'> = {
    RESTOCK_PRIME: 'emerald',
    TRANSFER_TO_SERVICE: 'brand',
    DISPOSE_SCRAP: 'danger',
    PENDING: 'slate'
};

export const Returns: React.FC = () => {
    const {
        rmas,
        filteredRmas,
        kpis,
        isLoading,
        isError,
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
        handleCreateRma
    } = useReturnsManager();

    if (isError) {
        return (
            <div className="p-8 text-center border border-rose-200 rounded-lg bg-rose-50 font-mono text-xs text-rose-800 space-y-3">
                <p>Failed to load return orders from server.</p>
                <Button variant="danger" size="sm" onClick={() => refetchRmas()}>
                    Retry Loading
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <ReturnsHeader
                kpis={kpis}
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                activeFilter={activeStatusTab}
                onFilterChange={setActiveStatusTab}
            />

            <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="w-full sm:w-80">
                    <Input
                        placeholder="Search by RMA ID, Product, Customer, or Order #..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="text-xs font-mono text-slate-500 self-end sm:self-center">
                    Showing <strong className="text-slate-900">{filteredRmas.length}</strong> of {rmas.length} records
                </div>
            </div>

            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>RMA ID / Date</TableHeaderCell>
                            <TableHeaderCell>Product & SKU</TableHeaderCell>
                            <TableHeaderCell>Customer & Order Ref</TableHeaderCell>
                            <TableHeaderCell>Return Reason</TableHeaderCell>
                            <TableHeaderCell>Inspection Status</TableHeaderCell>
                            <TableHeaderCell>Action Suggested / Final</TableHeaderCell>
                            <TableHeaderCell className="text-right">Operations</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-slate-500 font-mono text-xs">
                                    Loading Return Merchandise Authorizations...
                                </TableCell>
                            </TableRow>
                        ) : filteredRmas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-slate-500 font-mono text-xs">
                                    No RMA records matching the selected criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRmas.map((rma) => {
                                const isPending = rma.status === 'INSPECTION_PENDING' || rma.status === 'DRAFT';
                                const statusVariant = STATUS_BADGE_MAP[rma.status] ?? 'amber';
                                const finalActionVariant = rma.finalAction ? (ACTION_BADGE_MAP[rma.finalAction] ?? 'slate') : 'slate';

                                return (
                                    <TableRow key={rma.id}>
                                        <TableCell>
                                            <div className="font-mono text-xs font-bold text-slate-900">
                                                {rma.id}
                                            </div>
                                            <div className="text-xs font-mono text-slate-500">
                                                {rma.returnDate}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="font-mono text-xs font-bold text-slate-900">
                                                {rma.productName}
                                            </div>
                                            <div className="text-xs font-mono text-slate-500">
                                                Qty: <strong className="text-slate-800">{rma.quantity} {rma.unit}</strong> | {rma.productSku}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="text-xs font-bold text-slate-800">
                                                {rma.customerName}
                                            </div>
                                            <div className="text-xs font-mono text-slate-500">
                                                Ref: {rma.salesOrderId}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant="slate" className="text-xs font-mono">
                                                {rma.customerReason.replace(/_/g, ' ')}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant={statusVariant}
                                                className="text-xs font-mono"
                                            >
                                                {rma.status.replace(/_/g, ' ')}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                {rma.finalAction && rma.finalAction !== 'PENDING' ? (
                                                    <Badge
                                                        variant={finalActionVariant}
                                                        className="text-xs font-mono"
                                                    >
                                                        Final: {rma.finalAction.replace(/_/g, ' ')}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="blue" className="text-xs font-mono">
                                                        Suggested: {rma.suggestedAction.replace(/_/g, ' ')}
                                                    </Badge>
                                                )}
                                                {rma.destinationBin && (
                                                    <span className="text-xs font-mono text-slate-500">
                                                        Dest: {rma.destinationBin}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {isPending ? (
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        className="text-xs py-1"
                                                        onClick={() => setSelectedRmaForWizard(rma)}
                                                    >
                                                        Classify &gt;
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-xs py-1"
                                                        onClick={() => setSelectedRmaForWizard(rma)}
                                                    >
                                                        Re-inspect
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="text-xs py-1"
                                                    onClick={() => setSelectedRmaForDetail(rma)}
                                                >
                                                    Audit Log
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {selectedRmaForWizard && (
                <Modal
                    isOpen={!!selectedRmaForWizard}
                    onClose={() => setSelectedRmaForWizard(null)}
                    title={`Visual Classification Assistant: ${selectedRmaForWizard.id} (${selectedRmaForWizard.productName})`}
                    size="xl"
                >
                    <VisualClassificationWizard
                        rma={selectedRmaForWizard}
                        onClose={() => setSelectedRmaForWizard(null)}
                        onSaveSuccess={() => {
                            setSelectedRmaForWizard(null);
                            refetchRmas();
                        }}
                    />
                </Modal>
            )}

            {selectedRmaForDetail && (
                <RmaDetailModal
                    rma={selectedRmaForDetail}
                    isOpen={!!selectedRmaForDetail}
                    onClose={() => setSelectedRmaForDetail(null)}
                    onStartInspection={(rma) => setSelectedRmaForWizard(rma)}
                />
            )}

            {isCreateModalOpen && (
                <RmaCreateModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreated={handleCreateRma}
                />
            )}
        </div>
    );
};

export default Returns;
