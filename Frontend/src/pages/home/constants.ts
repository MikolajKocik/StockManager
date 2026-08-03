import type { BadgeProps } from '@/components/common';

export const BIN_CAPACITY_LIMIT = 500;

export const PRIORITY_VARIANTS: Record<string, BadgeProps['variant']> = {
    Critical: 'rose',
    High: 'amber',
    Medium: 'blue',
    Low: 'slate'
};

export const UNIT_VARIANTS: Record<string, BadgeProps['variant']> = {
    kg: 'emerald',
    pcs: 'orange',
    l: 'indigo'
};

export const ORDER_TYPE_VARIANTS: Record<string, BadgeProps['variant']> = {
    WZ: 'purple',
    PZ: 'blue',
    MM: 'amber'
};

export const getUsageVariant = (percent: number): BadgeProps['variant'] => {
    if (percent >= 90) return 'rose';
    if (percent >= 50) return 'amber';
    return 'emerald';
};
