import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { preloadCows } from './data/cows';
import { preloadCowSound } from './hooks/useCowSound';
import './styles/global.css';

preloadCows();
preloadCowSound();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
