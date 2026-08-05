import React, { useState, useMemo } from 'react';
import { Button, Input, Select, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/common';
import { 
    type BarcodeSymbology, 
    validateBarcode, 
    generateBarcodeSvg 
} from '../../utils/barcodeEngine';
import { generateSingleBarcodeZpl } from '../../utils/zplEngine';
import { MOCK_EMERGENCY_REPRINTS } from '../../mocks/labelTemplates.mocks';
import type { EmergencyPrintRecord } from '../../models/labelTemplate';
import toast from 'react-hot-toast';

export const EmergencyGenerator: React.FC = () => {
    const [symbology, setSymbology] = useState<BarcodeSymbology>('EAN13');
    const [payload, setPayload] = useState<string>('5901234123457');
    const [referenceNote, setReferenceNote] = useState<string>('Damaged Pallet tag - Sector A-04');
    const [barcodeHeight, setBarcodeHeight] = useState<number>(110);
    const [printerTarget, setPrinterTarget] = useState<string>('Zebra ZT410 (Forklift Mobile #3)');
    const [showText, setShowText] = useState<boolean>(true);
    const [isPrinting, setIsPrinting] = useState<boolean>(false);
    const [reprintHistory, setReprintHistory] = useState<EmergencyPrintRecord[]>(MOCK_EMERGENCY_REPRINTS);

    // Live validation
    const validation = useMemo(() => {
        return validateBarcode(symbology, payload);
    }, [symbology, payload]);

    // Live SVG generation
    const barcodeSvgResult = useMemo(() => {
        if (!validation.isValid) return { svgXml: '' };
        return generateBarcodeSvg({
            symbology,
            value: validation.formattedValue,
            width: 360,
            height: barcodeHeight,
            showText,
            fontSize: 14
        });
    }, [symbology, validation, barcodeHeight, showText]);

    const handlePrintEmergency = () => {
        if (!validation.isValid) {
            toast.error('Cannot print an invalid barcode format.');
            return;
        }

        setIsPrinting(true);

        const printPromise = new Promise((resolve) => {
            setTimeout(resolve, 1400);
        });

        toast.promise(
            printPromise,
            {
                loading: `Dispatching emergency ZPL job to ${printerTarget}...`,
                success: <b>Emergency label printed successfully! Pallet ready for scan.</b>,
                error: <b>Printer communication error</b>
            },
            { id: 'emergency-print' }
        ).then(() => {
            setIsPrinting(false);
            const newRecord: EmergencyPrintRecord = {
                id: `EMG-${Math.floor(1000 + Math.random() * 9000)}`,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                symbology,
                payload: validation.formattedValue,
                referenceLabel: referenceNote || 'Pallet Emergency Re-tag',
                printerTarget,
                operator: 'Warehouse Supervisor',
                status: 'PRINTED'
            };
            setReprintHistory([newRecord, ...reprintHistory]);
        });
    };

    const handleCopyZpl = () => {
        if (!validation.isValid) return;
        const zpl = generateSingleBarcodeZpl(symbology, validation.formattedValue);
        navigator.clipboard.writeText(zpl);
        toast.success('Raw Zebra ZPL-II commands copied to clipboard');
    };

    return (
        <div className="space-y-4">
            {/* Split Screen WYSIWYG Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left Column: Form & Presets */}
                <div className="lg:col-span-5 bg-white border border-slate-300 rounded-lg p-4 shadow-xs space-y-4 text-xs">
                    <div className="border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                            <h3 className="font-bold text-sm text-slate-800">
                                Emergency Barcode Parameter Form
                            </h3>
                        </div>
                        <p className="text-[0.6875rem] text-slate-500 mt-1">
                            Type or paste damaged pallet serials with live vector validation before dispatching to thermal printer.
                        </p>
                    </div>

                    {/* Symbology Standard */}
                    <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                            Barcode Symbology Standard <span className="text-red-500">*</span>
                        </label>
                        <Select
                            value={symbology}
                            onChange={(e) => setSymbology(e.target.value as BarcodeSymbology)}
                            options={[
                                { label: 'EAN-13 (13-digit GS1 European Article Number)', value: 'EAN13' },
                                { label: 'Code 128 (High-density ASCII & Pallet SSCC)', value: 'CODE128' },
                                { label: '2D QR Code (Autonomous AGV Matrix)', value: 'QR' },
                                { label: 'Code 39 (Alphanumeric Warehouse Bin Tag)', value: 'CODE39' },
                                { label: 'EAN-8 (8-digit Compact Retail Tag)', value: 'EAN8' },
                                { label: 'UPC-A (12-digit North American Standard)', value: 'UPCA' },
                                { label: 'ITF-14 (14-digit Logistics Outer Carton)', value: 'ITF14' }
                            ]}
                        />
                    </div>

                    {/* Payload Input */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="font-semibold text-slate-700">
                                Barcode Payload / Serial Code <span className="text-red-500">*</span>
                            </label>
                            <span className="text-[0.625rem] text-slate-400 font-mono">
                                Length: {payload.length} chars
                            </span>
                        </div>
                        <Input
                            value={payload}
                            onChange={(e) => setPayload(e.target.value)}
                            placeholder="Enter barcode string..."
                            className={`font-mono text-sm ${
                                !validation.isValid ? 'border-rose-500 bg-rose-50/50 focus:border-rose-600' : ''
                            }`}
                        />
                    </div>

                    {/* Quick-Test Presets for User Experimentation */}
                    <div>
                        <span className="text-[0.625rem] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                            Quick-Fill Validation Presets
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                            <button
                                type="button"
                                onClick={() => {
                                    setSymbology('EAN13');
                                    setPayload('5901234123457');
                                }}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[0.625rem] font-mono text-slate-700 cursor-pointer"
                            >
                                Valid EAN-13
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSymbology('EAN13');
                                    setPayload('5901234ABC45'); // Invalid letters
                                }}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded text-[0.625rem] font-mono text-rose-700 cursor-pointer"
                            >
                                Invalid EAN-13 (Letters)
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSymbology('EAN13');
                                    setPayload('590123456'); // Invalid length
                                }}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded text-[0.625rem] font-mono text-rose-700 cursor-pointer"
                            >
                                Invalid EAN-13 (9 digits)
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSymbology('CODE128');
                                    setPayload('003590123450000018');
                                }}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[0.625rem] font-mono text-slate-700 cursor-pointer"
                            >
                                Valid SSCC-18
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSymbology('QR');
                                    setPayload('VLV-HYDR-24V-01|LOT-2026-08-01X|003590123450000018');
                                }}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[0.625rem] font-mono text-slate-700 cursor-pointer"
                            >
                                Valid QR Matrix
                            </button>
                        </div>
                    </div>

                    {/* Pallet Reference / Reason */}
                    <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                            Pallet Location & Incident Context
                        </label>
                        <Input
                            value={referenceNote}
                            onChange={(e) => setReferenceNote(e.target.value)}
                            placeholder="E.g. Pallet dropped in Aisle 04"
                        />
                    </div>

                    {/* Printer Target */}
                    <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                            Dispatch to Thermal Printer
                        </label>
                        <Select
                            value={printerTarget}
                            onChange={(e) => setPrinterTarget(e.target.value)}
                            options={[
                                { label: 'Zebra ZT410 (Forklift Mobile #3 - High Bay)', value: 'Zebra ZT410 (Forklift Mobile #3)' },
                                { label: 'Zebra GK420d (Inbound Reception Desk 2)', value: 'Zebra GK420d (Inbound Desk)' },
                                { label: 'Zebra ZT410 (Hall B Workshop Station)', value: 'Zebra ZT410 (Hall B Workshop)' },
                                { label: 'Zebra ZD621 (Dispatch Shipping Dock #4)', value: 'Zebra ZD621 (Dispatch Dock 4)' }
                            ]}
                        />
                    </div>

                    {/* Adjustments */}
                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200">
                        <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                                Height: {barcodeHeight}px
                            </label>
                            <input
                                type="range"
                                min={60}
                                max={180}
                                value={barcodeHeight}
                                onChange={(e) => setBarcodeHeight(Number(e.target.value))}
                                className="w-full cursor-pointer accent-slate-800"
                            />
                        </div>
                        <div className="flex items-center pt-4">
                            <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={showText}
                                    onChange={(e) => setShowText(e.target.checked)}
                                    className="w-4 h-4 accent-slate-800"
                                />
                                <span>Human Text</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column: Live Vector Preview & Error Frame */}
                <div className="lg:col-span-7 bg-white border border-slate-300 rounded-lg p-4 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4">
                            <div>
                                <span className="text-[0.625rem] font-bold uppercase tracking-wider text-slate-500 block">
                                    Vector WYSIWYG Output
                                </span>
                                <h3 className="font-bold text-sm text-slate-800">
                                    Live Barcode Validation & Optical Scan Preview
                                </h3>
                            </div>
                            {validation.isValid ? (
                                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[0.6875rem] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 font-mono">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    VALID: {symbology}
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-[0.6875rem] font-bold px-2.5 py-0.5 rounded-full border border-rose-300 font-mono">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                                    VALIDATION ERROR
                                </span>
                            )}
                        </div>

                        {/* Interactive Preview Canvas */}
                        <div className="min-h-64 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-lg shadow-inner">
                            {validation.isValid ? (
                                /* Valid State Crisp Vector Display */
                                <div className="bg-white p-6 rounded-md border border-slate-300 shadow-lg flex flex-col items-center justify-center max-w-full overflow-hidden transition-all">
                                    <div 
                                        className="flex items-center justify-center"
                                        dangerouslySetInnerHTML={{ __html: barcodeSvgResult.svgXml }} 
                                    />
                                    {referenceNote && (
                                        <span className="text-[0.6875rem] text-slate-500 mt-2 font-mono text-center">
                                            Ref: {referenceNote}
                                        </span>
                                    )}
                                    {validation.checkDigit && (
                                        <div className="mt-2 text-[0.625rem] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded border border-slate-200">
                                            Modulo-10 Check Digit Verified: <b>{validation.checkDigit}</b>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Invalid State - Clean Red Error Frame */
                                <div className="w-full bg-rose-50 border-2 border-dashed border-rose-500 rounded-lg p-6 text-center space-y-3 shadow-md">
                                    <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 text-2xl flex items-center justify-center mx-auto font-black shadow-xs">
                                        &#9888;
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-rose-800 text-sm uppercase tracking-wide">
                                            Nieprawidłowy format dla wybranego standardu!
                                        </h4>
                                        <p className="text-xs text-rose-700 font-medium mt-1 max-w-md mx-auto">
                                            {validation.error}
                                        </p>
                                    </div>
                                    {validation.warning && (
                                        <div className="text-[0.6875rem] text-amber-800 bg-amber-50 border border-amber-300 rounded p-2 max-w-md mx-auto font-mono">
                                            {validation.warning}
                                        </div>
                                    )}
                                    <p className="text-[0.6875rem] text-slate-500 italic">
                                        Printing disabled to prevent unreadable or out-of-spec barcodes from entering the warehouse aisle.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-slate-200 mt-4">
                        <button
                            type="button"
                            onClick={handleCopyZpl}
                            disabled={!validation.isValid}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-300 rounded text-slate-700 text-xs font-semibold cursor-pointer"
                        >
                            Copy Raw ZPL Code
                        </button>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={handlePrintEmergency}
                                disabled={!validation.isValid || isPrinting}
                                isLoading={isPrinting}
                                className="w-full sm:w-auto text-xs font-semibold px-4 shadow-sm"
                            >
                                {isPrinting ? 'Sending to Thermal Head...' : 'Print Emergency Label (Direct ZPL)'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Recent Emergency Reprints Table */}
            <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                            Recent Emergency Pallet Reprints Log
                        </h4>
                        <p className="text-[0.6875rem] text-slate-500">
                            Audit trail of damaged barcode replacements dispatched to mobile forklift thermal printers.
                        </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {reprintHistory.length} Reprints Logged
                    </span>
                </div>

                <div className="rounded-md border border-slate-300 overflow-hidden">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>ID / Timestamp</TableHeaderCell>
                                <TableHeaderCell>Standard</TableHeaderCell>
                                <TableHeaderCell>Barcode Payload</TableHeaderCell>
                                <TableHeaderCell>Reference Context</TableHeaderCell>
                                <TableHeaderCell>Target Thermal Printer</TableHeaderCell>
                                <TableHeaderCell>Operator</TableHeaderCell>
                                <TableHeaderCell className="text-right">Status</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reprintHistory.map((rec) => (
                                <TableRow key={rec.id}>
                                    <TableCell className="font-mono text-slate-700">
                                        <div className="font-bold text-slate-900">{rec.id}</div>
                                        <div className="text-[0.625rem] text-slate-500">{rec.timestamp}</div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="bg-slate-100 text-slate-800 font-mono text-[0.625rem] px-2 py-0.5 rounded font-bold border border-slate-200">
                                            {rec.symbology}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-mono font-bold text-slate-900 text-xs">
                                        {rec.payload}
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-xs">
                                        {rec.referenceLabel}
                                    </TableCell>
                                    <TableCell className="text-slate-700 font-medium text-xs">
                                        {rec.printerTarget}
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-xs">
                                        {rec.operator}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-mono text-[0.625rem] px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            {rec.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};
