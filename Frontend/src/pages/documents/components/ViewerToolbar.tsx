import React from 'react';

interface ViewerToolbarProps {
    fileName: string;
    zoom: number;
    setZoom: (updater: (z: number) => number) => void;
    showOcrHighlights: boolean;
    setShowOcrHighlights: (v: boolean) => void;
}

export const ViewerToolbar: React.FC<ViewerToolbarProps> = ({ fileName, zoom, setZoom, showOcrHighlights, setShowOcrHighlights }) => {
    return (
        <div className="bg-white border border-slate-300 rounded-md px-3 py-2 mb-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-xs">Scanned Document Preview</span>
                <span className="text-[0.625rem] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{fileName}</span>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setZoom(z => Math.max(0.8, z - 0.1))}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-bold cursor-pointer"
                    >
                        -
                    </button>
                    <span className="font-mono text-[0.6875rem] text-slate-800 w-12 text-center">{Math.round(zoom * 100)}%</span>
                    <button
                        type="button"
                        onClick={() => setZoom(z => Math.min(1.3, z + 0.1))}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-bold cursor-pointer"
                    >
                        +
                    </button>
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium select-none">
                    <input
                        type="checkbox"
                        checked={showOcrHighlights}
                        onChange={(e) => setShowOcrHighlights(e.target.checked)}
                        className="w-3.5 h-3.5 accent-slate-800"
                    />
                    <span>OCR Snippets Overlay</span>
                </label>
            </div>
        </div>
    );
};

export default ViewerToolbar;
