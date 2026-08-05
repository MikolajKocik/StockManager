import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { LabelTemplate, LabelElement } from '../../models/labelTemplate';
import { generateBarcodeSvg } from '../../utils/barcodeEngine';

interface CanvasProps {
    template: LabelTemplate;
    selectedElementId: string | null;
    onSelectElement: (id: string | null) => void;
    onUpdateElement: (id: string, updates: Partial<LabelElement>) => void;
    onDeleteElement?: (id: string) => void;
    onDuplicateElement?: (id: string) => void;
    sampleData: Record<string, string>;
    isPreviewMode: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({
    template,
    selectedElementId,
    onSelectElement,
    onUpdateElement,
    onDeleteElement,
    onDuplicateElement,
    sampleData,
    isPreviewMode
}) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState<number>(1.0); // 1.0 = ~3.2 px per mm
    const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
    const [showGrid, setShowGrid] = useState<boolean>(true);

    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<{
        mouseX: number;
        mouseY: number;
        elementX: number;
        elementY: number;
        elementW: number;
        elementH: number;
    }>({
        mouseX: 0,
        mouseY: 0,
        elementX: 0,
        elementY: 0,
        elementW: 0,
        elementH: 0
    });

    const scale = 3.2 * zoom; // px per mm

    const snap = useCallback((val: number, step: number = 2) => {
        if (!snapToGrid) return Math.round(val * 10) / 10;
        return Math.round(val / step) * step;
    }, [snapToGrid]);

    const handleMouseDownElement = (e: React.MouseEvent, el: LabelElement) => {
        if (isPreviewMode) return;
        e.stopPropagation();
        onSelectElement(el.id);
        setIsDragging(true);
        setDragStart({
            mouseX: e.clientX,
            mouseY: e.clientY,
            elementX: el.x,
            elementY: el.y,
            elementW: el.width,
            elementH: el.height
        });
    };

    const handleMouseDownResize = (e: React.MouseEvent, el: LabelElement) => {
        if (isPreviewMode) return;
        e.stopPropagation();
        setIsResizing(true);
        setDragStart({
            mouseX: e.clientX,
            mouseY: e.clientY,
            elementX: el.x,
            elementY: el.y,
            elementW: el.width,
            elementH: el.height
        });
    };

    // Global Window Event Listeners for smooth, non-sticking drag & resize
    useEffect(() => {
        if (!isDragging && !isResizing) return;

        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!selectedElementId) return;
            const el = template.elements.find(item => item.id === selectedElementId);
            if (!el) return;

            const deltaX = (e.clientX - dragStart.mouseX) / scale;
            const deltaY = (e.clientY - dragStart.mouseY) / scale;

            if (isDragging) {
                const rawNewX = dragStart.elementX + deltaX;
                const rawNewY = dragStart.elementY + deltaY;

                const newX = Math.max(0, Math.min(template.dimensions.widthMm - el.width, snap(rawNewX)));
                const newY = Math.max(0, Math.min(template.dimensions.heightMm - el.height, snap(rawNewY)));

                onUpdateElement(selectedElementId, { x: newX, y: newY });
            } else if (isResizing) {
                const rawNewW = dragStart.elementW + deltaX;
                const rawNewH = dragStart.elementH + deltaY;

                const newW = Math.max(5, Math.min(template.dimensions.widthMm - el.x, snap(rawNewW)));
                const newH = Math.max(2, Math.min(template.dimensions.heightMm - el.y, snap(rawNewH)));

                onUpdateElement(selectedElementId, { width: newW, height: newH });
            }
        };

        const handleGlobalMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, isResizing, selectedElementId, template, dragStart, scale, snap, onUpdateElement]);

    // Keyboard shortcut for Delete / Backspace
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedElementId || isPreviewMode) return;

            // Do not delete if user is currently typing in an input or textarea
            const activeTag = document.activeElement?.tagName.toLowerCase();
            if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
                return;
            }

            if ((e.key === 'Delete' || e.key === 'Backspace') && onDeleteElement) {
                e.preventDefault();
                onDeleteElement(selectedElementId);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElementId, isPreviewMode, onDeleteElement]);

    const resolveText = (text: string) => {
        if (!isPreviewMode) return text;
        let res = text;
        for (const [k, v] of Object.entries(sampleData)) {
            res = res.replaceAll(k, v);
        }
        return res;
    };

    const canvasWidthPx = template.dimensions.widthMm * scale;
    const canvasHeightPx = template.dimensions.heightMm * scale;

    const handleCanvasBackgroundClick = (e: React.MouseEvent) => {
        // Only deselect if clicked directly on the canvas background or outer container
        if (e.target === e.currentTarget || e.target === canvasRef.current) {
            onSelectElement(null);
        }
    };

    return (
        <div
            className="flex-1 bg-slate-200/90 rounded-lg p-4 flex flex-col items-center justify-start overflow-auto select-none border border-slate-300 shadow-inner"
            onClick={handleCanvasBackgroundClick}
        >
            {/* Top Toolbar for Canvas Controls */}
            <div
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 mb-3 flex items-center justify-between shadow-xs text-xs"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Zoom:</span>
                    <button
                        type="button"
                        onClick={() => setZoom(z => Math.max(0.7, z - 0.15))}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs cursor-pointer font-bold"
                    >
                        -
                    </button>
                    <span className="font-mono text-slate-800 text-[0.6875rem] w-12 text-center">
                        {Math.round(zoom * 100)}%
                    </span>
                    <button
                        type="button"
                        onClick={() => setZoom(z => Math.min(1.6, z + 0.15))}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs cursor-pointer font-bold"
                    >
                        +
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                        <input
                            type="checkbox"
                            checked={showGrid}
                            onChange={(e) => setShowGrid(e.target.checked)}
                            className="w-3.5 h-3.5 accent-slate-800"
                        />
                        <span>Grid</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                        <input
                            type="checkbox"
                            checked={snapToGrid}
                            onChange={(e) => setSnapToGrid(e.target.checked)}
                            className="w-3.5 h-3.5 accent-slate-800"
                        />
                        <span>Snap (2mm)</span>
                    </label>

                    <span className="text-[0.6875rem] text-slate-500 font-mono">
                        {template.dimensions.widthMm} x {template.dimensions.heightMm} mm
                    </span>
                </div>
            </div>

            {/* Label Canvas Container with Shadow and Physical Label Frame */}
            <div
                ref={canvasRef}
                onClick={handleCanvasBackgroundClick}
                className="relative bg-white border border-slate-400 shadow-2xl transition-all"
                style={{
                    width: `${canvasWidthPx}px`,
                    height: `${canvasHeightPx}px`,
                    backgroundImage: showGrid
                        ? `radial-gradient(circle, #cbd5e1 1px, transparent 1px)`
                        : 'none',
                    backgroundSize: `${scale * 5}px ${scale * 5}px`
                }}
            >
                {/* Physical Notch / Thermal Cut Indicator */}
                <div className="absolute top-0 right-0 w-3 h-3 bg-slate-300 border-l border-b border-slate-400 opacity-60 pointer-events-none" />

                {/* Render Template Elements */}
                {template.elements.map((el) => {
                    const isSelected = selectedElementId === el.id;
                    const leftPx = el.x * scale;
                    const topPx = el.y * scale;
                    const widthPx = el.width * scale;
                    const heightPx = el.height * scale;
                    const text = resolveText(el.content);

                    return (
                        <div
                            key={el.id}
                            onMouseDown={(e) => handleMouseDownElement(e, el)}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectElement(el.id);
                            }}
                            className={`absolute select-none transition-shadow ${isSelected && !isPreviewMode
                                    ? 'ring-2 ring-blue-600 ring-offset-1 z-30 cursor-move shadow-md bg-blue-50/20'
                                    : 'hover:ring-1 hover:ring-slate-400 cursor-pointer z-10'
                                }`}
                            style={{
                                left: `${leftPx}px`,
                                top: `${topPx}px`,
                                width: `${widthPx}px`,
                                height: `${heightPx}px`
                            }}
                        >
                            {/* Floating Toolbar right on the selected element for immediate action */}
                            {isSelected && !isPreviewMode && (
                                <div
                                    className="absolute -top-7 left-0 bg-slate-900 text-white rounded px-1.5 py-0.5 text-[0.625rem] flex items-center gap-1.5 shadow-lg z-50 pointer-events-auto"
                                    onClick={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    <span className="font-mono text-amber-300 truncate max-w-22.5">
                                        {el.label || el.type}
                                    </span>
                                    {onDuplicateElement && (
                                        <button
                                            type="button"
                                            onClick={() => onDuplicateElement(el.id)}
                                            className="px-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 cursor-pointer"
                                            title="Duplicate (Copy)"
                                        >
                                            ⎘
                                        </button>
                                    )}
                                    {onDeleteElement && (
                                        <button
                                            type="button"
                                            onClick={() => onDeleteElement(el.id)}
                                            className="px-1 bg-rose-600 hover:bg-rose-700 text-white rounded cursor-pointer font-bold"
                                            title="Delete Element (Del)"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Render Element By Type */}
                            {el.type === 'BARCODE' && (
                                <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden pointer-events-none">
                                    {(() => {
                                        const { svgXml, validation } = generateBarcodeSvg({
                                            symbology: el.symbology || 'CODE128',
                                            value: resolveText(el.content),
                                            width: Math.round(widthPx),
                                            height: Math.round(heightPx),
                                            showText: el.showHumanReadableText !== false,
                                            fontSize: (el.fontSize || 10) * zoom
                                        });

                                        if (!validation.isValid) {
                                            return (
                                                <div className="w-full h-full border border-rose-300 bg-rose-50 text-[0.625rem] text-rose-700 flex items-center justify-center p-1 text-center font-mono">
                                                    Barcode Invalid: {validation.error}
                                                </div>
                                            );
                                        }

                                        return (
                                            <div
                                                className="w-full h-full flex items-center justify-center"
                                                dangerouslySetInnerHTML={{ __html: svgXml }}
                                            />
                                        );
                                    })()}
                                </div>
                            )}

                            {el.type === 'QR_CODE' && (
                                <div className="w-full h-full flex items-center justify-center overflow-hidden pointer-events-none">
                                    {(() => {
                                        const { svgXml } = generateBarcodeSvg({
                                            symbology: 'QR',
                                            value: resolveText(el.content),
                                            width: Math.round(widthPx),
                                            height: Math.round(heightPx)
                                        });
                                        return (
                                            <div
                                                className="w-full h-full flex items-center justify-center"
                                                dangerouslySetInnerHTML={{ __html: svgXml }}
                                            />
                                        );
                                    })()}
                                </div>
                            )}

                            {(el.type === 'TEXT' || el.type === 'DYNAMIC_FIELD') && (
                                <div
                                    className={`w-full h-full flex items-center overflow-hidden px-1 pointer-events-none ${el.alignment === 'center'
                                            ? 'justify-center text-center'
                                            : el.alignment === 'right'
                                                ? 'justify-end text-right'
                                                : 'justify-start text-left'
                                        }`}
                                    style={{
                                        fontSize: `${(el.fontSize || 12) * zoom * 0.9}px`,
                                        fontWeight: el.fontWeight || 'normal',
                                        lineHeight: 1.2
                                    }}
                                >
                                    <span className="truncate w-full font-mono">
                                        {text || '(Empty Text)'}
                                    </span>
                                </div>
                            )}

                            {el.type === 'IMAGE_LOGO' && (
                                <div className="w-full h-full flex items-center justify-center gap-1.5 bg-slate-900 text-white rounded-xs px-2 pointer-events-none">
                                    <span className="w-2.5 h-2.5 bg-amber-400 rounded-full shrink-0" />
                                    <span
                                        className="font-bold tracking-wider truncate font-mono"
                                        style={{ fontSize: `${(el.fontSize || 12) * zoom * 0.85}px` }}
                                    >
                                        {text}
                                    </span>
                                </div>
                            )}

                            {el.type === 'BOX' && (
                                <div
                                    className="w-full h-full pointer-events-none"
                                    style={{
                                        border: `${el.borderWidth ? el.borderWidth * scale * 0.3 : 1.5}px solid #0f172a`
                                    }}
                                />
                            )}

                            {el.type === 'LINE' && (
                                <div
                                    className="w-full pointer-events-none"
                                    style={{
                                        height: `${Math.max(1, (el.borderWidth || 1) * scale * 0.3)}px`,
                                        backgroundColor: '#0f172a'
                                    }}
                                />
                            )}

                            {/* Resize Handle when Selected */}
                            {isSelected && !isPreviewMode && (
                                <div
                                    onMouseDown={(e) => handleMouseDownResize(e, el)}
                                    className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-600 border-2 border-white rounded-full cursor-se-resize shadow-md z-40"
                                    title="Drag to resize"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
