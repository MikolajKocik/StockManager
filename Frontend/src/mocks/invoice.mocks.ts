import type { InvoiceParty, InvoiceDocument, Invoice } from "@/models/invoice";

export const DEFAULT_SELLER: InvoiceParty = {
    name: "StockManager Logistyka & Magazyn Sp. z o.o.",
    nip: "5252819234",
    street: "ul. Magazynowa 42A",
    postalCode: "02-677",
    city: "Warszawa",
    country: "Polska",
    email: "faktury@stockmanager.pl",
    phone: "+48 22 890 12 34"
};

export const MOCK_COMPANIES_DATABASE: Record<string, InvoiceParty> = {
    "5252344078": {
        name: "TechLogistics Poland Sp. z o.o.",
        nip: "5252344078",
        street: "ul. Prosta 12 / 4",
        postalCode: "00-838",
        city: "Warszawa",
        country: "Polska",
        email: "kontakt@techlogistics.pl",
        phone: "+48 22 100 20 30"
    },
    "1234567890": {
        name: "AgroHurt Spożywczy S.A.",
        nip: "1234567890",
        street: "ul. Rolna 5",
        postalCode: "60-101",
        city: "Poznań",
        country: "Polska",
        email: "zamowienia@agrohurt.pl",
        phone: "+48 61 800 40 50"
    },
    "7010456789": {
        name: "Electrix System Sp. k.",
        nip: "7010456789",
        street: "ul. Innowacyjna 8",
        postalCode: "30-390",
        city: "Kraków",
        country: "Polska",
        email: "biuro@electrix.pl",
        phone: "+48 12 345 67 89"
    },
    "9512345678": {
        name: "Apex Retail Group Sp. z o.o.",
        nip: "9512345678",
        street: "Al. Jerozolimskie 100",
        postalCode: "02-001",
        city: "Warszawa",
        country: "Polska",
        email: "faktury@apexgroup.com",
        phone: "+48 22 999 88 77"
    },
    "8971234567": {
        name: "Nordic Distribution Sp. z o.o.",
        nip: "8971234567",
        street: "ul. Portowa 14",
        postalCode: "81-345",
        city: "Gdynia",
        country: "Polska",
        email: "sales@nordic-dist.pl",
        phone: "+48 58 600 70 80"
    }
};

export const MOCK_INVOICE_DOCUMENTS: InvoiceDocument[] = [
    {
        id: 5001,
        invoiceNumber: "FV/2026/08/001",
        type: "Sales",
        status: "Issued",
        issueDate: "2026-08-01",
        saleDate: "2026-08-01",
        dueDate: "2026-08-15",
        paymentMethod: "Transfer",
        bankName: "mBank S.A.",
        bankAccount: "PL 44 1140 2004 0000 3102 7890 1234",
        currency: "PLN",
        seller: DEFAULT_SELLER,
        buyer: MOCK_COMPANIES_DATABASE["5252344078"],
        items: [
            {
                id: "item-1",
                name: "Silnik bezszczotkowy BLDC 24V 250W",
                sku: "MOT-BLDC-24V",
                quantity: 10,
                unit: "szt",
                netPrice: 320.00,
                vatRate: 23,
                netTotal: 3200.00,
                vatTotal: 736.00,
                grossTotal: 3936.00
            },
            {
                id: "item-2",
                name: "Sterownik serwonapędu 10A CANopen",
                sku: "CTRL-SERVO-10A",
                quantity: 5,
                unit: "szt",
                netPrice: 640.00,
                vatRate: 23,
                netTotal: 3200.00,
                vatTotal: 736.00,
                grossTotal: 3936.00
            },
            {
                id: "item-3",
                name: "Przewód ekranowany magistrali 4x0.5mm² (rolka 100m)",
                sku: "CAB-CAN-100M",
                quantity: 2,
                unit: "rolka",
                netPrice: 180.00,
                vatRate: 23,
                netTotal: 360.00,
                vatTotal: 82.80,
                grossTotal: 442.80
            }
        ],
        notes: "Towar wydany z magazynu głównego (WZ/2026/08/012). Prosimy o podanie numeru faktury w tytule przelewu.",
        issuerName: "Jan Kowalski",
        recipientName: "Marek Podolski",
        totalNet: 6760.00,
        totalVat: 1554.80,
        totalGross: 8314.80,
        vatSummary: [
            {
                rate: 23,
                rateLabel: "23%",
                netAmount: 6760.00,
                vatAmount: 1554.80,
                grossAmount: 8314.80
            }
        ],
        salesOrderId: 101
    },
    {
        id: 5002,
        invoiceNumber: "FV/2026/07/089",
        type: "Sales",
        status: "Paid",
        issueDate: "2026-07-28",
        saleDate: "2026-07-28",
        dueDate: "2026-08-11",
        paymentMethod: "Transfer",
        bankName: "mBank S.A.",
        bankAccount: "PL 44 1140 2004 0000 3102 7890 1234",
        currency: "PLN",
        seller: DEFAULT_SELLER,
        buyer: MOCK_COMPANIES_DATABASE["7010456789"],
        items: [
            {
                id: "item-10",
                name: "Zasilacz buforowy impulsowy 12V 5A",
                sku: "PSU-BUF-12V-5A",
                quantity: 20,
                unit: "szt",
                netPrice: 75.00,
                vatRate: 23,
                netTotal: 1500.00,
                vatTotal: 345.00,
                grossTotal: 1845.00
            },
            {
                id: "item-11",
                name: "Akumulator AGM 12V 7.2Ah",
                sku: "BAT-AGM-12V-7AH",
                quantity: 20,
                unit: "szt",
                netPrice: 58.00,
                vatRate: 23,
                netTotal: 1160.00,
                vatTotal: 266.80,
                grossTotal: 1426.80
            }
        ],
        notes: "Zapłacono przelewem w dniu 2026-07-30.",
        issuerName: "Jan Kowalski",
        recipientName: "Tomasz Nowak",
        totalNet: 2660.00,
        totalVat: 611.80,
        totalGross: 3271.80,
        vatSummary: [
            {
                rate: 23,
                rateLabel: "23%",
                netAmount: 2660.00,
                vatAmount: 611.80,
                grossAmount: 3271.80
            }
        ],
        salesOrderId: 98
    }
];

export const MOCK_INVOICES_LIST: Invoice[] = MOCK_INVOICE_DOCUMENTS.map(doc => ({
    id: typeof doc.id === 'number' ? doc.id : parseInt(String(doc.id)) || 1,
    invoiceNumber: doc.invoiceNumber,
    type: doc.type,
    invoiceDate: doc.issueDate,
    dueDate: doc.dueDate,
    status: doc.status,
    totalAmount: doc.totalGross,
    purchaseOrderId: doc.purchaseOrderId || null,
    salesOrderId: doc.salesOrderId || null,
    buyerName: doc.buyer.name,
    buyerNip: doc.buyer.nip
}));
