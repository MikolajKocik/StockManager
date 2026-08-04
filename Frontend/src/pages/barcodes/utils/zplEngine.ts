import type { LabelTemplate, LabelElement } from "../models/labelTemplate";

type ZplElementFormatter = (
    el: LabelElement,
    resolvedContent: string,
    dotsPerMm: number
) => string;

const ZPL_ELEMENT_FORMATTERS: Record<LabelElement['type'], ZplElementFormatter> = {
    BARCODE: (el, resolvedContent, dotsPerMm) => {
        const xDots = Math.round(el.x * dotsPerMm);
        const yDots = Math.round(el.y * dotsPerMm);
        const hDots = Math.round(el.height * dotsPerMm);
        const sym = el.symbology || 'CODE128';

        if (sym === 'EAN13') {
            return `^FO${xDots},${yDots}^BEN,${hDots},Y,N^FD${resolvedContent}^FS\n`;
        }
        if (sym === 'CODE39') {
            return `^FO${xDots},${yDots}^B3N,N,${hDots},Y,N^FD${resolvedContent}^FS\n`;
        }
        return `^FO${xDots},${yDots}^BY2,3,${hDots}^BCN,${hDots},Y,N,N^FD>:${resolvedContent}^FS\n`;
    },

    QR_CODE: (el, resolvedContent, dotsPerMm) => {
        const xDots = Math.round(el.x * dotsPerMm);
        const yDots = Math.round(el.y * dotsPerMm);
        return `^FO${xDots},${yDots}^BQN,2,6^FDQA,${resolvedContent}^FS\n`;
    },

    TEXT: (el, resolvedContent, dotsPerMm) => {
        const xDots = Math.round(el.x * dotsPerMm);
        const yDots = Math.round(el.y * dotsPerMm);
        const fontH = Math.round((el.fontSize || 12) * 2.8);
        const fontW = Math.round(fontH * 0.85);
        return `^FO${xDots},${yDots}^A0N,${fontH},${fontW}^FD${resolvedContent}^FS\n`;
    },

    DYNAMIC_FIELD: (el, resolvedContent, dotsPerMm) => {
        const xDots = Math.round(el.x * dotsPerMm);
        const yDots = Math.round(el.y * dotsPerMm);
        const fontH = Math.round((el.fontSize || 12) * 2.8);
        const fontW = Math.round(fontH * 0.85);
        return `^FO${xDots},${yDots}^A0N,${fontH},${fontW}^FD${resolvedContent}^FS\n`;
    },

    BOX: (el, _resolvedContent, dotsPerMm) => {
        const xDots = Math.round(el.x * dotsPerMm);
        const yDots = Math.round(el.y * dotsPerMm);
        const wDots = Math.round(el.width * dotsPerMm);
        const hDots = Math.round(el.height * dotsPerMm);
        const thickness = el.borderWidth ? Math.round(el.borderWidth * 2) : 2;
        return `^FO${xDots},${yDots}^GB${wDots},${hDots},${thickness}^FS\n`;
    },

    LINE: (el, _resolvedContent, dotsPerMm) => {
        const xDots = Math.round(el.x * dotsPerMm);
        const yDots = Math.round(el.y * dotsPerMm);
        const wDots = Math.round(el.width * dotsPerMm);
        const thickness = el.borderWidth ? Math.round(el.borderWidth * 2) : 2;
        return `^FO${xDots},${yDots}^GB${wDots},${thickness},${thickness}^FS\n`;
    },

    IMAGE_LOGO: (el, resolvedContent, dotsPerMm) => {
        const xDots = Math.round(el.x * dotsPerMm);
        const yDots = Math.round(el.y * dotsPerMm);
        const fontH = Math.round((el.fontSize || 14) * 3);
        return `^FO${xDots},${yDots}^A0N,${fontH},${fontH}^FD[WMS LOGO] ${resolvedContent}^FS\n`;
    }
};

/**
 * Zebra ZPL-II Code Generator
 * Converts visual millimeter coordinates into thermal printer dots (8 dots/mm at 203 DPI)
 */
export function generateZplFromTemplate(template: LabelTemplate, sampleData: Record<string, string> = {}): string {
    const dotsPerMm = template.dimensions.dpi === 300 ? 12 : 8;
    const labelWidthDots = Math.round(template.dimensions.widthMm * dotsPerMm);
    const labelHeightDots = Math.round(template.dimensions.heightMm * dotsPerMm);

    let zpl = `^XA\n`;
    zpl += `^PW${labelWidthDots}\n`;
    zpl += `^LL${labelHeightDots}\n`;
    zpl += `^LH0,0\n`;
    zpl += `^CI28\n`; // UTF-8 encoding

    for (const el of template.elements) {
        // Resolve dynamic placeholders (e.g. {product.name} -> actual value)
        let resolvedContent = el.content;
        for (const [key, val] of Object.entries(sampleData)) {
            resolvedContent = resolvedContent.replaceAll(key, val);
        }

        const formatter = ZPL_ELEMENT_FORMATTERS[el.type];
        if (formatter) {
            zpl += formatter(el, resolvedContent, dotsPerMm);
        }
    }

    zpl += `^PQ1,0,1,Y\n`;
    zpl += `^XZ`;
    return zpl;
}

export function generateSingleBarcodeZpl(
    symbology: string,
    value: string,
    widthMm: number = 100,
    heightMm: number = 50
): string {
    const dotsPerMm = 8;
    const wDots = widthMm * dotsPerMm;
    const hDots = heightMm * dotsPerMm;

    let zpl = `^XA\n`;
    zpl += `^PW${wDots}\n`;
    zpl += `^LL${hDots}\n`;
    zpl += `^LH20,20\n`;

    if (symbology === 'QR') {
        zpl += `^FO50,30^BQN,2,8^FDQA,${value}^FS\n`;
    } else if (symbology === 'EAN13') {
        zpl += `^FO50,40^BEN,120,Y,N^FD${value}^FS\n`;
    } else {
        zpl += `^FO40,40^BY2,3,120^BCN,120,Y,N,N^FD>:${value}^FS\n`;
    }

    zpl += `^XZ`;
    return zpl;
}
