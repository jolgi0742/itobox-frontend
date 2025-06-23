// src/hooks/index.ts - Exports centralizados de hooks

// CORREGIDO: Import default de useAuth
export { default as useAuth } from './useAuth';
export { useForm } from './useForm';
export { useNotifications } from './useNotifications';
export { usePackages } from './usePackages';

// Re-export tipos si es necesario
export type { UseFormReturn } from './useForm';