import React from 'react';
import { Badge } from '@/components/common';
import type { DamagePhoto } from '@/models/rma';

export interface DamagePhotoCardProps {
    photo: DamagePhoto;
    onPreview: (photo: DamagePhoto) => void;
    onDelete: (photoId: string) => void;
}

export const DamagePhotoCard: React.FC<DamagePhotoCardProps> = ({
    photo,
    onPreview,
    onDelete
}) => {
    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white hover:border-[#2b6675] transition-colors shadow-2xs group flex flex-col">
            <div
                className="h-36 bg-slate-100 border-b border-slate-200 overflow-hidden cursor-pointer relative flex items-center justify-center"
                onClick={() => onPreview(photo)}
            >
                <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1">
                    <Badge
                        variant={
                            photo.severityTag === 'Critical' ? 'danger' :
                            photo.severityTag === 'Moderate' ? 'warning' : 'success'
                        }
                        className="text-xs"
                    >
                        {photo.severityTag}
                    </Badge>
                </div>
                <div className="absolute bottom-2 left-2 bg-white/90 border border-slate-200 px-2 py-0.5 rounded text-xs font-mono text-slate-700 shadow-xs">
                    Click to Zoom
                </div>
            </div>

            <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-slate-900 font-mono line-clamp-1">
                            {photo.title}
                        </span>
                        <Badge variant="slate" className="text-xs">
                            {photo.category}
                        </Badge>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {photo.description}
                    </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400 font-mono">
                    <span>{photo.timestamp.slice(11, 16)}</span>
                    <button
                        type="button"
                        onClick={() => onDelete(photo.id)}
                        className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                    >
                        Delete Photo
                    </button>
                </div>
            </div>
        </div>
    );
};
