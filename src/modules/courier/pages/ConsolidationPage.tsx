import React from 'react';
import ConsolidationModule from '../components/ConsolidationModule';

const ConsolidationPage: React.FC = () => {
  return (
    <div className="page-container">
      {/* Header de la página */}
      <div className="page-header">
        <h1 className="page-title">Consolidación y Manifiestos</h1>
        <p className="page-subtitle">
          Gestionar consolidaciones, crear manifiestos de carga y coordinar envíos
        </p>
      </div>

      {/* Contenido principal */}
      <div className="page-content">
        <ConsolidationModule />
      </div>
    </div>
  );
};

export default ConsolidationPage;