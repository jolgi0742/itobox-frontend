// src/contexts/index.tsx - EXPORTS ACTUALIZADOS

// Navegación (ACTUALIZADO)
export {
  NavigationProvider,
  useNavigation
} from './NavigationContext';

// Autenticación
export { 
  AuthProvider, 
  useAuth,
  type AuthContextType 
} from './AuthContext';
export { default as AuthContext } from './AuthContext';

// Tema
export {
  ThemeProvider,
  useTheme
} from './ThemeContext';

// Idioma
export {
  LanguageProvider,
  useLanguage,
  type SupportedLanguage
} from './LanguageContext';

// Notificaciones
export {
  NotificationProvider,
  useNotification,
  type Notification,
  type NotificationContextType
} from './NotificationContext';