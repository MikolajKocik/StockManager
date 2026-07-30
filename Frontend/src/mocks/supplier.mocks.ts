import { type Supplier } from "@/models/supplier";

export const mockSuppliers: Supplier[] = [
    {
        id: "1",
        name: "Acme Corp",
        slug: "acme-corp",
        addressId: "101",
        address: {
            id: "101",
            city: "New York",
            country: "USA",
            postalCode: "10001",
            supplierId: "1"
        }
    },
    {
        id: "2",
        name: "Global Tech Supplies",
        slug: "global-tech-supplies",
        addressId: "102",
        address: {
            id: "102",
            city: "London",
            country: "UK",
            postalCode: "E1 6AN",
            supplierId: "2"
        }
    }
];
