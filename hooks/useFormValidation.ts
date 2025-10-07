import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message: string;
}

interface ValidationRules {
  [key: string]: ValidationRule[];
}

interface FormErrors {
  [key: string]: string;
}

interface UseFormValidationReturn {
  errors: FormErrors;
  validateField: (name: string, value: string, rules: ValidationRule[]) => string;
  validateForm: (values: { [key: string]: string }, rules: ValidationRules) => boolean;
  clearError: (name: string) => void;
  clearErrors: () => void;
}

export function useFormValidation(): UseFormValidationReturn {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = useCallback(
    (name: string, value: string, rules: ValidationRule[]): string => {
      for (const rule of rules) {
        // Required validation
        if (rule.required && !value.trim()) {
          return rule.message;
        }

        // Skip other validations if value is empty and not required
        if (!value.trim() && !rule.required) {
          continue;
        }

        // Min length validation
        if (rule.minLength && value.length < rule.minLength) {
          return rule.message;
        }

        // Max length validation
        if (rule.maxLength && value.length > rule.maxLength) {
          return rule.message;
        }

        // Pattern validation
        if (rule.pattern && !rule.pattern.test(value)) {
          return rule.message;
        }

        // Custom validation
        if (rule.custom && !rule.custom(value)) {
          return rule.message;
        }
      }

      return '';
    },
    []
  );

  const validateForm = useCallback(
    (values: { [key: string]: string }, rules: ValidationRules): boolean => {
      const newErrors: FormErrors = {};
      let isValid = true;

      Object.keys(rules).forEach((fieldName) => {
        const error = validateField(fieldName, values[fieldName] || '', rules[fieldName]);
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [validateField]
  );

  const clearError = useCallback((name: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    clearErrors,
  };
}

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Helper to create validation rules
export const createValidationRules = (t: (key: string) => string) => ({
  email: [
    {
      required: true,
      message: t('auth.validation.emailRequired'),
    },
    {
      pattern: EMAIL_REGEX,
      message: t('auth.validation.emailInvalid'),
    },
  ],
  password: [
    {
      required: true,
      message: t('auth.validation.passwordRequired'),
    },
    {
      minLength: 8,
      message: t('auth.validation.passwordTooShort'),
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: t('auth.validation.confirmPasswordRequired'),
    },
  ],
});