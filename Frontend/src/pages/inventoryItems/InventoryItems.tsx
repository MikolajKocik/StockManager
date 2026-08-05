import { useState, useMemo } from 'react';
import { StockHeader } from './components/StockHeader';
import { StockTreemap } from './components/StockTreemap';
import { StockTableView } from './components/StockTableView';
import { StockDetailsDrawer } from './components/StockDetailsDrawer';
import { mockStockTreemapData } from './mocks/stockData';
import type { StockTreemapNode } from './models/stockTreemap';
import toast from 'react-hot-toast';

export default function InventoryItems() {
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('ALL');
    const [selectedRotation, setSelectedRotation] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [viewMode, setViewMode] = useState<'treemap' | 'table'>('treemap');
    const [selectedNode, setSelectedNode] = useState<StockTreemapNode | null>(null);

    const filteredData = useMemo(() => {
        return mockStockTreemapData.filter(cat => {
            if (selectedWarehouse !== 'ALL' && cat.warehouse !== selectedWarehouse) {
                return false;
            }
            if (selectedRotation !== 'ALL' && cat.rotationStatus !== selectedRotation) {
                const hasMatchingChild = cat.children?.some(c =>
                    c.rotationStatus === selectedRotation ||
                    c.children?.some(p => p.rotationStatus === selectedRotation)
                );
                if (!hasMatchingChild) return false;
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchesCat = cat.name.toLowerCase().includes(q);
                const matchesChild = cat.children?.some(c =>
                    c.name.toLowerCase().includes(q) ||
                    c.children?.some(p => p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q))
                );
                if (!matchesCat && !matchesChild) return false;
            }
            return true;
        });
    }, [selectedWarehouse, selectedRotation, searchQuery]);

    {/** Recursively computes weighted turnover days and category valuations across tree hierarchy */ }
    const { totalValue, deadStockValue, fastStockValue, avgTurnoverDays } = useMemo(() => {
        let totalVal = 0;
        let deadVal = 0;
        let fastVal = 0;
        let weightedDays = 0;

        const collectValues = (nodes: StockTreemapNode[]) => {
            nodes.forEach(n => {
                if (n.level === 'product') {
                    totalVal += n.value;
                    weightedDays += n.turnoverDays * n.value;
                    if (n.rotationStatus === 'DEAD_STOCK') {
                        deadVal += n.value;
                    } else if (n.rotationStatus === 'FAST') {
                        fastVal += n.value;
                    }
                } else if (n.children) {
                    collectValues(n.children);
                }
            });
        };

        collectValues(mockStockTreemapData);

        return {
            totalValue: totalVal,
            deadStockValue: deadVal,
            fastStockValue: fastVal,
            avgTurnoverDays: totalVal > 0 ? Math.round(weightedDays / totalVal) : 0
        };
    }, []);

    const handleNodeAction = (actionType: string, node: StockTreemapNode) => {
        if (actionType === 'DISCOUNT_CLEARANCE') {
            toast.success(`Initiated 25% Discount Clearance order for: ${node.name} (${node.sku || node.id})`);
        } else if (actionType === 'REORDER') {
            toast.success(`Scheduled automatic procurement refill for: ${node.name}`);
        } else if (actionType === 'TRANSFER_BIN') {
            toast.success(`Relocation task created for SKU: ${node.sku} to secondary storage zone.`);
        }
    };

    return (
        <div className="w-full space-y-4">
            <StockHeader
                totalValue={totalValue}
                deadStockValue={deadStockValue}
                fastStockValue={fastStockValue}
                avgTurnoverDays={avgTurnoverDays}
                selectedWarehouse={selectedWarehouse}
                onSelectWarehouse={setSelectedWarehouse}
                selectedRotation={selectedRotation}
                onSelectRotation={setSelectedRotation}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                viewMode={viewMode}
                onToggleViewMode={setViewMode}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
                <div className={selectedNode ? 'lg:col-span-3' : 'lg:col-span-4'}>
                    {viewMode === 'treemap' ? (
                        <StockTreemap
                            data={filteredData}
                            onSelectNode={setSelectedNode}
                            selectedNodeId={selectedNode?.id || null}
                        />
                    ) : (
                        <StockTableView
                            data={filteredData}
                            onSelectNode={setSelectedNode}
                        />
                    )}
                </div>

                {selectedNode && (
                    <div className="lg:col-span-1">
                        <StockDetailsDrawer
                            node={selectedNode}
                            onClose={() => setSelectedNode(null)}
                            onAction={handleNodeAction}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
