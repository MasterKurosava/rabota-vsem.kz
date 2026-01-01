import { useState, useCallback } from "react";
import { validateEmail, validatePhone, validateRequired, validatePassword, validatePasswordConfirmation, type ValidationErrors } from "@/lib/utils/validation";

export function useFormValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const setError = useCallback((field: string, error: string | null) => {
    setErrors((prev) => {
      if (error === null) {
        const { [field]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [field]: error };
    });
  }, []);

  const clearError = useCallback((field: string) => {
    setError(field, null);
  }, [setError]);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const validateField = useCallback((field: string, value: string, type?: string): boolean => {
    let error: string | null = null;

    switch (type) {
      case "email":
        error = validateEmail(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      case "required":
        error = validateRequired(value, field);
        break;
      default:
        if (value.trim()) {
          error = null;
        } else {
          error = validateRequired(value, field);
        }
    }

    setError(field, error);
    return error === null;
  }, [setError]);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    setError,
    clearError,
    clearAllErrors,
    validateField,
    hasErrors,
  };
}

