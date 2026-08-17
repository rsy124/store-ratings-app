# Store Ratings Platform

A full-stack web application where users can browse registered stores and submit ratings (1–5). Built as a coding challenge implementing three roles: System Administrator, Normal User, and Store Owner.

## Tech Stack

- **Backend:** Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Frontend:** React (Vite)
- **Auth:** JWT + bcrypt

## Features

- Single login system with role-based access (Admin / Normal User / Store Owner)
- Admin: create users & stores, view dashboard stats, filter/sort user & store listings, view user detail
- Normal User: sign up, browse & search stores, submit/modify a 1–5 rating, update password
- Store Owner: view raters and average rating for their store, update password
- Server-side validation on Name, Email, Address, and Password per the spec

## Project Structure
store-ratings-app/
├── backend/ # Express API, Prisma schema & migrations
└── frontend/ # React (Vite) client
## Prerequisites

- Node.js 20+
- PostgreSQL (or use Prisma's local dev database — see below)

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/store-ratings-app.git
cd store-ratings-app
```

### 2. Backend setup
```bash
cd backend
npm install
```

Copy the example env file and fill in your own values:
```bash
cp .env.example .env
```

Start the local Prisma Postgres dev server (in its own terminal, keep it running):
```bash
npx prisma dev
```

In a separate terminal, run migrations and seed the initial admin account:
```bash
npx prisma migrate dev
node prisma/seed.js
```

Start the backend server:
```bash
npm run dev
```
Backend runs on `http://localhost:5000`.

**Default seeded admin login:** `admin@example.com` / `Admin@1234`

### 3. Frontend setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## Environment Variables

See `backend/.env.example` for required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — random secret used to sign auth tokens
- `PORT` — backend server port (default 5000)

## Validation Rules

| Field | Rule |
|---|---|
| Name | 20–60 characters |
| Address | Max 400 characters |
| Password | 8–16 characters, ≥1 uppercase, ≥1 special character |
| Email | Standard email format |

## API Overview

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| PUT | `/api/auth/password` | Any logged-in user |
| POST | `/api/admin/users` | Admin |
| POST | `/api/admin/stores` | Admin |
| GET | `/api/admin/dashboard` | Admin |
| GET | `/api/admin/users` | Admin |
| GET | `/api/admin/stores` | Admin |
| GET | `/api/admin/users/:id` | Admin |
| GET | `/api/stores` | Normal User |
| POST | `/api/stores/:id/ratings` | Normal User |
| GET | `/api/owner/dashboard` | Store Owner |
