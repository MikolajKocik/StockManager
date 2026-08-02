import type { LabelTemplate, LabelElement } from "../models/labelTemplate";

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
        const xDots = Math.round(el.x * dotsPerMm);
        const yDots = Math.round(el.y * dotsPerMm);
        const wDots = Math.round(el.width * dotsPerMm);
        const hDots = Math.round(el.height * dotsPerMm);

        // Resolve dynamic placeholders (e.g. {product.name} -> actual value)
        let resolvedContent = el.content;
        for (const [key, val] of Object.entries(sampleData)) {
            resolvedContent = resolvedContent.replaceAll(key, val);
        }

        switch (el.type) {
            case 'BARCODE': {
                const sym = el.symbology || 'CODE128';
                if (sym === 'EAN13') {
                    zpl += `^FO${xDots},${yDots}^BEN,${hDots},Y,N^FD${resolvedContent}^FS\n`;
                } else if (sym === 'CODE39') {
                    zpl += `^FO${xDots},${yDots}^B3N,N,${hDots},Y,N^FD${resolvedContent}^FS\n`;
                } else {
                    // Default Code 128
                    zpl += `^FO${xDots},${yDots}^BY2,3,${hDots}^BCN,${hDots},Y,N,N^FD>:${resolvedContent}^FS\n`;
                }
                break;
            }

            case 'QR_CODE': {
                zpl += `^FO${xDots},${yDots}^BQN,2,6^FDQA,${resolvedContent}^FS\n`;
                break;
            }

            case 'TEXT':
            case 'DYNAMIC_FIELD': {
                const fontH = Math.round((el.fontSize || 12) * 2.8);
                const fontW = Math.round(fontH * 0.85);
                zpl += `^FO${xDots},${yDots}^A0N,${fontH},${fontW}^FD${resolvedContent}^FS\n`;
                break;
            }

            case 'BOX': {
                const thickness = el.borderWidth ? Math.round(el.borderWidth * 2) : 2;
                zpl += `^FO${xDots},${yDots}^GB${wDots},${hDots},${thickness}^FS\n`;
                break;
            }

            case 'LINE': {
                const thickness = el.borderWidth ? Math.round(el.borderWidth * 2) : 2;
                zpl += `^FO${xDots},${yDots}^GB${wDots},${thickness},${thickness}^FS\n`;
                break;
            }

            case 'IMAGE_LOGO': {
                const fontH = Math.round((el.fontSize || 14) * 3);
                zpl += `^FO${xDots},${yDots}^A0N,${fontH},${fontH}^FD[WMS LOGO] ${resolvedContent}^FS\n`;
                break;
            }

            default:
                break;
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
