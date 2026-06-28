import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './globals.css';
import { ThemeProvider } from './components/ui/ThemeProvider';
import { ClerkProvider } from '@clerk/clerk-react';

// Use env var securely
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);