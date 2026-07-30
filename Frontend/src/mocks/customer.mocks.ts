import { type Customer } from "@/models/customer";

export const mockCustomers: Customer[] = [
    {
        id: 1,
        name: "John Doe Enterprises",
        taxId: "PL1234567890",
        email: "contact@johndoe.com",
        phone: "+48 123 456 789",
        addressId: "201",
        address: {
            id: "201",
            city: "Warsaw",
            country: "Poland",
            postalCode: "00-001",
            supplierId: "0"
        }
    },
    {
        id: 2,
        name: "Jane Smith LLC",
        taxId: "GB987654321",
        email: "jane@smith.co.uk",
        phone: "+44 20 7123 4567",
        addressId: "202",
        address: {
            id: "202",
            city: "London",
            country: "UK",
            postalCode: "W1A 1AA",
            supplierId: "0"
        }
    }
];
