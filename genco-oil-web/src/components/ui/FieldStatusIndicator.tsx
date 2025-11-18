import React from 'react';
import { Loader2, CheckCircle, AlertCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldStatusIndicatorProps {
  status: {
    isDirty: boolean;
    isSaving: boolean;
    isSaved: boolean;
    hasError: boolean;
    errorMessage?: string;
  };
  showText?: boolean;
  className?: string;
}

export const FieldStatusIndicator: React.FC<FieldStatusIndicatorProps> = ({
  status,
  showText = true,
  className
}) => {
  const getStatusIcon = () => {
    if (status.isSaving) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    }

    if (status.hasError) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }

    if (status.isSaved) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }

    if (status.isDirty) {
      return <Circle className="w-4 h-4 text-yellow-500 fill-yellow-500" />;
    }

    return <Circle className="w-4 h-4 text-gray-300" />;
  };

  const getStatusText = () => {
    if (status.isSaving) {
      return 'Saving...';
    }

    if (status.hasError) {
      return status.errorMessage || 'Error';
    }

    if (status.isSaved) {
      return 'Saved';
    }

    if (status.isDirty) {
      return 'Unsaved';
    }

    return '';
  };

  const getStatusColor = () => {
    if (status.hasError) {
      return 'text-red-600';
    }

    if (status.isSaving) {
      return 'text-blue-600';
    }

    if (status.isSaved) {
      return 'text-green-600';
    }

    if (status.isDirty) {
      return 'text-yellow-600';
    }

    return 'text-gray-400';
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {getStatusIcon()}
      {showText && getStatusText() && (
        <span className={cn('text-xs', getStatusColor())}>
          {getStatusText()}
        </span>
      )}
    </div>
  );
};

export default FieldStatusIndicator;