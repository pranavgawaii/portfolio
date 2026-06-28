import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './globals.css';
import { ThemeProvider } from './components/ui/ThemeProvider';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const app = (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <App />
  </ThemeProvider>
);

root.render(
  <React.StrictMode>
    {app}
  </React.StrictMode>
);