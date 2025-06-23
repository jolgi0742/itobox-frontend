// src/config/config.ts
export const config = {
  // API Configuration
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000'),
  },

  // App Configuration
  app: {
    name: process.env.REACT_APP_APP_NAME || 'ITOBOX Courier',
    version: process.env.REACT_APP_VERSION || '3.0.0',
    environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  },

  // Authentication
  auth: {
    tokenKey: 'authToken',
    refreshTokenKey: 'refreshToken',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
  },

  // CAMCA Configuration
  camca: {
    volumeFactor: parseFloat(process.env.REACT_APP_CAMCA_VOLUME_FACTOR || '0.000578746'),
    weightFactor: parseFloat(process.env.REACT_APP_CAMCA_WEIGHT_FACTOR || '10.4'),
    defaultDaysAir: parseInt(process.env.REACT_APP_CAMCA_DEFAULT_DAYS_AIR || '2'),
    defaultDaysSea: parseInt(process.env.REACT_APP_CAMCA_DEFAULT_DAYS_SEA || '14'),
    company: {
      name: 'PREMIER GLOBAL USA CORP',
      address: '8548 NW 72ND ST.',
      phone: '786-800-9991',
    },
  },

  // Pagination
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
    pageSizes: [10, 20, 50, 100],
  },

  // Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.REACT_APP_MAX_FILE_SIZE || '10485760'), // 10MB
    allowedTypes: (process.env.REACT_APP_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,application/pdf').split(','),
    acceptedFormats: {
      images: ['jpg', 'jpeg', 'png', 'gif'],
      documents: ['pdf', 'doc', 'docx'],
      spreadsheets: ['xls', 'xlsx', 'csv'],
    },
  },

  // UI Configuration
  ui: {
    theme: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0ea5e9',
    },
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss',
    dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
    currency: 'USD',
    locale: 'en-US',
  },

  // Features Flags
  features: {
    enableTracking: true,
    enableNotifications: true,
    enableReports: true,
    enableExport: true,
    enableImport: true,
    enableWebSockets: false, // Disable for now
    enableDarkMode: false,
    enableMultiLanguage: false,
  },

  // Validation Rules
  validation: {
    trackingNumber: {
      minLength: 10,
      maxLength: 50,
      pattern: /^[A-Z0-9]+$/,
    },
    whrNumber: {
      pattern: /^WHR\d{6}\d{4}$/,
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      pattern: /^[\+]?[0-9\-\(\)\s]+$/,
    },
    weight: {
      min: 0,
      max: 999999,
    },
    dimensions: {
      min: 0,
      max: 999,
    },
  },

  // Error Messages
  errors: {
    network: 'Error de conexión. Verifique su conexión a internet.',
    server: 'Error del servidor. Inténtelo nuevamente.',
    validation: 'Datos inválidos. Verifique los campos requeridos.',
    authentication: 'Sesión expirada. Inicie sesión nuevamente.',
    authorization: 'No tiene permisos para realizar esta acción.',
    notFound: 'Recurso no encontrado.',
    generic: 'Ha ocurrido un error inesperado.',
  },

  // Success Messages
  success: {
    whrCreated: 'WHR creado exitosamente',
    whrUpdated: 'WHR actualizado exitosamente',
    whrDeleted: 'WHR eliminado exitosamente',
    emailSent: 'Email enviado exitosamente',
    whrClassified: 'WHR clasificado exitosamente',
    dataExported: 'Datos exportados exitosamente',
    dataImported: 'Datos importados exitosamente',
  },

  // Development Configuration
  development: {
    enableLogs: process.env.NODE_ENV === 'development',
    enableDebugger: process.env.NODE_ENV === 'development',
    mockApi: false, // Set to true to use mock data
    apiDelay: 0, // Simulate network delay in milliseconds
  },
};

// Helper functions
export const isDevelopment = () => config.app.environment === 'development';
export const isProduction = () => config.app.environment === 'production';

// Validate configuration
export const validateConfig = (): boolean => {
  try {
    // Check required environment variables
    const required = [
      'REACT_APP_API_URL',
      'REACT_APP_APP_NAME',
    ];

    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:', missing);
      return false;
    }

    // Validate API URL format
    try {
      new URL(config.api.baseURL);
    } catch {
      console.error('❌ Invalid API URL format:', config.api.baseURL);
      return false;
    }

    console.log('✅ Configuration validated successfully');
    return true;
  } catch (error) {
    console.error('❌ Configuration validation failed:', error);
    return false;
  }
};

// Initialize configuration
export const initConfig = (): void => {
  if (isDevelopment()) {
    console.log('🔧 Configuration loaded:', {
      app: config.app,
      api: config.api,
      features: config.features,
    });
  }

  // Validate configuration
  validateConfig();
};

export default config;