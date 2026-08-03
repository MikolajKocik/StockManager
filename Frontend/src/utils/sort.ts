export function genericSort<T>(array: T[], activeSort: string | null, keyMap?: Record<string, string>) {
    if (!activeSort) return array;
    const propKey = keyMap ? keyMap[activeSort] : activeSort;
    if (!propKey) return array;

    return array.toSorted((a, b) => {
        const valA = a[propKey as keyof T];
        const valB = b[propKey as keyof T];

        if (typeof valA === 'number' && typeof valB === 'number') {
            return valA - valB;
        }
        return String(valA || '').localeCompare(String(valB || ''));
    });
}
