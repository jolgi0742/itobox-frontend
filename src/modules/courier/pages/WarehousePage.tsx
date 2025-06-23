import React from 'react';
import WarehouseModule from '../components/WarehouseModule';

const WarehousePage: React.FC = () => {
  return (
    <div className="page-container">
      {/* Header de la página */}
      <div className="page-header">
        <h1 className="page-title">Gestión de Almacén</h1>
        <p className="page-subtitle">
          Recibir paquetes, generar warehouse receipts y gestionar inventario
        </p>
      </div>

      {/* Contenido principal */}
      <div className="page-content">
        <WarehouseModule />
      </div>
    </div>
  );
};

export default WarehousePage;