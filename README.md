# 🚀 Portfolio - Pranav Gawai

A premium, modern personal portfolio engineered with **React 19**, **TypeScript**, and **Tailwind CSS**. Designed for performance, accessibility, and visual excellence.

![License](https://img.shields.io/github/license/pranavgawaii/portfolio?style=flat-square)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)

## ✨ key Features

- **Live Integrations**: Real-time Spotify "Now Playing" tracking and LeetCode activity visualizations.
- **Dynamic UX**: Responsive design with liquid transitions, motion-enhanced interactions, and adaptive dark mode.
- **Modular Architecture**: Component-driven development with a clear separation of concerns.
- **Micro-Services**: Lightweight Node.js proxy server for API orchestration and secure state management.
- **Optimized Performance**: Lazy loading, asset optimization, and minimal bundle size.

## 🛠️ Technology Stack

| Category | Tools |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, motion/react (formerly Framer Motion) |
| **Styling** | Tailwind CSS, Lucide Icons, Glassmorphism UI |
| **Backend** | Node.js (Proxy Server), Vercel Serverless Functions |
| **Services** | Spotify Web API, LeetCode GraphQL API, Firebase Firestore |
| **Tooling** | Vite, PostCSS, ESLint, npm |

## 📂 Project Structure

```text
├── core/               # Production Serverless Functions (Vercel)
├── static/             # Static assets (images, fonts, resume)
├── gateway/            # Local Development API Proxy
├── web/
│   ├── components/
│   │   ├── features/   # Logic-heavy components (Spotify, Projects)
│   │   ├── icons/      # Custom SVG components
│   │   ├── layout/     # Structural components (Navbar, Footer, Preloader)
│   │   ├── sections/   # Page-level section components (Hero, About, Contact)
│   │   └── ui/         # Reusable design primitives (Buttons, Cards, Badges)
│   ├── config/         # App configuration and constants
│   ├── lib/            # Third-party service initializations (Firebase)
│   ├── types/          # TypeScript definitions and global interfaces
│   ├── App.tsx         # Main Application Orchestrator
│   └── globals.css     # Global Design System and Tailwind Directives
└── vite.config.ts      # Build and Dev Server Configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pranavgawaii/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   SPOTIFY_CLIENT_ID=your_id
   SPOTIFY_CLIENT_SECRET=your_secret
   SPOTIFY_REFRESH_TOKEN=your_token
   # Add Firebase and other service keys as required
   ```

4. **Launch Development Environment**
   ```bash
   npm run dev
   ```
   *This starts the API Proxy on port 3001 and the Frontend on port 3000.*

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Built with 🖤 by **[Pranav Gawai](https://github.com/pranavgawaii)**
