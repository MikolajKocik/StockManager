import type { Address } from "./address";

export interface Customer {
    id: number;
    name: string;
    code?: string;
    taxId: string;
    email: string;
    phone: string;
    contactPerson?: string;
    segment?: 'Enterprise' | 'Wholesale' | 'Retail' | 'Key Account';
    creditLimit?: number;
    currency?: string;
    status?: 'Active' | 'Suspended' | 'Pending';
    totalOrdersCount?: number;
    totalSpent?: number;
    addressId: string;
    address?: Address;
}