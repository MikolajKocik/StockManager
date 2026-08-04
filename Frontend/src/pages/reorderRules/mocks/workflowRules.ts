import type { WorkflowRule } from '../models/reorderNode';

export const initialWorkflowRules: WorkflowRule[] = [
    {
        id: 'rule-jit-auto-po',
        name: 'Just-in-Time Auto Replenishment (Stock < 10)',
        description: 'Detects low inventory levels, calculates 7-day velocity, and creates a purchase order draft.',
        active: true,
        triggeredCount: 42,
        lastExecutedAt: '2026-08-04 14:35',
        nodes: [
            {
                id: 'node-trigger-1',
                type: 'TRIGGER',
                subtype: 'STOCK_THRESHOLD',
                title: 'Stock Level < 10',
                description: 'Available index quantity drops below the 10 units threshold.',
                x: 60,
                y: 120,
                config: {
                    thresholdValue: 10
                },
                executionStatus: 'IDLE'
            },
            {
                id: 'node-condition-1',
                type: 'CONDITION',
                subtype: 'SALES_VELOCITY_CHECK',
                title: '7-Day Sales Velocity',
                description: 'Check average daily outbound dispatches over the past 7 days.',
                x: 360,
                y: 120,
                config: {
                    salesDays: 7
                },
                executionStatus: 'IDLE'
            },
            {
                id: 'node-action-1',
                type: 'ACTION',
                subtype: 'GENERATE_PO_DRAFT',
                title: 'Generate PO Draft',
                description: 'Create automated purchase order draft for TechSupply Inc.',
                x: 680,
                y: 120,
                config: {
                    supplierId: 'SUP-001',
                    supplierName: 'TechSupply Inc.',
                    targetQty: 50
                },
                executionStatus: 'IDLE'
            }
        ],
        connections: [
            {
                id: 'conn-1-2',
                fromNodeId: 'node-trigger-1',
                toNodeId: 'node-condition-1'
            },
            {
                id: 'conn-2-3',
                fromNodeId: 'node-condition-1',
                toNodeId: 'node-action-1'
            }
        ]
    },
    {
        id: 'rule-safety-stock-breach',
        name: 'Safety Stock Breach & Alert',
        description: 'Immediate notification dispatched when critical safety inventory buffer is breached.',
        active: true,
        triggeredCount: 18,
        lastExecutedAt: '2026-08-04 11:20',
        nodes: [
            {
                id: 'node-trigger-2',
                type: 'TRIGGER',
                subtype: 'SAFETY_STOCK_BREACH',
                title: 'Critical Buffer Breached',
                description: 'Safety stock compromised by urgent production requirements.',
                x: 60,
                y: 100,
                config: {
                    thresholdValue: 5
                },
                executionStatus: 'IDLE'
            },
            {
                id: 'node-condition-2',
                type: 'CONDITION',
                subtype: 'SUPPLIER_MOQ_CHECK',
                title: 'Verify Supplier MOQ',
                description: 'Does required replenishment volume meet minimum order quantity (MOQ >= 20)?',
                x: 360,
                y: 100,
                config: {
                    thresholdValue: 20
                },
                executionStatus: 'IDLE'
            },
            {
                id: 'node-action-2',
                type: 'ACTION',
                subtype: 'SEND_PROCUREMENT_ALERT',
                title: 'Procurement Team Alert',
                description: 'Send instant notification to Slack #procurement-urgent channel.',
                x: 680,
                y: 100,
                config: {
                    notificationChannel: 'SLACK'
                },
                executionStatus: 'IDLE'
            }
        ],
        connections: [
            {
                id: 'conn-2-1-2',
                fromNodeId: 'node-trigger-2',
                toNodeId: 'node-condition-2'
            },
            {
                id: 'conn-2-2-3',
                fromNodeId: 'node-condition-2',
                toNodeId: 'node-action-2'
            }
        ]
    }
];
