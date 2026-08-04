export type NodeType = 'TRIGGER' | 'CONDITION' | 'ACTION';

export type NodeSubtype =
    // Triggers
    | 'STOCK_THRESHOLD'
    | 'SAFETY_STOCK_BREACH'
    | 'LEAD_TIME_EXCEEDED'
    // Conditions
    | 'SALES_VELOCITY_CHECK'
    | 'SUPPLIER_MOQ_CHECK'
    | 'PROFIT_MARGIN_CHECK'
    // Actions
    | 'GENERATE_PO_DRAFT'
    | 'SEND_PROCUREMENT_ALERT'
    | 'AUTO_APPROVE_PO'
    | 'NOTIFY_DISPATCH';

export interface NodeConfig {
    thresholdValue?: number;
    salesDays?: number;
    supplierId?: string;
    supplierName?: string;
    targetQty?: number;
    notificationChannel?: 'EMAIL' | 'SLACK' | 'SMS';
    minMarginPercent?: number;
}

export interface WorkflowNode {
    id: string;
    type: NodeType;
    subtype: NodeSubtype;
    title: string;
    description: string;
    x: number;
    y: number;
    config: NodeConfig;
    executionStatus?: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'SKIPPED';
}

export interface WorkflowConnection {
    id: string;
    fromNodeId: string;
    toNodeId: string;
}

export interface WorkflowRule {
    id: string;
    name: string;
    description: string;
    active: boolean;
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
    lastExecutedAt?: string;
    triggeredCount: number;
}
