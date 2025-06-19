import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// ✅ PASO 7: Inicializar configuración
import { initConfig } from './config/config';

// Inicializar configuración antes de renderizar la app
initConfig();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);