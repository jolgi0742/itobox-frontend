// src/hooks/useForm.ts
import { useState, useCallback } from 'react';
import { FormErrors, FormTouched, UseFormReturn } from '../types';

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => FormErrors;
  onSubmit: (values: T) => void | Promise<void>;
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

  const handleChange = useCallback(
    (field: keyof T) => 
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked
          : e.target.type === 'number'
          ? parseFloat(e.target.value) || 0
          : e.target.value;

        setValues(prev => ({
          ...prev,
          [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field as string]) {
          setErrors(prev => ({
            ...prev,
            [field as string]: undefined
          }));
        }
      },
    [errors]
  );

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched(prev => ({
        ...prev,
        [field as string]: true
      }));
      validateField(field);
    },
    []
  );

  const validateField = useCallback(
    (field: keyof T) => {
      if (validate) {
        const fieldErrors = validate(values);
        setErrors(prev => ({
          ...prev,
          [field as string]: fieldErrors[field as string]
        }));
      }
    },
    [values, validate]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        // Validate all fields
        if (validate) {
          const validationErrors = validate(values);
          setErrors(validationErrors);

          // Mark all fields as touched
          const touchedFields: FormTouched = {};
          Object.keys(values).forEach(key => {
            touchedFields[key] = true;
          });
          setTouched(touchedFields);

          // If there are errors, don't submit
          if (Object.keys(validationErrors).some(key => validationErrors[key])) {
            return;
          }
        }

        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const setValue = useCallback(
    (field: keyof T, value: any) => {
      setValues(prev => ({
        ...prev,
        [field]: value
      }));
    },
    []
  );

  const setFieldError = useCallback(
    (field: keyof T, error: string) => {
      setErrors(prev => ({
        ...prev,
        [field as string]: error
      }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    setFieldError,
    resetForm,
    validateField
  };
}

export default useForm;