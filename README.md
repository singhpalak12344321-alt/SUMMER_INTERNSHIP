# Laundry CRM MERN Application

A full-stack Customer Relationship Management system for a laundry and dry-cleaning business. It includes authentication, customer management, laundry order tracking, payment records, reporting, and dashboard analytics.

## Tech Stack

- Frontend: React, React Router, Axios, Vite
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Security: JWT authentication, password hashing, protected routes

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
frontend/
  src/
    api/
    components/
    context/
    pages/
    styles/
```

## Getting Started

1. Install dependencies:

```bash
npm run install:all
```

2. Create `backend/.env` from `backend/.env.example`.

3. Run the app:

```bash
npm run dev
```

The backend runs on `http://localhost:5000` and the frontend runs on `http://localhost:5173`.

## Local MongoDB Without Admin Install

This workspace includes an extracted MongoDB Community Server under `work/mongodb-extracted`. To run the database, backend, and frontend together on Windows:

```bash
npm.cmd run dev:local
```

MongoDB data is stored in `work/mongo-data`, and logs are stored in `work/mongo-log`.
