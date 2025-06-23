import React, { useState } from 'react';
import { Settings, User, Shield, Palette, Bell, Database, Save, Eye, EyeOff } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Administrador',
    lastName: 'Sistema',
    email: 'admin@itobox.com',
    phone: '+1 (555) 123-4567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    securityAlerts: true
  });

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'security', name: 'Seguridad', icon: Shield },
    { id: 'appearance', name: 'Apariencia', icon: Palette },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'system', name: 'Sistema', icon: Settings }
  ];

  return (
    <div className="p-6 lg:p-8 -mt-20">
      <div className="flex items-center space-x-3 mb-8">
        <Settings className="w-8 h-8 text-gray-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Administra las configuraciones del sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <nav className="space-y-1 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Información del Perfil</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Save className="w-5 h-5" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Seguridad</h2>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña Actual
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.currentPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ingresa tu contraseña actual"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ingresa una nueva contraseña"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirma la nueva contraseña"
                    />
                  </div>
                </div>

                <button className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <Shield className="w-5 h-5" />
                  <span>Cambiar Contraseña</span>
                </button>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Notificaciones</h2>
                
                <div className="space-y-6">
                  {Object.entries(notifications).map(([key, value]) => {
                    const labels = {
                      emailNotifications: 'Notificaciones por Email',
                      smsNotifications: 'Notificaciones por SMS',
                      pushNotifications: 'Notificaciones Push',
                      weeklyReports: 'Reportes Semanales',
                      securityAlerts: 'Alertas de Seguridad'
                    };

                    return (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {labels[key as keyof typeof labels]}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Recibe notificaciones sobre actividades importantes
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Apariencia</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Tema</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {['Claro', 'Oscuro', 'Sistema'].map((theme) => (
                        <div key={theme} className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                          <div className="text-center">
                            <div className={`w-12 h-8 mx-auto mb-2 rounded ${
                              theme === 'Claro' ? 'bg-white border border-gray-300' :
                              theme === 'Oscuro' ? 'bg-gray-800' : 'bg-gradient-to-r from-white to-gray-800'
                            }`}></div>
                            <span className="text-sm font-medium">{theme}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Tamaño de Fuente</h3>
                    <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="small">Pequeño</option>
                      <option value="medium" selected>Mediano</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Sistema</h2>
                
                <div className="space-y-6">
                  <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Database className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-medium text-blue-900">Información del Sistema</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700 font-medium">Versión:</span>
                        <span className="text-blue-600 ml-2">2.1.0</span>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Base de datos:</span>
                        <span className="text-blue-600 ml-2">MySQL 8.0</span>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Última actualización:</span>
                        <span className="text-blue-600 ml-2">16 Jun 2024</span>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Estado:</span>
                        <span className="text-green-600 ml-2">Operativo</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <h4 className="font-medium text-gray-900 mb-2">Limpiar Caché</h4>
                      <p className="text-sm text-gray-600">Limpia los archivos temporales del sistema</p>
                    </button>

                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <h4 className="font-medium text-gray-900 mb-2">Exportar Datos</h4>
                      <p className="text-sm text-gray-600">Genera una copia de seguridad de los datos</p>
                    </button>

                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <h4 className="font-medium text-gray-900 mb-2">Logs del Sistema</h4>
                      <p className="text-sm text-gray-600">Ver registros de actividad del sistema</p>
                    </button>

                    <button className="p-4 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-left">
                      <h4 className="font-medium text-red-900 mb-2">Reiniciar Sistema</h4>
                      <p className="text-sm text-red-600">Reinicia todos los servicios del sistema</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;