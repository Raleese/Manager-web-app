import type { Item, User, NewInventoryItemRequest, NewUserRequest, ExportPdfRequest } from '../types/item_user_types';

const URL = 'http://localhost:5067/api';

// Helper function to make API requests and handle JSON responses
async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(URL + path, init);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  // Some endpoints return 204 so there is no content to parse as JSON
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return Promise.resolve(undefined as unknown as T);
  }
  return response.json() as Promise<T>;
}

// Get all users
export function getUsers(): Promise<User[]> {
  return requestJson<User[]>('/users');
}

// Create a new user
export function createUser(user: NewUserRequest): Promise<User> {
  return requestJson<User>('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
}

// Delete a user by ID
export function deleteUser(id: number): Promise<void>{
  return requestJson<void>(`/users/${id}`, {
    method: 'DELETE'
  });
}

// Get all inventory items
export function getInventory(): Promise<Item[]> {
  return requestJson<Item[]>('/inventory');
}

// Create a new inventory item
export function createInventoryItem(item: NewInventoryItemRequest): Promise<void> {
  return requestJson<void>('/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
}

// Permanently delete an inventory item by ID
export function deleteInventoryItem(id: number): Promise<void> {
  return requestJson<void>(`/inventory/${id}`, {
    method: 'DELETE'
  });
}

// Soft delete an inventory item by ID
export function softDeleteInventoryItem(id: number): Promise<void> {
  return requestJson<void>(`/inventory/${id}/soft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
}

// Export inventory to PDF based on filters and template
export function exportInventoryToPdf(request: ExportPdfRequest): Promise<Blob> {
  return fetch(URL + '/export/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  })
  // The response is expected to be a PDF file, so we return it as a Blob
  // Blob - Binary Large Object. It represents raw data
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }

      return response.blob();
  });
}