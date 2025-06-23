// src/services/utils/validationService.ts
import { FormErrors } from '../../types'; // CORREGIDO: FormErrors ahora existe

export class ValidationService {
  // Esquemas de validación
  static validateEmail(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Email inválido';
    }
    return null;
  }

  static validatePassword(password: string): string | null {
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return null;
  }

  static validateRequired(value: any): string | null {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'Este campo es requerido';
    }
    return null;
  }

  static validatePhone(phone: string): string | null {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return 'Número de teléfono inválido';
    }
    return null;
  }

  static validateLoginForm(values: { email: string; password: string }): FormErrors {
    const errors: FormErrors = {};

    const emailError = ValidationService.validateRequired(values.email) || 
                      ValidationService.validateEmail(values.email);
    if (emailError) errors.email = emailError;

    const passwordError = ValidationService.validateRequired(values.password) || 
                          ValidationService.validatePassword(values.password);
    if (passwordError) errors.password = passwordError;

    return errors;
  }

  static validateRegisterForm(values: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }): FormErrors {
    const errors: FormErrors = {};

    // Validar campos requeridos
    const firstNameError = ValidationService.validateRequired(values.firstName);
    if (firstNameError) errors.firstName = firstNameError;

    const lastNameError = ValidationService.validateRequired(values.lastName);
    if (lastNameError) errors.lastName = lastNameError;

    // Validar email
    const emailError = ValidationService.validateRequired(values.email) || 
                      ValidationService.validateEmail(values.email);
    if (emailError) errors.email = emailError;

    // Validar password
    const passwordError = ValidationService.validateRequired(values.password) || 
                          ValidationService.validatePassword(values.password);
    if (passwordError) errors.password = passwordError;

    // Validar confirmación de password
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return errors;
  }
}

// AGREGADO: Export default para services/index.ts
export default ValidationService;