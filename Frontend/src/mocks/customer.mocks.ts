import { type Customer } from "@/models/customer";

export const mockCustomers: Customer[] = [
    {
        id: 1,
        name: "Apex Logistics & Retail Hub Sp. z o.o.",
        code: "CUST-001",
        taxId: "PL5252819401",
        contactPerson: "Alexander Novak",
        email: "logistics@apex-retail.pl",
        phone: "+48 22 590 12 34",
        segment: "Enterprise",
        creditLimit: 150000,
        currency: "EUR",
        status: "Active",
        totalOrdersCount: 148,
        totalSpent: 489200,
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
        name: "OmniChannel Retail Solutions UK Ltd",
        code: "CUST-002",
        taxId: "GB987654321",
        contactPerson: "Sarah Jenkins",
        email: "procurement@omnichannel-uk.co.uk",
        phone: "+44 20 7123 4567",
        segment: "Key Account",
        creditLimit: 250000,
        currency: "GBP",
        status: "Active",
        totalOrdersCount: 215,
        totalSpent: 890500,
        addressId: "202",
        address: {
            id: "202",
            city: "London",
            country: "UK",
            postalCode: "W1A 1AA",
            supplierId: "0"
        }
    },
    {
        id: 3,
        name: "Berlin Express Fulfillment GmbH",
        code: "CUST-003",
        taxId: "DE389102451",
        contactPerson: "Maximilian Schulz",
        email: "operations@berlin-fulfillment.de",
        phone: "+49 30 201 9876",
        segment: "Enterprise",
        creditLimit: 120000,
        currency: "EUR",
        status: "Active",
        totalOrdersCount: 94,
        totalSpent: 312000,
        addressId: "203",
        address: {
            id: "203",
            city: "Berlin",
            country: "Germany",
            postalCode: "10115",
            supplierId: "0"
        }
    },
    {
        id: 4,
        name: "Viking Wholesale Distribution AS",
        code: "CUST-004",
        taxId: "NO998812345MVA",
        contactPerson: "Henrik Larsen",
        email: "orders@vikingwholesale.no",
        phone: "+47 22 34 56 78",
        segment: "Wholesale",
        creditLimit: 80000,
        currency: "EUR",
        status: "Active",
        totalOrdersCount: 52,
        totalSpent: 168400,
        addressId: "204",
        address: {
            id: "204",
            city: "Oslo",
            country: "Norway",
            postalCode: "0150",
            supplierId: "0"
        }
    },
    {
        id: 5,
        name: "Baltic Freight & Fasteners OÜ",
        code: "CUST-005",
        taxId: "EE100984512",
        contactPerson: "Kristjan Tamm",
        email: "supply@balticfreight.ee",
        phone: "+372 612 3456",
        segment: "Retail",
        creditLimit: 30000,
        currency: "EUR",
        status: "Active",
        totalOrdersCount: 28,
        totalSpent: 64200,
        addressId: "205",
        address: {
            id: "205",
            city: "Tallinn",
            country: "Estonia",
            postalCode: "10111",
            supplierId: "0"
        }
    },
    {
        id: 6,
        name: "Iberian E-Commerce Depot S.L.",
        code: "CUST-006",
        taxId: "ESB88192044",
        contactPerson: "Carmen Morales",
        email: "invoices@iberiandepot.es",
        phone: "+34 91 555 6789",
        segment: "Key Account",
        creditLimit: 95000,
        currency: "EUR",
        status: "Pending",
        totalOrdersCount: 14,
        totalSpent: 42100,
        addressId: "206",
        address: {
            id: "206",
            city: "Madrid",
            country: "Spain",
            postalCode: "28001",
            supplierId: "0"
        }
    }
];
