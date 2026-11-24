# CodeInterviewX

A role-based technical interview platform with authentication, scheduling, realtime rooms, shared code editing, and chat.

## Features

- Candidate and interviewer signup/login
- JWT authentication
- Role-based dashboards
- Interview scheduling, listing, updates and cancellation
- Realtime interview rooms with Socket.IO
- Shared code editor and room chat
- Browser-side JavaScript execution demo
- MongoDB support with an automatic in-memory demo fallback

## Run locally

Start the backend:

```powershell
cd server
npm install
node index.js
```

The backend runs at `http://localhost:5000`. Configure `server/.env` with `PORT`, `MONGO_URI`, and `JWT_SECRET`.

Start the frontend:

```powershell
cd client/Inter-view
npm install
npm run dev
```

Open `http://localhost:5173`.

## Production note

The JavaScript runner is browser-side demo execution. A production system requires isolated containers or an external code-execution service with CPU, memory, timeout, and network controls.

## Legacy Vite template

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
