// src/types/index.ts - ARREGLAR NavigationContextType

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'courier' | 'client';
  isActive?: boolean;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

// ✅ ARREGLAR: Agregar propiedad navigate al NavigationContextType
export interface NavigationContextType {
  currentPath: string;
  navigate: (path: string) => void;  // ← AGREGAR ESTA LÍNEA
  isActivePath: (path: string) => boolean;
  goBack: () => void;
  goForward: () => void;
  breadcrumbs: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: string;
}

export interface Package {
  id: string;
  trackingNumber: string;
  sender: ContactInfo;
  recipient: ContactInfo;
  status: PackageStatus;
  weight: number;
  dimensions: Dimensions;
  createdAt: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  courierAssigned?: string;
  route?: RouteInfo[];
}

export interface ContactInfo {
  name: string;
  email?: string;
  phone: string;
  address: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export interface RouteInfo {
  location: string;
  timestamp: string;
  status: string;
  description?: string;
}

export type PackageStatus = 
  | 'pending' 
  | 'picked_up' 
  | 'in_transit' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'returned';

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address: Address;
  totalPackages: number;
  totalSpent: number;
  rating: number;
  isActive: boolean;
  createdAt: string;
  casillero?: string; // ← Campo casillero para clientes
}

export interface Courier {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: CourierStatus;
  vehicle: VehicleInfo;
  rating: number;
  totalDeliveries: number;
  isActive: boolean;
  location?: GeoLocation;
  assignedPackages: number;
}

export type CourierStatus = 'available' | 'busy' | 'offline';

export interface VehicleInfo {
  type: 'motorcycle' | 'car' | 'van' | 'truck';
  plate: string;
  model?: string;
  year?: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  markAsRead: (id: string) => void;
  unreadCount: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  action?: NotificationAction;
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface DashboardStats {
  totalPackages: number;
  pendingPackages: number;
  deliveredPackages: number;
  totalClients: number;
  activeClients: number;
  totalCouriers: number;
  activeCouriers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  dailyPackages: number[];
  topCouriers: TopCourier[];
  recentActivity: ActivityItem[];
}

export interface TopCourier {
  id: string;
  name: string;
  deliveries: number;
  rating: number;
  avatar?: string;
}

export interface ActivityItem {
  id: string;
  type: 'package_created' | 'package_delivered' | 'client_registered' | 'courier_assigned';
  description: string;
  timestamp: string;
  icon: string;
  user?: string;
}

// WHR Types para Warehouse Module
export interface WHRPackage {
  id: string;
  whrNumber: string;
  shipper: ContactInfo;
  consignee: ContactInfo;
  packages: PackageItem[];
  transportType?: 'aereo' | 'maritimo';
  totalWeight: number;
  totalVolume: number;
  totalVolumeWeight: number;
  status: 'pending' | 'classified' | 'email_sent' | 'delivered';
  createdAt: string;
  emailSent?: boolean;
  classifiedAt?: string;
}

export interface PackageItem {
  id: string;
  description: string;
  quantity: number;
  weight: number;
  dimensions: Dimensions;
  value: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: ValidationRule[];
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: string | number;
  message: string;
}
