# DetailStock

Backend for a car-detailing product shop: a public JSON API for the storefront (SPA) and a server-rendered admin panel for the shop owner.

## Tech stack

- Node.js + TypeScript, Express 4
- MongoDB with Mongoose
- EJS views for the admin panel (server-side rendered)
- JWT (cookie) auth for shop customers, session-based auth for the admin
- Multer for image uploads, bcryptjs for password hashing

## Project structure

```
src/
  app.ts              Express app setup (middleware, sessions, CORS, static files)
  server.ts           Entry point: connects Mongo, starts the HTTP server
  router.ts            /member, /product, /order, /article — public JSON API (SPA)
  router-admin.ts      /admin/... — session-protected admin panel (SSR)
  controllers/         Request handlers per domain
  models/              Business logic / DB access (*.service.ts)
  schema/              Mongoose schemas (*.model.ts)
  libs/                Shared config, error types, enums, upload/escaping utils
  views/               EJS templates for the admin panel
  public/              Static assets (css, js, images, video) served by the app
uploads/               User-uploaded images (members, products, articles) — not in git
```

## Features

**Storefront API** (`/member`, `/product`, `/order`, `/article`)
- Member signup/login/logout, profile detail & update, top users by points
- Product listing with paging/sorting/search, product detail with view tracking
- Order creation, listing, and status updates (stock reserved and priced server-side)
- Public FAQ/notice articles

**Admin panel** (`/admin`, EJS SSR, shop-account only)
- Login (single shop account; signup is disabled)
- Product inventory management (create/update, multi-image upload)
- User management (edit, delete)
- FAQ / Notices / Events management with image upload

## Setup

### Prerequisites
- Node.js 18+
- A MongoDB connection string (e.g. MongoDB Atlas)

### Install

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
PORT=3003
CORS_ORIGIN=http://localhost:3000
MONGO_URL=<your MongoDB connection string>
SESSION_SECRET=<long random string>
SECRET_TOKEN=<long random string, used to sign member JWTs>
AUTH_TIMER=24
```

- `CORS_ORIGIN` — comma-separated list of origins allowed to call the public API with credentials (e.g. the SPA's dev/prod URLs).
- `SESSION_SECRET` / `SECRET_TOKEN` — use long, random, unique values; do not reuse the sample values from any example `.env`.

### Run

```bash
npm run start:dev   # nodemon, restarts on change
npm start           # ts-node, no watcher
npm run build       # compiles to dist/
```

The storefront API is served at `http://localhost:<PORT>/`, the admin panel at `http://localhost:<PORT>/admin`.

## Notes

- `uploads/` and `.env` are gitignored; uploaded files are stored on local disk under `uploads/<members|products|articles>`.
- There is no automated test suite yet (`npm test` is a placeholder).
