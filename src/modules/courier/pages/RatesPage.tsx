import React from 'react';
import RatesModule from '../components/RatesModule';

const RatesPage: React.FC = () => {
  return (
    <div className="page-container">
      {/* Header de la página */}
      <div className="page-header">
        <h1 className="page-title">Sistema de Tarifas</h1>
        <p className="page-subtitle">
          Configurar tarifas, servicios adicionales y calcular costos de envío
        </p>
      </div>

      {/* Contenido principal */}
      <div className="page-content">
        <RatesModule />
      </div>
    </div>
  );
};

export default RatesPage;