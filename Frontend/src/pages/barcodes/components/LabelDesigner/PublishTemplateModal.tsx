import React, { useState } from 'react';
import { Button } from '@/components/common';
import type { LabelTemplate, SaveLabelTemplateCommand } from '../../models/labelTemplate';
import toast from 'react-hot-toast';

interface PublishTemplateModalProps {
    isOpen: boolean;
    template: LabelTemplate;
    onClose: () => void;
    onPublished: () => void;
}

export const PublishTemplateModal: React.FC<PublishTemplateModalProps> = ({
    isOpen,
    template,
    onClose,
    onPublished
}) => {
    const [isPublishing, setIsPublishing] = useState<boolean>(false);
    const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

    if (!isOpen) return null;

    const technicalPayload: SaveLabelTemplateCommand = {
        commandId: `STD-WMS-${Date.now()}`,
        commandType: 'SaveLabelTemplateCommand',
        templateId: template.id,
        name: template.name,
        category: template.category,
        targetZone: template.targetZone,
        dimensions: template.dimensions,
        elements: template.elements,
        metadata: {
            author: 'Warehouse Manager (M. Kocik)',
            timestamp: new Date().toISOString(),
            environment: 'Production-WMS-Cluster',
            cqrsAggregate: 'WarehouseLabelTemplateAggregate',
            routingKey: `wms.labels.${template.targetZone.toLowerCase()}`
        }
    };

    const jsonString = JSON.stringify(technicalPayload, null, 2);

    const handlePublish = () => {
        setIsPublishing(true);

        const publishPromise = new Promise((resolve) => {
            setTimeout(resolve, 1100);
        });

        toast.promise(
            publishPromise,
            {
                loading: 'Synchronizing template across warehouse terminals & printers...',
                success: <b>Standard published! Template v{template.version + 1} is now active on all terminals.</b>,
                error: <b>Failed to publish template standard</b>
            },
            { id: 'publish-template' }
        ).then(() => {
            setIsPublishing(false);
            onPublished();
            onClose();
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white border border-slate-300 rounded-lg shadow-2xl max-w-xl w-full overflow-hidden text-slate-800 animate-scale-in">
                {/* Dark Header */}
                <div className="bg-[#384155] text-white px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="bg-emerald-400 text-slate-950 text-[0.625rem] font-black px-2 py-0.5 rounded font-mono uppercase">
                            GLOBAL STANDARD SYNC
                        </span>
                        <h3 className="font-bold text-sm text-white">
                            Publish & Enforce Label Standard
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-300 hover:text-white text-lg leading-none p-1 cursor-pointer"
                    >
                        &#10005;
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3 text-xs">
                    {/* Summary Info Cards */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <div>
                                <span className="text-[0.625rem] font-bold text-slate-500 uppercase block">Template Name</span>
                                <span className="font-bold text-slate-900 text-sm">{template.name}</span>
                            </div>
                            <span className="text-[0.6875rem] font-mono font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                                Target Rev: v{template.version + 1}
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                                <span className="text-slate-500 block text-[0.625rem]">Target Sector:</span>
                                <span className="font-semibold text-slate-800">
                                    {template.targetZone === 'ALL_ZONES' ? 'All Warehouse Sectors' : template.targetZone}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500 block text-[0.625rem]">Dimensions:</span>
                                <span className="font-semibold text-slate-800">
                                    {template.dimensions.widthMm} x {template.dimensions.heightMm} mm
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500 block text-[0.625rem]">Configured Items:</span>
                                <span className="font-semibold text-slate-800">
                                    {template.elements.length} components
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Business explanation */}
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-md p-3 text-emerald-900 text-xs space-y-1">
                        <span className="font-bold block">
                            What happens when you publish?
                        </span>
                        <p className="text-[0.6875rem] leading-relaxed text-emerald-800">
                            This layout standard is automatically sent to all warehouse operator tablets, dock scanners, and mobile forklift thermal printers. Operators at Goods Reception (PZ) will automatically print this exact design with zero risk of manual formatting errors.
                        </p>
                    </div>

                    {/* Collapsible Technical Details for IT / Admins */}
                    <div className="pt-1 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                            className="text-[0.6875rem] text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 cursor-pointer"
                        >
                            <span>{showTechnicalDetails ? '▼ Hide' : '▶ Show'} System Synchronization Details (JSON Schema)</span>
                        </button>

                        {showTechnicalDetails && (
                            <div className="mt-2 space-y-1.5 animate-fade-in">
                                <pre className="bg-slate-900 text-slate-100 p-2.5 rounded text-[0.625rem] font-mono overflow-auto max-h-48 border border-slate-700">
                                    {jsonString}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-3 bg-slate-50 border-t border-slate-200">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onClose}
                        disabled={isPublishing}
                        className="text-xs"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handlePublish}
                        isLoading={isPublishing}
                        className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 border-emerald-700 shadow-sm"
                    >
                        {isPublishing ? 'Publishing...' : 'Publish Standard to Warehouse'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
