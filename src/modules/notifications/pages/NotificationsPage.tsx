import React, { useState, useContext } from 'react';
import { 
  CreditCard, 
  Search, 
  Bell, 
  Settings as SettingsIcon, 
  Download,
  Filter,
  Eye,
  Plus,
  DollarSign,
  Calendar,
  MapPin,
  User,
  Lock,
  Palette,
  Globe,
  Shield,
  Smartphone
} from 'lucide-react';
import { useNavigation } from '../../../contexts/NavigationContext';


// Notifications Page
export const NotificationsPage: React.FC = () => {
  const notifications = [
    {
      id: 1,
      type: 'delivery',
      title: 'Paquete entregado',
      message: 'El paquete ITB123456 ha sido entregado exitosamente',
      time: '5 min',
      read: false
    },
    {
      id: 2,
      type: 'payment',
      title: 'Pago recibido',
      message: 'Pago de $1,250 recibido de Tech Solutions Inc.',
      time: '1 hora',
      read: false
    },
    {
      id: 3,
      type: 'alert',
      title: 'Retraso en entrega',
      message: 'El paquete ITB789012 presenta un retraso estimado de 2 horas',
      time: '3 horas',
      read: true
    }
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Bell className="w-8 h-8 text-yellow-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-gray-600">Centro de notificaciones del sistema</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Notificaciones Recientes</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Marcar todas como leídas
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <div key={notification.id} className={`p-6 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${
                  notification.type === 'delivery' ? 'bg-green-100' :
                  notification.type === 'payment' ? 'bg-blue-100' : 'bg-yellow-100'
                }`}>
                  <Bell className={`w-5 h-5 ${
                    notification.type === 'delivery' ? 'text-green-600' :
                    notification.type === 'payment' ? 'text-blue-600' : 'text-yellow-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{notification.title}</h4>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-2">hace {notification.time}</p>
                </div>
                {!notification.read && (
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default NotificationsPage;