import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Shield, 
  Building2, 
  Bell, 
  Palette, 
  Database, 
  Mail, 
  Lock,
  Save,
  Plus,
  Search,
  Edit3,
  Trash2,
  User,
  UserPlus,
  Eye,
  EyeOff,
  X,
  Check,
  AlertTriangle,
  Globe,
  Monitor,
  Smartphone,
  Clock,
  MapPin,
  Phone,
  Calendar,
  Badge
} from 'lucide-react';

// Interfaces
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  phone?: string;
  address?: string;
  createdAt: string;
  lastLogin?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  isSystem: boolean;
  permissions: string[];
  userCount: number;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface CompanySettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  logo: string;
  timezone: string;
  currency: string;
  language: string;
}

// Datos mock
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'Sistema',
    email: 'admin@itobox.com',
    role: 'admin',
    department: 'IT',
    status: 'active',
    phone: '+1-555-0100',
    address: '123 Admin St, Tech City',
    createdAt: '2024-01-15T10:00:00Z',
    lastLogin: '2024-06-15T09:30:00Z'
  },
  {
    id: '2',
    firstName: 'María',
    lastName: 'González',
    email: 'maria.gonzalez@itobox.com',
    role: 'manager',
    department: 'Operaciones',
    status: 'active',
    phone: '+1-555-0101',
    address: '456 Manager Ave, Business District',
    createdAt: '2024-02-01T14:00:00Z',
    lastLogin: '2024-06-14T16:45:00Z'
  },
  {
    id: '3',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    email: 'carlos.rodriguez@itobox.com',
    role: 'courier',
    department: 'Entrega',
    status: 'active',
    phone: '+1-555-0102',
    address: '789 Courier Rd, Delivery Zone',
    createdAt: '2024-03-10T08:00:00Z',
    lastLogin: '2024-06-15T07:20:00Z'
  },
  {
    id: '4',
    firstName: 'Ana',
    lastName: 'Martínez',
    email: 'ana.martinez@itobox.com',
    role: 'operator',
    department: 'Atención al Cliente',
    status: 'active',
    phone: '+1-555-0103',
    createdAt: '2024-04-05T12:00:00Z',
    lastLogin: '2024-06-13T18:10:00Z'
  },
  {
    id: '5',
    firstName: 'Luis',
    lastName: 'Torres',
    email: 'luis.torres@itobox.com',
    role: 'courier',
    department: 'Entrega',
    status: 'suspended',
    phone: '+1-555-0104',
    createdAt: '2024-05-20T16:00:00Z'
  }
];

const systemRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acceso completo al sistema',
    color: '#ef4444',
    isSystem: true,
    permissions: ['all'],
    userCount: 1
  },
  {
    id: 'manager',
    name: 'Gerente',
    description: 'Gestión de operaciones y reportes',
    color: '#3b82f6',
    isSystem: true,
    permissions: ['view_dashboard', 'manage_packages', 'manage_clients', 'view_reports', 'manage_couriers'],
    userCount: 1
  },
  {
    id: 'courier',
    name: 'Courier',
    description: 'Gestión de entregas y paquetes asignados',
    color: '#10b981',
    isSystem: true,
    permissions: ['view_packages', 'update_package_status', 'view_routes'],
    userCount: 2
  },
  {
    id: 'client',
    name: 'Cliente',
    description: 'Acceso al portal del cliente',
    color: '#8b5cf6',
    isSystem: true,
    permissions: ['view_own_packages', 'create_shipments', 'track_packages'],
    userCount: 0
  },
  {
    id: 'operator',
    name: 'Operador',
    description: 'Soporte al cliente y operaciones básicas',
    color: '#f59e0b',
    isSystem: true,
    permissions: ['view_dashboard', 'view_packages', 'view_clients', 'create_packages'],
    userCount: 1
  }
];

const availablePermissions: Permission[] = [
  // General
  { id: 'view_dashboard', name: 'Ver Dashboard', description: 'Acceso al panel principal', category: 'General' },
  { id: 'view_reports', name: 'Ver Reportes', description: 'Acceso a reportes y analytics', category: 'General' },
  { id: 'manage_system', name: 'Gestionar Sistema', description: 'Configuración del sistema', category: 'General' },
  
  // Paquetes
  { id: 'view_packages', name: 'Ver Paquetes', description: 'Ver lista de paquetes', category: 'Paquetes' },
  { id: 'create_packages', name: 'Crear Paquetes', description: 'Crear nuevos paquetes', category: 'Paquetes' },
  { id: 'edit_packages', name: 'Editar Paquetes', description: 'Modificar paquetes existentes', category: 'Paquetes' },
  { id: 'delete_packages', name: 'Eliminar Paquetes', description: 'Eliminar paquetes', category: 'Paquetes' },
  { id: 'manage_packages', name: 'Gestionar Paquetes', description: 'Control completo de paquetes', category: 'Paquetes' },
  { id: 'update_package_status', name: 'Actualizar Estado', description: 'Cambiar estado de paquetes', category: 'Paquetes' },
  { id: 'view_own_packages', name: 'Ver Propios Paquetes', description: 'Ver solo paquetes propios', category: 'Paquetes' },
  
  // Clientes
  { id: 'view_clients', name: 'Ver Clientes', description: 'Ver lista de clientes', category: 'Clientes' },
  { id: 'create_clients', name: 'Crear Clientes', description: 'Crear nuevos clientes', category: 'Clientes' },
  { id: 'edit_clients', name: 'Editar Clientes', description: 'Modificar clientes existentes', category: 'Clientes' },
  { id: 'delete_clients', name: 'Eliminar Clientes', description: 'Eliminar clientes', category: 'Clientes' },
  { id: 'manage_clients', name: 'Gestionar Clientes', description: 'Control completo de clientes', category: 'Clientes' },
  
  // Couriers
  { id: 'view_couriers', name: 'Ver Couriers', description: 'Ver lista de couriers', category: 'Couriers' },
  { id: 'manage_couriers', name: 'Gestionar Couriers', description: 'Control completo de couriers', category: 'Couriers' },
  { id: 'view_routes', name: 'Ver Rutas', description: 'Ver rutas de entrega', category: 'Couriers' },
  
  // Tracking
  { id: 'track_packages', name: 'Rastrear Paquetes', description: 'Usar sistema de tracking', category: 'Tracking' },
  { id: 'create_shipments', name: 'Crear Envíos', description: 'Crear nuevos envíos', category: 'Tracking' },
  
  // Usuarios
  { id: 'manage_users', name: 'Gestionar Usuarios', description: 'Control completo de usuarios', category: 'Usuarios' },
  { id: 'manage_roles', name: 'Gestionar Roles', description: 'Control completo de roles', category: 'Usuarios' }
];

const departments = ['IT', 'Operaciones', 'Entrega', 'Atención al Cliente', 'Ventas', 'Administración', 'Contabilidad'];

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'company' | 'notifications' | 'security'>('users');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [roles, setRoles] = useState<Role[]>(systemRoles);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Company Settings State
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: 'ITOBOX Courier',
    address: '123 Business Ave, Corporate City, CC 12345',
    phone: '+1-555-ITOBOX',
    email: 'info@itobox.com',
    website: 'www.itobox.com',
    taxId: '123-45-6789',
    logo: '',
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'es'
  });

  // User Form State
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  // Role Form State
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    permissions: [] as string[]
  });

  // Filtered users
  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle User CRUD
  const handleCreateUser = () => {
    if (userForm.password !== userForm.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      firstName: userForm.firstName,
      lastName: userForm.lastName,
      email: userForm.email,
      role: userForm.role,
      department: userForm.department,
      status: userForm.status,
      phone: userForm.phone,
      address: userForm.address,
      createdAt: new Date().toISOString()
    };

    setUsers([...users, newUser]);
    resetUserForm();
    setShowUserModal(false);
    alert('✅ Usuario creado exitosamente!');
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    const updatedUsers = users.map(user =>
      user.id === selectedUser.id
        ? {
            ...user,
            firstName: userForm.firstName,
            lastName: userForm.lastName,
            email: userForm.email,
            role: userForm.role,
            department: userForm.department,
            status: userForm.status,
            phone: userForm.phone,
            address: userForm.address
          }
        : user
    );

    setUsers(updatedUsers);
    resetUserForm();
    setShowUserModal(false);
    setSelectedUser(null);
    setIsEditMode(false);
    alert('✅ Usuario actualizado exitosamente!');
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      setUsers(users.filter(user => user.id !== userId));
      alert('✅ Usuario eliminado exitosamente!');
    }
  };

  const resetUserForm = () => {
    setUserForm({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      department: '',
      status: 'active',
      phone: '',
      address: '',
      password: '',
      confirmPassword: ''
    });
  };

  // Handle Role CRUD
  const handleCreateRole = () => {
    const newRole: Role = {
      id: Date.now().toString(),
      name: roleForm.name,
      description: roleForm.description,
      color: roleForm.color,
      isSystem: false,
      permissions: roleForm.permissions,
      userCount: 0
    };

    setRoles([...roles, newRole]);
    resetRoleForm();
    setShowRoleModal(false);
    alert('✅ Rol creado exitosamente!');
  };

  const handleEditRole = () => {
    if (!selectedRole) return;

    const updatedRoles = roles.map(role =>
      role.id === selectedRole.id
        ? {
            ...role,
            name: roleForm.name,
            description: roleForm.description,
            color: roleForm.color,
            permissions: roleForm.permissions
          }
        : role
    );

    setRoles(updatedRoles);
    resetRoleForm();
    setShowRoleModal(false);
    setSelectedRole(null);
    setIsEditMode(false);
    alert('✅ Rol actualizado exitosamente!');
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      alert('⚠️ No se pueden eliminar roles del sistema');
      return;
    }

    if (window.confirm('¿Estás seguro de eliminar este rol?')) {
      setRoles(roles.filter(role => role.id !== roleId));
      alert('✅ Rol eliminado exitosamente!');
    }
  };

  const resetRoleForm = () => {
    setRoleForm({
      name: '',
      description: '',
      color: '#3b82f6',
      permissions: []
    });
  };

  // Open modals for editing
  const openEditUserModal = (user: User) => {
    setSelectedUser(user);
    setUserForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
      phone: user.phone || '',
      address: user.address || '',
      password: '',
      confirmPassword: ''
    });
    setIsEditMode(true);
    setShowUserModal(true);
  };

  const openEditRoleModal = (role: Role) => {
    if (role.isSystem) {
      alert('⚠️ No se pueden editar roles del sistema');
      return;
    }
    
    setSelectedRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      color: role.color,
      permissions: [...role.permissions]
    });
    setIsEditMode(true);
    setShowRoleModal(true);
  };

  // Toggle permission
  const togglePermission = (permissionId: string) => {
    const hasPermission = roleForm.permissions.includes(permissionId);
    if (hasPermission) {
      setRoleForm({
        ...roleForm,
        permissions: roleForm.permissions.filter(p => p !== permissionId)
      });
    } else {
      setRoleForm({
        ...roleForm,
        permissions: [...roleForm.permissions, permissionId]
      });
    }
  };

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Permission categories
  const permissionsByCategory = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            Configuración del Sistema
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona usuarios, roles, permisos y configuración general
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'users', name: 'Usuarios', icon: Users },
            { id: 'roles', name: 'Roles y Permisos', icon: Shield },
            { id: 'company', name: 'Empresa', icon: Building2 },
            { id: 'notifications', name: 'Notificaciones', icon: Bell },
            { id: 'security', name: 'Seguridad', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Users Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            </div>
            <button
              onClick={() => {
                resetUserForm();
                setIsEditMode(false);
                setShowUserModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
            >
              <UserPlus className="w-5 h-5" />
              Crear Usuario
            </button>
          </div>

          {/* Users Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Activos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Suspendidos</p>
                  <p className="text-2xl font-bold text-red-600">
                    {users.filter(u => u.status === 'suspended').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Roles Activos</p>
                  <p className="text-2xl font-bold text-purple-600">{roles.length}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Usuario</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Rol</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Departamento</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Estado</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Último Login</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: roles.find(r => r.id === user.role)?.color + '20',
                            color: roles.find(r => r.id === user.role)?.color 
                          }}
                        >
                          {roles.find(r => r.id === user.role)?.name}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-900">{user.department}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status === 'active' ? 'Activo' : user.status === 'inactive' ? 'Inactivo' : 'Suspendido'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditUserModal(user)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          {/* Roles Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Roles y Permisos</h2>
              <p className="text-gray-600">Define roles personalizados y asigna permisos específicos</p>
            </div>
            <button
              onClick={() => {
                resetRoleForm();
                setIsEditMode(false);
                setShowRoleModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-5 h-5" />
              Crear Rol
            </button>
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: role.color + '20' }}
                    >
                      <Shield className="w-5 h-5" style={{ color: role.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-500">{role.userCount} usuarios</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {role.isSystem && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Sistema
                      </span>
                    )}
                    <button
                      onClick={() => openEditRoleModal(role)}
                      className="text-gray-400 hover:text-blue-600 p-1"
                      title="Editar"
                      disabled={role.isSystem}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {!role.isSystem && (
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{role.description}</p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-900">Permisos principales:</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map((permission) => (
                      <span key={permission} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {availablePermissions.find(p => p.id === permission)?.name || permission}
                      </span>
                    ))}
                    {role.permissions.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{role.permissions.length - 3} más
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Company Tab */}
      {activeTab === 'company' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Información de la Empresa</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  value={companySettings.name}
                  onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Teléfono
                </label>
                <input
                  type="text"
                  value={companySettings.phone}
                  onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Dirección
                </label>
                <textarea
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={companySettings.email}
                  onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Sitio Web
                </label>
                <input
                  type="text"
                  value={companySettings.website}
                  onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Fiscal / RUC
                </label>
                <input
                  type="text"
                  value={companySettings.taxId}
                  onChange={(e) => setCompanySettings({...companySettings, taxId: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Zona Horaria
                </label>
                <select
                  value={companySettings.timezone}
                  onChange={(e) => setCompanySettings({...companySettings, timezone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="America/New_York">Eastern Time (UTC-5)</option>
                  <option value="America/Chicago">Central Time (UTC-6)</option>
                  <option value="America/Denver">Mountain Time (UTC-7)</option>
                  <option value="America/Los_Angeles">Pacific Time (UTC-8)</option>
                  <option value="America/Mexico_City">Mexico City (UTC-6)</option>
                  <option value="America/Bogota">Bogotá (UTC-5)</option>
                  <option value="America/Lima">Lima (UTC-5)</option>
                  <option value="Europe/Madrid">Madrid (UTC+1)</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700">
                <Save className="w-5 h-5" />
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración de Notificaciones</h2>
            <div className="space-y-6">
              {[
                { title: 'Nuevos Paquetes', description: 'Recibir notificaciones cuando se creen nuevos paquetes', enabled: true },
                { title: 'Estado de Entrega', description: 'Notificaciones sobre cambios en el estado de los paquetes', enabled: true },
                { title: 'Nuevos Clientes', description: 'Alerta cuando se registren nuevos clientes', enabled: false },
                { title: 'Reportes Diarios', description: 'Resumen diario de actividades y métricas', enabled: true },
                { title: 'Alertas de Sistema', description: 'Notificaciones sobre el estado del sistema', enabled: true }
              ].map((notification, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    <p className="text-sm text-gray-500">{notification.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked={notification.enabled}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración de Seguridad</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiempo de Sesión (minutos)
                  </label>
                  <input
                    type="number"
                    defaultValue={60}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intentos de Login Máximos
                  </label>
                  <input
                    type="number"
                    defaultValue={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: 'Autenticación de Dos Factores', description: 'Requiere verificación adicional al iniciar sesión', enabled: false },
                  { title: 'Forzar Cambio de Contraseña', description: 'Los usuarios deben cambiar contraseñas cada 90 días', enabled: true },
                  { title: 'Historial de Contraseñas', description: 'Evitar reutilización de las últimas 5 contraseñas', enabled: true },
                  { title: 'Sesiones Concurrentes', description: 'Permitir múltiples sesiones por usuario', enabled: false }
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{setting.title}</h3>
                      <p className="text-sm text-gray-500">{setting.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked={setting.enabled}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Editar Usuario' : 'Crear Usuario'}
              </h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={userForm.firstName}
                    onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={userForm.lastName}
                    onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar rol</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento
                  </label>
                  <select
                    value={userForm.department}
                    onChange={(e) => setUserForm({...userForm, department: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar departamento</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({...userForm, status: e.target.value as 'active' | 'inactive' | 'suspended'})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="suspended">Suspendido</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <textarea
                  value={userForm.address}
                  onChange={(e) => setUserForm({...userForm, address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {!isEditMode && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={!isEditMode}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      value={userForm.confirmPassword}
                      onChange={(e) => setUserForm({...userForm, confirmPassword: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={!isEditMode}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 p-6 border-t">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={isEditMode ? handleEditUser : handleCreateUser}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
              >
                {isEditMode ? 'Actualizar' : 'Crear'} Usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Editar Rol' : 'Crear Rol'}
              </h2>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Rol
                  </label>
                  <input
                    type="text"
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={roleForm.color}
                      onChange={(e) => setRoleForm({...roleForm, color: e.target.value})}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={roleForm.color}
                      onChange={(e) => setRoleForm({...roleForm, color: e.target.value})}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Permisos
                </label>
                <div className="space-y-6">
                  {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                    <div key={category} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {permissions.map((permission) => (
                          <label key={permission.id} className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={roleForm.permissions.includes(permission.id)}
                              onChange={() => togglePermission(permission.id)}
                              className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                              <p className="text-xs text-gray-500">{permission.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={isEditMode ? handleEditRole : handleCreateRole}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700"
              >
                {isEditMode ? 'Actualizar' : 'Crear'} Rol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;