import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Package, 
  Search, 
  FileText, 
  MessageCircle,
  Phone,
  Mail,
  Clock,
  MapPin,
  CheckCircle,
  Truck,
  AlertCircle
} from 'lucide-react';

const ClientPortalPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Header del Cliente */}
        <div className="bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-green-500 to-blue-600 p-2 rounded-xl shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Portal del Cliente</h1>
                  <p className="text-gray-600">Bienvenido, {user?.firstName} {user?.lastName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Cliente Activo
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-white/50"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Mis Paquetes', value: '12', color: 'from-blue-500 to-blue-600', icon: Package },
              { label: 'En Tránsito', value: '3', color: 'from-yellow-500 to-orange-600', icon: Truck },
              { label: 'Entregados', value: '9', color: 'from-green-500 to-green-600', icon: CheckCircle },
              { label: 'Costo Total', value: '$1,250', color: 'from-purple-500 to-purple-600', icon: MapPin }
            ].map((stat, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Funcionalidades Principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mis Paquetes */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
              <div className="p-6 border-b border-white/20 bg-gradient-to-r from-white/50 to-white/30 rounded-t-2xl">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Mis Paquetes Recientes
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { id: 'ITB240705001', destino: 'San José', estado: 'Entregado', fecha: '2024-07-05', color: 'green' },
                    { id: 'ITB240705002', destino: 'Cartago', estado: 'En Tránsito', fecha: '2024-07-04', color: 'yellow' },
                    { id: 'ITB240705003', destino: 'Heredia', estado: 'Pendiente', fecha: '2024-07-03', color: 'gray' }
                  ].map((paquete, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          paquete.color === 'green' ? 'bg-green-100 text-green-600' :
                          paquete.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {paquete.color === 'green' ? <CheckCircle className="w-4 h-4" /> :
                           paquete.color === 'yellow' ? <Truck className="w-4 h-4" /> :
                           <AlertCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{paquete.id}</h4>
                          <p className="text-gray-600 text-sm">Destino: {paquete.destino}</p>
                          <p className="text-gray-500 text-xs">{paquete.fecha}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        paquete.estado === 'Entregado' ? 'bg-green-100 text-green-800' :
                        paquete.estado === 'En Tránsito' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {paquete.estado}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200">
                    Ver Todos los Paquetes
                  </button>
                </div>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
              <div className="p-6 border-b border-white/20 bg-gradient-to-r from-white/50 to-white/30 rounded-t-2xl">
                <h2 className="text-xl font-bold text-gray-900">Acciones Rápidas</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Crear Nuevo Envío', icon: Package, color: 'from-blue-500 to-blue-600' },
                    { label: 'Rastrear Paquete', icon: Search, color: 'from-green-500 to-green-600' },
                    { label: 'Ver Historial', icon: FileText, color: 'from-purple-500 to-purple-600' },
                    { label: 'Contactar Soporte', icon: MessageCircle, color: 'from-orange-500 to-orange-600' }
                  ].map((action, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 hover:scale-105 transition-all duration-200 text-left w-full group"
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} shadow-sm group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-700">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Información de Contacto y Soporte */}
          <div className="mt-8 bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
            <div className="p-6 border-b border-white/20 bg-gradient-to-r from-white/50 to-white/30 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Información de Contacto</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl border border-white/20">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Teléfono</p>
                    <p className="text-gray-600">+506 2000-0000</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl border border-white/20">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">soporte@itobox.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl border border-white/20">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Horarios</p>
                    <p className="text-gray-600">Lun-Vie 8:00-17:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mensaje de Bienvenida */}
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">¡Bienvenido al Portal del Cliente!</h3>
                <p className="text-gray-700 mb-3">
                  Desde aquí puedes gestionar todos tus envíos, rastrear paquetes en tiempo real y contactar nuestro equipo de soporte cuando lo necesites.
                </p>
                <p className="text-gray-600 text-sm">
                  Tu satisfacción es nuestra prioridad. Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortalPage;