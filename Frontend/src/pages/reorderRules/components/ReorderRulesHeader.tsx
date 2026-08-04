import React from 'react';
import { Header, KpiCard, Badge, Button, Select } from '@/components/common';
import type { WorkflowRule } from '../models/reorderNode';

interface ReorderRulesHeaderProps {
    rules: WorkflowRule[];
    selectedRuleId: string;
    onSelectRule: (ruleId: string) => void;
    onRunSimulation: () => void;
    isSimulating: boolean;
    onToggleRuleActive: () => void;
    isRuleActive: boolean;
    onSaveRule: () => void;
}

export const ReorderRulesHeader: React.FC<ReorderRulesHeaderProps> = ({
    rules,
    selectedRuleId,
    onSelectRule,
    onRunSimulation,
    isSimulating,
    onToggleRuleActive,
    isRuleActive,
    onSaveRule
}) => {
    const totalActiveRules = rules.filter(r => r.active).length;
    const totalTriggered = rules.reduce((sum, r) => sum + r.triggeredCount, 0);

    const ruleOptions = rules.map(r => ({
        label: `${r.name} (${r.active ? 'Active' : 'Disabled'})`,
        value: r.id
    }));

    return (
        <div className="space-y-4">
            <Header
                title="Automated Reorder Rules & Visual Logic Builder"
                subtitle="Visual node-based orchestration engine for just-in-time replenishment, safety buffers, and auto-PO generation"
                badge={
                    <Badge variant="brand">
                        WORKFLOW AUTOMATION
                    </Badge>
                }
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant={isRuleActive ? 'success' : 'outline'}
                            size="sm"
                            onClick={onToggleRuleActive}
                        >
                            {isRuleActive ? '● Workflow Active' : '○ Workflow Paused'}
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={onRunSimulation}
                            isLoading={isSimulating}
                        >
                            Run Logic Simulation
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onSaveRule}
                        >
                            Save Workflow
                        </Button>
                    </div>
                }
            />

            {/* Quick KPI Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <KpiCard
                    title="Active Automation Rules"
                    value={`${totalActiveRules} Workflows`}
                    subtitle="Continuously monitoring stock levels"
                    variant="primary"
                />
                <KpiCard
                    title="Automated POs Triggered"
                    value={`${totalTriggered} Drafts`}
                    subtitle="Saved 18.5 hrs of manual procurement"
                    variant="success"
                />
                <KpiCard
                    title="Avg Replenishment Lead"
                    value="2.4 Days"
                    subtitle="JIT threshold refilling"
                    variant="default"
                />
                <KpiCard
                    title="Engine Health"
                    value="100% Operational"
                    subtitle="Zero logic errors in 72h"
                    variant="default"
                />
            </div>

            {/* Workflow Selector Bar */}
            <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-72">
                    <span className="text-xs font-mono font-bold text-slate-700 uppercase">
                        Select Automation:
                    </span>
                    <div className="w-80">
                        <Select
                            value={selectedRuleId}
                            onChange={(e) => onSelectRule(e.target.value)}
                            options={ruleOptions}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>Trigger Block</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2b6675]" />
                        <span>Condition Block</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                        <span>Action / PO Block</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
