import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoicesApi } from '@/api/internal/invoicesApi';
import { DEFAULT_SELLER, MOCK_INVOICE_DOCUMENTS } from '@/mocks/invoice.mocks';
import type {
    InvoiceDocument,
    InvoiceLineItem,
    InvoiceParty,
    VatRate,
    VatRateSummary,
    PaymentMethod,
    InvoiceStatus,
    InvoiceType
} from '@/models/invoice';
import toast from 'react-hot-toast';

const round2 = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

export const createBlankInvoice = (): InvoiceDocument => {
    const today = new Date().toISOString().split('T')[0];
    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + 14);
    const dueDate = dueDateObj.toISOString().split('T')[0];

    const randomNum = Math.floor(100 + Math.random() * 900);
    const invoiceNumber = `FV/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${randomNum}`;

    const initialItem: InvoiceLineItem = {
        id: `item-${Date.now()}-1`,
        name: 'Usługa magazynowo-logistyczna',
        sku: 'SRV-LOG-01',
        quantity: 1,
        unit: 'usł',
        netPrice: 1500.00,
        vatRate: 23,
        netTotal: 1500.00,
        vatTotal: 345.00,
        grossTotal: 1845.00
    };

    return {
        id: Date.now(),
        invoiceNumber,
        type: 'Sales',
        status: 'Draft',
        issueDate: today,
        saleDate: today,
        dueDate: dueDate,
        paymentMethod: 'Transfer',
        bankName: 'mBank S.A.',
        bankAccount: 'PL 44 1140 2004 0000 3102 7890 1234',
        currency: 'PLN',
        language: 'PL',
        seller: { ...DEFAULT_SELLER },
        buyer: {
            name: '',
            nip: '',
            street: '',
            postalCode: '',
            city: '',
            country: 'Polska',
            email: '',
            phone: ''
        },
        items: [initialItem],
        notes: 'Dziękujemy za współpracę. Prosimy o terminową płatność.',
        issuerName: 'Administrator Systemu',
        recipientName: '',
        totalNet: 1500.00,
        totalVat: 345.00,
        totalGross: 1845.00,
        vatSummary: [
            {
                rate: 23,
                rateLabel: '23%',
                netAmount: 1500.00,
                vatAmount: 345.00,
                grossAmount: 1845.00
            }
        ]
    };
};

export function useInvoiceEditor() {
    const queryClient = useQueryClient();

    // View state: 'editor' (WYSIWYG) or 'list' (Archive)
    const [viewMode, setViewMode] = useState<'editor' | 'list'>('editor');
    const [invoice, setInvoice] = useState<InvoiceDocument>(() => MOCK_INVOICE_DOCUMENTS[0] || createBlankInvoice());
    const [isLookingUpNip, setIsLookingUpNip] = useState<boolean>(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // Query archive list
    const {
        data: invoicesList = [],
        isLoading: isLoadingList,
        refetch: refetchList
    } = useQuery({
        queryKey: ['invoices-list'],
        queryFn: invoicesApi.getAll
    });

    // Helper to calculate line amounts
    const calculateLineAmounts = (item: Partial<InvoiceLineItem>): { netTotal: number; vatTotal: number; grossTotal: number } => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.netPrice) || 0;
        const rate = item.vatRate ?? 23;

        const netTotal = round2(qty * price);
        const vatTotal = rate === -1 ? 0 : round2(netTotal * (rate / 100));
        const grossTotal = round2(netTotal + vatTotal);

        return { netTotal, vatTotal, grossTotal };
    };

    // Helper to recalculate whole document summary from items
    const calculateDocumentTotals = useCallback((items: InvoiceLineItem[]) => {
        let totalNet = 0;
        let totalVat = 0;
        let totalGross = 0;

        const rateMap = new Map<VatRate, { net: number; vat: number; gross: number }>();

        for (const item of items) {
            totalNet += item.netTotal;
            totalVat += item.vatTotal;
            totalGross += item.grossTotal;

            const existing = rateMap.get(item.vatRate) || { net: 0, vat: 0, gross: 0 };
            existing.net += item.netTotal;
            existing.vat += item.vatTotal;
            existing.gross += item.grossTotal;
            rateMap.set(item.vatRate, existing);
        }

        const vatSummary: VatRateSummary[] = Array.from(rateMap.entries()).map(([rate, vals]) => ({
            rate,
            rateLabel: rate === -1 ? 'zw.' : `${rate}%`,
            netAmount: round2(vals.net),
            vatAmount: round2(vals.vat),
            grossAmount: round2(vals.gross)
        }));

        return {
            totalNet: round2(totalNet),
            totalVat: round2(totalVat),
            totalGross: round2(totalGross),
            vatSummary
        };
    }, []);

    // Update root level field
    const updateDocumentField = <K extends keyof InvoiceDocument>(field: K, value: InvoiceDocument[K]) => {
        setInvoice(prev => ({ ...prev, [field]: value }));
    };

    // Update Seller
    const updateSeller = (field: keyof InvoiceParty, value: string) => {
        setInvoice(prev => ({
            ...prev,
            seller: { ...prev.seller, [field]: value }
        }));
    };

    // Update Buyer
    const updateBuyer = (field: keyof InvoiceParty, value: string) => {
        setInvoice(prev => ({
            ...prev,
            buyer: { ...prev.buyer, [field]: value }
        }));
    };

    // Live NIP lookup with autocomplete
    const lookupNip = async (customNip?: string) => {
        const nipToSearch = customNip || invoice.buyer.nip;
        if (!nipToSearch || nipToSearch.replace(/[^0-9]/g, '').length < 10) {
            toast.error('Wpisz poprawny 10-cyfrowy numer NIP');
            return;
        }

        setIsLookingUpNip(true);
        try {
            const result = await invoicesApi.lookupByNip(nipToSearch);
            if (result) {
                setInvoice(prev => ({
                    ...prev,
                    buyer: {
                        ...prev.buyer,
                        ...result
                    }
                }));
                toast.success(`Dane pobrane pomyślnie: ${result.name}`);
            } else {
                toast.error('Nie znaleziono firmy o podanym numerze NIP');
            }
        } catch {
            toast.error('Błąd podczas pobierania danych z rejestru NIP');
        } finally {
            setIsLookingUpNip(false);
        }
    };

    // Line items manipulation
    const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: unknown) => {
        setInvoice(prev => {
            const updatedItems = prev.items.map(item => {
                if (item.id !== id) return item;
                const draft = { ...item, [field]: value };
                const calcs = calculateLineAmounts(draft);
                return { ...draft, ...calcs };
            });
            const totals = calculateDocumentTotals(updatedItems);
            return {
                ...prev,
                items: updatedItems,
                ...totals
            };
        });
    };

    const addLineItem = () => {
        const newItem: InvoiceLineItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: '',
            sku: '',
            quantity: 1,
            unit: 'szt',
            netPrice: 0,
            vatRate: 23,
            netTotal: 0,
            vatTotal: 0,
            grossTotal: 0
        };

        setInvoice(prev => {
            const items = [...prev.items, newItem];
            const totals = calculateDocumentTotals(items);
            return { ...prev, items, ...totals };
        });
    };

    const removeLineItem = (id: string) => {
        setInvoice(prev => {
            if (prev.items.length <= 1) {
                toast.error('Faktura musi zawierać co najmniej jedną pozycję');
                return prev;
            }
            const items = prev.items.filter(item => item.id !== id);
            const totals = calculateDocumentTotals(items);
            return { ...prev, items, ...totals };
        });
    };

    const cloneLineItem = (id: string) => {
        setInvoice(prev => {
            const target = prev.items.find(i => i.id === id);
            if (!target) return prev;
            const cloned: InvoiceLineItem = {
                ...target,
                id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
            };
            const items = [...prev.items, cloned];
            const totals = calculateDocumentTotals(items);
            return { ...prev, items, ...totals };
        });
    };

    // HTML5 Drag & Drop reordering
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        setInvoice(prev => {
            const items = [...prev.items];
            const [draggedItem] = items.splice(draggedIndex, 1);
            items.splice(index, 0, draggedItem);
            return { ...prev, items };
        });
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    // Save mutation
    const saveMutation = useMutation({
        mutationFn: invoicesApi.saveInvoice,
        onSuccess: (savedDoc) => {
            toast.success(`Faktura ${savedDoc.invoiceNumber} została zapisana`);
            queryClient.invalidateQueries({ queryKey: ['invoices-list'] });
        },
        onError: () => {
            toast.error('Błąd podczas zapisywania faktury');
        }
    });

    const handleSave = () => {
        if (!invoice.buyer.name || !invoice.buyer.nip) {
            toast.error('Uzupełnij dane nabywcy (Nazwa i NIP)');
            return;
        }
        saveMutation.mutate(invoice);
    };

    const handleLoadInvoice = async (id: number | string) => {
        try {
            const doc = await invoicesApi.getById(id);
            if (doc) {
                setInvoice(doc);
                setViewMode('editor');
                toast.success(`Wczytano fakturę ${doc.invoiceNumber}`);
            }
        } catch {
            toast.error('Nie udało się wczytać faktury');
        }
    };

    const handleNewInvoice = () => {
        setInvoice(createBlankInvoice());
        setViewMode('editor');
        toast.success('Utworzono nowy szablon faktury');
    };

    const handlePrint = () => {
        window.print();
    };

    return {
        // State
        invoice,
        viewMode,
        invoicesList,
        isLoadingList,
        isLookingUpNip,
        isSaving: saveMutation.isPending,
        draggedIndex,

        // Actions
        setViewMode,
        updateDocumentField,
        updateSeller,
        updateBuyer,
        lookupNip,
        updateLineItem,
        addLineItem,
        removeLineItem,
        cloneLineItem,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleSave,
        handleLoadInvoice,
        handleNewInvoice,
        handlePrint,
        refetchList
    };
}
