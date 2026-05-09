import type { Item, User } from '../types/item_user_types';

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
};

const URL = 'http://localhost:5067/api';

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${URL}${path}`, init);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function getUsers(): Promise<User[]> {
  return requestJson<User[]>('/users');
}

export function createUser(user: NewUserRequest): Promise<User> {
  return requestJson<User>('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
}

export function getInventory(): Promise<Item[]> {
  return requestJson<Item[]>('/inventory');
}

export function createInventoryItem(item: NewInventoryItemRequest): Promise<Item> {
  return requestJson<Item>('/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
}
