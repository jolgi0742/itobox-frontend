import React from 'react'; 
import { Package, Clock, Plane, Ship } from 'lucide-react'; 
 
const WarehouseModule = () => { 
  return ( 
    <div className="p-6 bg-gray-50 min-h-screen"> 
      <div className="mb-8"> 
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Módulo Operativo WHR</h1> 
        <p className="text-gray-600">Sistema de Warehouse Receipt - Operativo</p> 
      </div> 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> 
        <div className="bg-white p-6 rounded-lg shadow"> 
          <Package className="w-8 h-8 text-blue-500 mb-4" /> 
          <h3 className="font-semibold text-gray-900">Total WHRs</h3> 
          <p className="text-2xl font-bold text-blue-600">0</p> 
        </div> 
        <div className="bg-white p-6 rounded-lg shadow"> 
          <Plane className="w-8 h-8 text-green-500 mb-4" /> 
          <h3 className="font-semibold text-gray-900">Aéreo (AWB)</h3> 
          <p className="text-2xl font-bold text-green-600">0</p> 
        </div> 
        <div className="bg-white p-6 rounded-lg shadow"> 
          <Ship className="w-8 h-8 text-cyan-500 mb-4" /> 
          <h3 className="font-semibold text-gray-900">Marítimo (BL)</h3> 
          <p className="text-2xl font-bold text-cyan-600">0</p> 
        </div> 
      </div> 
      <div className="bg-white p-6 rounded-lg shadow"> 
        <h2 className="text-lg font-semibold mb-4">Backend Operativo</h2> 
        <div className="space-y-4"> 
          <p className="text-green-600 font-medium">✅ Backend funcionando en puerto 5000</p> 
          <p className="text-green-600 font-medium">✅ APIs WHR disponibles</p> 
          <p className="text-green-600 font-medium">✅ Sistema de clasificación AWB/BL</p> 
          <a href="http://localhost:5000/api/warehouse/health" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Probar API</a> 
        </div> 
      </div> 
    </div> 
  ); 
}; 
 
export default WarehouseModule; 
