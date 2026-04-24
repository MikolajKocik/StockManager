import type { Address } from "./address";

export interface Customer {
    id: number;
    name: string;
    taxId: string;
    email: string;
    phone: string;
    addressId: string;
    address?: Address;
}