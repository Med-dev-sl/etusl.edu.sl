# Backend (Node + Express + MySQL)

Quick setup:

1. cd backend
2. npm install
3. copy `.env.example` to `.env` and set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
4. Run in development: `npm run dev` (requires `nodemon`)
   or run production: `npm start`

Endpoints:
- `GET /health` - basic health check
- `GET /api/users` - sample users query (expects a `users` table)

Notes:
- This uses `mysql2` with connection pooling. Adjust `db.js` as needed.
