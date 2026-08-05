import React from 'react';
import { OcrSnippet } from './OcrSnippet';
import { formatNumber } from '@/utils/format';
import type { OcrBoundingBox } from '../models/ocrDocument';
import type { OcrLineItem } from '../models/ocrDocument';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/common';

interface GoodsTableProps {
    items: OcrLineItem[];
    getBoxForField: (key: string) => OcrBoundingBox | undefined;
    onSnippetClick: (box: OcrBoundingBox) => void;
    showOcrHighlights: boolean;
    focusedFieldKey: string | null;
}

export const GoodsTable: React.FC<GoodsTableProps> = ({ items, getBoxForField, onSnippetClick, showOcrHighlights, focusedFieldKey }) => {
    return (
        <section className="py-2" aria-labelledby="goods-table-title">
            <h3 id="goods-table-title" className="font-bold text-[0.5625rem] text-slate-500 uppercase block font-mono mb-1.5">SPECIFICATION OF GOODS / POSITIONS</h3>
            <Table className="text-[0.625rem]">
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>LP</TableHeaderCell>
                        <TableHeaderCell>SKU / Code</TableHeaderCell>
                        <TableHeaderCell>Product Name</TableHeaderCell>
                        <TableHeaderCell className="text-right">Qty</TableHeaderCell>
                        <TableHeaderCell>Unit</TableHeaderCell>
                        <TableHeaderCell className="text-right">Price Net</TableHeaderCell>
                        <TableHeaderCell>LOT / Batch</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody className="font-mono">
                    {items.map((item, idx) => (
                        <TableRow key={item.id}>
                            <TableCell className="text-slate-500">{idx + 1}</TableCell>
                            <TableCell>
                                <OcrSnippet fieldKey={`item_sku_${idx}`} textValue={item.sku as any} fallbackText="SKU" customClass="font-bold text-blue-900" getBoxForField={getBoxForField} onSnippetClick={onSnippetClick} showOcrHighlights={showOcrHighlights} focusedFieldKey={focusedFieldKey} />
                            </TableCell>
                            <TableCell className="font-sans font-medium text-slate-900 max-w-[9.375rem] truncate">
                                <OcrSnippet fieldKey={`item_name_${idx}`} textValue={item.name as any} fallbackText="Name" customClass="truncate" getBoxForField={getBoxForField} onSnippetClick={onSnippetClick} showOcrHighlights={showOcrHighlights} focusedFieldKey={focusedFieldKey} />
                            </TableCell>
                            <TableCell className="text-right font-bold">{item.quantity}</TableCell>
                            <TableCell className="text-slate-600">{item.unit}</TableCell>
                            <TableCell className="text-right font-bold text-slate-800">{formatNumber(item.unitPriceNet)}</TableCell>
                            <TableCell>
                                <OcrSnippet
                                    fieldKey={`item_lot_${idx}`}
                                    textValue={item.lotNumber || '' as any}
                                    fallbackText="LOT-BATCH"
                                    customClass={item.lotNumber ? 'font-bold text-amber-900 bg-amber-50/70 border border-amber-300' : 'text-amber-700 italic border border-dashed border-amber-400 bg-amber-50/40'}
                                    getBoxForField={getBoxForField}
                                    onSnippetClick={onSnippetClick}
                                    showOcrHighlights={showOcrHighlights}
                                    focusedFieldKey={focusedFieldKey}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    );
};

export default GoodsTable;
