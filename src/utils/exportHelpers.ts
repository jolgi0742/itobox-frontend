// src/utils/exportHelpers.ts
// CREAR ESTE ARCHIVO - Funciones de exportación reales

// Exportar datos como CSV
export const exportToCSV = (data: any[], filename: string) => {
  console.log(`📄 Exportando ${data.length} registros a CSV...`);
  
  if (data.length === 0) {
    alert('No hay datos para exportar');
    return;
  }
  
  try {
    // Obtener headers del primer objeto
    const headers = Object.keys(data[0]);
    
    // Crear contenido CSV
    const csvContent = [
      // Headers
      headers.join(','),
      // Data rows
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escapar comillas y envolver en comillas si contiene comas
          const escaped = String(value).replace(/"/g, '""');
          return escaped.includes(',') ? `"${escaped}"` : escaped;
        }).join(',')
      )
    ].join('\n');
    
    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`✅ Archivo ${filename}.csv descargado exitosamente`);
    alert(`✅ Archivo ${filename}.csv descargado exitosamente`);
    
  } catch (error) {
    console.error('Error exportando CSV:', error);
    alert('Error al exportar archivo CSV');
  }
};

// Exportar datos como Excel (XLSX)
export const exportToExcel = (data: any[], filename: string) => {
  console.log(`📊 Exportando ${data.length} registros a Excel...`);
  
  if (data.length === 0) {
    alert('No hay datos para exportar');
    return;
  }
  
  try {
    // Crear contenido de tabla HTML que Excel puede abrir
    const headers = Object.keys(data[0]);
    
    const htmlContent = `
      <table>
        <thead>
          <tr>
            ${headers.map(header => `<th>${header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => 
            `<tr>
              ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
            </tr>`
          ).join('')}
        </tbody>
      </table>
    `;
    
    // Crear y descargar archivo
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.xls`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`✅ Archivo ${filename}.xls descargado exitosamente`);
    alert(`✅ Archivo ${filename}.xls descargado exitosamente`);
    
  } catch (error) {
    console.error('Error exportando Excel:', error);
    alert('Error al exportar archivo Excel');
  }
};

// Exportar como PDF (texto simple)
export const exportToPDF = (content: string, filename: string) => {
  console.log(`📄 Exportando contenido a PDF...`);
  
  try {
    // Crear contenido HTML que simula PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .content { line-height: 1.6; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ITOBOX Courier - ${filename}</h1>
          <p>Generado el: ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>Documento generado por ITOBOX Courier System</p>
        </div>
      </body>
      </html>
    `;
    
    // Crear y descargar archivo HTML (que se puede imprimir como PDF)
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.html`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`✅ Archivo ${filename}.html descargado exitosamente`);
    alert(`✅ Archivo ${filename}.html descargado exitosamente\n\nPuedes abrirlo en tu navegador e imprimirlo como PDF usando Ctrl+P`);
    
  } catch (error) {
    console.error('Error exportando PDF:', error);
    alert('Error al exportar archivo PDF');
  }
};

// Función específica para exportar clientes
export const exportClients = (clients: any[]) => {
  const clientsData = clients.map(client => ({
    'Nombre': client.name,
    'Empresa': client.company,
    'Email': client.email,
    'Teléfono': client.phone,
    'Dirección': client.address,
    'Total Paquetes': client.totalPackages,
    'Revenue Total': client.totalRevenue,
    'Estado': client.status,
    'Tipo': client.type,
    'Rating': client.rating,
    'Última Actividad': client.lastActivity
  }));
  
  exportToCSV(clientsData, `clientes_${new Date().toISOString().split('T')[0]}`);
};

// Función específica para exportar facturas
export const exportInvoicePDF = (invoice: any) => {
  const invoiceContent = `
    <h2>Factura ${invoice.number}</h2>
    <p><strong>Cliente:</strong> ${invoice.client}</p>
    <p><strong>Fecha:</strong> ${invoice.date}</p>
    <p><strong>Monto:</strong> $${invoice.amount}</p>
    <p><strong>Estado:</strong> ${invoice.status}</p>
    
    <h3>Detalles:</h3>
    <p>Servicios de courier y logística</p>
    <p>Período de facturación: ${invoice.date}</p>
    
    <h3>Total:</h3>
    <p style="font-size: 18px; font-weight: bold;">$${invoice.amount}</p>
  `;
  
  exportToPDF(invoiceContent, `factura_${invoice.number}`);
};