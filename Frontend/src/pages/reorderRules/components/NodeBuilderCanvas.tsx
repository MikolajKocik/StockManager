import React, { useState, useRef } from 'react';
import type { WorkflowNode, WorkflowConnection, NodeType } from '../models/reorderNode';
import { Badge } from '@/components/common/custom';

interface NodeBuilderCanvasProps {
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
    onUpdateNodePosition: (nodeId: string, x: number, y: number) => void;
    onConnectNodes: (fromId: string, toId: string) => void;
    onDeleteConnection: (connectionId: string) => void;
    onDeleteNode: (nodeId: string) => void;
    onEditNodeConfig: (node: WorkflowNode) => void;
    isSimulating: boolean;
}

interface NodeTheme {
    border: string;
    headerBg: string;
    badge: 'warning' | 'brand' | 'success';
    badgeText: string;
    cardBg: string;
}

const NODE_THEME_MAP: Record<NodeType, NodeTheme> = {
    'TRIGGER': {
        border: 'border-amber-400',
        headerBg: 'bg-amber-100 text-amber-900 border-amber-300',
        badge: 'warning',
        badgeText: 'TRIGGER',
        cardBg: 'bg-amber-50/50'
    },
    'CONDITION': {
        border: 'border-[#2b6675]/50',
        headerBg: 'bg-[#f0f7f8] text-[#2b6675] border-[#2b6675]/30',
        badge: 'brand',
        badgeText: 'CONDITION',
        cardBg: 'bg-white'
    },
    'ACTION': {
        border: 'border-emerald-400',
        headerBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        badge: 'success',
        badgeText: 'ACTION',
        cardBg: 'bg-emerald-50/50'
    }
};

const NODE_WIDTH = 240;
const NODE_HEIGHT = 120;

export const NodeBuilderCanvas: React.FC<NodeBuilderCanvasProps> = ({
    nodes,
    connections,
    onUpdateNodePosition,
    onConnectNodes,
    onDeleteConnection,
    onDeleteNode,
    onEditNodeConfig,
    isSimulating
}) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
    const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    // Dragging handling
    const handleMouseDown = (e: React.MouseEvent, node: WorkflowNode) => {
        if ((e.target as HTMLElement).closest('.node-action-btn') || (e.target as HTMLElement).closest('.port-handle')) {
            return;
        }
        setDraggedNodeId(node.id);
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggedNodeId || !canvasRef.current) return;
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const newX = Math.max(20, Math.min(canvasRect.width - NODE_WIDTH - 20, e.clientX - canvasRect.left - dragOffset.current.x));
        const newY = Math.max(20, Math.min(canvasRect.height - NODE_HEIGHT - 20, e.clientY - canvasRect.top - dragOffset.current.y));
        onUpdateNodePosition(draggedNodeId, newX, newY);
    };

    const handleMouseUp = () => {
        setDraggedNodeId(null);
    };

    // Connection port handling
    const handleOutputPortClick = (e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        setConnectingFromId(nodeId);
    };

    const handleInputPortClick = (e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        if (connectingFromId && connectingFromId !== nodeId) {
            onConnectNodes(connectingFromId, nodeId);
            setConnectingFromId(null);
        }
    };

    return (
        <div
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={() => setConnectingFromId(null)}
            className="relative w-full h-160 bg-[#f8fafc] border border-slate-300 rounded-lg overflow-hidden select-none shadow-xs"
        >
            {/* SVG Background Grid & Connectors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <pattern id="node-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                    </pattern>
                    <marker
                        id="arrow"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#2b6675" />
                    </marker>
                    <marker
                        id="arrow-anim"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
                    </marker>
                </defs>

                <rect width="100%" height="100%" fill="url(#node-grid)" />

                {/* Render Connectors */}
                {connections.map((conn) => {
                    const fromNode = nodes.find(n => n.id === conn.fromNodeId);
                    const toNode = nodes.find(n => n.id === conn.toNodeId);
                    if (!fromNode || !toNode) return null;

                    const startX = fromNode.x + NODE_WIDTH;
                    const startY = fromNode.y + NODE_HEIGHT / 2;
                    const endX = toNode.x;
                    const endY = toNode.y + NODE_HEIGHT / 2;

                    const dx = Math.max(50, Math.abs(endX - startX) * 0.5);
                    const pathData = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;

                    return (
                        <g key={conn.id} className="pointer-events-auto cursor-pointer group">
                            {/* Hover hit area */}
                            <path
                                d={pathData}
                                fill="none"
                                stroke="transparent"
                                strokeWidth="16"
                                onClick={() => onDeleteConnection(conn.id)}
                            />
                            {/* Visible Connector Line */}
                            <path
                                d={pathData}
                                fill="none"
                                stroke={isSimulating ? '#059669' : '#2b6675'}
                                strokeWidth={isSimulating ? '3' : '2'}
                                strokeDasharray={isSimulating ? '6,4' : undefined}
                                markerEnd={isSimulating ? 'url(#arrow-anim)' : 'url(#arrow)'}
                            />
                            {/* Delete button midpoint indicator on hover */}
                            <circle
                                cx={(startX + endX) / 2}
                                cy={(startY + endY) / 2}
                                r="9"
                                fill="#ffffff"
                                stroke="#991b1b"
                                strokeWidth="1.5"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => onDeleteConnection(conn.id)}
                            />
                            <text
                                x={(startX + endX) / 2}
                                y={(startY + endY) / 2 + 3.5}
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight="bold"
                                fill="#991b1b"
                                className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                            >
                                &#10005;
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Connecting prompt toast */}
            {connectingFromId && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-mono px-3 py-1.5 rounded-full shadow-lg z-50 flex items-center gap-2">
                    <span>Click input port on target block to connect</span>
                </div>
            )}

            {/* Render Nodes */}
            {nodes.map((node) => {
                const theme = NODE_THEME_MAP[node.type];
                const isConnectingSource = connectingFromId === node.id;

                return (
                    <div
                        key={node.id}
                        onMouseDown={(e) => handleMouseDown(e, node)}
                        style={{
                            left: `${node.x}px`,
                            top: `${node.y}px`,
                            width: `${NODE_WIDTH}px`,
                            height: `${NODE_HEIGHT}px`
                        }}
                        className={`absolute rounded-lg border shadow-sm flex flex-col justify-between cursor-move transition-shadow duration-150 z-20 ${theme.cardBg
                            } ${theme.border} ${isConnectingSource ? 'ring-2 ring-emerald-500 shadow-md' : 'hover:shadow-md'
                            }`}
                    >
                        {/* Left Input Port */}
                        {node.type !== 'TRIGGER' && (
                            <div
                                onClick={(e) => handleInputPortClick(e, node.id)}
                                title="Click to connect as target"
                                className={`port-handle absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center cursor-pointer shadow-xs z-30 transition-transform ${connectingFromId ? 'bg-emerald-500 scale-125' : 'bg-slate-500 hover:bg-slate-700'
                                    }`}
                            >
                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                            </div>
                        )}

                        {/* Right Output Port */}
                        <div
                            onClick={(e) => handleOutputPortClick(e, node.id)}
                            title="Click to draw connection arrow"
                            className={`port-handle absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center cursor-pointer shadow-xs z-30 transition-transform ${isConnectingSource ? 'bg-emerald-600 scale-125' : 'bg-[#2b6675] hover:bg-[#204e5a]'
                                }`}
                        >
                            <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>

                        {/* Node Top Header */}
                        <div className={`px-2.5 py-1.5 border-b rounded-t-lg flex items-center justify-between gap-1 ${theme.headerBg}`}>
                            <span className="font-bold text-xs text-slate-900 truncate">
                                {node.title}
                            </span>
                            <Badge variant={theme.badge} className="text-[0.5rem] px-1 py-0 uppercase">
                                {theme.badgeText}
                            </Badge>
                        </div>

                        {/* Node Body / Description */}
                        <div className="px-2.5 py-1 flex-1 flex flex-col justify-center">
                            <p className="text-[0.6875rem] text-slate-600 leading-tight">
                                {node.description}
                            </p>
                        </div>

                        {/* Node Footer Actions */}
                        <div className="px-2.5 py-1 bg-slate-100/80 border-t border-slate-200/80 rounded-b-lg flex items-center justify-between text-xs">
                            <button
                                onClick={() => onEditNodeConfig(node)}
                                className="node-action-btn text-[0.6875rem] font-semibold text-[#2b6675] hover:underline cursor-pointer"
                            >
                                Configure
                            </button>
                            <button
                                onClick={() => onDeleteNode(node.id)}
                                className="node-action-btn text-[0.6875rem] font-semibold text-red-600 hover:underline cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
