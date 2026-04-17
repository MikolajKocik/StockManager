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

export interface ProductCreateForm {
    name: string;
    genre: string;
    unit: string;
    type: string;
    batchNumber: string;
    supplierId: string;
    expirationDate: string;
}

export interface ProductUpdateForm {
    id: number | null;
    name: string | null;
    genre: string | null;
    unit: string | null;
    type: string | null;
    batchNumber: string | null;
    supplierId: string | null;
    expirationDate: string | null;
}