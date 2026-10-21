import '@fontsource/kalam/400.css';
import '@fontsource/kalam/700.css';
import '@fontsource/nunito-sans/400.css';
import '@fontsource/nunito-sans/700.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';
import './paper-picnic.css';

// Safely unregister stale service workers in development to prevent caching issues in iframe preview
if (import.meta.env.DEV) {
  try {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) {
          reg.unregister().catch(() => {});
        }
      }).catch(() => {});
    }
  } catch (_) {}
} else {
  // Production PWA Service Worker registration
  try {
    if (
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.location.protocol.startsWith('http')
    ) {
      window.addEventListener('load', () => {
        try {
          navigator.serviceWorker
            .register('/sw.js', { scope: '/' })
            .then((reg) => {
              reg.update().catch(() => {});
            })
            .catch((err) => {
              console.warn('Service worker registration skipped:', err?.message);
            });
        } catch (e) {
          console.warn('Service worker registration restricted:', e);
        }
      });
    }
  } catch (e) {
    console.warn('Service worker not supported in current environment:', e);
  }
}

// Clean up any legacy preview helper element if present
const legacyHelper = typeof document !== 'undefined' ? document.getElementById('spotera-preview-sandbox-helper') : null;
if (legacyHelper) {
  legacyHelper.remove();
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}

// Assemble the lossless reference asset after first paint so page startup stays responsive.
Promise.all(Array.from({length:8},async(_,i)=>{const response=await fetch(`/paper-reference-${i}.bin`);if(!response.ok)throw Error('Photo unavailable');return response.arrayBuffer()})).then(parts=>{const image=URL.createObjectURL(new Blob(parts,{type:'image/webp'}));document.documentElement.style.setProperty('--paper-photo',`url("${image}")`)}).catch(()=>console.warn('Reference photo unavailable'));
