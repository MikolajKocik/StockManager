/**
 * Utility functions for localized formatting using native browser Intl APIs
 */

export const formatDate = (dateString?: string | null): string => {
    if (!dateString) return '-';

    const date = new Date(dateString);

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

export const formatCurrency = (currency?: number | null, currencyCode = 'PLN'): string => {
    if (currency == null || isNaN(currency)) return '-';

    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: currencyCode
    }).format(currency);
};

export const formatNumber = (value?: number | null): string => {
    if (value == null || isNaN(value)) return '-';
    return new Intl.NumberFormat('pl-PL').format(value);
};

export const formatPercent = (value?: number | null): string => {
    if (value == null || isNaN(value)) return '-';
    return new Intl.NumberFormat('pl-PL', {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
    }).format(value / 100);
};

export const formatHour = (hourDecimal?: number | null): string => {
    if (hourDecimal == null || isNaN(hourDecimal)) return '-';
    const h = Math.floor(hourDecimal);
    const m = Math.round((hourDecimal - h) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const formatTimeRange = (startHour?: number | null, durationHours?: number | null): string => {
    if (startHour == null || isNaN(startHour)) return '-';
    const start = formatHour(startHour);
    if (durationHours == null || isNaN(durationHours)) return start;
    const end = formatHour(startHour + durationHours);
    return `${start} - ${end}`;
};

export const formatValue = (value?: string | number | null): string | number => {
    if (value == null) return '-';

    if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : '-';
    }

    return value;
};