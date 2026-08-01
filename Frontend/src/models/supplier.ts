import type { Address } from "./address";

export interface Supplier {
    id: string;
    name: string;
    slug: string;
    taxId?: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    website?: string;
    paymentTerms?: string;
    leadTimeDays?: number;
    rating?: number;
    status?: 'Active' | 'Under Review' | 'Inactive';
    activeItemsCount?: number;
    addressId?: string;
    address?: Address;
}

export interface SupplierCollection {
    data: Supplier[];
}