// types/index.ts - Tipos centralizados para ITOBOX Courier

// ============================================================================
// USER & AUTH TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'courier' | 'client';
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  phone?: string;
  address?: string;
  company?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  confirmPassword: string;
  phone?: string;
  company?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// INTERFAZ CORREGIDA - Unificada con AuthContext.tsx
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>; // CORREGIDO: era updateUser
  clearError: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export interface NavigationParams {
  [key: string]: string | number | boolean | undefined;
}

export interface NavigationState {
  currentPage: string;
  params: NavigationParams;
  history: string[];
}

export interface NavigationContextType {
  currentPage: string;
  params: NavigationParams;
  history: string[];
  navigate: (page: string, newParams?: NavigationParams) => void;
  navigateWithAction: (page: string, action: string, id?: string, additionalParams?: NavigationParams) => void; // AGREGADO
  goBack: () => void;
  setParams: (newParams: NavigationParams) => void;
  clearHistory: () => void;
}

// ============================================================================
// PACKAGE TYPES
// ============================================================================

export interface Package {
  id: string;
  trackingNumber: string;
  senderId: string;
  recipientId: string;
  sender: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  recipient: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned';
  service: 'express' | 'standard' | 'economy';
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  declaredValue: number;
  deliveryInstructions?: string;
  specialHandling?: string[];
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  pickupDate?: string;
  // AGREGADOS: Campos que usan los servicios
  clientId?: string;
  origin?: string;
  destination?: string;
  value?: number;
  description?: string;
  courier?: string;
}

export interface PackageStats {
  total: number;
  pending: number;
  in_transit: number;
  delivered: number;
  returned: number;
  totalValue: number;
  averageWeight: number;
}

// ============================================================================
// CLIENT TYPES
// ============================================================================

export interface Client {
  id: string;
  userId: string;
  type: 'individual' | 'business';
  name: string;
  email: string;
  phone: string;
  company?: string;
  taxId?: string;
  // AGREGADOS: Campos que usan los servicios
  customerCode?: string;
  contactPerson?: string;
  companyName?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  status: 'active' | 'inactive' | 'pending';
  creditLimit: number;
  currentBalance: number;
  totalPackages: number;
  totalSpent: number;
  rating: number;
  joinDate: string;
  lastOrder?: string;
  notes?: string;
  // AGREGADOS: Campos de timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  totalRevenue: number;
  averageOrderValue: number;
}

// ============================================================================
// COURIER TYPES
// ============================================================================

export interface Courier {
  id: string;
  userId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  vehicle: {
    type: 'motorcycle' | 'car' | 'van' | 'truck';
    brand: string;
    model: string;
    plate: string;
    color: string;
  };
  zone: string;
  rating: number;
  totalDeliveries: number;
  successRate: number;
  currentLocation?: {
    lat: number;
    lng: number;
    lastUpdate: string;
  };
  specialties: string[];
  joinDate: string;
  isActive: boolean;
}

export interface CourierStats {
  total: number;
  available: number;
  busy: number;
  offline: number;
  averageRating: number;
  totalDeliveries: number;
}

// ============================================================================
// TRACKING TYPES
// ============================================================================

export interface TrackingEvent {
  id: string;
  packageId: string;
  eventType: 'created' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
  location: string;
  description: string;
  timestamp: string;
  courierId?: string;
  courierName?: string;
  notes?: string;
}

export interface TrackingInfo {
  packageId: string;
  trackingNumber: string;
  currentStatus: Package['status'];
  currentLocation: string;
  estimatedDelivery: string;
  events: TrackingEvent[];
  recipient: {
    name: string;
    city: string;
  };
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  isRead?: boolean;
  createdAt: Date;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: number;
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface DashboardStats {
  packages: PackageStats;
  clients: ClientStats;
  couriers: CourierStats;
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
    growth: {
      daily: number;
      weekly: number;
      monthly: number;
      yearly: number;
    };
  };
}

export interface RecentActivity {
  id: string;
  type: 'package_created' | 'package_delivered' | 'client_registered' | 'payment_received';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

// ============================================================================
// WAREHOUSE/WHR TYPES (Para el módulo operativo)
// ============================================================================

export interface WHRPackage {
  id: string;
  whrNumber: string;
  trackingNumber: string;
  shipper: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  consignee: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  packageDetails: {
    description: string;
    quantity: number;
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    value: number;
  };
  classification: 'aéreo' | 'marítimo' | 'por_definir';
  status: 'creado' | 'clasificado' | 'email_enviado' | 'procesado';
  createdAt: string;
  updatedAt: string;
  calculations: {
    volume: number;
    volumeWeight: number;
    chargeableWeight: number;
  };
}

export interface WHRStats {
  total: number;
  aéreo: number;
  marítimo: number;
  por_definir: number;
  email_enviado: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
}

export interface FormError {
  field: string;
  message: string;
}

export interface FormState {
  values: Record<string, any>;
  errors: FormError[];
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

// ============================================================================
// LANGUAGE TYPES
// ============================================================================

export type SupportedLanguage = 'es' | 'en';

export interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  changeLanguage: (language: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ============================================================================
// FORM TYPES - TIPOS FALTANTES AGREGADOS
// ============================================================================

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormTouched {
  [key: string]: boolean;
}

export interface UseFormReturn<T> {
  values: T;
  errors: FormErrors;
  touched: FormTouched;
  handleChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>; // AGREGADO: handleSubmit
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean; // AGREGADO: isSubmitting
}

// ============================================================================
// PACKAGE FILTERS Y PAGINATION - TIPOS FALTANTES
// ============================================================================

export interface PackageFilters {
  search?: string;
  status?: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned' | 'all';
  service?: 'express' | 'standard' | 'economy' | 'all';
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// ============================================================================
// EXPORT DEFAULT REMOVIDO - SOLO TYPES, NO VALUES
// ============================================================================

// NOTA: Removido export default que causaba errores TS2693
// Los tipos no pueden ser exportados como valores