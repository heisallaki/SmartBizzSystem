# SmartBizzSystem

A point-of-sale and business management platform built for small and medium-sized businesses in Kenya. It brings sales, inventory, customers, suppliers, purchasing, invoicing, expenses, and reporting into one system, with support for KES, M-Pesa, and Kenyan business requirements.

## Features

* **Sales & POS** — streamlined checkout, multiple payment methods, receipts, and sale management
* **Inventory** — products, categories, stock adjustments, and low-stock tracking
* **Customers & Suppliers** — contact management, transaction history, and order tracking
* **Purchase Orders** — draft, approval, and receiving workflow with partial receiving
* **Invoicing** — create invoices from sales or independently, with payment tracking
* **Expenses** — categorized business expense management
* **Reports** — sales, revenue, inventory, customer, and profit & loss reports
* **Dashboard** — overview of sales, revenue, and inventory health
* **Team Accounts** — role-based access with configurable permissions
* **Notifications & Audit Logs** — system alerts and activity tracking
* **Backups** — on-demand data backups for administrative use

## Tech Stack

**Frontend:** React 19, Vite, Material UI, React Router, Recharts
**Backend:** Node.js, Express, Prisma ORM
**Database:** PostgreSQL (Neon)

## Getting Started

Clone the repository and install the dependencies:

```bash
git clone https://github.com/heisallaki/SmartBizzSystem.git
cd SmartBizzSystem
npm install

cd backend
npm install
```

Create the required environment variables in `backend/.env` and `.env.local` at the project root.

Set up the database and start the backend:

```bash
cd backend
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

In a separate terminal, start the frontend:

```bash
npm run dev
```

The seed process creates the initial Admin account using the configured bootstrap credentials. Use this account to sign in and create additional team accounts.

## Project Structure

```text
SmartBizzSystem/
├── backend/        # API, business logic, authentication and database
├── src/            # Frontend application
│   ├── features/   # Business modules
│   └── components/ # Shared UI components
└── prisma/         # Database schema and migrations
```

## Deployment

The frontend is deployed on Vercel, the backend on Render, and the PostgreSQL database is hosted on Neon.

## License

Private project. All rights reserved.