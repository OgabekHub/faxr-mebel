import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';

// The shop cart is gone; drop the key it left in returning visitors' storage.
try {
  localStorage.removeItem('cart');
} catch {
  // Storage can be blocked (private mode, disabled site data); nothing to clean then.
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
