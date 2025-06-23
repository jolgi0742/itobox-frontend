// src/hooks/useForm.ts
import { useState, useCallback } from 'react';
import { FormErrors, FormTouched, UseFormReturn } from '../types'; // CORREGIDO: tipos ahora existen

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => FormErrors;
  onSubmit?: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determinar si el formulario está sucio
  const isDirty = Object.keys(values).some(
    key => values[key] !== initialValues[key]
  );

  // Determinar si el formulario es válido
  const isValid = Object.keys(errors).length === 0 || 
    Object.values(errors).every(error => !error);

  // Manejar cambios en los campos
  const handleChange = useCallback(
    (field: keyof T) => 
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : e.target.value;

        setValues(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field as string]) {
          setErrors((prev: FormErrors) => ({
            ...prev,
            [field as string]: undefined
          }));
        }
      },
    [errors]
  );

  // Manejar blur de los campos
  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched((prev: FormTouched) => ({
        ...prev,
        [field as string]: true
      }));

      // Validate field on blur if validation function is provided
      if (validate) {
        const fieldErrors = validate(values);
        setErrors((prev: FormErrors) => ({
          ...prev,
          [field as string]: fieldErrors[field as string]
        }));
      }
    },
    [values, validate]
  );

  // Establecer valor de campo programáticamente
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  // Validar todo el formulario
  const validateForm = useCallback(() => {
    if (!validate) return true;

    const formErrors = validate(values);
    setErrors(formErrors);

    // Marcar todos los campos como touched
    const allTouched = Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);

    return Object.keys(formErrors).length === 0 || 
      Object.values(formErrors).every(error => !error);
  }, [values, validate]);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Manejar submit
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateForm()) {
      return;
    }

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateForm, onSubmit]);

  // Establecer error de campo específico
  const setFieldError = useCallback(
    (field: keyof T, error: string) => {
      setErrors((prev: FormErrors) => ({
        ...prev,
        [field as string]: error
      }));
    },
    []
  );

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    validateForm,
    resetForm,
    handleSubmit,
    isValid,
    isDirty,
    isSubmitting
  };
}

export type { UseFormReturn };