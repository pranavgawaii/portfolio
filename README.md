# Pranav Gawai — Portfolio

Personal portfolio and blog for [Pranav Gawai](https://pranavx.in), built with React 19, TypeScript, and Tailwind CSS. Includes a Node.js backend for AI chat, live analytics, and blog comments/reactions.

![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css)

## Features

- **Home** — hero, experience timeline, project highlights, tech stack marquee, GitHub activity heatmap, education, and about sections.
- **Projects** — full project list with tech stack, links, and a detail view per project.
- **Blog** — posts with threaded comments and emoji reactions, gated behind Clerk auth for posting.
- **DSA Sheet** — progress tracker for the Striver SDE Sheet with per-topic breakdowns.
- **Resume** — inline PDF viewer sized to the document, no scroll needed to see the full page.
- **Ask Me** — an AI voice/text assistant (Groq-backed) that answers questions about Pranav using a local knowledge base, with Web Speech API support for voice input.
- **Cmd+K search** — a command palette with quick navigation actions (Home/Projects/Blog/Resume/DSA Sheet, each with a keyboard shortcut) plus fuzzy search over blog posts and projects.
- **Admin dashboard** — Clerk-gated view for managing comments and viewing site analytics.
- Dark mode only, by design — the theme toggle is intentionally locked (see `App.tsx` / `Navbar.tsx` if you're curious why).

## Tech stack

| Layer | Tools |
| :--- | :--- |
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS, motion (Framer Motion) |
| Auth | Clerk |
| Data | Firebase Firestore (analytics, visitor logs), flat JSON files (comments, reactions) |
| AI | Groq SDK (chat completions), Web Speech API (voice input) |
| Backend | Node.js (`http` module, no framework) |
| Icons | Lucide |

## Project structure

```text
.
├── backend/                  # Node HTTP server — AI chat, LeetCode proxy, comments/reactions, analytics
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── features/     # Logic-heavy components (ExperienceCard, ProjectCard, ...)
│   │   │   ├── layout/       # Navbar, Footer, Preloader
│   │   │   ├── modals/       # Search, Contact, Ask Me, Blog/Project modals
│   │   │   ├── sections/     # Page-level sections (Hero, ProjectsPage, BlogPage, DSAPage, ...)
│   │   │   └── ui/           # Reusable primitives (Card, Badge, ProgressiveImage, ...)
│   │   ├── config/           # Site content and constants (profile, projects, experience, DSA sheet data)
│   │   ├── hooks/            # useGroqChat, useSpeechRecognition, useAnalytics
│   │   ├── lib/               # Firebase init, API base URL resolution, small utilities
│   │   ├── types/
│   │   ├── App.tsx           # Routing, nav context, global keyboard shortcuts
│   │   └── globals.css       # Design tokens and Tailwind directives
│   └── vite.config.ts
└── package.json               # npm workspaces root (frontend + backend)
```

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
git clone https://github.com/pranavgawaii/portfolio.git
cd portfolio
npm install
```

### Environment variables

Create a `.env` file at the repo root:

```env
# Groq (Ask Me chat)
GROQ_API_KEY=

# Clerk (auth — comments, admin dashboard)
VITE_CLERK_PUBLISHABLE_KEY=

# Firebase (Firestore — analytics, visitor logs)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Optional — only needed if the backend is deployed at a different origin
# than the frontend in production
VITE_API_URL=
```

### Run

```bash
npm run dev
```

This runs the frontend (Vite, `:3002`) and backend (`:3001`) together via npm workspaces. To run just one:

```bash
npm run dev -w frontend
npm run dev -w backend
```

### Build

```bash
npm run build     # frontend production build, output to frontend/build
npm run preview   # serve the production build locally
```

## Known gaps

Kept here instead of pretending they don't exist:

- **No automated tests.** Neither frontend nor backend has test coverage today.
- **Comments and reactions persist to flat JSON files** (`backend/comments.json`, `backend/reactions.json`) rather than a database. Analytics and visitor logs already run through Firestore; comments/reactions are the remaining piece of that migration.
- **TypeScript `strict` mode is off.** `tsconfig.json` doesn't set `"strict": true`, and `npx tsc --noEmit` currently surfaces a handful of pre-existing type errors unrelated to any specific feature. Worth tackling as a dedicated pass rather than folding into unrelated changes.
- A few installed dependencies (`@giscus/react`, `react-activity-calendar`) aren't imported anywhere in the source — safe to remove next time `package.json` is touched.

## License

No license file is currently included — all rights reserved by default. Add a `LICENSE` file if you want to permit reuse.

---

Built by [Pranav Gawai](https://github.com/pranavgawaii) · [pranavx.in](https://pranavx.in)
