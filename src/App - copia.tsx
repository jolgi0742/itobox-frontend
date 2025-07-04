// src/App.tsx - Simple version
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WarehouseTestStandalone from './components/WarehouseTestStandalone';

// Importar tu página principal existente
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de testing independiente */}
        <Route path="/warehouse-test" element={<WarehouseTestStandalone />} />
        
        {/* Rutas existentes (mantener como estaban) */}
        <Route path="/*" element={<div>Main App</div>} />
      </Routes>
    </Router>
  );
}

export default App;