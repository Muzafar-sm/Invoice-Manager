# Freelancer Invoice Manager

A full-stack web application for freelancers to manage invoices, clients, and payments. Built with Node.js, Express.js, MongoDB, React, and Tailwind CSS.

## Features

- **User Authentication**: Register and login with JWT-based authentication. Passwords are securely hashed.
- **Invoice Management**: Create, view, update, and delete invoices. Each invoice includes client, services, total, due date, and status (draft, sent, paid, overdue).
- **Client Management**: Store and manage client details (name, email, company, phone, address).
- **Dashboard**: View recent invoices, stats (total earnings, unpaid invoices), and upcoming due dates.
- **Filtering**: Filter invoices by status or date.
- **Responsive UI**: Mobile-friendly, clean, and professional dashboard UI with intuitive navigation.
- **Security**: Protected API routes using JWT. Input validation and error handling on both client and server sides.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs
- **Frontend**: React.js, TypeScript, Tailwind CSS, Vite

## Project Structure

```
project/
  src/           # React frontend
  server/        # Express backend
  package.json   # Project scripts and dependencies
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB (local or Atlas)

### 1. Clone the Repository
```bash
git clone <repo-url>
cd invoice/project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in `project/server/` with the following:

```
MONGODB_URI=mongodb://localhost:27017/invoice_manager
JWT_SECRET=your_jwt_secret
PORT=5000
```
- Replace `MONGODB_URI` with your MongoDB connection string if using Atlas.
- Set a strong `JWT_SECRET`.

### 4. Run the Application

#### Development (concurrently runs backend and frontend):
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

#### Build Frontend for Production
```bash
npm run build
```

#### Lint
```bash
npm run lint
```

## Usage

1. Register a new user account.
2. Add clients with their details.
3. Create invoices for clients, specifying services, due dates, and status.
4. View dashboard stats, recent invoices, and upcoming due dates.
5. Update invoice status (draft, sent, paid, overdue) as needed.

## API Endpoints

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/clients` — List all clients
- `POST /api/clients` — Add a new client
- `GET /api/invoices` — List all invoices (filterable)
- `POST /api/invoices` — Create a new invoice
- `PUT /api/invoices/:id` — Update an invoice
- `DELETE /api/invoices/:id` — Delete an invoice
- `GET /api/dashboard/stats` — Dashboard statistics

## Environment Variables

| Variable      | Description                        |
| -------------| -----------------------------------|
| MONGODB_URI  | MongoDB connection string           |
| JWT_SECRET   | Secret for JWT signing              |
| PORT         | Backend server port (default: 5000) |

## Optional Enhancements
- PDF invoice export
- Email invoices to clients
- Stripe integration for payments

## License

MIT 