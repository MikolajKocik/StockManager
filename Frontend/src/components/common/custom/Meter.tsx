import React from 'react';

export interface MeterProps extends React.MeterHTMLAttributes<HTMLMeterElement> {
    value: number;
    min?: number;
    max?: number;
    low?: number;
    high?: number;
    optimum?: number;
    className?: string;
}

export function Meter({
    value,
    min = 0,
    max = 100,
    low = 50,
    high = 90,
    optimum = 20,
    className = '',
    ...props
}: MeterProps) {
    return (
        <meter
            value={value}
            min={min}
            max={max}
            low={low}
            high={high}
            optimum={optimum}
            className={`custom-meter ${className}`}
            {...props}
        >
            {value}%
        </meter>
    );
}
