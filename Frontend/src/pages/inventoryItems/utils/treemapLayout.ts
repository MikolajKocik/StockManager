import type { StockTreemapNode, TreemapRect } from '../models/stockTreemap';

interface RectArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Computes a standard squarified treemap layout for given items within a bounded rectangle.
 */
export function computeTreemapLayout(
    items: StockTreemapNode[],
    width: number,
    height: number,
    padding: number = 4
): TreemapRect[] {
    if (!items || items.length === 0 || width <= 0 || height <= 0) return [];

    const totalValue = items.reduce((acc, item) => acc + (item.value || 0), 0);
    if (totalValue <= 0) return [];

    // Sort descending by value for optimal aspect ratios
    const sorted = [...items].sort((a, b) => b.value - a.value);

    const results: TreemapRect[] = [];
    squarify(sorted, [], { x: 0, y: 0, width, height }, totalValue, results, padding);
    return results;
}

function squarify(
    children: StockTreemapNode[],
    row: StockTreemapNode[],
    container: RectArea,
    totalParentValue: number,
    results: TreemapRect[],
    padding: number
) {
    if (children.length === 0) {
        layoutRow(row, container, totalParentValue, results, padding);
        return;
    }

    const c = children[0];
    const newRow = [...row, c];

    if (row.length === 0 || worst(row, container, totalParentValue) >= worst(newRow, container, totalParentValue)) {
        squarify(children.slice(1), newRow, container, totalParentValue, results, padding);
    } else {
        const remainingContainer = layoutRow(row, container, totalParentValue, results, padding);
        squarify(children, [], remainingContainer, totalParentValue, results, padding);
    }
}

function worst(row: StockTreemapNode[], container: RectArea, totalParentValue: number): number {
    if (row.length === 0) return 0;
    const rowValue = row.reduce((sum, item) => sum + item.value, 0);
    const side = Math.min(container.width, container.height);
    if (side <= 0 || totalParentValue <= 0) return 0;

    const rowArea = (rowValue / totalParentValue) * (container.width * container.height);
    const rowLength = rowArea / side;

    let maxAspect = 0;
    for (const item of row) {
        const itemArea = (item.value / totalParentValue) * (container.width * container.height);
        const itemWidth = itemArea / rowLength;
        const aspect = Math.max(rowLength / itemWidth, itemWidth / rowLength);
        if (aspect > maxAspect) maxAspect = aspect;
    }
    return maxAspect;
}

function layoutRow(
    row: StockTreemapNode[],
    container: RectArea,
    totalParentValue: number,
    results: TreemapRect[],
    padding: number
): RectArea {
    const rowValue = row.reduce((sum, item) => sum + item.value, 0);
    const isHorizontal = container.width >= container.height;
    const containerArea = container.width * container.height;
    const rowAreaFraction = totalParentValue > 0 ? rowValue / totalParentValue : 0;
    const rowArea = rowAreaFraction * containerArea;

    let offset = 0;

    if (isHorizontal) {
        const rowWidth = container.height > 0 ? rowArea / container.height : 0;
        for (const item of row) {
            const itemAreaFraction = rowValue > 0 ? item.value / rowValue : 0;
            const itemHeight = itemAreaFraction * container.height;

            results.push({
                node: item,
                x: container.x + padding / 2,
                y: container.y + offset + padding / 2,
                width: Math.max(0, rowWidth - padding),
                height: Math.max(0, itemHeight - padding)
            });

            offset += itemHeight;
        }

        return {
            x: container.x + rowWidth,
            y: container.y,
            width: Math.max(0, container.width - rowWidth),
            height: container.height
        };
    } else {
        const rowHeight = container.width > 0 ? rowArea / container.width : 0;
        for (const item of row) {
            const itemAreaFraction = rowValue > 0 ? item.value / rowValue : 0;
            const itemWidth = itemAreaFraction * container.width;

            results.push({
                node: item,
                x: container.x + offset + padding / 2,
                y: container.y + padding / 2,
                width: Math.max(0, itemWidth - padding),
                height: Math.max(0, rowHeight - padding)
            });

            offset += itemWidth;
        }

        return {
            x: container.x,
            y: container.y + rowHeight,
            width: container.width,
            height: Math.max(0, container.height - rowHeight)
        };
    }
}
