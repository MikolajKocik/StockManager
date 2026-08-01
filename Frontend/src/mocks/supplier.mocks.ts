import { type Supplier } from "@/models/supplier";

export const mockSuppliers: Supplier[] = [
    {
        id: "1",
        name: "Acme Industrial Logistics Corp",
        slug: "acme-corp",
        taxId: "US-8829104",
        contactPerson: "James Wilson",
        email: "procurement@acme-corp.com",
        phone: "+1 (555) 234-5678",
        website: "https://www.acme-industrial.com",
        paymentTerms: "Net 30",
        leadTimeDays: 5,
        rating: 4.9,
        status: "Active",
        activeItemsCount: 42,
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
        name: "Global Tech Supplies Ltd",
        slug: "global-tech-supplies",
        taxId: "GB-9920148",
        contactPerson: "Charlotte Evans",
        email: "orders@globaltechsupplies.co.uk",
        phone: "+44 20 7946 0912",
        website: "https://www.globaltech.co.uk",
        paymentTerms: "Net 45",
        leadTimeDays: 7,
        rating: 4.7,
        status: "Active",
        activeItemsCount: 88,
        addressId: "102",
        address: {
            id: "102",
            city: "London",
            country: "UK",
            postalCode: "E1 6AN",
            supplierId: "2"
        }
    },
    {
        id: "3",
        name: "Nordic Packaging Solutions AB",
        slug: "nordic-packaging",
        taxId: "SE-5560123456",
        contactPerson: "Lars Lindqvist",
        email: "sales@nordicpackaging.se",
        phone: "+46 8 123 4567",
        website: "https://www.nordicpackaging.se",
        paymentTerms: "Net 14",
        leadTimeDays: 3,
        rating: 4.8,
        status: "Active",
        activeItemsCount: 19,
        addressId: "103",
        address: {
            id: "103",
            city: "Stockholm",
            country: "Sweden",
            postalCode: "111 22",
            supplierId: "3"
        }
    },
    {
        id: "4",
        name: "Hanseatic Automation & Components GmbH",
        slug: "hanseatic-automation",
        taxId: "DE-312984501",
        contactPerson: "Klaus Weber",
        email: "kontakt@hanseatic-automation.de",
        phone: "+49 40 555 0192",
        website: "https://www.hanseatic-automation.de",
        paymentTerms: "Net 60",
        leadTimeDays: 12,
        rating: 4.6,
        status: "Active",
        activeItemsCount: 65,
        addressId: "104",
        address: {
            id: "104",
            city: "Hamburg",
            country: "Germany",
            postalCode: "20095",
            supplierId: "4"
        }
    },
    {
        id: "5",
        name: "Silesia Material Handling Sp. z o.o.",
        slug: "silesia-material-handling",
        taxId: "PL-6340129871",
        contactPerson: "Mateusz Kowalski",
        email: "dostawy@silesiamh.pl",
        phone: "+48 32 789 45 12",
        website: "https://www.silesiamh.pl",
        paymentTerms: "Net 30",
        leadTimeDays: 2,
        rating: 5.0,
        status: "Active",
        activeItemsCount: 114,
        addressId: "105",
        address: {
            id: "105",
            city: "Katowice",
            country: "Poland",
            postalCode: "40-001",
            supplierId: "5"
        }
    },
    {
        id: "6",
        name: "Trans-Alpine Pallets & Racks S.r.l.",
        slug: "trans-alpine-pallets",
        taxId: "IT-08912340918",
        contactPerson: "Elena Rossi",
        email: "info@transalpinepallets.it",
        phone: "+39 02 6678 9012",
        website: "https://www.transalpinepallets.it",
        paymentTerms: "Prepayment",
        leadTimeDays: 10,
        rating: 4.2,
        status: "Under Review",
        activeItemsCount: 12,
        addressId: "106",
        address: {
            id: "106",
            city: "Milan",
            country: "Italy",
            postalCode: "20121",
            supplierId: "6"
        }
    }
];
