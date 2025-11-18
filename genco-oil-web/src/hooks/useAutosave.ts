import { useState, useEffect, useCallback, useRef } from 'react';

interface AutosaveOptions {
  delay?: number;
  onSave?: (data: any) => Promise<void>;
  validate?: (value: any) => { isValid: boolean; message?: string };
}

interface FieldStatus {
  isDirty: boolean;
  isSaving: boolean;
  isSaved: boolean;
  hasError: boolean;
  errorMessage?: string;
  lastSavedValue?: any;
}

interface AutosaveReturn<T> {
  value: T;
  setValue: (value: T) => void;
  status: FieldStatus;
  clearStatus: () => void;
}

export function useAutosave<T>(
  initialValue: T,
  fieldName: string,
  formId: string,
  options: AutosaveOptions = {}
): AutosaveReturn<T> {
  const { delay = 0, onSave, validate } = options;

  const [value, setValue] = useState<T>(initialValue);
  const [status, setStatus] = useState<FieldStatus>({
    isDirty: false,
    isSaving: false,
    isSaved: false,
    hasError: false,
    lastSavedValue: initialValue
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const savePromiseRef = useRef<Promise<void> | null>(null);

  // Clear any pending timeout
  const clearPendingSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Save function
  const performSave = useCallback(async (saveValue: T) => {
    if (!onSave) return;

    try {
      setStatus(prev => ({
        ...prev,
        isSaving: true,
        hasError: false,
        errorMessage: undefined
      }));

      await onSave({
        formId,
        fieldName,
        value: saveValue,
        timestamp: new Date().toISOString()
      });

      setStatus(prev => ({
        ...prev,
        isSaving: false,
        isSaved: true,
        isDirty: false,
        lastSavedValue: saveValue
      }));

      // Clear saved status after 2 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, isSaved: false }));
      }, 2000);

    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isSaving: false,
        hasError: true,
        errorMessage: error instanceof Error ? error.message : 'Save failed'
      }));
    }
  }, [onSave, formId, fieldName]);

  // Handle value change
  const handleChange = useCallback((newValue: T) => {
    setValue(newValue);

    // Validate if validation function is provided
    if (validate) {
      const validation = validate(newValue);
      if (!validation.isValid) {
        setStatus(prev => ({
          ...prev,
          isDirty: true,
          hasError: true,
          errorMessage: validation.message
        }));
        return;
      }
    }

    // Mark as dirty and clear previous errors
    setStatus(prev => ({
      ...prev,
      isDirty: true,
      hasError: false,
      errorMessage: undefined
    }));

    // Clear any pending save
    clearPendingSave();

    // Schedule save
    if (onSave) {
      timeoutRef.current = setTimeout(() => {
        performSave(newValue);
      }, delay);
    }
  }, [validate, clearPendingSave, performSave, delay]);

  // Clear status function
  const clearStatus = useCallback(() => {
    setStatus(prev => ({
      ...prev,
      isDirty: false,
      isSaved: false,
      hasError: false,
      errorMessage: undefined
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearPendingSave();
    };
  }, [clearPendingSave]);

  return {
    value,
    setValue: handleChange,
    status,
    clearStatus
  };
}