export type Item = {
    id: number;
    type: ItemType;
    identifier: string;
    comment: string;
    purchaseDate: string | null;
    isActive: boolean;
    user: User | null;
};

export type ItemType = 'Tablet' | 'Phone' | 'SIMCard' | 'Laptop';

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    identifier: string;
};

export type NewUserRequest = {
    firstName: string;
    lastName: string;
    identifier: string;
};

export type NewInventoryItemRequest = {
    type: 'Tablet' | 'Phone' | 'SIMCard' | 'Laptop';
    identifier: string;
    comment: string;
    purchaseDate?: string | null;
    userId: number | null;
};