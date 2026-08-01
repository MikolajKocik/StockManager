import type { InvoiceLanguage } from '@/models/invoice';

export const INVOICE_TRANSLATIONS = {
    PL: {
        docTitle: {
            Sales: 'FAKTURA VAT',
            Proforma: 'FAKTURA PROFORMA',
            Correction: 'FAKTURA KORYGUJĄCA',
            Purchase: 'FAKTURA ZAKUPOWA'
        },
        invoiceNumber: 'Nr:',
        placeOfIssue: 'Miejsce wystawienia:',
        issueDate: 'Data wystawienia:',
        saleDate: 'Data sprzedaży:',
        dueDate: 'Termin płatności:',
        sellerTitle: 'SPRZEDAWCA (WYSTAWCA)',
        buyerTitle: 'NABYWCA (KLIENT)',
        nip: 'NIP:',
        address: 'Adres:',
        fetchGus: 'GUS',
        fetchGusLoading: 'Pobieranie...',
        itemsTable: {
            handle: 'Uchwyt',
            lp: 'Lp.',
            name: 'Nazwa towaru lub usługi',
            qty: 'Ilość',
            unit: 'Jm.',
            netPrice: 'Cena Netto',
            vatRate: 'VAT',
            netTotal: 'Wartość Netto',
            vatTotal: 'Kwota VAT',
            grossTotal: 'Wartość Brutto',
            actions: 'Akcje',
            addItem: '+ Dodaj nową pozycję towarową'
        },
        paymentMethod: 'Sposób zapłaty:',
        paymentMethods: {
            Transfer: 'Przelew bankowy',
            Card: 'Karta płatnicza',
            Cash: 'Gotówka',
            SplitPayment: 'Split Payment (MPP)'
        },
        bank: 'Bank:',
        bankAccount: 'Nr konta:',
        notesTitle: 'UWAGI I ADNOTACJE',
        notesPlaceholder: 'Wpisz dodatkowe uwagi (np. numer WZ, podstawa prawna zwolnienia z VAT)...',
        vatTable: {
            rate: 'Stawka',
            net: 'Netto',
            vat: 'VAT',
            gross: 'Brutto',
            total: 'RAZEM:'
        },
        grandTotal: 'Do zapłaty (Brutto):',
        dueTerm: 'Termin:',
        signatures: {
            issuer: 'Osoba upoważniona do wystawienia faktury',
            recipient: 'Osoba upoważniona do odbioru faktury'
        }
    },
    ENG: {
        docTitle: {
            Sales: 'COMMERCIAL VAT INVOICE',
            Proforma: 'PROFORMA INVOICE',
            Correction: 'CORRECTIVE INVOICE',
            Purchase: 'PURCHASE INVOICE'
        },
        invoiceNumber: 'No:',
        placeOfIssue: 'Place of issue:',
        issueDate: 'Issue date:',
        saleDate: 'Delivery / Sale date:',
        dueDate: 'Due date:',
        sellerTitle: 'SELLER / SUPPLIER',
        buyerTitle: 'BUYER / CUSTOMER',
        nip: 'Tax ID / VAT No:',
        address: 'Address:',
        fetchGus: 'VIES/GUS',
        fetchGusLoading: 'Fetching...',
        itemsTable: {
            handle: 'Drag',
            lp: 'No.',
            name: 'Description of Goods & Services',
            qty: 'Qty',
            unit: 'Unit',
            netPrice: 'Unit Net Price',
            vatRate: 'VAT',
            netTotal: 'Net Total',
            vatTotal: 'VAT Total',
            grossTotal: 'Gross Total',
            actions: 'Actions',
            addItem: '+ Add new line item'
        },
        paymentMethod: 'Payment Method:',
        paymentMethods: {
            Transfer: 'Bank Transfer (Wire)',
            Card: 'Credit Card',
            Cash: 'Cash',
            SplitPayment: 'Split Payment (MPP)'
        },
        bank: 'Bank Name:',
        bankAccount: 'IBAN / Account No:',
        notesTitle: 'NOTES & REMARKS',
        notesPlaceholder: 'Enter remarks (e.g. Purchase Order ref, delivery note WZ, exemption clause)...',
        vatTable: {
            rate: 'Rate',
            net: 'Net Amount',
            vat: 'VAT Amount',
            gross: 'Gross Amount',
            total: 'TOTAL:'
        },
        grandTotal: 'Total Payable (Gross):',
        dueTerm: 'Due by:',
        signatures: {
            issuer: 'Authorized Issuer Signature',
            recipient: 'Authorized Recipient Signature'
        }
    }
};

export const getInvoiceTranslations = (lang?: InvoiceLanguage) => {
    return INVOICE_TRANSLATIONS[lang || 'PL'] || INVOICE_TRANSLATIONS.PL;
};
