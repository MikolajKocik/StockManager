import api from "../config/api";
import { USE_MOCKS } from "../config/mock";
import { MOCK_INVOICES_LIST, MOCK_INVOICE_DOCUMENTS, MOCK_COMPANIES_DATABASE } from "@/mocks/invoice.mocks";
import type { Invoice, InvoiceDocument, InvoiceParty } from "@/models/invoice";

let localInvoicesStore: InvoiceDocument[] = [...MOCK_INVOICE_DOCUMENTS];

export const invoicesApi = {
    /**
     * Retrieves all summary invoices for the archive list.
     */
    getAll: async (): Promise<Invoice[]> => {
        if (USE_MOCKS) {
            return localInvoicesStore.map(doc => ({
                id: typeof doc.id === 'number' ? doc.id : parseInt(String(doc.id)) || 1,
                invoiceNumber: doc.invoiceNumber,
                type: doc.type,
                invoiceDate: doc.issueDate,
                dueDate: doc.dueDate,
                status: doc.status,
                totalAmount: doc.totalGross,
                purchaseOrderId: doc.purchaseOrderId || null,
                salesOrderId: doc.salesOrderId || null,
                buyerName: doc.buyer?.name,
                buyerNip: doc.buyer?.nip
            }));
        }

        const res = await api.get("/invoices");
        return res.data;
    },

    /**
     * Retrieves a complete WYSIWYG invoice document by ID.
     */
    getById: async (id: number | string): Promise<InvoiceDocument | null> => {
        if (USE_MOCKS) {
            const found = localInvoicesStore.find(inv => String(inv.id) === String(id));
            return found ? { ...found } : null;
        }

        const res = await api.get(`/invoices/${id}`);
        return res.data;
    },

    /**
     * Looks up contractor/buyer data by Polish NIP tax number (simulates GUS / CEIDG / Customer DB).
     */
    lookupByNip: async (rawNip: string): Promise<InvoiceParty | null> => {
        const cleanNip = rawNip.replace(/[^0-9]/g, '');

        if (USE_MOCKS) {
            // Check in mock company registry
            if (MOCK_COMPANIES_DATABASE[cleanNip]) {
                return { ...MOCK_COMPANIES_DATABASE[cleanNip] };
            }

            // Fallback generation for any valid 10-digit NIP entered
            if (cleanNip.length === 10) {
                return {
                    name: `Firma Handlowo-Usługowa NIP ${cleanNip} Sp. z o.o.`,
                    nip: cleanNip,
                    street: "ul. Handlowa 15/2",
                    postalCode: "00-001",
                    city: "Warszawa",
                    country: "Polska",
                    email: `biuro@firma-${cleanNip.slice(-4)}.pl`,
                    phone: "+48 22 555 00 00"
                };
            }

            return null;
        }

        try {
            const res = await api.get(`/customers/lookup-nip/${cleanNip}`);
            return res.data;
        } catch {
            return null;
        }
    },

    /**
     * Saves or creates an invoice document.
     */
    saveInvoice: async (invoice: InvoiceDocument): Promise<InvoiceDocument> => {
        if (USE_MOCKS) {
            const index = localInvoicesStore.findIndex(inv => String(inv.id) === String(invoice.id));
            if (index >= 0) {
                localInvoicesStore[index] = { ...invoice };
            } else {
                const newId = Date.now();
                const newDoc = { ...invoice, id: newId };
                localInvoicesStore.unshift(newDoc);
                return newDoc;
            }
            return invoice;
        }

        const res = await api.post("/invoices", invoice);
        return res.data;
    },

    /**
     * Deletes an invoice by ID.
     */
    deleteInvoice: async (id: number | string): Promise<boolean> => {
        if (USE_MOCKS) {
            localInvoicesStore = localInvoicesStore.filter(inv => String(inv.id) !== String(id));
            return true;
        }

        await api.delete(`/invoices/${id}`);
        return true;
    }
};
