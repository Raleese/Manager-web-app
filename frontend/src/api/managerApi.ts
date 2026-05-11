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
  userId: number | null;
};

const URL = 'http://localhost:5067/api';

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(URL + path, init);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  // Some endpoints (like DELETE) return 204, or POST endpoints return 200 with no body.
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return Promise.resolve(undefined as unknown as T);
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

export function deleteUser(id: number): Promise<void>{
  return requestJson<void>(`/users/${id}`, {
    method: 'DELETE'
  });
}

export function getInventory(): Promise<Item[]> {
  return requestJson<Item[]>('/inventory');
}

export function createInventoryItem(item: NewInventoryItemRequest): Promise<void> {
  return requestJson<void>('/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
}

export function deleteInventoryItem(id: number): Promise<void> {
  return requestJson<void>(`/inventory/${id}`, {
    method: 'DELETE'
  });
}
