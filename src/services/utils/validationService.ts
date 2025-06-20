// src/services/utils/validationService.ts
import { FormErrors } from '../../types';

export class ValidationService {
  // Esquemas de validación
  static registerSchema = {
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: {
      required: true,
      pattern: /^[\+]?[1-9][\d]{0,15}$/
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
    },
    confirmPassword: {
      required: true,
      match: 'password'
    },
    terms: {
      required: true,
      mustBeTrue: true
    }
  };

  static clientSchema = {
    customerCode: {
      required: true,
      minLength: 3,
      maxLength: 20
    },
    contactPerson: {
      required: true,
      minLength: 2,
      maxLength: 100
    },
    phone: {
      required: true,
      pattern: /^[\+]?[1-9][\d]{0,15}$/
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    creditLimit: {
      required: true,
      min: 0
    }
  };

  static packageSchema = {
    trackingNumber: {
      required: true,
      minLength: 5,
      maxLength: 50
    },
    description: {
      required: true,
      minLength: 5,
      maxLength: 500
    },
    weight: {
      required: true,
      min: 0.1,
      max: 1000
    },
    value: {
      required: true,
      min: 0
    },
    recipientName: {
      required: true,
      minLength: 2,
      maxLength: 100
    }
  };

  // Método principal de validación
  static async validate(schema: any, values: any): Promise<{ isValid: boolean; errors: FormErrors }> {
    const errors: FormErrors = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = values[field];
      const fieldRules = rules as any;

      // Validación requerida
      if (fieldRules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        errors[field] = `${this.getFieldLabel(field)} es requerido`;
        continue;
      }

      // Si el campo está vacío y no es requerido, saltar otras validaciones
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        continue;
      }

      // Validación de longitud mínima
      if (fieldRules.minLength && value.length < fieldRules.minLength) {
        errors[field] = `${this.getFieldLabel(field)} debe tener al menos ${fieldRules.minLength} caracteres`;
        continue;
      }

      // Validación de longitud máxima
      if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
        errors[field] = `${this.getFieldLabel(field)} no puede tener más de ${fieldRules.maxLength} caracteres`;
        continue;
      }

      // Validación de patrón
      if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
        errors[field] = this.getPatternErrorMessage(field);
        continue;
      }

      // Validación de valor mínimo
      if (fieldRules.min !== undefined && parseFloat(value) < fieldRules.min) {
        errors[field] = `${this.getFieldLabel(field)} debe ser mayor o igual a ${fieldRules.min}`;
        continue;
      }

      // Validación de valor máximo
      if (fieldRules.max !== undefined && parseFloat(value) > fieldRules.max) {
        errors[field] = `${this.getFieldLabel(field)} debe ser menor o igual a ${fieldRules.max}`;
        continue;
      }

      // Validación de coincidencia
      if (fieldRules.match && value !== values[fieldRules.match]) {
        errors[field] = 'Las contraseñas no coinciden';
        continue;
      }

      // Validación de debe ser verdadero
      if (fieldRules.mustBeTrue && !value) {
        errors[field] = 'Debes aceptar los términos y condiciones';
        continue;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Obtener etiqueta legible del campo
  private static getFieldLabel(field: string): string {
    const labels: Record<string, string> = {
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Email',
      phone: 'Teléfono',
      password: 'Contraseña',
      confirmPassword: 'Confirmación de contraseña',
      customerCode: 'Código de cliente',
      contactPerson: 'Persona de contacto',
      creditLimit: 'Límite de crédito',
      trackingNumber: 'Número de seguimiento',
      description: 'Descripción',
      weight: 'Peso',
      value: 'Valor',
      recipientName: 'Nombre del destinatario',
      terms: 'Términos y condiciones'
    };
    return labels[field] || field;
  }

  // Obtener mensaje de error para patrones
  private static getPatternErrorMessage(field: string): string {
    const messages: Record<string, string> = {
      email: 'Ingresa un email válido',
      phone: 'Ingresa un número de teléfono válido',
      password: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    };
    return messages[field] || `Formato inválido para ${this.getFieldLabel(field)}`;
  }

  // Validaciones específicas
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }
    
    if (!/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateRequired(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return !isNaN(value);
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }
}

export default ValidationService;