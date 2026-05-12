# Inventory Manager

A full-stack web application for managing users and their assigned inventory items. It includes a React frontend and an ASP.NET Core backend API for users, inventory records, and PDF exports.

## Screenshots

## Features

- Manage users with first name, last name, and a unique identifier.
- Manage inventory items by type, identifier, comment, purchase date, and assigned user.
- Supported item types: `Tablet`, `Phone`, `SIMCard`, and `Laptop`.
- Filter inventory by item type, comment text, or assigned user.
- Mark inventory items inactive with soft delete, excluding them from PDF exports.
- Permanently delete users and inventory items.
- Export active inventory to PDF using 2 different templates: summary or detailed.
- Paginated user and inventory tables.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Material UI
- React Router

### Backend

- ASP.NET Core
- .NET 10
- Entity Framework Core InMemory
- QuestPDF

## Project Structure

```text
Manager-web-app/
  backend/          ASP.NET Core API
  frontend/         React/Vite client
  README.md
```

## Prerequisites

- .NET 10 SDK
- Node.js and npm

## Getting Started

Start and run the backend API:

```powershell
cd backend
dotnet run
```

The backend listens on `http://localhost:5067` by default.

Install frontend dependencies:

```powershell
cd frontend
npm install
```

Run the frontend:

```powershell
npm run dev
```

Vite starts the client on `http://localhost:5173` by default.

## API Overview

Base URL: `http://localhost:5067/api`

### Users

- `GET /users` - list users.
- `POST /users` - create a user.
- `DELETE /users/{id}` - delete a user.

### Inventory

- `GET /inventory` - list inventory items.
- `POST /inventory` - create an inventory item.
- `DELETE /inventory/{id}` - permanently delete an inventory item.
- `POST /inventory/{id}/soft` - toggle an inventory item's active state.

### Export

- `POST /export/pdf` - export active inventory items to `inventory.pdf`.

Supported PDF templates are `Summary` and `Detailed`.

## Data Storage

The backend currently uses EF Core in-memory database.

## Database Seeding

The backend includes a simple database seeder to populate the in-memory store with sample data for development.

- Seeder class: `backend/Data/DbSeeder.cs`
- What it does: Adds a few sample `User` and `InventoryItem` records when the application starts if the database is empty.

Remove or modify the seeder as needed for production scenarios.
