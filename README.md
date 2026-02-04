♻️ ECO DIRA – Waste Management & Rewards Platform

ECO DIRA is a role-based waste management web application that incentivizes proper waste disposal through a points/rewards system and overall weight tracking per waste type.
It supports Clients, Operators, and Admins, each with distinct access and functionality.

This repository contains the full-stack implementation using React + TypeScript (Vite) on the frontend and Node.js + Express + MongoDB on the backend.

🚀 Core Features
🔐 Authentication & Roles

JWT-based authentication

Role-aware system:

Client

Operator

Admin

Single source of truth for auth state via /api/auth/me

Automatic navbar + route switching without refresh

👤 Client Features

Register & login

View personal profile

Points balance tracking

Points history

Redeem rewards



Leaderboard visibility

🧑‍🔧 Operator Features

Secure operator login

Operator-specific dashboard & navigation

Waste collection logging (linked to clients)

Role-restricted API access

🧑‍💼 Admin (Extensible)

Backend role support included

Ready for future admin dashboards & controls

🏗️ Tech Stack
Frontend:

React 18

TypeScript

Vite

React Router

Tailwind CSS

Context-based auth (useAuth)

Backend:

Node.js

Express

MongoDB + Mongoose

JWT Authentication

RESTful API architecture

📁 Project Structure
eco-dira/
├── client/                  # Frontend (React + TS)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom hooks (useAuth)
│   │   ├── pages/            # Route-level pages
│   │   ├── services/         # Auth helpers
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── vite.config.ts
│
├── server/                  # Backend (Node + Express)
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── middleware/           # Auth & role guards
│   └── server.js
│  
│
└── README.md

🔑 Authentication Flow (IMPORTANT)

This project uses a centralized auth state.
Do not read localStorage directly inside pages.

Correct Flow

User logs in or registers

JWT token stored once

/api/auth/me is called

Auth context (useAuth) becomes the source of truth

UI (navbar, routes, redirects) updates instantly

Key Rule

All auth changes MUST go through useAuth.login() and useAuth.logout()

This avoids refresh issues, stale state, and role desync.

🔄 API Overview
Auth
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/operator-login
GET    /api/auth/me

Clients
GET    /api/clients/:id
GET    /api/clients/:id/points-history

Waste
GET    /api/waste
POST   /api/waste

Points & Rewards
POST   /api/points/redeem
GET    /api/leaderboard

🧠 Key Design Decisions
1. Role-Driven Navigation

Navbar renders based on me.role

No hardcoded UI assumptions

Fully reactive to auth changes

2. No Route Params for Identity

Client profile does NOT rely on URL params

Identity always comes from JWT (/auth/me)

Prevents ID tampering

3. Defensive Fetching

All API calls guard against undefined IDs

Backend responses support { data } or direct objects



🧪 Environment Variables
Frontend (client/.env)
VITE_API_BASE=http://localhost:5000

Backend (server/.env)
PORT=5000
MONGO_URI=mongodb://localhost:27017/eco-dira
JWT_SECRET=your_secret_here

▶️ Running the Project Locally
Backend
cd server
npm install
npm run dev

Frontend
cd client
npm install
npm run dev

🛠️ Handover Notes (For Next Developer)

Auth system is fully stabilized

Avoid rewriting auth unless absolutely necessary

Use useAuth for any auth-related logic

Roles are enforced both frontend and backend

Codebase is TypeScript-safe and lint-clean

📌Possible  Future Enhancements (Depending on developer and client agreement)

childrens page & agriculture page

Push notifications

SMS integration

Offline collection sync

Advanced analytics & reporting



Project Author: John
