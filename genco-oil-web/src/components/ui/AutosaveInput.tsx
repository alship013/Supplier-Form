import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldStatusIndicator } from '@/components/ui/FieldStatusIndicator';
import { useAutosave } from '@/hooks/useAutosave';
import { autosaveService } from '@/services/autosaveService';
import { cn } from '@/lib/utils';

interface AutosaveInputProps {
  id: string;
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  formId: string;
  fieldName: string;
  validation?: (value: string) => { isValid: boolean; message?: string };
  onSave?: (data: any) => Promise<void>;
  showStatusIndicator?: boolean;
  showStatusLabel?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const AutosaveInput: React.FC<AutosaveInputProps> = ({
  id,
  label,
  placeholder,
  type = 'text',
  value,
  defaultValue = '',
  required = false,
  disabled = false,
  className,
  formId,
  fieldName,
  validation,
  onSave,
  showStatusIndicator = true,
  showStatusLabel = true,
  onBlur,
  onFocus
}) => {
  // Try to get saved value from localStorage
  const savedValue = autosaveService.getSavedValue(formId, fieldName);
  const initialValue = value !== undefined ? value : (savedValue || defaultValue);

  const {
    value: fieldValue,
    setValue,
    status,
    clearStatus
  } = useAutosave(initialValue, fieldName, formId, {
    delay: 0, // Save immediately on blur
    onSave: onSave || autosaveService.saveField.bind(autosaveService),
    validate: validation
  });

  // Handle blur event
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Trigger save immediately on blur
    const newValue = e.target.value;
    if (newValue !== status.lastSavedValue) {
      setValue(newValue);
    }
    onBlur?.();
  };

  // Handle focus event
  const handleFocus = () => {
    clearStatus();
    onFocus?.();
  };

  // Update if external value changes
  useEffect(() => {
    if (value !== undefined && value !== fieldValue) {
      setValue(value);
    }
  }, [value, fieldValue, setValue]);

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="flex items-center gap-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div className="relative">
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={fieldValue}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          className={cn(
            'pr-10',
            status.hasError && 'border-red-500 focus:border-red-500',
            status.isSaved && 'border-green-500 focus:border-green-500',
            className
          )}
        />

        {showStatusIndicator && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <FieldStatusIndicator
              status={status}
              showText={false}
            />
          </div>
        )}
      </div>

      {showStatusLabel && (
        <FieldStatusIndicator
          status={status}
          showText={true}
          className="text-xs"
        />
      )}
    </div>
  );
};

export default AutosaveInput;