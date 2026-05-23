# Materio — TypeScript Admin Dashboard

A modern admin dashboard built on the [Materio Free MUI Next.js template](https://themeselection.com/item/materio-free-mui-nextjs-admin-template), extended with a feature-based architecture, typed forms, and a mock-first API layer ready for a real backend.

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| UI | [MUI 5](https://mui.com), [Tailwind CSS](https://tailwindcss.com), [Iconify](https://iconify.design) |
| Language | [TypeScript](https://www.typescriptlang.org) |
| Data | [TanStack Query](https://tanstack.com/query), [Axios](https://axios-http.com) |
| Forms | [React Hook Form](https://react-hook-form.com), [Zod](https://zod.dev) |

## What's included

- **Dashboard** — overview with KPI widgets
- **Users** — list and create flow with validation
- **File manager** — browse and manage files (mock data)
- **Auth pages** — login, register, forgot password
- **Theming** — light / dark mode, RTL support, customizable primary color
- **Mock API** — works out of the box; switch to HTTP when your backend is ready

## Prerequisites

- **Node.js** LTS (v18 or v20 recommended)
- **npm**, **yarn**, or **pnpm**

## Quick start

```bash
# 1. Install dependencies (also builds Iconify icon bundle)
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable | Description | Default |
| --- | --- | --- |
| `BASEPATH` | Optional URL prefix for deployment | _(empty)_ |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Client-side API base path | `/api` |
| `API_URL` | Server-side API base path | `/api` |
| `NEXT_PUBLIC_USE_MOCK_API` | Use in-memory mock repositories | `true` |

Set `NEXT_PUBLIC_USE_MOCK_API=false` when you connect a real backend. Repositories live under `src/features/*/api/`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format `src/` with Prettier |
| `npm run build:icons` | Bundle Iconify icons into CSS |

## Project structure

```
src/
├── app/                    # Next.js App Router (routes & layouts)
│   ├── (auth)/             # Login, register, forgot password
│   └── (dashboard)/        # Dashboard, users, file manager
├── components/             # Shared UI (layout, primitives)
├── core/                   # HTTP client, theme, toast, React Query
├── features/               # Domain modules (auth, users, file-manager)
│   └── {feature}/
│       ├── api/            # API layer + mock/repository implementations
│       ├── components/     # Feature-specific UI
│       └── types/          # Types & Zod schemas
├── providers/              # App-wide React providers
└── configs/                # Theme and layout configuration
```

**Convention:** put reusable UI in `src/components/`, and anything tied to a single domain in `src/features/{name}/`.

## Routes

| Path | Page |
| --- | --- |
| `/` | Dashboard |
| `/users` | User management |
| `/file-manager` | File manager |
| `/login` | Sign in |
| `/register` | Sign up |
| `/forgot-password` | Password recovery |

## Customization

- **App name & theme** — `src/configs/themeConfig.ts`
- **Primary color** — `src/configs/primaryColorConfig.ts`
- **Navigation** — `src/components/layout/vertical/VerticalMenu.tsx`
- **New feature** — add a folder under `src/features/`, wire a page in `src/app/(dashboard)/`, and register a menu item

## Production build

```bash
npm run build
npm run start
```

Deploy like any standard Next.js app (Vercel, Docker, Node server, etc.). Set `BASEPATH` if the app is served from a subpath.

## Documentation & license

This project is based on **Materio Free MUI Next.js Admin Template** by [ThemeSelection](https://themeselection.com).

- [Live demo](https://demos.themeselection.com/materio-mui-nextjs-admin-template-free/demo)
- [Official docs](https://demos.themeselection.com/materio-mui-nextjs-admin-template/documentation)
- [Pro version](https://themeselection.com/item/materio-mui-nextjs-admin-template)

See the [repository license](https://github.com/themeselection/materio-mui-nextjs-admin-template-free/blob/main/LICENSE) for usage terms.
