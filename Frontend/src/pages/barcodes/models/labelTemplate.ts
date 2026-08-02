import type { BarcodeSymbology } from "../utils/barcodeEngine";

export type LabelElementType = 
    | 'BARCODE'
    | 'QR_CODE'
    | 'TEXT'
    | 'DYNAMIC_FIELD'
    | 'IMAGE_LOGO'
    | 'BOX'
    | 'LINE'
    | 'HAZMAT_ICON';

export type DynamicFieldType = 
    | '{product.name}'
    | '{product.sku}'
    | '{product.genre}'
    | '{product.unit}'
    | '{batch.number}'
    | '{batch.expirationDate}'
    | '{warehouse.zone}'
    | '{warehouse.binLocation}'
    | '{customer.name}'
    | '{customer.taxId}'
    | '{shipment.trackingNumber}'
    | '{pallet.sscc}'
    | '{quantity}';

export interface LabelElement {
    id: string;
    type: LabelElementType;
    label: string;
    x: number; // in mm
    y: number; // in mm
    width: number; // in mm
    height: number; // in mm
    content: string; // text or dynamic template string
    symbology?: BarcodeSymbology;
    fontSize?: number; // pt
    fontWeight?: 'normal' | 'bold';
    alignment?: 'left' | 'center' | 'right';
    borderWidth?: number;
    showHumanReadableText?: boolean;
    zIndex?: number;
}

export interface LabelDimensions {
    widthMm: number;
    heightMm: number;
    dpi: number; // 203 dpi (8 dots/mm) or 300 dpi (12 dots/mm)
}

export interface LabelTemplate {
    id: string;
    name: string;
    description: string;
    category: 'LOGISTICS_PALLET' | 'INBOUND_PZ' | 'SHELF_BIN' | 'RETAIL_SKU' | 'HAZMAT_CHEMICAL';
    targetZone: string; // e.g. 'HIGH_BAY_A', 'PICKING_B', 'ALL_ZONES'
    dimensions: LabelDimensions;
    elements: LabelElement[];
    version: number;
    createdBy: string;
    updatedAt: string;
    isDefault?: boolean;
}

export interface SaveLabelTemplateCommand {
    commandId: string;
    commandType: 'SaveLabelTemplateCommand';
    templateId: string;
    name: string;
    category: string;
    targetZone: string;
    dimensions: LabelDimensions;
    elements: LabelElement[];
    metadata: {
        author: string;
        timestamp: string;
        environment: string;
        cqrsAggregate: 'WarehouseLabelTemplateAggregate';
        routingKey: string;
    };
}

export interface EmergencyPrintRecord {
    id: string;
    timestamp: string;
    symbology: BarcodeSymbology;
    payload: string;
    referenceLabel: string;
    printerTarget: string;
    operator: string;
    status: 'PRINTED' | 'DISPATCHED' | 'FAILED';
}
