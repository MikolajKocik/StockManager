export interface Product {
    id: number;
    isDeleted: boolean | null;
    name: string;
    genre: string;
    unit: string;
    expirationDate: string;
    deliveredAt: string;
    type: string;
    batchNumber: string;
    supplierId: string;
    supplierName: string;                  
}

export interface ProductCollection {
    data: Product[];
}