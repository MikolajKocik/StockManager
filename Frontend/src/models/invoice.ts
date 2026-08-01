export interface InvoiceParty {
    name: string;
    nip: string;
    street: string;
    postalCode: string;
    city: string;
    country?: string;
    email?: string;
    phone?: string;
}

export type VatRate = 23 | 8 | 5 | 0 | -1; // -1 represents 'zw' (exempt)

export interface InvoiceLineItem {
    id: string;
    name: string;
    sku?: string;
    quantity: number;
    unit: string;
    netPrice: number;
    vatRate: VatRate;
    netTotal: number;
    vatTotal: number;
    grossTotal: number;
}

export interface VatRateSummary {
    rate: VatRate;
    rateLabel: string;
    netAmount: number;
    vatAmount: number;
    grossAmount: number;
}

export type InvoiceStatus = 'Draft' | 'Issued' | 'Paid' | 'Cancelled';
export type InvoiceType = 'Sales' | 'Purchase' | 'Proforma' | 'Correction';
export type InvoiceCurrency = 'PLN' | 'EUR' | 'USD';
export type InvoiceLanguage = 'PL' | 'ENG';
export type PaymentMethod = 'Transfer' | 'Card' | 'Cash' | 'SplitPayment';

export interface InvoiceDocument {
    id: number | string;
    invoiceNumber: string;
    type: InvoiceType;
    status: InvoiceStatus;
    issueDate: string;
    saleDate: string;
    dueDate: string;
    paymentMethod: PaymentMethod;
    bankName: string;
    bankAccount: string;
    currency: string;
    language?: InvoiceLanguage;
    seller: InvoiceParty;
    buyer: InvoiceParty;
    items: InvoiceLineItem[];
    notes?: string;
    issuerName?: string;
    recipientName?: string;
    totalNet: number;
    totalVat: number;
    totalGross: number;
    vatSummary: VatRateSummary[];
    purchaseOrderId?: number | null;
    salesOrderId?: number | null;
}

export interface Invoice {
    id: number;
    invoiceNumber?: string;
    type: string;
    invoiceDate: string;
    dueDate: string | null;
    status: string;
    totalAmount: number;
    purchaseOrderId: number | null;
    salesOrderId: number | null;
    buyerName?: string;
    buyerNip?: string;
}