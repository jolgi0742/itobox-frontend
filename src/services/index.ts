// src/services/index.ts
export { apiClient } from './api/apiClient';
export { packageService } from './api/packageService';
export { clientService } from './api/clientService';
export { default as ValidationService } from './utils/validationService';

// Storage service simple
export const localStorage = {
  getItem: (key: string) => window.localStorage.getItem(key),
  setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
  removeItem: (key: string) => window.localStorage.removeItem(key),
  clear: () => window.localStorage.clear()
};

export const sessionStorage = {
  getItem: (key: string) => window.sessionStorage.getItem(key),
  setItem: (key: string, value: string) => window.sessionStorage.setItem(key, value),
  removeItem: (key: string) => window.sessionStorage.removeItem(key),
  clear: () => window.sessionStorage.clear()
};