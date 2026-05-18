# FOODFIT

FOODFIT is a production-grade AI-powered fitness and lifestyle web application built with React, TypeScript, Vite, Node.js, Express, Prisma, PostgreSQL Neon, OpenRouter, TailwindCSS, Framer Motion, Zustand, Recharts, Lucide, and React Three Fiber.

## Features

- Secure signup, login, JWT access tokens, refresh-token rotation, bcrypt password hashing
- Protected dashboard routes with persistent auth
- Health profile setup with city, food preference, allergies, diseases, goals, height, weight, age, and gender
- AI weekly diet generation through OpenRouter
- AI workout generation for home, gym, yoga, cardio, fat loss, muscle gain, and endurance
- City-specific healthy food recommendations
- AI fitness assistant chat with stored history
- Dashboard overview with calories, macros, hydration, BMI, and charts
- Analytics for weight, calories, protein, and workout consistency
- Premium responsive landing page with React Three Fiber 3D section
- Dark and light themes
- Modular backend architecture with controllers, routes, services, middleware, validation, and Prisma models

## Project Structure

```txt
FOODFIT/
  backend/
    prisma/schema.prisma
    src/
      config/
      controllers/
      middleware/
      routes/
      schemas/
      services/
      utils/
  frontend/
    src/
      components/
      data/
      hooks/
      layouts/
      lib/
      pages/
      store/
```

## Environment

Secrets are stored only in backend `.env`. The frontend only stores the API base URL.

## Links

Local:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Backend API: `http://localhost:5000/api`

Deployed:

- Frontend: `https://foodfit-swart.vercel.app/`
- Backend: `https://foodfit-production.up.railway.app/`
- Backend API: `https://foodfit-production.up.railway.app/api`

Backend:

```env
DATABASE_URL="postgresql://..."
CLIENT_URL="http://localhost:5173"
CLIENT_URLS="http://localhost:5173,https://foodfit-swart.vercel.app"
OPENROUTER_REFERER_URL="https://foodfit-swart.vercel.app"
OPENROUTER_API_KEY="sk-or-v1-..."
JWT_ACCESS_SECRET="use-a-long-random-secret"
JWT_REFRESH_SECRET="use-another-long-random-secret"
```

Frontend:

```env
VITE_API_URL="http://localhost:5000/api"
```

Before production, replace both JWT secrets with strong random values and rotate any exposed keys.

## Installation

```bash
cd C:\Users\prane\COHORT-HARKIRAT\FOODFIT
npm run install:all
npm run db:generate
npm run db:migrate
npm run dev
```

Local frontend: `http://localhost:5173`

Local backend: `http://localhost:5000`

Deployed frontend: `https://foodfit-swart.vercel.app/`

Deployed backend: `https://foodfit-production.up.railway.app/`

## API Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/overview`
- `GET /api/profile`
- `PUT /api/profile`
- `GET /api/progress`
- `POST /api/progress`
- `POST /api/ai/diet-plan/generate`
- `GET /api/ai/diet-plan/latest`
- `POST /api/ai/workout-plan/generate`
- `GET /api/ai/workout-plan/latest`
- `POST /api/ai/foods/generate`
- `GET /api/ai/foods/latest`
- `GET /api/ai/chat/history`
- `POST /api/ai/chat`

## Production Notes

- Configure Neon connection pooling in `DATABASE_URL`.
- Set backend `CLIENT_URL` to the deployed frontend origin: `https://foodfit-swart.vercel.app`.
- Keep backend `CLIENT_URLS` with both local and deployed frontend origins: `http://localhost:5173,https://foodfit-swart.vercel.app`.
- Set frontend `VITE_API_URL` to the deployed backend API: `https://foodfit-production.up.railway.app/api`.
- Keep OpenRouter keys on the server only.
- Run Prisma migrations before deployment.
- Deploy backend and frontend separately or as services behind a reverse proxy.
