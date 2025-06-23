import React from 'react';
import DocumentsModule from '../components/DocumentsModule';

const DocumentsPage: React.FC = () => {
  return (
    <div className="page-container">
      {/* Header de la página */}
      <div className="page-header">
        <h1 className="page-title">Generación de Documentos</h1>
        <p className="page-subtitle">
          Crear PDFs, declaraciones de valor, etiquetas y documentos con códigos de barras
        </p>
      </div>

      {/* Contenido principal */}
      <div className="page-content">
        <DocumentsModule />
      </div>
    </div>
  );
};

export default DocumentsPage;