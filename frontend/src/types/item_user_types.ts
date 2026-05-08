export type Item = {
    id: number;
    type: ItemType;
    identifier: string;
    comment: string;
    purchaseDate: string | null;
    isAssigned: boolean;
    user: User | null;
};

export type ItemType = 'Tablet' | 'Phone' | 'SIMCard' | 'Laptop';

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    identifier: string;
};