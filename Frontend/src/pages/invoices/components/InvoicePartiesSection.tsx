import React from 'react';
import type { InvoiceLanguage, InvoiceParty } from '@/models/invoice';
import { getInvoiceTranslations } from '../utils/invoiceTranslations';

interface InvoicePartiesSectionProps {
    seller: InvoiceParty;
    buyer: InvoiceParty;
    language?: InvoiceLanguage;
    isLookingUpNip: boolean;
    onUpdateSeller: (field: keyof InvoiceParty, value: string) => void;
    onUpdateBuyer: (field: keyof InvoiceParty, value: string) => void;
    onLookupNip: (nip?: string) => void;
}

export const InvoicePartiesSection: React.FC<InvoicePartiesSectionProps> = ({
    seller,
    buyer,
    language,
    isLookingUpNip,
    onUpdateSeller,
    onUpdateBuyer,
    onLookupNip
}) => {
    const t = getInvoiceTranslations(language);

    const handleNipKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onLookupNip();
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4 my-4">
            {/* Seller Box */}
            <div className="border border-slate-300 rounded p-3 bg-slate-50/50 flex flex-col justify-between print:bg-transparent print:p-2">
                <div>
                    <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-slate-500 block mb-2 border-b border-slate-200 pb-1">
                        {t.sellerTitle}
                    </span>
                    <div className="space-y-1.5 text-xs text-slate-800">
                        <input
                            type="text"
                            value={seller.name}
                            onChange={(e) => onUpdateSeller('name', e.target.value)}
                            placeholder="Nazwa firmy sprzedawcy..."
                            className="w-full font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-700 focus:bg-white px-1 py-0.5 outline-none transition-colors"
                        />
                        <div className="flex items-center gap-1">
                            <span className="text-slate-500 font-medium w-12">{t.nip}</span>
                            <input
                                type="text"
                                value={seller.nip}
                                onChange={(e) => onUpdateSeller('nip', e.target.value)}
                                placeholder="NIP sprzedawcy..."
                                className="flex-1 font-mono font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-700 focus:bg-white px-1 py-0.5 outline-none transition-colors"
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-slate-500 font-medium w-12">{t.address}</span>
                            <input
                                type="text"
                                value={seller.street}
                                onChange={(e) => onUpdateSeller('street', e.target.value)}
                                placeholder="Ulica i numer..."
                                className="flex-1 text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-700 focus:bg-white px-1 py-0.5 outline-none transition-colors"
                            />
                        </div>
                        <div className="flex items-center gap-2 pl-13">
                            <input
                                type="text"
                                value={seller.postalCode}
                                onChange={(e) => onUpdateSeller('postalCode', e.target.value)}
                                placeholder="Kod..."
                                className="w-16 text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-700 focus:bg-white px-1 py-0.5 outline-none transition-colors"
                            />
                            <input
                                type="text"
                                value={seller.city}
                                onChange={(e) => onUpdateSeller('city', e.target.value)}
                                placeholder="Miasto..."
                                className="flex-1 text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-700 focus:bg-white px-1 py-0.5 outline-none transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Buyer Box with Instant NIP Auto-lookup */}
            <div className="border border-slate-300 rounded p-3 bg-white relative shadow-sm print:shadow-none print:p-2">
                <div>
                    <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-1">
                        <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-slate-700">
                            {t.buyerTitle}
                        </span>
                        <span className="text-[0.625rem] text-slate-400 no-print">
                            {language === 'ENG' ? 'Enter Tax ID &bull; Enter to fetch' : 'Wpisz NIP &bull; Enter aby pobrać dane'}
                        </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-800">
                        {/* Interactive NIP Input with Instant Lookup Button */}
                        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded border border-slate-300 print:bg-transparent print:p-0 print:border-none">
                            <span className="text-slate-600 font-bold text-xs pl-1">{t.nip}</span>
                            <input
                                type="text"
                                value={buyer.nip}
                                onChange={(e) => onUpdateBuyer('nip', e.target.value)}
                                onKeyDown={handleNipKeyDown}
                                placeholder="np. 5252344078"
                                className="flex-1 font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs outline-none focus:border-slate-800 print:bg-transparent print:border-none print:px-0"
                            />
                            <button
                                type="button"
                                onClick={() => onLookupNip()}
                                disabled={isLookingUpNip}
                                className="no-print bg-[#37393B] hover:bg-slate-800 text-white text-[0.6875rem] font-semibold px-2.5 py-1 rounded transition-colors disabled:opacity-50"
                            >
                                {isLookingUpNip ? t.fetchGusLoading : t.fetchGus}
                            </button>
                        </div>

                        <input
                            type="text"
                            value={buyer.name}
                            onChange={(e) => onUpdateBuyer('name', e.target.value)}
                            placeholder="Nazwa firmy lub imię i nazwisko nabywcy..."
                            className="w-full font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 hover:border-slate-400 focus:border-slate-800 focus:bg-amber-50/50 px-1 py-0.5 outline-none transition-colors"
                        />

                        <div className="flex items-center gap-1">
                            <span className="text-slate-500 font-medium w-12">{t.address}</span>
                            <input
                                type="text"
                                value={buyer.street}
                                onChange={(e) => onUpdateBuyer('street', e.target.value)}
                                placeholder="Ulica i numer lokalu..."
                                className="flex-1 text-slate-800 bg-transparent border-b border-dashed border-slate-300 hover:border-slate-400 focus:border-slate-800 focus:bg-amber-50/50 px-1 py-0.5 outline-none transition-colors"
                            />
                        </div>

                        <div className="flex items-center gap-2 pl-13">
                            <input
                                type="text"
                                value={buyer.postalCode}
                                onChange={(e) => onUpdateBuyer('postalCode', e.target.value)}
                                placeholder="Kod pocztowy..."
                                className="w-24 text-slate-800 bg-transparent border-b border-dashed border-slate-300 hover:border-slate-400 focus:border-slate-800 focus:bg-amber-50/50 px-1 py-0.5 outline-none transition-colors"
                            />
                            <input
                                type="text"
                                value={buyer.city}
                                onChange={(e) => onUpdateBuyer('city', e.target.value)}
                                placeholder="Miejscowość..."
                                className="flex-1 text-slate-800 bg-transparent border-b border-dashed border-slate-300 hover:border-slate-400 focus:border-slate-800 focus:bg-amber-50/50 px-1 py-0.5 outline-none transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
