import { useState, useRef } from 'react';
import { initialWorkflowRules } from './mocks/workflowRules';
import type { WorkflowRule, WorkflowNode, NodeType, NodeSubtype, NodeConfig } from './models/reorderNode';
import { ReorderRulesHeader } from './components/ReorderRulesHeader';
import { NodePalette } from './components/NodePalette';
import { NodeBuilderCanvas } from './components/NodeBuilderCanvas';
import { NodeConfigModal } from './components/NodeConfigModal';

export default function ReorderRules() {
    const [rules, setRules] = useState<WorkflowRule[]>(initialWorkflowRules);
    const [selectedRuleId, setSelectedRuleId] = useState<string>(initialWorkflowRules[0]?.id || '');
    const [isSimulating, setIsSimulating] = useState<boolean>(false);
    const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
    const [editingNode, setEditingNode] = useState<WorkflowNode | null>(null);

    const configModalRef = useRef<HTMLDialogElement>(null);

    const activeRule = rules.find(r => r.id === selectedRuleId) || rules[0];

    const handleUpdateNodePosition = (nodeId: string, x: number, y: number) => {
        setRules(prev => prev.map(r => {
            if (r.id !== activeRule.id) return r;
            return {
                ...r,
                nodes: r.nodes.map(n => n.id === nodeId ? { ...n, x, y } : n)
            };
        }));
    };

    const handleConnectNodes = (fromId: string, toId: string) => {
        // Prevent duplicate connection
        const exists = activeRule.connections.some(c => c.fromNodeId === fromId && c.toNodeId === toId);
        if (exists) return;

        const newConnection = {
            id: `conn-${Date.now()}`,
            fromNodeId: fromId,
            toNodeId: toId
        };

        setRules(prev => prev.map(r => {
            if (r.id !== activeRule.id) return r;
            return {
                ...r,
                connections: [...r.connections, newConnection]
            };
        }));
    };

    const handleDeleteConnection = (connectionId: string) => {
        setRules(prev => prev.map(r => {
            if (r.id !== activeRule.id) return r;
            return {
                ...r,
                connections: r.connections.filter(c => c.id !== connectionId)
            };
        }));
    };

    const handleDeleteNode = (nodeId: string) => {
        setRules(prev => prev.map(r => {
            if (r.id !== activeRule.id) return r;
            return {
                ...r,
                nodes: r.nodes.filter(n => n.id !== nodeId),
                connections: r.connections.filter(c => c.fromNodeId !== nodeId && c.toNodeId !== nodeId)
            };
        }));
    };

    const handleAddNode = (type: NodeType, subtype: NodeSubtype) => {
        const id = `node-${Date.now()}`;
        const defaultTitles: Record<string, string> = {
            STOCK_THRESHOLD: 'Stock Level < X',
            SAFETY_STOCK_BREACH: 'Safety Stock Breach',
            LEAD_TIME_EXCEEDED: 'Lead Time Exceeded',
            SALES_VELOCITY_CHECK: 'Verify Sales Velocity (7d)',
            SUPPLIER_MOQ_CHECK: 'Verify Supplier MOQ',
            PROFIT_MARGIN_CHECK: 'Gross Margin Check > 20%',
            GENERATE_PO_DRAFT: 'Generate Purchase Order Draft',
            SEND_PROCUREMENT_ALERT: 'Alert Procurement Team',
            AUTO_APPROVE_PO: 'Auto-Approve PO (EDI)',
            NOTIFY_DISPATCH: 'Notify Dispatch Buffer'
        };

        const newNode: WorkflowNode = {
            id,
            type,
            subtype,
            title: defaultTitles[subtype] || 'New Block',
            description: 'Configure block parameters by clicking Configure.',
            x: 200 + Math.random() * 100,
            y: 150 + Math.random() * 80,
            config: {
                thresholdValue: 10,
                salesDays: 7,
                supplierName: 'TechSupply Sp. z o.o.',
                targetQty: 50
            }
        };

        setRules(prev => prev.map(r => {
            if (r.id !== activeRule.id) return r;
            return {
                ...r,
                nodes: [...r.nodes, newNode]
            };
        }));
    };

    const handleOpenEditNode = (node: WorkflowNode) => {
        setEditingNode(node);
        configModalRef.current?.showModal();
    };

    const handleCloseEditNode = () => {
        configModalRef.current?.close();
        setEditingNode(null);
    };

    const handleSaveNodeConfig = (
        nodeId: string,
        title: string,
        description: string,
        config: NodeConfig
    ) => {
        setRules(prev => prev.map(r => {
            if (r.id !== activeRule.id) return r;
            return {
                ...r,
                nodes: r.nodes.map(n => n.id === nodeId ? { ...n, title, description, config } : n)
            };
        }));
    };

    const handleToggleRuleActive = () => {
        setRules(prev => prev.map(r => {
            if (r.id !== activeRule.id) return r;
            return { ...r, active: !r.active };
        }));
    };

    const handleRunSimulation = () => {
        setIsSimulating(true);
        setSimulationLogs(['[START] Initializing workflow execution test...']);

        setTimeout(() => {
            setSimulationLogs(prev => [...prev, '[TRIGGER] Evaluated node: Stock < 10 threshold condition TRUE (Current inventory: 6 pcs).']);
        }, 600);

        setTimeout(() => {
            setSimulationLogs(prev => [...prev, '[CONDITION] Calculated 7-day velocity: 4.8 units/day. Replenishment validated.']);
        }, 1200);

        setTimeout(() => {
            setSimulationLogs(prev => [
                ...prev,
                '[ACTION] PO Draft Generated successfully for TechSupply Sp. z o.o. (Qty: 50 pcs, Est. Value: 4,500 PLN).',
                '[SUCCESS] Workflow simulation finished in 1.8s with 0 errors.'
            ]);
            setIsSimulating(false);
        }, 1800);
    };

    const handleSaveRule = () => {
        alert(`Workflow "${activeRule.name}" saved to database successfully.`);
    };

    return (
        <div className="w-full space-y-4 pb-8">
            <ReorderRulesHeader
                rules={rules}
                selectedRuleId={selectedRuleId}
                onSelectRule={setSelectedRuleId}
                onRunSimulation={handleRunSimulation}
                isSimulating={isSimulating}
                onToggleRuleActive={handleToggleRuleActive}
                isRuleActive={activeRule.active}
                onSaveRule={handleSaveRule}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start w-full">
                <div className="lg:col-span-1">
                    <NodePalette onAddNode={handleAddNode} />
                </div>

                <div className="lg:col-span-3 space-y-3">
                    <NodeBuilderCanvas
                        nodes={activeRule.nodes}
                        connections={activeRule.connections}
                        onUpdateNodePosition={handleUpdateNodePosition}
                        onConnectNodes={handleConnectNodes}
                        onDeleteConnection={handleDeleteConnection}
                        onDeleteNode={handleDeleteNode}
                        onEditNodeConfig={handleOpenEditNode}
                        isSimulating={isSimulating}
                    />

                    {/* Live Simulation Terminal Logs */}
                    {simulationLogs.length > 0 && (
                        <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono text-xs space-y-1 shadow-xs border border-slate-800">
                            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
                                <span>Automation Engine Test Execution Console</span>
                                <button
                                    onClick={() => setSimulationLogs([])}
                                    className="hover:text-white cursor-pointer"
                                >
                                    Clear
                                </button>
                            </div>
                            {simulationLogs.map((log, idx) => (
                                <div key={idx} className="leading-relaxed">
                                    {log}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <NodeConfigModal
                ref={configModalRef}
                node={editingNode}
                onClose={handleCloseEditNode}
                onSave={handleSaveNodeConfig}
            />
        </div>
    );
}
