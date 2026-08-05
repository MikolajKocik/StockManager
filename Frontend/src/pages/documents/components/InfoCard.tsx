import React from 'react';

interface InfoCardProps {
    title: React.ReactNode;
    children: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => {
    return (
        <div className="bg-slate-50/70 p-2.5 rounded border border-slate-200 space-y-1.5">
            <span className="font-bold text-[0.5625rem] text-slate-500 uppercase block font-mono">{title}</span>
            <div>{children}</div>
        </div>
    );
};

export default InfoCard;
