export const formatDate = (dateString?: string | null): string => {
    if (!dateString) return '-';

    const date = new Date(dateString);

    // invalid date
    if (isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat('pl-PL').format(date);
};

export const formatDateTime = (dateString?: string | null): string => {
    if (!dateString) return '-';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

export const formatCurrency = (currency?: number | null): string => {
    // '==' catch null and undefined
    if (currency == null || isNaN(currency)) return '-';

    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN'
    }).format(currency);
};

export const formatNumber = (value?: number | null): string => {
    if (value == null || isNaN(value)) return '-';
    return new Intl.NumberFormat('pl-PL').format(value);
};

export const formatValue = (value?: string | number | null): string | number => {
    if (value == null) return '-';

    if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : '-';
    }

    return value;
};