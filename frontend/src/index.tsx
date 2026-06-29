import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './globals.css';
import { ThemeProvider } from './components/ui/ThemeProvider';
import { ClerkProvider } from '@clerk/clerk-react';
import { Analytics } from '@vercel/analytics/react';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const app = PUBLISHABLE_KEY ? (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <App />
      <Analytics />
    </ThemeProvider>
  </ClerkProvider>
) : (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <App />
    <Analytics />
  </ThemeProvider>
);

root.render(
  <React.StrictMode>
    {app}
  </React.StrictMode>
);
