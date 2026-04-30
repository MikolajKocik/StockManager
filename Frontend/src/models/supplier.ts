import type { Address } from "./address";

export interface Supplier {
    id: string;
    name: string;
    slug: string;
    addressId?: string;
    address?: Address;
}

export interface SupplierCollection {
    data: Supplier[];
}