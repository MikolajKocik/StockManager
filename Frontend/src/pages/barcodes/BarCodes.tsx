import { useState } from 'react';
import { BarcodesHeader, type BarcodeModuleTab } from './components/BarcodesHeader';
import { ComponentPalette } from './components/LabelDesigner/ComponentPalette';
import { Canvas } from './components/LabelDesigner/Canvas';
import { PropertiesPanel } from './components/LabelDesigner/PropertiesPanel';
import { PublishTemplateModal } from './components/LabelDesigner/PublishTemplateModal';
import { EmergencyGenerator } from './components/EmergencyGenerator/EmergencyGenerator';
import { InboundReceptionPrinter } from './components/InboundReceptionPrinter/InboundReceptionPrinter';
import { ZplViewer } from './components/ZplViewer/ZplViewer';

import { MOCK_TEMPLATES, MOCK_SAMPLE_DATA } from './mocks/labelTemplates.mocks';
import type { LabelTemplate, LabelElement, LabelElementType } from './models/labelTemplate';
import toast from 'react-hot-toast';

export default function BarCodes() {
    const [activeTab, setActiveTab] = useState<BarcodeModuleTab>('DESIGNER');
    const [templatesList, setTemplatesList] = useState<LabelTemplate[]>(MOCK_TEMPLATES);
    const [activeTemplate, setActiveTemplate] = useState<LabelTemplate>(MOCK_TEMPLATES[0]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);

    const selectedElement = activeTemplate.elements.find(el => el.id === selectedElementId) || null;

    const handleAddElement = (
        type: LabelElementType,
        defaultContent: string = '',
        extra?: { symbology?: any; label?: string; width?: number; height?: number }
    ) => {
        const newId = `el-${Date.now()}`;
        const newEl: LabelElement = {
            id: newId,
            type,
            label: extra?.label || (type === 'BARCODE' ? 'Barcode' : 'New Element'),
            x: 10,
            y: 10,
            width: extra?.width || 50,
            height: extra?.height || 15,
            content: defaultContent,
            symbology: extra?.symbology || (type === 'BARCODE' ? 'CODE128' : undefined),
            fontSize: 12,
            fontWeight: 'normal',
            alignment: 'left',
            showHumanReadableText: true
        };

        setActiveTemplate(prev => ({
            ...prev,
            elements: [...prev.elements, newEl]
        }));
        setSelectedElementId(newId);
        setIsDirty(true);
        toast.success(`Added ${newEl.label} to canvas`);
    };

    const handleUpdateElement = (id: string, updates: Partial<LabelElement>) => {
        setActiveTemplate(prev => ({
            ...prev,
            elements: prev.elements.map(el => el.id === id ? { ...el, ...updates } : el)
        }));
        setIsDirty(true);
    };

    const handleDeleteElement = (id: string) => {
        setActiveTemplate(prev => ({
            ...prev,
            elements: prev.elements.filter(el => el.id !== id)
        }));
        if (selectedElementId === id) setSelectedElementId(null);
        setIsDirty(true);
        toast.success('Element removed from layout');
    };

    const handleDuplicateElement = (id: string) => {
        const target = activeTemplate.elements.find(el => el.id === id);
        if (!target) return;
        const newId = `el-${Date.now()}`;
        const cloned: LabelElement = {
            ...target,
            id: newId,
            x: Math.min(activeTemplate.dimensions.widthMm - target.width, target.x + 5),
            y: Math.min(activeTemplate.dimensions.heightMm - target.height, target.y + 5),
            label: `${target.label} (Copy)`
        };
        setActiveTemplate(prev => ({
            ...prev,
            elements: [...prev.elements, cloned]
        }));
        setSelectedElementId(newId);
        setIsDirty(true);
        toast.success('Element duplicated');
    };

    const handleUpdateTemplate = (updates: Partial<LabelTemplate>) => {
        setActiveTemplate(prev => ({ ...prev, ...updates }));
        setIsDirty(true);
    };

    const handleSelectTemplate = (templateId: string) => {
        const found = templatesList.find(t => t.id === templateId);
        if (found) {
            setActiveTemplate(found);
            setSelectedElementId(null);
            setIsDirty(false);
            toast.success(`Loaded template: ${found.name}`);
        }
    };

    const handleResetTemplate = () => {
        const original = templatesList.find(t => t.id === activeTemplate.id);
        if (original) {
            setActiveTemplate(original);
            setSelectedElementId(null);
            setIsDirty(false);
            toast.success('Layout reset to saved baseline');
        }
    };

    const handlePublished = () => {
        setIsDirty(false);
        setTemplatesList(prev => prev.map(t => t.id === activeTemplate.id ? { ...activeTemplate, version: activeTemplate.version + 1 } : t));
    };

    return (
        <div className="w-full space-y-4 pb-12">
            {/* Header & Mode Switcher */}
            <BarcodesHeader
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onSaveTemplate={() => setIsPublishModalOpen(true)}
                onResetTemplate={isDirty ? handleResetTemplate : undefined}
                templateName={activeTemplate.name}
                isDirty={isDirty}
            />

            {/* TAB 1: Visual Drag & Drop Label Studio */}
            {activeTab === 'DESIGNER' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Left Column: Palette */}
                    <div className="lg:col-span-3">
                        <ComponentPalette onAddElement={handleAddElement} />
                    </div>

                    {/* Middle Column: Interactive Canvas */}
                    <div className="lg:col-span-6 flex flex-col min-h-[560px]">
                        <Canvas
                            template={activeTemplate}
                            selectedElementId={selectedElementId}
                            onSelectElement={setSelectedElementId}
                            onUpdateElement={handleUpdateElement}
                            onDeleteElement={handleDeleteElement}
                            onDuplicateElement={handleDuplicateElement}
                            sampleData={MOCK_SAMPLE_DATA}
                            isPreviewMode={isPreviewMode}
                        />
                    </div>

                    {/* Right Column: Properties Panel */}
                    <div className="lg:col-span-3">
                        <PropertiesPanel
                            template={activeTemplate}
                            selectedElement={selectedElement}
                            onUpdateElement={handleUpdateElement}
                            onDeleteElement={handleDeleteElement}
                            onDuplicateElement={handleDuplicateElement}
                            onUpdateTemplate={handleUpdateTemplate}
                            templatesList={templatesList}
                            onSelectTemplate={handleSelectTemplate}
                            isPreviewMode={isPreviewMode}
                            onTogglePreviewMode={() => setIsPreviewMode(!isPreviewMode)}
                            onOpenPublishModal={() => setIsPublishModalOpen(true)}
                        />
                    </div>
                </div>
            )}

            {/* TAB 2: Emergency WYSIWYG Barcode Generator with Live Validation */}
            {activeTab === 'EMERGENCY' && (
                <EmergencyGenerator />
            )}

            {/* TAB 3: Inbound Reception PZ Terminal Printing */}
            {activeTab === 'INBOUND_PRINT' && (
                <InboundReceptionPrinter template={activeTemplate} />
            )}

            {/* TAB 4: Zebra ZPL-II Engine & Telemetry */}
            {activeTab === 'ZPL_ENGINE' && (
                <ZplViewer template={activeTemplate} />
            )}

            {/* Publish & Enforce Label Standard Modal */}
            <PublishTemplateModal
                isOpen={isPublishModalOpen}
                template={activeTemplate}
                onClose={() => setIsPublishModalOpen(false)}
                onPublished={handlePublished}
            />
        </div>
    );
}
