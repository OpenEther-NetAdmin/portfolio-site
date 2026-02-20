/**
 * useFormState Hook
 * Generic form state management with Zod validation
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { z } from 'zod';

/**
 * Options for configuring the form state hook
 */
interface UseFormStateOptions<T> {
  /** Validate on every change (default: true) */
  validateOnChange?: boolean;
  /** Validate on blur events (default: true) */
  validateOnBlur?: boolean;
  /** Custom transform function before validation */
  transform?: (data: T) => T;
}

/**
 * Return type for the useFormState hook
 */
interface UseFormStateReturn<T> {
  /** Current form data */
  data: T;
  /** Validation errors by field name */
  errors: Partial<Record<keyof T, string>>;
  /** Whether the form is currently valid */
  isValid: boolean;
  /** Whether the form has been touched/modified */
  isDirty: boolean;
  /** Which fields have been touched */
  touched: Partial<Record<keyof T, boolean>>;
  /** Update a single field value */
  updateField: (key: keyof T, value: T[keyof T]) => void;
  /** Update multiple fields at once */
  setData: (data: Partial<T>) => void;
  /** Mark a field as touched */
  touchField: (key: keyof T) => void;
  /** Reset form to initial state */
  reset: () => void;
  /** Reset form with new initial values */
  resetTo: (newInitialData: T) => void;
  /** Validate the entire form manually */
  validate: () => boolean;
  /** Get current form state as a snapshot */
  getSnapshot: () => { data: T; errors: Partial<Record<keyof T, string>>; isValid: boolean };
}

/**
 * A generic hook for managing form state with Zod schema validation.
 * 
 * @param initialData - Initial form values
 * @param schema - Zod schema for validation
 * @param options - Configuration options
 * 
 * @example
 * ```tsx
 * const schema = z.object({
 *   email: z.string().email(),
 *   name: z.string().min(2),
 * });
 * 
 * const { data, errors, isValid, updateField } = useFormState(
 *   { email: '', name: '' },
 *   schema
 * );
 * ```
 */
export function useFormState<T extends Record<string, unknown>>(
  initialData: T,
  schema: z.ZodSchema<T>,
  options: UseFormStateOptions<T> = {}
): UseFormStateReturn<T> {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    transform,
  } = options;

  // Store initial data for reset functionality
  const [initialValues, setInitialValues] = useState<T>(initialData);
  
  // Form data state
  const [data, setDataState] = useState<T>(initialData);
  
  // Validation errors
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  
  // Overall validity
  const [isValid, setIsValid] = useState(false);
  
  // Track if form has been modified
  const [isDirty, setIsDirty] = useState(false);
  
  // Track touched fields
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  // Memoize the schema to prevent unnecessary re-renders
  const memoizedSchema = useMemo(() => schema, [schema]);

  // Validation function
  const validateForm = useCallback((formData: T): boolean => {
    const dataToValidate = transform ? transform(formData) : formData;
    const result = memoizedSchema.safeParse(dataToValidate);
    
    if (result.success) {
      setErrors({});
      setIsValid(true);
      return true;
    } else {
      const formattedErrors: Partial<Record<keyof T, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof T;
        // Only show the first error per field
        if (!formattedErrors[path]) {
          formattedErrors[path] = issue.message;
        }
      });
      setErrors(formattedErrors);
      setIsValid(false);
      return false;
    }
  }, [memoizedSchema, transform]);

  // Validate on data change if enabled
  useEffect(() => {
    if (validateOnChange) {
      validateForm(data);
    }
  }, [data, validateOnChange, validateForm]);

  // Update a single field
  const updateField = useCallback((key: keyof T, value: T[keyof T]) => {
    setDataState((prev) => {
      const updated = { ...prev, [key]: value };
      return updated;
    });
    setIsDirty(true);
  }, []);

  // Update multiple fields at once
  const setData = useCallback((partialData: Partial<T>) => {
    setDataState((prev) => {
      const updated = { ...prev, ...partialData };
      return updated;
    });
    setIsDirty(true);
  }, []);

  // Mark a field as touched (for blur validation)
  const touchField = useCallback((key: keyof T) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    
    // Optionally validate on blur
    if (validateOnBlur && !validateOnChange) {
      validateForm(data);
    }
  }, [data, validateOnBlur, validateOnChange, validateForm]);

  // Reset to initial state
  const reset = useCallback(() => {
    setDataState(initialValues);
    setErrors({});
    setIsValid(false);
    setIsDirty(false);
    setTouched({});
  }, [initialValues]);

  // Reset with new initial values
  const resetTo = useCallback((newInitialData: T) => {
    setInitialValues(newInitialData);
    setDataState(newInitialData);
    setErrors({});
    setIsValid(false);
    setIsDirty(false);
    setTouched({});
  }, []);

  // Manual validation trigger
  const validate = useCallback(() => {
    return validateForm(data);
  }, [data, validateForm]);

  // Get a snapshot of current state
  const getSnapshot = useCallback(() => {
    return {
      data,
      errors,
      isValid,
    };
  }, [data, errors, isValid]);

  return {
    data,
    errors,
    isValid,
    isDirty,
    touched,
    updateField,
    setData,
    touchField,
    reset,
    resetTo,
    validate,
    getSnapshot,
  };
}

export default useFormState;
