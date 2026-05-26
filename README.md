# Garage Management System

A full-stack garage management starter built with React, Node.js, and MySQL.

## What it includes

- React dashboard for customers, vehicles, and service orders
- Node.js + Express API with MySQL data access
- SQL schema and seed files for local setup
- Environment examples for backend and frontend

## Project structure

- `client/` React app built with Vite
- `server/` Express API server
- `database/` MySQL schema and seed data

## Quick start

1. Create the MySQL database.
2. Run the schema and seed scripts in `database/`.
3. Copy `server/.env.example` to `server/.env` and update the values.
4. Copy `client/.env.example` to `client/.env` if you want a custom API URL.
5. Install dependencies from the project root with `npm install`.
6. Run `npm run dev` to start both apps.

## API

- `GET /api/health`
- `GET /api/dashboard`
- `GET/POST /api/customers`
- `GET/POST /api/vehicles`
- `GET/POST /api/service-orders`
- `PATCH /api/service-orders/:id/status`
