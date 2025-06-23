import React from 'react';
import ShippingModule from '../components/ShippingModule';

const ShippingPage: React.FC = () => {
  return (
    <div className="page-container">
      {/* Header de la página */}
      <div className="page-header">
        <h1 className="page-title">Gestión de Envíos</h1>
        <p className="page-subtitle">
          Crear guías, generar tracking numbers y gestionar envíos
        </p>
      </div>

      {/* Contenido principal */}
      <div className="page-content">
        <ShippingModule />
      </div>
    </div>
  );
};

export default ShippingPage;